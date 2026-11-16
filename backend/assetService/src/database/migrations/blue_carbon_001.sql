CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS blue_carbon_projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id VARCHAR(255) NOT NULL REFERENCES organizations(org_id),
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  ecosystem_type VARCHAR(32) NOT NULL CHECK (ecosystem_type IN ('mangrove','tidal_wetland','seagrass')),
  methodology_id VARCHAR(120) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','monitoring','under_review','verified','archived')),
  boundary_geojson JSONB,
  centroid_lat NUMERIC(9,6),
  centroid_lng NUMERIC(9,6),
  baseline_summary TEXT,
  monitoring_start DATE,
  monitoring_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blue_carbon_projects_org_idx ON blue_carbon_projects(org_id);
