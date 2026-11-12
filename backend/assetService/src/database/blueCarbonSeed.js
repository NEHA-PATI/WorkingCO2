const { pool } = require('../config/database');
const { generateTiles } = require('../utils/blueCarbonTiles');

const projects = [
  { name: 'Bhitarkanika Mangrove Demonstration', ecosystem: 'mangrove', center: [86.92, 20.72], size: 0.08 },
  { name: 'Sundarbans Tidal Wetland Demonstration', ecosystem: 'tidal_wetland', center: [88.88, 21.95], size: 0.06 },
];
function boundary([lng,lat], size) { return { type:'Polygon', coordinates:[[ [lng-size,lat-size], [lng+size,lat-size], [lng+size,lat+size], [lng-size,lat+size], [lng-size,lat-size] ]] }; }
async function seed() {
  const client=await pool.connect();
  try { await client.query('BEGIN');
    const org=(await client.query('SELECT org_id FROM organizations ORDER BY created_at LIMIT 1')).rows[0];
    if(!org) throw new Error('Create or approve an organization before seeding Blue Carbon demo data');
    const user=(await client.query("SELECT COALESCE(u_id,id::text) AS id FROM users ORDER BY created_at LIMIT 1")).rows[0];
    for(const item of projects){
      const geometry=boundary(item.center,item.size);
      const existing=await client.query('SELECT project_id FROM blue_carbon_projects WHERE org_id=$1 AND project_name=$2',[org.org_id,item.name]);
      let projectId=existing.rows[0]?.project_id;
      if(!projectId){ const inserted=await client.query(`INSERT INTO blue_carbon_projects (org_id,project_name,description,ecosystem_type,methodology_id,methodology_version,status,boundary_geojson,centroid_lat,centroid_lng,baseline_summary,monitoring_start,monitoring_end,area_hectares,monitoring_progress,data_disclaimer) VALUES ($1,$2,$3,$4,'blue-carbon-initial-v1','1.0.0','monitoring',$5::jsonb,$6,$7,$8,CURRENT_DATE,CURRENT_DATE+INTERVAL '1 year',$9,35,'DEMO DATA — not a verified field measurement') RETURNING project_id`,[org.org_id,item.name,`Seeded ${item.name} demonstration project`,item.ecosystem,JSON.stringify(geometry),item.center[1],item.center[0],'Seeded illustrative baseline',Number(item.size*2*111*item.size*2*111).toFixed(6)]); projectId=inserted.rows[0].project_id; await client.query(`INSERT INTO blue_carbon_baselines (project_id,org_id,baseline_date,source_label,summary,created_by) VALUES ($1,$2,CURRENT_DATE,'DEMO BASELINE','Illustrative baseline for demonstration only',$3)`,[projectId,org.org_id,user?.id||'demo-seed']); }
      const tiles=generateTiles(geometry,250,'square');
      for(const tile of tiles.slice(0,40)){ const t=await client.query(`INSERT INTO blue_carbon_tiles (project_id,org_id,tile_code,geometry_geojson,area_hectares,centroid_lat,centroid_lng,grid_row,grid_column,status) VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7,$8,$9,'assigned') ON CONFLICT (project_id,tile_code) DO UPDATE SET geometry_geojson=EXCLUDED.geometry_geojson RETURNING tile_id`,[projectId,org.org_id,`DEMO-${tile.row}-${tile.column}`,JSON.stringify(tile.geometry_geojson),tile.area_hectares,tile.centroid_lat,tile.centroid_lng,tile.row,tile.column]); const tileId=t.rows[0].tile_id; if(user) { await client.query(`INSERT INTO blue_carbon_tile_assignments (tile_id,project_id,org_id,assignee_id,assigned_by,start_date,field_instructions,checklist) VALUES ($1,$2,$3,$4,$4,CURRENT_DATE,'DEMO VISIT — illustrative evidence only','[{"label":"Photograph boundary","required":true},{"label":"Record vegetation condition","required":true}]') ON CONFLICT DO NOTHING`,[tileId,projectId,org.org_id,user.id]); }
      }
      const firstTile=(await client.query('SELECT tile_id FROM blue_carbon_tiles WHERE project_id=$1 ORDER BY grid_row,grid_column LIMIT 1',[projectId])).rows[0];
      if(firstTile){ const schedule=(await client.query(`INSERT INTO blue_carbon_monitoring_schedules (tile_id,project_id,org_id,frequency,start_date,next_due_at,created_by) SELECT $1,$2,$3,'monthly',CURRENT_DATE,CURRENT_DATE,$4 WHERE NOT EXISTS (SELECT 1 FROM blue_carbon_monitoring_schedules WHERE tile_id=$1 AND active=true) RETURNING schedule_id`,[firstTile.tile_id,projectId,org.org_id,user?.id||'demo-seed'])).rows[0]; if(schedule) await client.query(`INSERT INTO blue_carbon_monitoring_tasks (schedule_id,tile_id,project_id,org_id,assigned_user_id,due_at,status) VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,'due') ON CONFLICT DO NOTHING`,[schedule.schedule_id,firstTile.tile_id,projectId,org.org_id,user?.id||null]); }
    }
    await client.query('COMMIT'); console.log('Blue Carbon demo data seeded for Bhitarkanika and Sundarbans');
  } catch(error){await client.query('ROLLBACK');console.error(error.message);process.exitCode=1;} finally {client.release();await pool.end();}
}
seed();
