const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,

  // 🔥 FORCE SSL FOR AWS RDS
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.query("SELECT NOW()")
  .then(res => console.log("🕐 DB time:", res.rows[0].now))
  .catch(err => console.error("❌ PostgreSQL error:", err));

module.exports = pool;
