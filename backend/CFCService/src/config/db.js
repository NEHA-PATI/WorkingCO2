const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

/* ==================== ENV LOAD ==================== */
// Docker env already inject karta hai, local fallback
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

/* ==================== LOGS DIRECTORY ==================== */
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/* ==================== SSL CONFIG (IMPORTANT FOR AWS RDS) ==================== */
const useSSL =
  String(process.env.DB_SSL).toLowerCase() === "true" ||
  process.env.NODE_ENV === "production";

/* ==================== CONNECTION CONFIG ==================== */
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSSL ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD),
      ssl: useSSL ? { rejectUnauthorized: false } : false,
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
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
  process.exit(1); // Docker restart trigger
});

/* ==================== TEST CONNECTION ==================== */
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("🕒 DB time:", result.rows[0].now);
    console.log("🚀 Database ready");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
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
  try {
    await pool.end();
    console.log("✅ DB pool closed");
  } catch (err) {
    console.error("❌ Error closing DB pool:", err.message);
  }
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