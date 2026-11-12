const { query, transaction } = require("../config/database");
const { validateGeoJSON, calculateGeometry } = require("../utils/blueCarbonGeometry");
const { generateTiles } = require("../utils/blueCarbonTiles");
const crypto = require('crypto');
const { uploadMedia } = require('../config/cloudinary');

const allowedEcosystems = new Set(["mangrove", "tidal_wetland", "seagrass"]);
const methodologyCatalog = [
  { id: "blue-carbon-initial-v1", name: "Blue Carbon Initial Methodology", version: "1.0.0", ecosystemTypes: ["mangrove"], status: "internal_review" },
];

const projectColumns = `project_id, org_id, project_name, description, ecosystem_type, methodology_id,
  status, boundary_geojson, centroid_lat, centroid_lng, baseline_summary, monitoring_start,
  monitoring_end, monitoring_date, project_manager, manager_contact, estimated_removals_tco2e,
  monitoring_progress, data_disclaimer, methodology_version, area_hectares, submitted_at, submitted_by, created_at, updated_at`;

const getOrgId = (req) => req.blueCarbonUser.org_id;
const actorId = (req) => req.blueCarbonUser.u_id || req.blueCarbonUser.id || req.blueCarbonUser.sub;
const reviewerOnly = (req, res) => {
  const role = String(req.blueCarbonUser.role || req.blueCarbonUser.role_name || '').toLowerCase().replace(/[\s-]+/g, '_');
  return ['blue_carbon_reviewer', 'admin'].includes(role)
    ? true
    : (res.status(403).json({ success: false, message: 'Reviewer role required. Ask an organization admin or Blue Carbon reviewer to perform this action.' }), false);
};
function numberField(value, name, { min = -Infinity, max = Infinity } = {}) { if (value === undefined || value === null || value === '') return null; const n = Number(value); if (!Number.isFinite(n) || n < min || n > max) throw new Error(`${name} must be a valid number`); return n; }
function coordinates(b) { if (b.latitude === undefined && b.longitude === undefined) return [null, null]; const lat = numberField(b.latitude, 'latitude', { min: -90, max: 90 }); const lng = numberField(b.longitude, 'longitude', { min: -180, max: 180 }); if (lat === null || lng === null) throw new Error('latitude and longitude must be supplied together'); return [lat, lng]; }
function evidenceRefs(value, name) { if (value === undefined) return []; if (!Array.isArray(value) || value.some(x => typeof x !== 'string' || !x.trim())) throw new Error(`${name} must be an array of references`); return value; }

exports.getMethodologies = async (_req, res) => res.json({ success: true, data: methodologyCatalog });

exports.getSummary = async (req, res) => {
  const orgId = getOrgId(req);
  const result = await query(`
    SELECT COUNT(DISTINCT p.project_id)::int AS active_projects,
           COALESCE(SUM(DISTINCT p.area_hectares),0)::numeric AS monitored_area_hectares,
           COUNT(DISTINCT t.tile_id)::int AS total_tiles,
           COUNT(DISTINCT t.tile_id) FILTER (WHERE t.status='unassigned')::int AS unassigned_tiles,
           COUNT(DISTINCT t.tile_id) FILTER (WHERE t.status IN ('due','overdue'))::int AS monitoring_alerts,
           COUNT(DISTINCT task.task_id) FILTER (WHERE task.status IN ('submitted','under_review'))::int AS pending_reviews,
           COUNT(DISTINCT o.observation_id) FILTER (WHERE o.review_status='approved')::int AS approved_observations,
           COALESCE(SUM(p.estimated_removals_tco2e),0)::numeric AS estimated_net_removals
    FROM blue_carbon_projects p
    LEFT JOIN blue_carbon_tiles t ON t.project_id=p.project_id AND t.org_id=p.org_id
    LEFT JOIN blue_carbon_monitoring_tasks task ON task.project_id=p.project_id AND task.org_id=p.org_id
    LEFT JOIN blue_carbon_observations o ON o.project_id=p.project_id AND o.org_id=p.org_id
    WHERE p.org_id = $1`, [orgId]);
  res.json({ success: true, data: { ...result.rows[0], dataFreshness: new Date().toISOString() } });
};

exports.exportReport = async (req, res) => {
  const projectId = req.query.project_id || null;
  const result = await query(`SELECT p.project_name,t.tile_code,t.status AS tile_status,a.assignee_id,task.status AS task_status,task.due_at,v.visit_id,v.status AS visit_status,m.media_type,m.validation_status,m.review_status,m.uploaded_at FROM blue_carbon_projects p LEFT JOIN blue_carbon_tiles t ON t.project_id=p.project_id AND t.org_id=p.org_id LEFT JOIN blue_carbon_tile_assignments a ON a.tile_id=t.tile_id AND a.active=true LEFT JOIN blue_carbon_monitoring_tasks task ON task.tile_id=t.tile_id LEFT JOIN blue_carbon_field_visits v ON v.tile_id=t.tile_id LEFT JOIN blue_carbon_media_evidence m ON m.visit_id=v.visit_id WHERE p.org_id=$1 AND ($2::uuid IS NULL OR p.project_id=$2) ORDER BY p.project_name,t.tile_code,m.uploaded_at`, [getOrgId(req), projectId]);
  const headers=['project_name','tile_code','tile_status','assignee_id','task_status','due_at','visit_id','visit_status','media_type','validation_status','review_status','uploaded_at'];
  const csv=[headers.join(','),...result.rows.map(row=>headers.map(key=>`"${String(row[key] ?? '').replaceAll('"','""')}"`).join(','))].join('\n');
  res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="blue-carbon-monitoring-report.csv"'); res.send(csv);
};

exports.listProjects = async (req, res) => {
  const result = await query(`SELECT ${projectColumns} FROM blue_carbon_projects WHERE org_id = $1 ORDER BY updated_at DESC`, [getOrgId(req)]);
  res.json({ success: true, data: result.rows });
};

exports.listTiles = async (req, res) => {
  const result = await query(`SELECT * FROM blue_carbon_tiles WHERE project_id=$1 AND org_id=$2 ORDER BY grid_row, grid_column`, [req.params.projectId, getOrgId(req)]);
  res.json({ success: true, data: result.rows });
};

exports.generateTiles = async (req, res) => {
  const project = await query('SELECT project_id, org_id, boundary_geojson FROM blue_carbon_projects WHERE project_id=$1 AND org_id=$2', [req.params.projectId, getOrgId(req)]);
  if (!project.rows.length) return res.status(404).json({ success: false, message: 'Blue Carbon project not found' });
  // The persisted monitoring records represent inner grids. The block size is
  // a visualization/grouping dimension and is sent along for forward
  // compatibility with clients that need to regenerate the hierarchy.
  const size = Number(req.body?.inner_grid_size_m || req.body?.tile_size_m || 250);
  try {
    const requestedBoundary = req.body?.boundary_geojson || project.rows[0].boundary_geojson;
    const boundary = validateGeoJSON(requestedBoundary);
    const generated = generateTiles(boundary, size, req.body?.shape, Number(req.body?.block_size_m || size));
    const rows = await transaction(async (db) => {
      if (req.body?.boundary_geojson) await db.query('UPDATE blue_carbon_projects SET boundary_geojson=$1::jsonb,updated_at=NOW() WHERE project_id=$2 AND org_id=$3', [JSON.stringify(boundary), req.params.projectId, getOrgId(req)]);
      await db.query('DELETE FROM blue_carbon_tiles WHERE project_id=$1 AND org_id=$2', [req.params.projectId, getOrgId(req)]);
      const saved = [];
      for (const tile of generated) {
        const result = await db.query(`INSERT INTO blue_carbon_tiles (project_id,org_id,tile_code,geometry_geojson,area_hectares,centroid_lat,centroid_lng,grid_row,grid_column) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9) RETURNING *`, [req.params.projectId, getOrgId(req), `T-${String(tile.row).padStart(3,'0')}-${String(tile.column).padStart(3,'0')}`, JSON.stringify(tile.geometry_geojson), tile.area_hectares, tile.centroid_lat, tile.centroid_lng, tile.row, tile.column]);
        saved.push(result.rows[0]);
      }
      return saved;
    });
    res.status(201).json({ success: true, data: rows, count: rows.length });
  } catch (error) { res.status(400).json({ success: false, message: error.message }); }
};

exports.getProject = async (req, res) => {
  const result = await query(`SELECT ${projectColumns} FROM blue_carbon_projects WHERE project_id = $1 AND org_id = $2`, [req.params.projectId, getOrgId(req)]);
  if (!result.rows.length) return res.status(404).json({ success: false, message: "Blue Carbon project not found" });
  res.json({ success: true, data: result.rows[0] });
};

exports.createProject = async (req, res) => {
  const b = req.body || {};
  if (!b.project_name || !allowedEcosystems.has(b.ecosystem_type) || !b.methodology_id) {
    return res.status(400).json({ success: false, message: "Project name, supported ecosystem type, and methodology are required" });
  }
  if (!methodologyCatalog.some((m) => m.id === b.methodology_id && m.ecosystemTypes.includes(b.ecosystem_type) && (!b.methodology_version || b.methodology_version === m.version))) {
    return res.status(400).json({ success: false, message: "Methodology is not eligible for this ecosystem" });
  }
  let geometry;
  try { geometry = b.boundary_geojson ? validateGeoJSON(b.boundary_geojson) : null; } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
  if (!geometry) return res.status(400).json({ success: false, message: "A valid boundary_geojson is required" });
  if (!b.monitoring_start || !b.monitoring_end || new Date(b.monitoring_start) > new Date(b.monitoring_end)) return res.status(400).json({ success: false, message: "A valid monitoring_start and monitoring_end are required" });
  if (!b.baseline || !b.baseline.baseline_date || !b.baseline.source_label || !b.baseline.summary) return res.status(400).json({ success: false, message: "Baseline date, source_label, and summary are required" });
  let derived;
  try {
    derived = calculateGeometry(geometry);
    if (![derived.area_hectares, derived.centroid_lat, derived.centroid_lng].every(Number.isFinite)) throw new Error('Boundary geometry produced invalid area or centroid');
    if (derived.area_hectares <= 0 || derived.area_hectares > 99999999.999999) throw new Error('Boundary area is outside the supported range');
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
  try {
  const result = await transaction(async (db) => {
    const inserted = await db.query(`INSERT INTO blue_carbon_projects
    (org_id, project_name, description, ecosystem_type, methodology_id, methodology_version, status, boundary_geojson,
     centroid_lat, centroid_lng, baseline_summary, monitoring_start, monitoring_end, monitoring_date,
     project_manager, manager_contact, estimated_removals_tco2e, monitoring_progress, area_hectares, submitted_at, submitted_by)
    VALUES ($1,$2,$3,$4,$5,$6,'under_review',$7::jsonb,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW(),$19)
    RETURNING ${projectColumns}`, [getOrgId(req), b.project_name.trim(), b.description || null, b.ecosystem_type,
    b.methodology_id, (b.methodology_version || "1.0.0"), JSON.stringify(geometry), derived.centroid_lat,
    derived.centroid_lng, b.baseline.summary, b.monitoring_start, b.monitoring_end,
    b.monitoring_date || null, b.project_manager || null, b.manager_contact || null, b.estimated_removals_tco2e || null,
    b.monitoring_progress || 0, derived.area_hectares, actorId(req)]);
    await db.query(`INSERT INTO blue_carbon_baselines (project_id,org_id,baseline_date,source_label,summary,source_uri,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [inserted.rows[0].project_id, getOrgId(req), b.baseline.baseline_date, b.baseline.source_label, b.baseline.summary, b.baseline.source_uri || null, actorId(req)]);
    await db.query(`INSERT INTO blue_carbon_project_status_history (project_id,org_id,from_status,to_status,reason,changed_by) VALUES ($1,$2,NULL,'under_review','Project submitted by organization',$3)`, [inserted.rows[0].project_id, getOrgId(req), actorId(req)]);
    return inserted;
  });
  res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Blue Carbon project transaction failed:', error.message);
    return res.status(400).json({ success: false, message: error.code === '22003' ? 'Boundary or project numeric value is outside the database range' : 'Unable to create Blue Carbon project' });
  }
};

async function getOwnedProject(req, res) {
  const result = await query("SELECT project_id, org_id FROM blue_carbon_projects WHERE project_id=$1 AND org_id=$2", [req.params.projectId, getOrgId(req)]);
  if (!result.rows.length) { res.status(404).json({ success: false, message: "Blue Carbon project not found" }); return null; }
  return result.rows[0];
}

exports.listObservations = async (req, res) => {
  if (!await getOwnedProject(req, res)) return;
  const result = await query("SELECT * FROM blue_carbon_observations WHERE project_id=$1 AND org_id=$2 ORDER BY observed_on DESC", [req.params.projectId, getOrgId(req)]);
  res.json({ success: true, data: result.rows });
};

exports.createObservation = async (req, res) => {
  const project = await getOwnedProject(req, res); if (!project) return;
  const b = req.body || {};
  if (!b.observation_type || !b.observed_on || b.measured_value === undefined || !b.measured_unit || !b.collection_method || !b.source_label) return res.status(400).json({ success: false, message: "Observation type, date, measured value, unit, collection method, and source are required" });
  let coords, value, refs, tileId = b.tile_id || null; try { coords=coordinates(b); value=numberField(b.measured_value, 'measured_value'); refs=evidenceRefs(b.evidence_refs, 'evidence_refs'); } catch (e) { return res.status(400).json({ success:false,message:e.message }); }
  if (tileId) { const tile = await query('SELECT * FROM blue_carbon_tiles WHERE tile_id=$1 AND project_id=$2 AND org_id=$3',[tileId,project.project_id,project.org_id]); if (!tile.rows.length) return res.status(400).json({success:false,message:'tile_id does not belong to this project'}); if (coords[0] !== null) { const [status,message] = locationStatus(tile.rows[0],coords[0],coords[1],b.gps_accuracy_m); if (status !== 'valid') return res.status(400).json({success:false,message}); } }
  const result = await transaction(async (db) => { const inserted = await db.query(`INSERT INTO blue_carbon_observations
    (project_id,org_id,tile_id,observation_type,observed_on,latitude,longitude,gps_accuracy_m,observation_value,measured_value,measured_unit,collection_method,source_label,evidence_refs,created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`, [project.project_id, project.org_id, tileId, b.observation_type, b.observed_on, coords[0], coords[1], b.gps_accuracy_m || null, String(b.measured_value), value, b.measured_unit, b.collection_method, b.source_label, JSON.stringify(refs), actorId(req)]); await db.query(`INSERT INTO blue_carbon_evidence_revisions (record_type,record_id,project_id,org_id,version,payload,changed_by,change_reason) VALUES ('observation',$1,$2,$3,1,$4,$5,'Initial capture')`, [inserted.rows[0].observation_id, project.project_id, project.org_id, JSON.stringify(inserted.rows[0]), actorId(req)]); return inserted; });
  res.status(201).json({ success: true, data: result.rows[0] });
};

exports.listSamples = async (req, res) => {
  if (!await getOwnedProject(req, res)) return;
  const result = await query("SELECT * FROM blue_carbon_soil_samples WHERE project_id=$1 AND org_id=$2 ORDER BY collected_on DESC", [req.params.projectId, getOrgId(req)]);
  res.json({ success: true, data: result.rows });
};

exports.createSample = async (req, res) => {
  const project = await getOwnedProject(req, res); if (!project) return;
  const b = req.body || {};
  if (!b.sample_id || !b.collected_on || !b.depth_interval || b.bulk_density === undefined || !b.bulk_density_unit || b.organic_carbon === undefined || !b.organic_carbon_unit || !b.source_label) return res.status(400).json({ success: false, message: "Sample ID, collection date, depth interval, measurements, units, and source are required" });
  const depth = String(b.depth_interval).replace(/[–—]/g, '-').match(/^\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(cm|m)\s*$/i); let coords, density, carbon, refs, custody;
  try { if (!depth || Number(depth[1]) >= Number(depth[2])) throw new Error('depth_interval must be a valid positive range'); coords=coordinates(b); density=numberField(b.bulk_density,'bulk_density',{min:0}); carbon=numberField(b.organic_carbon,'organic_carbon',{min:0,max:100}); refs=evidenceRefs(b.laboratory_evidence_refs,'laboratory_evidence_refs'); custody=b.custody_records === undefined ? [] : (Array.isArray(b.custody_records) ? b.custody_records : (()=>{throw new Error('custody_records must be an array')})()); } catch(e) { return res.status(400).json({success:false,message:e.message}); }
  const result = await transaction(async (db) => { const inserted = await db.query(`INSERT INTO blue_carbon_soil_samples
    (sample_id,project_id,org_id,collected_on,depth_interval,latitude,longitude,bulk_density_g_cm3,bulk_density_unit,organic_carbon_percent,organic_carbon_unit,laboratory_result,laboratory_evidence_refs,custody_records,source_label,created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`, [b.sample_id, project.project_id, project.org_id, b.collected_on, b.depth_interval, coords[0],coords[1],density,b.bulk_density_unit,carbon,b.organic_carbon_unit,b.laboratory_result || null,JSON.stringify(refs),JSON.stringify(custody),b.source_label,actorId(req)]); await db.query(`INSERT INTO blue_carbon_evidence_revisions (record_type,record_id,project_id,org_id,version,payload,changed_by,change_reason) VALUES ('soil_sample',$1,$2,$3,1,$4,$5,'Initial capture')`, [inserted.rows[0].sample_id, project.project_id, project.org_id, JSON.stringify(inserted.rows[0]), actorId(req)]); return inserted; });
  res.status(201).json({ success: true, data: result.rows[0] });
};

exports.updateProject = async (req, res) => {
  const b = req.body || {};
  const existing = await query("SELECT * FROM blue_carbon_projects WHERE project_id=$1 AND org_id=$2", [req.params.projectId, getOrgId(req)]);
  if (!existing.rows.length) return res.status(404).json({ success: false, message: "Blue Carbon project not found" });
  const current = existing.rows[0]; const nextStatus = b.status ? String(b.status).toLowerCase() : current.status;
  const allowed = { draft: ['draft','under_review','active','archived'], active: ['active','monitoring','archived'], monitoring: ['monitoring','under_review','archived'], under_review: ['under_review','verified','monitoring'], verified: ['verified','archived'], archived: ['archived'] };
  if (!allowed[current.status].includes(nextStatus)) return res.status(400).json({ success: false, message: `Invalid status transition: ${current.status} -> ${nextStatus}` });
  if (['active','monitoring','under_review','verified'].includes(nextStatus)) {
    const baseline = await query("SELECT 1 FROM blue_carbon_baselines WHERE project_id=$1 AND org_id=$2 LIMIT 1", [req.params.projectId, getOrgId(req)]);
    if (!current.boundary_geojson || !current.area_hectares || current.centroid_lat == null || current.centroid_lng == null || !current.monitoring_start || !current.monitoring_end || !baseline.rows.length) return res.status(400).json({ success: false, message: "Project requires a valid boundary, derived area/centroid, monitoring period, and baseline before activation" });
  }
  const result = await transaction(async (db) => {
    const updated = await db.query(`UPDATE blue_carbon_projects SET project_name=COALESCE($1,project_name), description=COALESCE($2,description), status=$3::varchar, baseline_summary=COALESCE($4,baseline_summary), submitted_at=CASE WHEN $3::varchar='under_review' THEN NOW() ELSE submitted_at END, submitted_by=CASE WHEN $3::varchar='under_review' THEN $7::varchar ELSE submitted_by END, updated_at=NOW() WHERE project_id=$5::uuid AND org_id=$6::varchar RETURNING ${projectColumns}`, [b.project_name || null, b.description || null, nextStatus, b.baseline_summary || null, req.params.projectId, getOrgId(req), actorId(req)]);
    await db.query(`INSERT INTO blue_carbon_project_status_history (project_id,org_id,from_status,to_status,reason,changed_by) VALUES ($1,$2,$3,$4,$5,$6)`, [req.params.projectId, getOrgId(req), current.status, nextStatus, b.reason || null, actorId(req)]);
    return updated;
  });
  if (!result.rows.length) return res.status(404).json({ success: false, message: "Blue Carbon project not found" });
  res.json({ success: true, data: result.rows[0] });
};

exports.getBaselines = async (req, res) => { if (!await getOwnedProject(req, res)) return; const result = await query("SELECT * FROM blue_carbon_baselines WHERE project_id=$1 AND org_id=$2 ORDER BY baseline_date DESC", [req.params.projectId, getOrgId(req)]); res.json({ success: true, data: result.rows }); };
exports.listEvidenceRevisions = async (req, res) => {
  if (!await getOwnedProject(req, res)) return;
  const result = await query("SELECT * FROM blue_carbon_evidence_revisions WHERE project_id=$1 AND org_id=$2 AND record_type=$3 AND record_id=$4 ORDER BY version ASC", [req.params.projectId, getOrgId(req), req.params.recordType, req.params.recordId]);
  res.json({ success: true, data: result.rows });
};
exports.listReviewHistory = async (req, res) => {
  if (!await getOwnedProject(req, res)) return;
  const result = await query("SELECT * FROM blue_carbon_review_history WHERE project_id=$1 AND org_id=$2 AND record_id=$3 ORDER BY created_at ASC", [req.params.projectId, getOrgId(req), req.params.recordId]);
  res.json({ success: true, data: result.rows });
};

async function correctEvidence(req, res, type, id) {
  const table = type === 'observation' ? 'blue_carbon_observations' : 'blue_carbon_soil_samples';
  const key = type === 'observation' ? 'observation_id' : 'sample_id';
  const found = await query(`SELECT * FROM ${table} WHERE ${key}=$1 AND project_id=$2 AND org_id=$3`, [id, req.params.projectId, getOrgId(req)]);
  if (!found.rows.length) return res.status(404).json({ success: false, message: 'Evidence record not found' });
  if (found.rows[0].review_status !== 'approved') return res.status(409).json({ success: false, message: 'Only approved evidence can be corrected' });
  if (!req.body.reason || !String(req.body.reason).trim()) return res.status(400).json({ success: false, message: 'Correction reason is required' });
  const b = req.body;
  try {
    let values;
    if (type === 'observation') {
      const measured = numberField(b.measured_value, 'measured_value');
      if (!b.measured_unit || !b.collection_method || measured === null) throw new Error('measured_value, measured_unit, and collection_method are required');
      values = [measured, b.measured_unit, b.collection_method, evidenceRefs(b.evidence_refs, 'evidence_refs'), b.source_label || found.rows[0].source_label];
    } else {
      const density = numberField(b.bulk_density, 'bulk_density', { min: 0 });
      const carbon = numberField(b.organic_carbon, 'organic_carbon', { min: 0, max: 100 });
      if (!b.bulk_density_unit || !b.organic_carbon_unit || density === null || carbon === null) throw new Error('measurements and units are required');
      values = [density, b.bulk_density_unit, carbon, b.organic_carbon_unit, b.laboratory_result || null, evidenceRefs(b.laboratory_evidence_refs, 'laboratory_evidence_refs')];
    }
    const result = await transaction(async (db) => {
      const latest = await db.query('SELECT COALESCE(MAX(version),0)+1 AS version FROM blue_carbon_evidence_revisions WHERE record_type=$1 AND record_id=$2', [type, id]);
      const version = Number(latest.rows[0].version);
      const updated = type === 'observation'
        ? await db.query(`UPDATE ${table} SET measured_value=$1,measured_unit=$2,collection_method=$3,evidence_refs=$4::jsonb,source_label=$5,review_status='pending',review_comment=$6,reviewed_by=NULL,reviewer_id=NULL,reviewed_at=NULL,review_version=review_version+1,updated_at=NOW() WHERE ${key}=$7 RETURNING *`, [values[0], values[1], values[2], JSON.stringify(values[3]), values[4], b.reason, id])
        : await db.query(`UPDATE ${table} SET bulk_density_g_cm3=$1,bulk_density_unit=$2,organic_carbon_percent=$3,organic_carbon_unit=$4,laboratory_result=$5,laboratory_evidence_refs=$6::jsonb,review_status='pending',review_comment=$7,reviewed_by=NULL,reviewer_id=NULL,reviewed_at=NULL,review_version=review_version+1,updated_at=NOW() WHERE ${key}=$8 RETURNING *`, [values[0], values[1], values[2], values[3], values[4], JSON.stringify(values[5]), b.reason, id]);
      await db.query(`INSERT INTO blue_carbon_evidence_revisions (record_type,record_id,project_id,org_id,version,payload,changed_by,change_reason) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8)`, [type, id, req.params.projectId, getOrgId(req), version, JSON.stringify(updated.rows[0]), actorId(req), b.reason]);
      await db.query(`INSERT INTO blue_carbon_review_history (org_id,project_id,record_type,record_id,from_status,to_status,comment,reviewer_id) VALUES ($1,$2,$3,$4,'approved','pending',$5,$6)`, [getOrgId(req), req.params.projectId, type, id, b.reason, actorId(req)]);
      return updated;
    });
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) { return res.status(400).json({ success: false, message: error.message }); }
}
exports.correctObservation = (req, res) => correctEvidence(req, res, 'observation', req.params.observationId);
exports.correctSample = (req, res) => correctEvidence(req, res, 'soil_sample', req.params.sampleId);

async function reviewRecord(req, res, type, id) {
  if (!reviewerOnly(req,res)) return; const table=type==='observation'?'blue_carbon_observations':'blue_carbon_soil_samples'; const key=type==='observation'?'observation_id':'sample_id';
  const found=await query(`SELECT * FROM ${table} WHERE ${key}=$1 AND project_id=$2 AND org_id=$3`,[id,req.params.projectId,getOrgId(req)]); if(!found.rows.length) return res.status(404).json({success:false,message:'Evidence record not found'});
  const current=found.rows[0], next=req.body.review_status, transitions={pending:['approved','rejected','changes_requested'],changes_requested:['pending','rejected'],rejected:['pending'],approved:[]}; if(!transitions[current.review_status]?.includes(next)) return res.status(400).json({success:false,message:`Invalid review transition: ${current.review_status} -> ${next}`}); if(!req.body.reason || !String(req.body.reason).trim()) return res.status(400).json({success:false,message:'Review reason is required'});
  const updated=await transaction(async (db) => {
    const changed = await db.query(`UPDATE ${table} SET review_status=$1,review_comment=$2,reviewer_id=$3,reviewed_by=$3,reviewed_at=NOW(),updated_at=NOW() WHERE ${key}=$4 AND project_id=$5 AND org_id=$6 RETURNING *`,[next,req.body.reason,actorId(req),id,req.params.projectId,getOrgId(req)]);
    await db.query(`INSERT INTO blue_carbon_review_history (org_id,project_id,record_type,record_id,from_status,to_status,comment,reviewer_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,[getOrgId(req),req.params.projectId,type,id,current.review_status,next,req.body.reason,actorId(req)]);
    return changed;
  });
  res.json({success:true,data:updated.rows[0]});
}
exports.reviewObservation=(req,res)=>reviewRecord(req,res,'observation',req.params.observationId);
exports.reviewSample=(req,res)=>reviewRecord(req,res,'soil_sample',req.params.sampleId);

function actorCanManage(req) {
  return ['organization','organization_admin','org_admin','admin'].includes(String(req.blueCarbonUser.role || '').toLowerCase());
}
function taskStatus(dueAt) { const ms = new Date(dueAt).getTime() - Date.now(); return ms < 0 ? 'overdue' : ms < 7 * 86400000 ? 'due' : 'upcoming'; }

exports.listAssignments = async (req, res) => {
  const result = await query(`SELECT a.*, t.tile_code FROM blue_carbon_tile_assignments a JOIN blue_carbon_tiles t ON t.tile_id=a.tile_id WHERE a.project_id=$1 AND a.org_id=$2 ORDER BY a.assigned_at DESC`, [req.params.projectId, getOrgId(req)]);
  res.json({ success: true, data: result.rows });
};

exports.assignTiles = async (req, res) => {
  if (!actorCanManage(req)) return res.status(403).json({ success: false, message: 'Organization administrator permission required' });
  const { tile_ids: tileIds, assignee_id: assigneeId, monitoring_frequency: frequency = 'monthly', custom_interval_days: intervalDays, start_date: startDate, end_date: endDate, field_instructions: instructions, checklist = [], override_conflict: override = false } = req.body || {};
  if (!Array.isArray(tileIds) || !tileIds.length || !assigneeId || !startDate) return res.status(400).json({ success: false, message: 'tile_ids, assignee_id, and start_date are required' });
  try {
    const result = await transaction(async (db) => {
      const saved = [];
      for (const tileId of tileIds) {
        const tile = await db.query('SELECT tile_id FROM blue_carbon_tiles WHERE tile_id=$1 AND project_id=$2 AND org_id=$3', [tileId, req.params.projectId, getOrgId(req)]);
        if (!tile.rows.length) throw new Error(`Tile ${tileId} does not belong to this project`);
        const conflict = await db.query('SELECT assignment_id FROM blue_carbon_tile_assignments WHERE tile_id=$1 AND active=true AND assignee_id<>$2', [tileId, assigneeId]);
        if (conflict.rows.length && !override) throw new Error(`Tile ${tileId} already has an active assignment`);
        if (override) await db.query('UPDATE blue_carbon_tile_assignments SET active=false,ended_at=NOW() WHERE tile_id=$1 AND active=true', [tileId]);
        const inserted = await db.query(`INSERT INTO blue_carbon_tile_assignments (tile_id,project_id,org_id,assignee_id,assigned_by,monitoring_frequency,custom_interval_days,start_date,end_date,field_instructions,checklist,override_conflict) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12) RETURNING *`, [tileId, req.params.projectId, getOrgId(req), assigneeId, actorId(req), frequency, intervalDays || null, startDate, endDate || null, instructions || null, JSON.stringify(checklist), Boolean(override)]);
        await db.query(`UPDATE blue_carbon_tiles SET status='assigned',updated_at=NOW() WHERE tile_id=$1`, [tileId]);
        saved.push(inserted.rows[0]);
      }
      return saved;
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) { res.status(409).json({ success: false, message: error.message }); }
};

exports.clearProjectAssignments = async (req, res) => {
  if (!actorCanManage(req)) return res.status(403).json({ success: false, message: 'Organization administrator permission required' });
  try {
    const result = await transaction(async (db) => {
      const deactivated = await db.query(
        `UPDATE blue_carbon_tile_assignments
         SET active=false, ended_at=COALESCE(ended_at, NOW())
         WHERE project_id=$1 AND org_id=$2 AND active=true`,
        [req.params.projectId, getOrgId(req)]
      );
      const reset = await db.query(
        `DELETE FROM blue_carbon_tiles
         WHERE project_id=$1 AND org_id=$2`,
        [req.params.projectId, getOrgId(req)]
      );
      await db.query(
        `UPDATE blue_carbon_projects
         SET boundary_geojson=NULL, area_hectares=NULL,
             centroid_lat=NULL, centroid_lng=NULL, updated_at=NOW()
         WHERE project_id=$1 AND org_id=$2`,
        [req.params.projectId, getOrgId(req)]
      );
      return { assignments_cleared: deactivated.rowCount, tiles_cleared: reset.rowCount };
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Unable to clear project assignments' });
  }
};

exports.createSchedule = async (req, res) => {
  if (!actorCanManage(req)) return res.status(403).json({ success: false, message: 'Organization administrator permission required' });
  const { tile_id: tileId, frequency, interval_days: intervalDays, start_date: startDate, end_date: endDate } = req.body || {};
  if (!tileId || !frequency || !startDate) return res.status(400).json({ success: false, message: 'tile_id, frequency, and start_date are required' });
  const allowed = ['daily','weekly','biweekly','monthly','quarterly','custom']; if (!allowed.includes(frequency) || (frequency === 'custom' && !intervalDays)) return res.status(400).json({ success: false, message: 'Invalid monitoring frequency' });
  const firstDue = new Date(startDate); const result = await transaction(async (db) => {
    await db.query('UPDATE blue_carbon_monitoring_schedules SET active=false,updated_at=NOW() WHERE tile_id=$1 AND active=true', [tileId]);
    const schedule = await db.query(`INSERT INTO blue_carbon_monitoring_schedules (tile_id,project_id,org_id,frequency,interval_days,start_date,end_date,next_due_at,created_by) SELECT $1,project_id,org_id,$2,$3,$4,$5,$6,$7 FROM blue_carbon_tiles WHERE tile_id=$1 AND org_id=$8 RETURNING *`, [tileId, frequency, intervalDays || null, startDate, endDate || null, firstDue, actorId(req), getOrgId(req)]);
    if (!schedule.rows.length) throw new Error('Tile not found');
    const task = await db.query(`INSERT INTO blue_carbon_monitoring_tasks (schedule_id,tile_id,project_id,org_id,assigned_user_id,due_at,status) SELECT schedule_id,tile_id,project_id,org_id,(SELECT assignee_id FROM blue_carbon_tile_assignments WHERE tile_id=$1 AND active=true LIMIT 1),next_due_at,$2 FROM blue_carbon_monitoring_schedules WHERE schedule_id=$3 RETURNING *`, [tileId, taskStatus(firstDue), schedule.rows[0].schedule_id]);
    return { schedule: schedule.rows[0], task: task.rows[0] };
  });
  res.status(201).json({ success: true, data: result });
};

function nextOccurrence(date, frequency, customDays) { const next=new Date(date); if(frequency==='daily')next.setDate(next.getDate()+1); else if(frequency==='weekly')next.setDate(next.getDate()+7); else if(frequency==='biweekly')next.setDate(next.getDate()+14); else if(frequency==='monthly')next.setMonth(next.getMonth()+1); else if(frequency==='quarterly')next.setMonth(next.getMonth()+3); else next.setDate(next.getDate()+Number(customDays||1)); return next; }
exports.generateScheduledTasks = async () => {
  const schedules=await query(`SELECT * FROM blue_carbon_monitoring_schedules WHERE active=true AND next_due_at <= NOW() + INTERVAL '30 days'`);
  let created=0;
  for(const schedule of schedules.rows){
    let due=new Date(schedule.next_due_at);
    for(let i=0;i<12 && due <= new Date(Date.now()+30*86400000);i++){
      const task=await query(`INSERT INTO blue_carbon_monitoring_tasks (schedule_id,tile_id,project_id,org_id,assigned_user_id,due_at,status) SELECT $1,$2,$3,$4,(SELECT assignee_id FROM blue_carbon_tile_assignments WHERE tile_id=$2 AND active=true LIMIT 1),$5,$6 WHERE NOT EXISTS (SELECT 1 FROM blue_carbon_monitoring_tasks WHERE schedule_id=$1 AND due_at=$5) RETURNING task_id`,[schedule.schedule_id,schedule.tile_id,schedule.project_id,schedule.org_id,due,taskStatus(due)]);
      created+=task.rowCount; due=nextOccurrence(due,schedule.frequency,schedule.interval_days);
      if(schedule.end_date && due > new Date(schedule.end_date)) break;
    }
    await query('UPDATE blue_carbon_monitoring_schedules SET next_due_at=$1,updated_at=NOW() WHERE schedule_id=$2',[due,schedule.schedule_id]);
  }
  await query(`UPDATE blue_carbon_monitoring_tasks SET status='overdue',updated_at=NOW() WHERE due_at < NOW() AND status IN ('upcoming','due')`);
  return { created };
};

exports.listTasks = async (req, res) => {
  const result = await query(`SELECT t.*, tile.tile_code FROM blue_carbon_monitoring_tasks t JOIN blue_carbon_tiles tile ON tile.tile_id=t.tile_id WHERE t.org_id=$1 AND ($2::uuid IS NULL OR t.project_id=$2) AND ($3::varchar IS NULL OR t.assigned_user_id=$3) ORDER BY t.due_at ASC`, [getOrgId(req), req.query.project_id || null, req.query.assignee_id || null]);
  res.json({ success: true, data: result.rows });
};

function insideRing(point, ring) { let inside = false; for (let i=0,j=ring.length-1;i<ring.length;j=i++) { const xi=Number(ring[i][0]), yi=Number(ring[i][1]), xj=Number(ring[j][0]), yj=Number(ring[j][1]); const hit=((yi>point[1])!==(yj>point[1])) && point[0] < (xj-xi)*(point[1]-yi)/(yj-yi)+xi; if(hit) inside=!inside; } return inside; }
function locationStatus(tile, lat, lng, accuracy) {
  if (lat === undefined || lng === undefined || lat === '' || lng === '') return ['missing_gps','GPS coordinates were not supplied'];
  const geometry = tile.geometry_geojson?.geometry || tile.geometry_geojson; const ring = geometry?.coordinates?.[0];
  if (!ring || !insideRing([Number(lng),Number(lat)], ring)) return ['outside_tile','GPS point is outside the assigned tile'];
  if (accuracy !== undefined && accuracy !== null && Number(accuracy) > 50) return ['poor_accuracy','GPS accuracy is poorer than 50 metres'];
  return ['valid',null];
}

exports.startVisit = async (req, res) => {
  const task = await query(`SELECT t.*, tile.geometry_geojson FROM blue_carbon_monitoring_tasks t JOIN blue_carbon_tiles tile ON tile.tile_id=t.tile_id WHERE t.task_id=$1 AND t.org_id=$2`, [req.params.taskId, getOrgId(req)]);
  if (!task.rows.length) return res.status(404).json({ success:false, message:'Monitoring task not found' });
  const row = task.rows[0]; const userId = actorId(req);
  if (row.assigned_user_id && row.assigned_user_id !== userId && !actorCanManage(req)) return res.status(403).json({ success:false,message:'This task is assigned to another field user' });
  const result = await transaction(async db => {
    const visit = await db.query(`INSERT INTO blue_carbon_field_visits (task_id,tile_id,project_id,org_id,field_user_id,start_lat,start_lng,gps_accuracy_m) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [row.task_id,row.tile_id,row.project_id,row.org_id,userId,req.body?.latitude||null,req.body?.longitude||null,req.body?.gps_accuracy_m||null]);
    await db.query(`UPDATE blue_carbon_monitoring_tasks SET status='in_progress',visit_id=$1,updated_at=NOW() WHERE task_id=$2`, [visit.rows[0].visit_id,row.task_id]);
    await db.query(`UPDATE blue_carbon_tiles SET status='in_progress',updated_at=NOW() WHERE tile_id=$1`, [row.tile_id]);
    return visit.rows[0];
  });
  res.status(201).json({success:true,data:result});
};

exports.uploadVisitMedia = async (req, res) => {
  const visit = await query(`SELECT v.*,t.geometry_geojson FROM blue_carbon_field_visits v JOIN blue_carbon_tiles t ON t.tile_id=v.tile_id WHERE v.visit_id=$1 AND v.org_id=$2`, [req.params.visitId,getOrgId(req)]);
  if (!visit.rows.length) return res.status(404).json({success:false,message:'Field visit not found'});
  if (!req.files?.length) return res.status(400).json({success:false,message:'At least one media file is required'});
  const row=visit.rows[0], typeMap={photo:'photo',image:'photo',video:'video',audio:'audio',document:'document'};
  try {
    const saved=[];
    for (const file of req.files) {
      const hash=crypto.createHash('sha256').update(file.buffer).digest('hex');
      const type=typeMap[String(file.mimetype||'').split('/')[0]] || 'document';
      const lat=req.body?.latitude || file.latitude, lng=req.body?.longitude || file.longitude, accuracy=req.body?.gps_accuracy_m || file.gps_accuracy_m;
      const [validationStatus,validationMessage]=locationStatus(row,lat,lng,accuracy);
      const uploaded=await uploadMedia(file.buffer,`co2plus-blue-carbon/${row.project_id}`, 'auto');
      const result=await query(`INSERT INTO blue_carbon_media_evidence (visit_id,tile_id,project_id,org_id,uploaded_by,media_type,storage_key,original_filename,mime_type,file_size_bytes,checksum_sha256,capture_lat,capture_lng,gps_accuracy_m,captured_at,metadata,validation_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17) RETURNING *`,[row.visit_id,row.tile_id,row.project_id,row.org_id,actorId(req),type,uploaded.url,file.originalname,file.mimetype,file.size,hash,lat||null,lng||null,accuracy||null,req.body?.captured_at||null,JSON.stringify({cloudinary_public_id:uploaded.public_id,client_metadata:req.body?.metadata||null,capture_time_warning:req.body?.captured_at?null:'Capture time was not independently verified'}),validationStatus]);
      saved.push(result.rows[0]);
    }
    res.status(201).json({success:true,data:saved});
  } catch(error) { res.status(400).json({success:false,message:error.message}); }
};

exports.listVisitMedia = async (req,res) => { const result=await query('SELECT * FROM blue_carbon_media_evidence WHERE visit_id=$1 AND org_id=$2 ORDER BY uploaded_at ASC',[req.params.visitId,getOrgId(req)]); res.json({success:true,data:result.rows}); };
exports.tileHistory = async (req,res) => { const tile=await query('SELECT * FROM blue_carbon_tiles WHERE tile_id=$1 AND org_id=$2',[req.params.tileId,getOrgId(req)]); if(!tile.rows.length)return res.status(404).json({success:false,message:'Tile not found'}); const visits=await query(`SELECT v.*,json_agg(m ORDER BY m.uploaded_at) FILTER (WHERE m.evidence_id IS NOT NULL) AS evidence FROM blue_carbon_field_visits v LEFT JOIN blue_carbon_media_evidence m ON m.visit_id=v.visit_id WHERE v.tile_id=$1 AND v.org_id=$2 GROUP BY v.visit_id ORDER BY v.started_at DESC`,[req.params.tileId,getOrgId(req)]); res.json({success:true,data:{tile:tile.rows[0],visits:visits.rows}}); };
exports.reviewMedia = async (req,res) => { if(!reviewerOnly(req,res))return; const next=req.body?.review_status; if(!['approved','rejected','changes_requested'].includes(next)||!String(req.body?.reason||'').trim())return res.status(400).json({success:false,message:'A valid review status and reason are required'}); try { const result=await transaction(async(db)=>{const current=await db.query('SELECT * FROM blue_carbon_media_evidence WHERE evidence_id=$1 AND org_id=$2 FOR UPDATE',[req.params.evidenceId,getOrgId(req)]); if(!current.rows.length)throw Object.assign(new Error('Evidence not found'),{statusCode:404}); const changed=await db.query(`UPDATE blue_carbon_media_evidence SET review_status=$1,review_comment=$2,reviewed_by=$3,reviewed_at=NOW() WHERE evidence_id=$4 AND org_id=$5 RETURNING *`,[next,req.body.reason,actorId(req),req.params.evidenceId,getOrgId(req)]); await db.query(`INSERT INTO blue_carbon_media_review_history (evidence_id,org_id,from_status,to_status,reason,reviewer_id) VALUES ($1,$2,$3,$4,$5,$6)`,[req.params.evidenceId,getOrgId(req),current.rows[0].review_status,next,req.body.reason,actorId(req)]); return changed;}); res.json({success:true,data:result.rows[0]}); } catch(error) { res.status(error.statusCode||500).json({success:false,message:error.message}); } };
exports.mediaReviewHistory = async (req,res) => { const result=await query('SELECT * FROM blue_carbon_media_review_history WHERE evidence_id=$1 AND org_id=$2 ORDER BY created_at ASC',[req.params.evidenceId,getOrgId(req)]); res.json({success:true,data:result.rows}); };
exports.submitVisit = async (req,res) => { const result=await query(`UPDATE blue_carbon_field_visits SET status='submitted',submitted_at=NOW(),notes=COALESCE($1,notes),checklist=COALESCE($2::jsonb,checklist),updated_at=NOW() WHERE visit_id=$3 AND org_id=$4 RETURNING *`,[req.body?.notes||null,req.body?.checklist?JSON.stringify(req.body.checklist):null,req.params.visitId,getOrgId(req)]); if(!result.rows.length)return res.status(404).json({success:false,message:'Field visit not found'}); await query(`UPDATE blue_carbon_monitoring_tasks SET status='submitted',updated_at=NOW() WHERE visit_id=$1`,[req.params.visitId]); await query(`UPDATE blue_carbon_tiles SET status='submitted',updated_at=NOW() WHERE tile_id=$1`,[result.rows[0].tile_id]); res.json({success:true,data:result.rows[0]}); };
