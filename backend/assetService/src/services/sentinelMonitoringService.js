const axios = require('axios');
const { query, transaction } = require('../config/database');
const logger = require('../utils/logger');

const BANDS = ['B02','B03','B04','B05','B08','B11','SCL'];
const ENDPOINT = process.env.COPERNICUS_SENTINEL_HUB_URL || 'https://sh.dataspace.copernicus.eu';
const TOKEN_URL = process.env.COPERNICUS_TOKEN_URL || `${ENDPOINT}/oauth/token`;
const DEFAULT_THRESHOLDS = {
  amberChange: 0.05, // 5% relative indicator change needs review
  redChange: 0.12, // 12% relative indicator change needs investigation
  minValidPercent: 20,
  maxCloudPercent: 40,
};
let tokenCache = { value: null, expiresAt: 0 };

function credentialsPresent() { return Boolean(process.env.COPERNICUS_CLIENT_ID && process.env.COPERNICUS_CLIENT_SECRET); }
async function token() {
  if (!credentialsPresent()) throw new Error('Copernicus credentials are not configured');
  if (tokenCache.value && tokenCache.expiresAt > Date.now() + 60000) return tokenCache.value;
  const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.COPERNICUS_CLIENT_ID, client_secret: process.env.COPERNICUS_CLIENT_SECRET });
  const response = await axios.post(TOKEN_URL, body.toString(), { headers: { 'content-type': 'application/x-www-form-urlencoded' }, timeout: 30000 });
  tokenCache = { value: response.data.access_token, expiresAt: Date.now() + Number(response.data.expires_in || 300) * 1000 };
  return tokenCache.value;
}
function finite(v) { return Number.isFinite(Number(v)) ? Number(v) : null; }
function stats(stat) { const value = stat?.stats || stat || {}; return { mean: finite(value.mean), minimum: finite(value.min), maximum: finite(value.max), validPixelCount: Number(value.sampleCount || value.count || 0) }; }
function median(values) { const clean = values.filter(Number.isFinite).sort((a, b) => a - b); if (!clean.length) return null; const middle = Math.floor(clean.length / 2); return clean.length % 2 ? clean[middle] : (clean[middle - 1] + clean[middle]) / 2; }
function evalscript() {
  return `//VERSION=3\nfunction setup(){return {input:[{bands:["B02","B03","B04","B05","B08","B11","SCL","dataMask"]}],output:[{id:"default",bands:13,sampleType:"FLOAT32"},{id:"dataMask",bands:1,sampleType:"UINT8"}]}}\nfunction evaluatePixel(s){var b02=s.B02/10000,b03=s.B03/10000,b04=s.B04/10000,b05=s.B05/10000,b08=s.B08/10000,b11=s.B11/10000; var valid=s.dataMask===1 && [0,1,2,3,8,9,10,11].indexOf(s.SCL)===-1; var d=(a,b)=>Math.abs(a+b)<1e-12?NaN:(a-b)/(a+b); var values=[b02,b03,b04,b05,b08,b11,s.SCL,d(b08,b04),2.5*(b08-b04)/(b08+6*b04-7.5*b02+1),d(b08,b11),d(b03,b08),d(b03,b11),d(b08,b05)]; return {default:valid?values:values.map(()=>NaN),dataMask:[valid?1:0]};}`;
}
async function requestStats(geometry, from, to) {
  const payload = { input: { bounds: { geometry, properties: { crs: 'http://www.opengis.net/def/crs/EPSG/0/4326' } }, data: [{ type: 'sentinel-2-l2a', dataFilter: { timeRange: { from, to }, mosaickingOrder: 'leastCC', maxCloudCoverage: Number(process.env.COPERNICUS_MAX_CLOUD_COVERAGE || 40) } }] }, aggregation: { timeRange: { from, to }, aggregationInterval: { of: 'P1D' }, lastIntervalBehavior: 'SHORTEN', evalscript: evalscript(), resx: 10, resy: 10 } };
  const accessToken = await token();
  logger.info(`Satellite statistics request: url=${ENDPOINT}/statistics/v1 collection=${payload.input.data[0].type} from=${from} to=${to}`);
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await axios.post(`${ENDPOINT}/statistics/v1`, payload, { headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' }, timeout: 120000 });
      logger.info(`Satellite provider response: status=${response.status} observations=${response.data?.data?.length || 0}`);
      const item = response.data?.data?.find((x) => x.outputs?.default?.bands) || response.data?.data?.[0];
      if (!item) throw new Error('Copernicus returned no suitable Sentinel-2 observation');
      return { item, bands: item.outputs.default.bands };
    } catch (error) {
      const providerBody = error.response?.data ? JSON.stringify(error.response.data).slice(0, 1000) : error.message;
      if (error.response?.status === 429 && attempt < 3) {
        const retryAfter = Number(error.response.headers?.['retry-after'] || error.response.headers?.['Retry-After']);
        const delay = Math.min(60000, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 3000 * (2 ** attempt));
        logger.warn(`Satellite rate limited; retrying in ${delay}ms: status=429 body=${providerBody}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      logger.error(`Satellite provider rejected request: status=${error.response?.status || 'n/a'} body=${providerBody}`);
      throw error;
    }
  }
}
async function findLatestScene(geometry, from, to) {
  const accessToken = await token();
  const coordinates = geometry?.coordinates?.flat(Infinity) || [];
  const points = [];
  for (let i = 0; i < coordinates.length; i += 2) if (Number.isFinite(Number(coordinates[i])) && Number.isFinite(Number(coordinates[i + 1]))) points.push([Number(coordinates[i]), Number(coordinates[i + 1])]);
  const bbox = points.length ? [Math.min(...points.map((p) => p[0])), Math.min(...points.map((p) => p[1])), Math.max(...points.map((p) => p[0])), Math.max(...points.map((p) => p[1]))] : undefined;
  logger.info(`Satellite catalog search started: from=${from} to=${to} bbox=${bbox?.join(',') || 'none'}`);
  const response = await axios.get(`${ENDPOINT}/catalog/v1/search`, { params: { ...(bbox ? { bbox: bbox.join(',') } : {}), datetime: `${from}/${to}`, collections: 'sentinel-2-l2a', limit: 20 }, headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' }, timeout: 30000 });
  const maxCloud = Number(process.env.COPERNICUS_MAX_CLOUD_COVERAGE || 40);
  const features = (response.data?.features || []).filter((feature) => Number(feature.properties?.['eo:cloud_cover'] ?? feature.properties?.cloud_cover ?? 100) <= maxCloud).sort((a, b) => new Date(b.properties?.datetime || b.properties?.['datetime'] || 0) - new Date(a.properties?.datetime || a.properties?.['datetime'] || 0));
  const scene = features[0];
  if (!scene) throw new Error('No suitable Sentinel-2 L2A scene found in the configured lookback window');
  const acquisition = new Date(scene.properties?.datetime || scene.properties?.['datetime']);
  logger.info(`Satellite catalog scene selected: scene=${scene.id || 'unknown'} acquired=${acquisition.toISOString()} cloud=${scene.properties?.['eo:cloud_cover'] ?? 'n/a'}`);
  return { scene, acquisition };
}
function normalize(raw) {
  const names = [...BANDS, 'NDVI','EVI','NDMI','NDWI','MNDWI','NDRE'];
  const indicators = {};
  names.slice(0, 7).forEach((name, i) => { indicators[name] = stats(raw.bands[`B${i}`] || raw.bands[name]); });
  ['NDVI','EVI','NDMI','NDWI','MNDWI','NDRE'].forEach((name, i) => { indicators[name] = stats(raw.bands[`B${i + 7}`] || raw.bands[name]); });
  const valid = indicators.NDVI.validPixelCount || 0;
  const total = Number(raw.item?.outputs?.dataMask?.bands?.B0?.stats?.sampleCount || valid);
  return { indicators, validPixelCount: valid, validPixelPercentage: total ? (valid / total) * 100 : 0 };
}
function assess(current, previous, thresholds = {}) {
  const t = { ...DEFAULT_THRESHOLDS, ...thresholds };
  if (!current.validPixelCount || current.validPixelPercentage < t.minValidPercent) return { status: 'GREY', explanation: 'Insufficient valid Sentinel-2 pixels after SCL masking.' };
  const observations = Array.isArray(previous) ? previous : (previous ? [previous] : []);
  // A first valid observation has no change baseline yet, but it is still a
  // healthy, usable satellite result. Mark it GREEN so the first processing
  // run paints tiles immediately; later runs use the change thresholds below.
  if (!observations.length) return { status: 'GREEN', explanation: 'Initial valid Sentinel-2 observation recorded; change assessment will begin with the next observation.' };
  const baseline = {};
  ['NDVI','EVI','NDMI','NDWI','MNDWI','NDRE'].forEach((key) => { baseline[key] = median(observations.map((item) => Number(item.indicators?.[key]?.mean))); });
  const changes = ['NDVI','EVI','NDMI','NDWI','MNDWI','NDRE'].map(k => Math.abs((current.indicators[k]?.mean ?? 0) - (baseline[k] ?? 0)) / Math.max(Math.abs(baseline[k] ?? 0), 0.05));
  const redCount = changes.filter((change) => change >= t.redChange).length;
  const amberCount = changes.filter((change) => change >= t.amberChange).length;
  const medianChange = median(changes);
  const medianPercent = (medianChange * 100).toFixed(1);
  if (redCount >= 3 || medianChange >= t.redChange) return { status: 'RED', explanation: `Significant change: ${redCount}/6 indicators at or above ${t.redChange * 100}% (median ${medianPercent}%). Field investigation recommended.` };
  if (amberCount >= 2 || medianChange >= t.amberChange) return { status: 'AMBER', explanation: `Moderate change: ${amberCount}/6 indicators at or above ${t.amberChange * 100}% (median ${medianPercent}%). Review and verify in the field.` };
  return { status: 'GREEN', explanation: `Stable indicators: ${amberCount}/6 indicators exceeded the ${t.amberChange * 100}% attention threshold (median ${medianPercent}%).` };
}
async function processTile(tile, options = {}) {
  const date = options.date ? new Date(options.date) : new Date();
  // Request only today's UTC calendar day. No previous-day imagery fallback is
  // used for the live condition request.
  const lookbackDays = options.lookbackDays === undefined ? Number(process.env.COPERNICUS_LOOKBACK_DAYS || 30) : Number(options.lookbackDays);
  const from = new Date(date.getTime() - Math.max(1, lookbackDays) * 86400000);
  const day = date.toISOString().slice(0,10);
  if (!options.force) {
    const cacheHours = Math.max(1, Number(process.env.COPERNICUS_CACHE_HOURS || 24));
    const cached = await query('SELECT tile_id, health_status, indicators, valid_pixel_count AS "validPixelCount", valid_pixel_percentage AS "validPixelPercentage", observed_on, acquisition_time, scene_id FROM blue_carbon_satellite_observations WHERE tile_id=$1 AND processing_status=\'processed\' AND created_at >= NOW() - ($2::numeric * INTERVAL \'1 hour\') ORDER BY observed_on DESC, created_at DESC LIMIT 1', [tile.tile_id, cacheHours]);
    if (cached.rows[0]) { logger.info(`Satellite cache hit: tile=${tile.tile_code || tile.tile_id} observed=${cached.rows[0].observed_on} scene=${cached.rows[0].scene_id || 'unknown'}`); return cached.rows[0]; }
  }
  logger.info(`Satellite tile started: tile=${tile.tile_code || tile.tile_id} date=${day}`);
  const geometry = tile.geometry_geojson?.geometry || tile.geometry_geojson;
  let result;
  try {
    const selected = await findLatestScene(geometry, from.toISOString(), date.toISOString());
    const sceneDayStart = new Date(Date.UTC(selected.acquisition.getUTCFullYear(), selected.acquisition.getUTCMonth(), selected.acquisition.getUTCDate()));
    const sceneDayEnd = new Date(sceneDayStart.getTime() + 86400000);
    result = normalize(await requestStats(geometry, sceneDayStart.toISOString(), sceneDayEnd.toISOString()));
    result.scene = selected.scene;
    result.acquisition = selected.acquisition;
  }
  catch (error) {
    logger.error(`Satellite tile unavailable: tile=${tile.tile_code || tile.tile_id} status=${error.response?.status || 'n/a'} message=${error.response?.data?.error?.description || error.message}`);
    await query(`INSERT INTO blue_carbon_satellite_observations (tile_id,project_id,org_id,observed_on,processing_status,health_status,health_explanation,data_quality,error_message) VALUES ($1,$2,$3,$4,'unavailable','GREY','Satellite observation unavailable: ' || $5,'unavailable',$5) ON CONFLICT (tile_id,observed_on,source) DO UPDATE SET processing_status='unavailable',health_status='GREY',health_explanation=EXCLUDED.health_explanation,error_message=EXCLUDED.error_message,created_at=NOW()`, [tile.tile_id,tile.project_id,tile.org_id,day,error.message]);
    return { tile_id: tile.tile_id, health_status: 'GREY', error: error.message };
  }
  const historyLimit = Math.max(1, Math.min(Number(process.env.COPERNICUS_HISTORY_OBSERVATIONS || 5), 5));
  const previous = (await query('SELECT indicators FROM blue_carbon_satellite_observations WHERE tile_id=$1 AND processing_status=\'processed\' AND observed_on < $2 ORDER BY observed_on DESC LIMIT $3',[tile.tile_id,day,historyLimit])).rows;
  // `previous` is already the ordered observation array returned by PostgreSQL.
  // Passing `previous.indicators` here converted it into an object with an
  // undefined baseline, making every current tile look like a RED change.
  const health = assess(result, previous, tile.satellite_thresholds);
  const quality = result.validPixelPercentage >= 70 ? 'good' : result.validPixelPercentage >= 40 ? 'moderate' : 'poor';
  const observedDay = result.acquisition.toISOString().slice(0, 10);
  await query(`INSERT INTO blue_carbon_satellite_observations (tile_id,project_id,org_id,observed_on,acquisition_time,scene_id,health_status,health_explanation,data_quality,valid_pixel_count,valid_pixel_percentage,indicators,source_metadata) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb) ON CONFLICT (tile_id,observed_on,source) DO UPDATE SET acquisition_time=EXCLUDED.acquisition_time,scene_id=EXCLUDED.scene_id,health_status=EXCLUDED.health_status,health_explanation=EXCLUDED.health_explanation,data_quality=EXCLUDED.data_quality,valid_pixel_count=EXCLUDED.valid_pixel_count,valid_pixel_percentage=EXCLUDED.valid_pixel_percentage,indicators=EXCLUDED.indicators,source_metadata=EXCLUDED.source_metadata,processing_status='processed',created_at=NOW()`, [tile.tile_id,tile.project_id,tile.org_id,observedDay,result.acquisition.toISOString(),result.scene?.id || null,health.status,health.explanation,quality,result.validPixelCount,result.validPixelPercentage,JSON.stringify(result.indicators),JSON.stringify({ provider: 'Copernicus Data Space', collection: 'sentinel-2-l2a', bands: BANDS, scaling: 'REFLECTANCE units', selectedBy: 'Catalog latest scene', lookbackDays })]);
  logger.info(`Satellite tile persisted: tile=${tile.tile_code || tile.tile_id} status=${health.status} quality=${quality} validPixels=${result.validPixelPercentage.toFixed(1)}%`);
  return { tile_id: tile.tile_id, health_status: health.status, ...result, ...health };
}
async function processProject(projectId, orgId, options = {}) { const tiles = (await query('SELECT t.*, p.satellite_thresholds FROM blue_carbon_tiles t JOIN blue_carbon_projects p ON p.project_id=t.project_id AND p.org_id=t.org_id WHERE t.project_id=$1 AND t.org_id=$2 ORDER BY t.grid_row,t.grid_column',[projectId,orgId])).rows; const results=[]; let processed=0; for (const tile of tiles) { if (tile.tile_id === options.skipTileId) { processed += 1; if (options.onProgress) options.onProgress(processed, tiles.length, tile, { skipped: true }); continue; } const stillExists = await query('SELECT 1 FROM blue_carbon_tiles WHERE tile_id=$1 AND project_id=$2 AND org_id=$3',[tile.tile_id,projectId,orgId]); if (!stillExists.rows.length) { processed += 1; logger.warn(`Satellite grid skipped because tile was regenerated: tile=${tile.tile_code || tile.tile_id}`); if (options.onProgress) options.onProgress(processed, tiles.length, tile, { skipped: true, reason: 'tile_removed' }); continue; } let result; try { result = await processTile(tile, { ...options, concurrency: 1 }); } catch (error) { logger.error(`Satellite grid continued after failure: tile=${tile.tile_code || tile.tile_id} message=${error.message}`); result = { tile_id: tile.tile_id, health_status: 'GREY', error: error.message }; } results.push(result); processed += 1; if (options.onProgress) options.onProgress(processed, tiles.length, tile, result); } return results; }
async function processAllProjects(options = {}) { if (!credentialsPresent()) return []; const projects = (await query('SELECT project_id, org_id FROM blue_carbon_projects WHERE status IN (\'monitoring\',\'approved\',\'under_review\')')).rows; const results = []; for (const project of projects) results.push({ project_id: project.project_id, results: await processProject(project.project_id, project.org_id, options) }); return results; }
module.exports = { processTile, processProject, processAllProjects, credentialsPresent };
