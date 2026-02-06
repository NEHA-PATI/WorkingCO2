const pool = require("../../config/db");

exports.create = async (d) => {
  await pool.query(
    `INSERT INTO user_address
     (address_id, u_id, address_type, address_line, country, pincode, is_default)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      d.address_id,
      d.u_id,
      d.address_type,
      d.address_line,
      d.country,
      d.pincode,
      d.is_default || false
    ]
  );
  return { message: "Address added" };
};

exports.findByUserId = async (u_id) => {
  const res = await pool.query(
    "SELECT * FROM user_address WHERE u_id=$1",
    [u_id]
  );
  return res.rows;
};

exports.delete = async (u_id, addressId) => {
  await pool.query(
    "DELETE FROM user_address WHERE address_id=$1 AND u_id=$2",
    [addressId, u_id]
  );
};
