const { Pool } = require("pg");
require("dotenv").config();

/* ==================== ENV DETECTION ==================== */
const isProduction = process.env.NODE_ENV === "production";

/* ==================== SSL CONFIG ==================== */
// 🔥 AWS RDS requires SSL in production
const sslConfig = isProduction
  ? { rejectUnauthorized: false }
  : false;

/* ==================== CONNECTION CONFIG ==================== */
let connectionConfig;

if (process.env.DATABASE_URL) {
  // 🔥 If using full connection string
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: sslConfig,
  };
} else {
  // 🔥 Standard env-based config
  connectionConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    ssl: sslConfig,
  };
}

/* ==================== POOL CONFIG ==================== */
const pool = new Pool({
  ...connectionConfig,

  max: 20, // max clients
  idleTimeoutMillis: 30000, // close idle clients
  connectionTimeoutMillis: 5000, // wait before timeout

  // 🔥 Recommended for Docker/AWS
  keepAlive: true,
});

/* ==================== EVENTS ==================== */
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

/* ==================== HEALTH CHECK ==================== */
const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕒 DB time:", res.rows[0].now);
    console.log("🚀 Database ready");
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    return false;
  }
};

/* ==================== GRACEFUL SHUTDOWN ==================== */
const shutdown = async () => {
  try {
    console.log("🔌 Closing DB pool...");
    await pool.end();
    console.log("✅ DB pool closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error closing DB pool:", err.message);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* ==================== INITIAL TEST ==================== */
testConnection();

/* ==================== EXPORT ==================== */
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  testConnection,
};