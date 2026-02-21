const db = require('../config/db');

exports.findFactor = async (category, subCategory) => {
  const query = `
    SELECT value 
    FROM emission_factors 
    WHERE category = $1 
    AND sub_category = $2
    LIMIT 1
  `;

  const result = await db.query(query, [category, subCategory]);
  return result.rows[0];
};

exports.getAllFactors = async () => {
  const result = await db.query(`
    SELECT category, sub_category, value
    FROM emission_factors
  `);

  return result.rows;
};