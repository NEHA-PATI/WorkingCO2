const { Pool } = require("pg");
require("dotenv").config();

/* ==================== ENV ==================== */
const isProduction = process.env.NODE_ENV === "production";

/* ==================== DEBUG (TEMP - REMOVE LATER) ==================== */
console.log("🔍 DB CONFIG:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  ssl: process.env.DB_SSL,
});

/* ==================== CONNECTION CONFIG ==================== */
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD).trim(), // 🔥 FIX: remove hidden spaces
      port: parseInt(process.env.DB_PORT) || 5432,
      ssl:
        process.env.DB_SSL === "true" || isProduction
          ? { rejectUnauthorized: false }
          : false,
    };

/* ==================== POOL ==================== */
const pool = new Pool({
  ...connectionConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/* ==================== EVENTS ==================== */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected (Ticket Service)");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err.message);
});

/* ==================== TEST CONNECTION ==================== */
const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕐 DB time:", res.rows[0].now);
    console.log("🚀 Ticket DB ready");
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    return false;
  }
};

// Run once at startup
testConnection();

/* ==================== GRACEFUL SHUTDOWN ==================== */
const shutdown = async () => {
  console.log("🔌 Closing DB pool...");
  await pool.end();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* ==================== EXPORT ==================== */
module.exports = {
  pool,
  testConnection,
};