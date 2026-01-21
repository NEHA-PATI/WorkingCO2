const pool = require("../config/db");

exports.create = async (data) => {
  await pool.query(`
    INSERT INTO otp_logs (user_id, destination, otp_code, purpose, expires_at)
    VALUES ($1,$2,$3,$4,$5)
  `, [data.user_id, data.destination, data.otp, data.purpose, data.expires_at]);
};

exports.findValid = async (destination, otp) => {
  const res = await pool.query(`
    SELECT * FROM otp_logs 
    WHERE destination=$1 AND otp_code=$2
    AND verified=false AND expires_at > NOW()
    ORDER BY created_at DESC LIMIT 1
  `, [destination, otp]);

  return res.rows[0];
};

exports.markVerified = async (id) => {
  await pool.query(`UPDATE otp_logs SET verified=true WHERE id=$1`, [id]);
};
