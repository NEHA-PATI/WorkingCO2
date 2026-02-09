const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction
          ? { rejectUnauthorized: false }
          : false, // 🔥 LOCAL = NO SSL
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
        ssl: false,
      }
);

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.query("SELECT NOW()")
  .then((res) => console.log("🕐 DB time:", res.rows[0].now))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err.message));

module.exports = pool;
