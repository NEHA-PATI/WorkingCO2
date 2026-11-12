-- Blue Carbon dMRV records. This migration is additive and preserves existing assets.

ALTER TABLE blue_carbon_projects
  ADD COLUMN IF NOT EXISTS monitoring_date DATE,
  ADD COLUMN IF NOT EXISTS project_manager VARCHAR(255),
  ADD COLUMN IF NOT EXISTS manager_contact VARCHAR(64),
  ADD COLUMN IF NOT EXISTS estimated_removals_tco2e NUMERIC(14,3) CHECK (estimated_removals_tco2e IS NULL OR estimated_removals_tco2e >= 0),
  ADD COLUMN IF NOT EXISTS monitoring_progress NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (monitoring_progress >= 0 AND monitoring_progress <= 100),
  ADD COLUMN IF NOT EXISTS data_disclaimer TEXT NOT NULL DEFAULT 'Demonstration data; not independently verified.';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blue_carbon_projects_project_org_unique') THEN
    ALTER TABLE blue_carbon_projects ADD CONSTRAINT blue_carbon_projects_project_org_unique UNIQUE (project_id, org_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS blue_carbon_observations (
  observation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES blue_carbon_projects(project_id) ON DELETE CASCADE,
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id),
  observation_type VARCHAR(120) NOT NULL,
  observed_on DATE NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  observation_value TEXT NOT NULL,
  review_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','changes_requested','rejected')),
  reviewer_id VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  source_label VARCHAR(120) NOT NULL DEFAULT 'demo_field_entry',
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blue_carbon_observation_org_project_fk FOREIGN KEY (project_id, org_id)
    REFERENCES blue_carbon_projects(project_id, org_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS blue_carbon_observations_project_idx ON blue_carbon_observations(project_id, observed_on DESC);
CREATE INDEX IF NOT EXISTS blue_carbon_observations_org_idx ON blue_carbon_observations(org_id, review_status);

CREATE TABLE IF NOT EXISTS blue_carbon_soil_samples (
  sample_id VARCHAR(120) PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES blue_carbon_projects(project_id) ON DELETE CASCADE,
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id),
  collected_on DATE NOT NULL,
  depth_interval VARCHAR(80) NOT NULL,
  bulk_density_g_cm3 NUMERIC(8,4) CHECK (bulk_density_g_cm3 IS NULL OR bulk_density_g_cm3 >= 0),
  organic_carbon_percent NUMERIC(8,4) CHECK (organic_carbon_percent IS NULL OR (organic_carbon_percent >= 0 AND organic_carbon_percent <= 100)),
  laboratory_result TEXT,
  custody_status VARCHAR(32) NOT NULL DEFAULT 'collected' CHECK (custody_status IN ('collected','in_transit','lab_review','approved','rejected')),
  reviewer_id VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  source_label VARCHAR(120) NOT NULL DEFAULT 'demo_field_entry',
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT blue_carbon_sample_org_project_fk FOREIGN KEY (project_id, org_id)
    REFERENCES blue_carbon_projects(project_id, org_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS blue_carbon_samples_project_idx ON blue_carbon_soil_samples(project_id, collected_on DESC);
CREATE INDEX IF NOT EXISTS blue_carbon_samples_org_idx ON blue_carbon_soil_samples(org_id, custody_status);

CREATE TABLE IF NOT EXISTS blue_carbon_review_history (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id),
  project_id UUID NOT NULL REFERENCES blue_carbon_projects(project_id) ON DELETE CASCADE,
  record_type VARCHAR(32) NOT NULL CHECK (record_type IN ('project','observation','soil_sample','calculation','report')),
  record_id VARCHAR(120) NOT NULL,
  from_status VARCHAR(64),
  to_status VARCHAR(64) NOT NULL,
  comment TEXT,
  reviewer_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blue_carbon_review_history_record_idx ON blue_carbon_review_history(record_type, record_id, created_at DESC);

