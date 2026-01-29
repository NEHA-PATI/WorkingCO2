const { Pool } = require("pg");
const path = require("path");
// Load from local .env first, then fallback to auth .env
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../../authentication/.env") });


const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { require: true, rejectUnauthorized: false },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    };

const pool = new Pool({
  ...connectionConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("✅ Career Service: Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Career Service DB Error:", err.message);
});

module.exports = pool;
