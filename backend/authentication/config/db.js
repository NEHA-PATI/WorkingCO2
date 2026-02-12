const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const isRDS = process.env.DB_HOST && process.env.DB_HOST.includes("rds.amazonaws.com");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,

  ssl: isRDS
    ? { rejectUnauthorized: false } // ✅ AWS RDS
    : false,                         // ✅ local postgres

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // ⬅️ 2s bahut kam tha
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});

// Test connection
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕐 DB time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
})();

module.exports = pool;
