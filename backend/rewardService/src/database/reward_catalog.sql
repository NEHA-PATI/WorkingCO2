CREATE TABLE IF NOT EXISTS reward_catalog (
  reward_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL CHECK (points > 0),
  price_inr INTEGER NOT NULL DEFAULT 0 CHECK (price_inr >= 0),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reward_catalog_active
  ON reward_catalog (is_active, points);
