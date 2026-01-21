const pool = require("../config/db");

const Application = {
  findAll: async () => {
    const query = `
      SELECT a.*, j.title as job_title, j.department 
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      ORDER BY a.submitted_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  create: async (data) => {
    const { job_id, name, email, resume_url, message } = data;
    const result = await pool.query(
      `INSERT INTO applications (job_id, name, email, resume_url, message, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 'Pending', NOW())
       RETURNING *`,
      [job_id, name, email, resume_url, message]
    );
    return result.rows[0];
  },

  updateStatus: async (id, status) => {
    const result = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    return result.rows[0];
  }
};

module.exports = Application;
