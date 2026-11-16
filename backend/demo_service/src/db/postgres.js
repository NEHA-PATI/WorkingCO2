const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const useSsl = process.env.DB_SSL === "true" || isProduction;

// ✅ Choose between DATABASE_URL and individual credentials
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    };

// ✅ Connection pool setup
const pool = new Pool({
  ...connectionConfig,
  max: 20, // max clients in pool
  idleTimeoutMillis: 30000, // close idle clients after 30s
  connectionTimeoutMillis: 2000, // return error after 2s if cannot connect
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err.message);
  setTimeout(() => {
    console.log("♻️ Reconnecting to database...");
  }, 2000);
});

// ✅ Test connection on startup
pool.query("SELECT NOW()")
  .then((res) => console.log("🕐 DB time:", res.rows[0].now))
  .catch((err) => console.error("❌ PostgreSQL connection error:", err));

module.exports = pool;
