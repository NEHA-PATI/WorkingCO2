const pool = require("../config/db");

exports.create = async ({ user_id, token, expiresInMinutes }) => {
  const res = await pool.query(`
    INSERT INTO password_resets (user_id, token, type, expires_at, used)
    VALUES ($1, $2, 'email', NOW() + make_interval(mins => $3), false)
    RETURNING *
  `, [user_id, token, expiresInMinutes]);

  return res.rows[0];
};

exports.findValid = async (token) => {
  const res = await pool.query(`
    SELECT * FROM password_resets
    WHERE token=$1 AND used=false AND expires_at > NOW()
    LIMIT 1
  `, [token]);

  return res.rows[0];
};

exports.markUsed = async (id) => {
  await pool.query(`UPDATE password_resets SET used=true WHERE id=$1`, [id]);
};
