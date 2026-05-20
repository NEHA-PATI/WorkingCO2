const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

/* ===================== CONNECTION CONFIG ===================== */
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction
        ? {
            require: true,
            rejectUnauthorized: false, // AWS RDS ke liye required
          }
        : false,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: String(process.env.DB_PASSWORD),
      port: process.env.DB_PORT || 5432,
      ssl: isProduction
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
    };

/* ===================== POOL ===================== */
const pool = new Pool({
  ...connectionConfig,
  max: 20, // max connections
  idleTimeoutMillis: 30000, // 30s idle
  connectionTimeoutMillis: 5000, // 5s timeout
});

/* ===================== EVENTS ===================== */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected (Org Service)");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

/* ===================== TEST CONNECTION ===================== */
const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕐 DB time:", res.rows[0].now);
    console.log("🚀 Database ready");
    return true;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
    return false;
  }
};

/* ===================== SAFE QUERY ===================== */
const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error("❌ Query error:", err.message);
    throw err;
  }
};

/* ===================== TRANSACTION ===================== */
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

/* ===================== GRACEFUL SHUTDOWN ===================== */
const shutdown = async () => {
  console.log("🔌 Closing PostgreSQL pool...");
  await pool.end();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* ===================== EXPORT ===================== */
module.exports = {
  pool,
  query,
  transaction,
  testConnection,
};