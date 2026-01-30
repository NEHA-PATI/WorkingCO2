const { pool } = require("../../config/db"); // 🔥 destructure

exports.createCompleteProfile = async (u_id, profile, addresses) => {
  const client = await pool.connect(); // ✅ works now
  try {
    await client.query("BEGIN");

    // profile insert/update
    await client.query(
      `INSERT INTO user_profile
       (u_id, first_name, middle_name, last_name, mobile_number, dob)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (u_id)
       DO UPDATE SET
         first_name = EXCLUDED.first_name,
         middle_name = EXCLUDED.middle_name,
         last_name = EXCLUDED.last_name,
         mobile_number = EXCLUDED.mobile_number,
         dob = EXCLUDED.dob`,
      [
        u_id,
        profile.first_name,
        profile.middle_name,
        profile.last_name,
        profile.mobile_number,
        profile.dob
      ]
    );

    // addresses
    for (const addr of addresses) {
      await client.query(
        `INSERT INTO user_address
         (address_id, u_id, address_type, address_line, country, pincode, is_default)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [
          require("uuid").v4(),
          u_id,
          addr.address_type,
          addr.address_line,
          addr.country,
          addr.pincode,
          addr.is_default || false
        ]
      );
    }

    await client.query("COMMIT");
    return { message: "Profile & address saved successfully" };

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
