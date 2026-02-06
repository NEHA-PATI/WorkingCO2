const pool = require("../../config/db");

exports.create = async (u_id, d) => {
  await pool.query(
    `INSERT INTO user_profile
     (u_id, first_name, middle_name, last_name, mobile_number, dob)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [u_id, d.first_name, d.middle_name, d.last_name, d.mobile_number, d.dob]
  );
  return { message: "Profile created" };
};

exports.findByUserId = async (u_id) => {
  const res = await pool.query(
    "SELECT * FROM user_profile WHERE u_id=$1",
    [u_id]
  );
  return res.rows[0];
};

exports.update = async (u_id, d) => {
  await pool.query(
    `UPDATE user_profile SET
     first_name=$1, middle_name=$2, last_name=$3,
     mobile_number=$4, dob=$5
     WHERE u_id=$6`,
    [d.first_name, d.middle_name, d.last_name, d.mobile_number, d.dob, u_id]
  );
  return { message: "Profile updated" };
};
