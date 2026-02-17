const { Pool } = require("pg");

const truthy = new Set(["1", "true", "yes", "on"]);
const dbSslEnv = String(process.env.DB_SSL || "").toLowerCase();
const useSsl = truthy.has(dbSslEnv) || process.env.NODE_ENV === "production";

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
}

if (useSsl) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB time:", res.rows[0].now))
  .catch((err) => console.error("PostgreSQL error:", err));

module.exports = pool;
