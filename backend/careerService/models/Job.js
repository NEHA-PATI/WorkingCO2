const pool = require("../config/db");

const Job = {
  findAll: async ({ status, department } = {}) => {
    let query = "SELECT * FROM jobs";
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    if (department) {
      conditions.push(`department = $${params.length + 1}`);
      params.push(department);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    
    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (data) => {
    const { title, department, type, level, status, description, location } = data;
    const result = await pool.query(
      `INSERT INTO jobs (title, department, type, level, status, description, location, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [title, department, type, level, status || 'Draft', description, location]
    );
    return result.rows[0];
  },

  update: async (id, data) => {
    const { title, department, type, level, status, description, location } = data;
    const result = await pool.query(
      `UPDATE jobs 
       SET title=$1, department=$2, type=$3, level=$4, status=$5, description=$6, location=$7, updated_at=NOW()
       WHERE id=$8
       RETURNING *`,
      [title, department, type, level, status, description, location, id]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query("DELETE FROM jobs WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }
};

module.exports = Job;
