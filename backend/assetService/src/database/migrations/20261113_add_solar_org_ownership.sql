ALTER TABLE solar_panels
  ADD COLUMN IF NOT EXISTS org_id VARCHAR(255);

ALTER TABLE solar_panels
  ALTER COLUMN u_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_solar_org'
  ) THEN
    ALTER TABLE solar_panels
      ADD CONSTRAINT fk_solar_org
      FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_solar_org_id ON solar_panels(org_id);
