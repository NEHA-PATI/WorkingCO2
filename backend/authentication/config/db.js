const { Pool } = require("pg");

/* ==================== SSL CONFIG ==================== */
const truthy = new Set(["1", "true", "yes", "on"]);
const dbSslEnv = String(process.env.DB_SSL || "").toLowerCase();

const useSsl =
  truthy.has(dbSslEnv) || process.env.NODE_ENV === "production";

/* ==================== POOL CONFIG ==================== */
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,

  // 🔥 Production optimizations
  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

/* ==================== DATABASE URL SUPPORT ==================== */
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

/* ==================== SSL (REQUIRED FOR AWS RDS) ==================== */
if (useSsl) {
  poolConfig.ssl = {
    rejectUnauthorized: false, // AWS RDS compatibility
  };
}

/* ==================== CREATE POOL ==================== */
const pool = new Pool(poolConfig);

/* ==================== EVENTS ==================== */

// When connected
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

// On error (VERY IMPORTANT)
pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err);
  process.exit(1); // crash container → restart by Docker
});

/* ==================== TEST CONNECTION ==================== */
const testDbConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕒 DB time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ PostgreSQL connection failed:", err.message);
  }
};

testDbConnection();

/* ==================== GRACEFUL SHUTDOWN ==================== */
process.on("SIGINT", async () => {
  console.log("🛑 Closing DB pool...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Closing DB pool...");
  await pool.end();
  process.exit(0);
});

module.exports = pool;