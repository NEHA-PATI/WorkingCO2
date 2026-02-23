const pool = require("../config/database");

const getAllUsers = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        u_id,
        username,
        email,
        role_id,
        verified,
        otp_code,
        otp_expires_at,
        created_at,
        updated_at,
        login_attempts,
        lock_until,
        status
      FROM users
    `);

    return result.rows;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers
};
