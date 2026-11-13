-- Real Sentinel-2 L2A grid observations. Values are never seeded or inferred.
CREATE TABLE IF NOT EXISTS blue_carbon_satellite_observations (
  observation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  observed_on DATE NOT NULL,
  acquisition_time TIMESTAMPTZ,
  source VARCHAR(64) NOT NULL DEFAULT 'COPERNICUS_SENTINEL_2_L2A',
  scene_id VARCHAR(255),
  processing_status VARCHAR(24) NOT NULL DEFAULT 'processed' CHECK (processing_status IN ('processed','unavailable','failed')),
  health_status VARCHAR(8) NOT NULL DEFAULT 'GREY' CHECK (health_status IN ('GREEN','AMBER','RED','GREY')),
  health_explanation TEXT,
  data_quality VARCHAR(24) NOT NULL DEFAULT 'unavailable',
  valid_pixel_count INTEGER NOT NULL DEFAULT 0,
  valid_pixel_percentage NUMERIC(7,3) NOT NULL DEFAULT 0,
  indicators JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tile_id, observed_on, source)
);
CREATE INDEX IF NOT EXISTS blue_carbon_satellite_tile_date_idx ON blue_carbon_satellite_observations(tile_id, observed_on DESC);
CREATE INDEX IF NOT EXISTS blue_carbon_satellite_project_date_idx ON blue_carbon_satellite_observations(project_id, observed_on DESC);

ALTER TABLE blue_carbon_projects
  ADD COLUMN IF NOT EXISTS satellite_baseline_date DATE,
  ADD COLUMN IF NOT EXISTS satellite_thresholds JSONB NOT NULL DEFAULT '{}'::jsonb;
