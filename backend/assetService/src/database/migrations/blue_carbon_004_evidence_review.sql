-- Phase 2: operational observations, samples, evidence, immutable revisions and review audit.
ALTER TABLE blue_carbon_observations
  ADD COLUMN IF NOT EXISTS measured_value NUMERIC,
  ADD COLUMN IF NOT EXISTS measured_unit VARCHAR(64),
  ADD COLUMN IF NOT EXISTS collection_method VARCHAR(255),
  ADD COLUMN IF NOT EXISTS evidence_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS review_comment TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS review_version INTEGER NOT NULL DEFAULT 1;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blue_carbon_observation_coords_ck') THEN
    ALTER TABLE blue_carbon_observations ADD CONSTRAINT blue_carbon_observation_coords_ck CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180));
  END IF;
END $$;
ALTER TABLE blue_carbon_soil_samples
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,6), ADD COLUMN IF NOT EXISTS longitude NUMERIC(9,6),
  ADD COLUMN IF NOT EXISTS bulk_density_unit VARCHAR(64), ADD COLUMN IF NOT EXISTS organic_carbon_unit VARCHAR(64),
  ADD COLUMN IF NOT EXISTS laboratory_evidence_refs JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS custody_records JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS review_comment TEXT, ADD COLUMN IF NOT EXISTS reviewed_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS review_version INTEGER NOT NULL DEFAULT 1;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blue_carbon_sample_coords_ck') THEN
    ALTER TABLE blue_carbon_soil_samples ADD CONSTRAINT blue_carbon_sample_coords_ck CHECK ((latitude IS NULL AND longitude IS NULL) OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180));
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS blue_carbon_sample_project_scope_uidx ON blue_carbon_soil_samples(project_id, sample_id);
CREATE TABLE IF NOT EXISTS blue_carbon_evidence_revisions (
  revision_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), record_type VARCHAR(32) NOT NULL CHECK (record_type IN ('observation','soil_sample')),
  record_id VARCHAR(120) NOT NULL, project_id UUID NOT NULL, org_id VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL, payload JSONB NOT NULL, changed_by VARCHAR(255) NOT NULL, change_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(record_type, record_id, version),
  CONSTRAINT blue_carbon_revision_project_org_fk FOREIGN KEY (project_id,org_id) REFERENCES blue_carbon_projects(project_id,org_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS blue_carbon_evidence_revision_record_idx ON blue_carbon_evidence_revisions(record_type,record_id,created_at DESC);
