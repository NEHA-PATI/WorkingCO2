const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

// ✅ AWS RDS Production Config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,

  // ✅ RDS needs SSL in production
  ssl: isProduction
    ? {
        require: true,
        rejectUnauthorized: false,
      }
    : false,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ✅ When connected
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

// ✅ Error handling
pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err.message);
});

// ✅ Test DB connection at startup
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🕐 DB time:", res.rows[0].now);
    console.log("🚀 Database ready");
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message);
  }
})();

module.exports = pool;
