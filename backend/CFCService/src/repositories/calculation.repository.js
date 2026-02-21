const db = require('../config/db');
const { CURRENT_FACTOR_VERSION } = require('../constants/factorVersion');

exports.insertCalculation = async (data) => {
  const query = `
    INSERT INTO calculations 
    (u_id, session_id, calculation_month, total_emissions_kg, breakdown, emission_factor_version)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [
    data.u_id,
    data.session_id,
    data.month,
    data.total,
    JSON.stringify(data.breakdown),
    CURRENT_FACTOR_VERSION
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};