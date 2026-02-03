const pool = require("../db/postgres");

async function createDemoRequest(payload) {
  const query = `
    INSERT INTO demo_requests (
      industry_name,
      industry_size_range,
      industry_revenue_range,
      contact_person_name,
      contact_email,
      contact_number
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [
    payload.industry_name,
    payload.industry_size_range,
    payload.industry_revenue_range,
    payload.contact_person_name,
    payload.contact_email,
    payload.contact_number || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getAllDemoRequests() {
  const { rows } = await pool.query(
    `SELECT * FROM demo_requests ORDER BY created_at DESC`
  );
  return rows;
}

module.exports = {
  createDemoRequest,
  getAllDemoRequests
};
