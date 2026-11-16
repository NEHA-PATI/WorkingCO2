-- Tile-based Blue Carbon monitoring platform entities.
-- This migration deliberately keeps existing projects, observations and evidence
-- intact and links new records back to them through project_id/org_id.

CREATE TABLE IF NOT EXISTS blue_carbon_tiles (
  tile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  tile_code VARCHAR(120) NOT NULL,
  geometry_geojson JSONB NOT NULL,
  area_hectares NUMERIC(14,6) NOT NULL CHECK (area_hectares > 0),
  centroid_lat NUMERIC(9,6),
  centroid_lng NUMERIC(9,6),
  grid_row INTEGER NOT NULL,
  grid_column INTEGER NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'unassigned' CHECK (status IN (
    'unassigned','assigned','upcoming','due','in_progress','submitted',
    'under_review','approved','overdue'
  )),
  generation_version VARCHAR(32) NOT NULL DEFAULT 'utm-grid-v1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, tile_code),
  UNIQUE (project_id, grid_row, grid_column)
);
CREATE INDEX IF NOT EXISTS blue_carbon_tiles_project_idx ON blue_carbon_tiles(project_id, status);
CREATE INDEX IF NOT EXISTS blue_carbon_tiles_org_idx ON blue_carbon_tiles(org_id, status);

CREATE TABLE IF NOT EXISTS blue_carbon_tile_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  assignee_id VARCHAR(255) NOT NULL,
  assignee_role VARCHAR(64) NOT NULL DEFAULT 'field_user',
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  monitoring_frequency VARCHAR(32) NOT NULL DEFAULT 'monthly',
  custom_interval_days INTEGER CHECK (custom_interval_days IS NULL OR custom_interval_days > 0),
  start_date DATE NOT NULL,
  end_date DATE,
  field_instructions TEXT,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  override_conflict BOOLEAN NOT NULL DEFAULT FALSE,
  ended_at TIMESTAMPTZ,
  UNIQUE (assignment_id, tile_id)
);
CREATE INDEX IF NOT EXISTS blue_carbon_assignments_active_idx ON blue_carbon_tile_assignments(tile_id, active);
CREATE INDEX IF NOT EXISTS blue_carbon_assignments_user_idx ON blue_carbon_tile_assignments(assignee_id, active);
CREATE UNIQUE INDEX IF NOT EXISTS blue_carbon_assignments_one_active_tile_idx ON blue_carbon_tile_assignments(tile_id) WHERE active;

CREATE TABLE IF NOT EXISTS blue_carbon_monitoring_schedules (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  frequency VARCHAR(32) NOT NULL CHECK (frequency IN ('daily','weekly','biweekly','monthly','quarterly','custom')),
  interval_days INTEGER CHECK (interval_days IS NULL OR interval_days > 0),
  start_date DATE NOT NULL,
  end_date DATE,
  next_due_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS blue_carbon_schedules_active_tile_idx ON blue_carbon_monitoring_schedules(tile_id) WHERE active;

CREATE TABLE IF NOT EXISTS blue_carbon_monitoring_tasks (
  task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES blue_carbon_monitoring_schedules(schedule_id) ON DELETE CASCADE,
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  assigned_user_id VARCHAR(255),
  due_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','due','in_progress','submitted','under_review','approved','overdue','missed')),
  visit_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (schedule_id, due_at)
);
CREATE INDEX IF NOT EXISTS blue_carbon_tasks_user_idx ON blue_carbon_monitoring_tasks(assigned_user_id, status, due_at);
CREATE INDEX IF NOT EXISTS blue_carbon_tasks_tile_idx ON blue_carbon_monitoring_tasks(tile_id, due_at);

CREATE TABLE IF NOT EXISTS blue_carbon_field_visits (
  visit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES blue_carbon_monitoring_tasks(task_id) ON DELETE SET NULL,
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  field_user_id VARCHAR(255) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','under_review','approved','changes_requested','rejected')),
  start_lat NUMERIC(9,6),
  start_lng NUMERIC(9,6),
  gps_accuracy_m NUMERIC(10,2),
  notes TEXT,
  checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS blue_carbon_visits_tile_idx ON blue_carbon_field_visits(tile_id, started_at DESC);
CREATE INDEX IF NOT EXISTS blue_carbon_visits_user_idx ON blue_carbon_field_visits(field_user_id, status);

CREATE TABLE IF NOT EXISTS blue_carbon_media_evidence (
  evidence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES blue_carbon_field_visits(visit_id) ON DELETE CASCADE,
  tile_id UUID NOT NULL REFERENCES blue_carbon_tiles(tile_id) ON DELETE CASCADE,
  project_id UUID NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  uploaded_by VARCHAR(255) NOT NULL,
  media_type VARCHAR(16) NOT NULL CHECK (media_type IN ('photo','video','audio','document')),
  storage_key TEXT NOT NULL,
  original_filename TEXT,
  mime_type VARCHAR(255),
  file_size_bytes BIGINT CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0),
  checksum_sha256 CHAR(64),
  capture_lat NUMERIC(9,6),
  capture_lng NUMERIC(9,6),
  gps_accuracy_m NUMERIC(10,2),
  captured_at TIMESTAMPTZ,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  validation_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (validation_status IN ('pending','valid','outside_tile','missing_gps','poor_accuracy','manual_location','unverified_time')),
  review_status VARCHAR(32) NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected','changes_requested')),
  review_comment TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS blue_carbon_media_visit_idx ON blue_carbon_media_evidence(visit_id, media_type);
CREATE INDEX IF NOT EXISTS blue_carbon_media_filter_idx ON blue_carbon_media_evidence(project_id, tile_id, review_status, uploaded_at);

CREATE TABLE IF NOT EXISTS blue_carbon_media_review_history (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES blue_carbon_media_evidence(evidence_id) ON DELETE CASCADE,
  org_id VARCHAR(255) NOT NULL,
  from_status VARCHAR(32),
  to_status VARCHAR(32) NOT NULL,
  reason TEXT NOT NULL,
  reviewer_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS blue_carbon_media_review_history_idx ON blue_carbon_media_review_history(evidence_id, created_at DESC);

ALTER TABLE blue_carbon_observations
  ADD COLUMN IF NOT EXISTS tile_id UUID REFERENCES blue_carbon_tiles(tile_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS visit_id UUID REFERENCES blue_carbon_field_visits(visit_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS gps_accuracy_m NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS location_validation_status VARCHAR(32) DEFAULT 'not_checked',
  ADD COLUMN IF NOT EXISTS location_validation_message TEXT;

