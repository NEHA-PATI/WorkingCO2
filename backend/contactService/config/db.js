const { Pool } = require("pg");

/* ==================== ENV LOAD ==================== */
// Docker already injects env, dotenv fallback for local
require("dotenv").config();

/* ==================== SSL CONFIG ==================== */
const useSSL =
  String(process.env.DB_SSL).toLowerCase() === "true" ||
  process.env.NODE_ENV === "production";

/* ==================== CONNECTION CONFIG ==================== */
let connectionConfig = {};

/* 🔥 PRIORITY: DATABASE_URL (if provided) */
if (process.env.DATABASE_URL) {
  connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
} else {
  connectionConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: Number(process.env.DB_PORT) || 5432,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  };
}

/* ==================== POOL ==================== */
const pool = new Pool({
  ...connectionConfig,

  // 🔥 Production tuning
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/* ==================== EVENTS ==================== */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
  process.exit(1); // restart container (Docker)
});

/* ==================== TEST CONNECTION ==================== */
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const res = await client.query("SELECT NOW()");
    console.log("🕒 DB time:", res.rows[0].now);
    console.log("🚀 Database ready");
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

/* ==================== QUERY HELPER ==================== */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error("❌ Query error:", err.message);
    throw err;
  }
};

/* ==================== TRANSACTION ==================== */
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction error:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

/* ==================== GRACEFUL SHUTDOWN ==================== */
const shutdown = async () => {
  console.log("🔌 Closing database pool...");
  try {
    await pool.end();
    console.log("✅ DB pool closed");
  } catch (err) {
    console.error("❌ Error closing pool:", err.message);
  }
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* ==================== EXPORTS ==================== */
module.exports = {
  pool,
  query,
  transaction,
  testConnection,
};