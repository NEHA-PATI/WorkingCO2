const { Pool } = require("pg");
require("dotenv").config();

/* -------------------- ENV VALIDATION -------------------- */
const requiredEnv = [
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD"
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});

/* -------------------- CONFIG -------------------- */
const dbPort = parseInt(process.env.DB_PORT, 10) || 5432;
const isSSL = process.env.DB_SSL === "true";

/* -------------------- POOL -------------------- */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: dbPort,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  ssl: isSSL
    ? {
        rejectUnauthorized: false, // AWS RDS ke liye required
      }
    : false,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/* -------------------- EVENTS -------------------- */
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
});

/* -------------------- TEST CONNECTION -------------------- */
const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");
    console.log("🕒 Server time:", res.rows[0].now);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    return false;
  }
};

/* -------------------- QUERY -------------------- */
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error("❌ Query error:", error.message);
    throw error;
  }
};

/* -------------------- TRANSACTION -------------------- */
const transaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction failed:", error.message);
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