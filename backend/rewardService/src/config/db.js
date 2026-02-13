const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
  path.resolve(__dirname, '../../../authentication/.env')
];

let loadedFrom = null;
for (const envPath of envCandidates) {
  if (!fs.existsSync(envPath)) {
    continue;
  }

  dotenv.config({ path: envPath });
  loadedFrom = envPath;
  break;
}

if (!loadedFrom) {
  dotenv.config();
}

const dbPort = Number.parseInt(process.env.DB_PORT || '5432', 10);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number.isNaN(dbPort) ? 5432 : dbPort,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('Database connected successfully');
    console.log('Current time:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection failed');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    if (client) client.release();
    return false;
  }
};

const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Query error:', error.message);
    throw error;
  }
};

const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
