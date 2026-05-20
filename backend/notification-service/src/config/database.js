const { Pool } = require("pg");
const path = require("path");

// Load env properly
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

/* ==================== ENV CHECK ==================== */
const isProduction = process.env.NODE_ENV === "production";

// 🔥 DEBUG (temporary - remove later)
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
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD).trim(), // 🔥 FIX: trim extra spaces
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
  connectionTimeoutMillis: 10000,
});

/* ==================== EVENTS ==================== */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected (Notification Service)");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
});

/* ==================== TEST CONNECTION ==================== */
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("🕒 DB time:", result.rows[0].now);
    console.log("🚀 Notification DB ready");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  } finally {
    if (client) client.release();
  }
};

/* ==================== QUERY ==================== */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error("❌ Query error:", error.message);
    throw error;
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
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction error:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

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
  query,
  transaction,
  testConnection,
};