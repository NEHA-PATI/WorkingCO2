# Reward Service

## Run

```bash
cd backend/rewardService
npm install
npm run dev
```

Service default URL: `http://localhost:3000`

## Required Environment

Copy `.env.example` to `.env` and set valid database credentials.

Key variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `CORS_ORIGINS` (comma-separated frontend origins)

## Database Requirements

Already used by service:

- `reward_rules`
- `user_reward_events`

Required for catalog endpoints (`/catalog`, `/redeem`):

- `reward_catalog`
- SQL file: `src/database/reward_catalog.sql`

Minimum required columns in `reward_catalog`:

- `reward_id`
- `name`
- `description`
- `points`
- `price_inr`
- `image_url`
- `is_active`

## Route Mounting

- `server.js` starts Express
- `src/app.js` mounts reward routes at `/api/v1/rewards`
- `src/modules/rewards/reward.routes.js` defines endpoint paths

## Quick Health Checks

- `GET /health`
- `GET /api/v1/rewards/health`
