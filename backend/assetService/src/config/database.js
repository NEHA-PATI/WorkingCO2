const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

// 🔥 Load env (Docker + AWS safe)
require("dotenv").config({
  path: path.join(__dirname, "../../.env"),
});

/* ==================== LOGS DIRECTORY ==================== */
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/* ==================== SSL CONFIG ==================== */
const useSSL =
  String(process.env.DB_SSL).toLowerCase() === "true" ||
  process.env.NODE_ENV === "production";

/* ==================== POOL CONFIG ==================== */
const poolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),

  // 🔥 RDS SSL support
  ssl: useSSL ? { rejectUnauthorized: false } : false,

  // 🔥 Production tuning
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

/* ==================== SUPPORT DATABASE_URL ==================== */
if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

/* ==================== CREATE POOL ==================== */
const pool = new Pool(poolConfig);

/* ==================== EVENTS ==================== */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
  process.exit(1); // restart container
});

/* ==================== TEST CONNECTION ==================== */
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("🕒 DB Time:", result.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

/* ==================== QUERY HELPER ==================== */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error("❌ Query error:", error.message);
    throw error;
  }
};

/* ==================== TRANSACTION HELPER ==================== */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction error:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection,
};