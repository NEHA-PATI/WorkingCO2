const db = require('../config/db');

exports.insertInput = async (calculationId, inputData) => {
  const query = `
    INSERT INTO calculation_inputs (calculation_id, raw_input_json)
    VALUES ($1, $2)
  `;

  await db.query(query, [calculationId, JSON.stringify(inputData)]);
};