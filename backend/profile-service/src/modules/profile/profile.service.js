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


    const incomingIds = addresses
  .map(a => a.address_id)
  .filter(Boolean);

if (incomingIds.length > 0) {
  await client.query(
    `
    DELETE FROM user_address
    WHERE u_id = $1
    AND address_id NOT IN (${incomingIds
      .map((_, i) => `$${i + 2}`)
      .join(",")})
    `,
    [u_id, ...incomingIds]
  );
} else {
  // No existing IDs → delete all previous addresses
  await client.query(
    `DELETE FROM user_address WHERE u_id = $1`,
    [u_id]
  );
}

    // addresses
   // addresses (UPSERT)
for (const addr of addresses) {
  const addressId = addr.address_id || require("uuid").v4();

  // 🔥 NORMALIZE address type (FINAL SAFETY NET)
  const allowedTypes = ["HOME", "WORK", "OTHER"];
  const normalizedType = allowedTypes.includes(addr.address_type)
    ? addr.address_type
    : "WORK";

  await client.query(
    `
    INSERT INTO user_address
(address_id, u_id, address_type, address_line, country, country_code, state, city, pincode, is_default)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
ON CONFLICT (address_id)
DO UPDATE SET
  address_type = EXCLUDED.address_type,
  address_line = EXCLUDED.address_line,
  country = EXCLUDED.country,
  country_code = EXCLUDED.country_code,
  state = EXCLUDED.state,
  city = EXCLUDED.city,
  pincode = EXCLUDED.pincode,
  is_default = EXCLUDED.is_default

    `,
   [
  addressId,
  u_id,
  normalizedType,   // 🔥 YAHI CHANGE
  addr.address_line,
  addr.country,
  addr.country_code,
  addr.state,
  addr.city,
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
exports.getCompleteProfile = async (u_id) => {
  const profileRes = await pool.query(
    `
    SELECT 
      up.u_id,
      up.first_name,
      up.middle_name,
      up.last_name,
      up.mobile_number,
      up.dob::TEXT AS dob,
      u.email
    FROM user_profile up
    JOIN users u ON u.u_id = up.u_id
    WHERE up.u_id = $1
    `,
    [u_id]
  );

  if (!profileRes.rows.length) {
    return null;
  }

  const addressRes = await pool.query(
    `
    SELECT *
    FROM user_address
    WHERE u_id = $1
    ORDER BY is_default DESC
    `,
    [u_id]
  );

  return {
    profile: profileRes.rows[0],
    addresses: addressRes.rows,
  };
};

