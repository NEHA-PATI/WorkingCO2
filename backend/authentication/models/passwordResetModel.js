const db = require("../config/db");

exports.create = async (data) => {
  const res = await db.query(
    `INSERT INTO password_resets 
     (user_id, token, otp, type, expires_at)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [data.user_id, data.token, data.otp, data.type, data.expires_at]
  );
  return res.rows[0];
};

exports.findValidToken = async (token) => {
  const res = await db.query(
    `SELECT * FROM password_resets 
     WHERE token=$1 AND used=false AND expires_at > NOW()`,
    [token]
  );
  return res.rows[0];
};

exports.markUsed = async (id) => {
  await db.query(`UPDATE password_resets SET used=true WHERE id=$1`, [id]);
};
