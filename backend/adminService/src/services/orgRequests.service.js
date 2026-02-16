const pool = require("../config/database");

const getAllOrgRequests = async () => {
  try {
    const result = await pool.query(`
      SELECT
        org_request_id,
        org_name,
        org_type,
        org_mail,
        org_contact_number,
        org_contact_person,
        org_designation,
        org_country,
        org_state,
        org_city,
        request_status,
        created_at
      FROM org_requests
      ORDER BY created_at DESC NULLS LAST
    `);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllOrgRequests,
};
