const db = require('../config/db');

exports.getAirportByCode = async (code) => {
  const query = `
    SELECT latitude, longitude
    FROM airports
    WHERE code = $1
    LIMIT 1
  `;

  const result = await db.query(query, [code]);
  return result.rows[0];
};

exports.getAllAirports = async () => {
  const result = await db.query(`
    SELECT code, latitude, longitude FROM airports
  `);
  return result.rows;
};