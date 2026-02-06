const pool = require("../config/db");

exports.resolveOAuthUser = async (provider, profile) => {
  const { id: providerId, email, name } = profile;

  // 1. check identity
  const identityRes = await pool.query(
    `SELECT u.* 
     FROM user_identities ui
     JOIN users u ON ui.user_id = u.id
     WHERE ui.provider=$1 AND ui.provider_user_id=$2`,
    [provider, providerId]
  );

  if (identityRes.rows.length) {
    return identityRes.rows[0];
  }

  // 2. check existing user by email
  let userRes = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  let user;

  if (userRes.rows.length) {
    user = userRes.rows[0];
  } else {
    // 3. create new user
    const newUser = await pool.query(
      `INSERT INTO users (username,email,verified,status)
       VALUES ($1,$2,true,'active')
       RETURNING *`,
      [name, email.toLowerCase()]
    );

    user = newUser.rows[0];
  }

  // 4. create identity link
  await pool.query(
    `INSERT INTO user_identities
     (user_id, provider, provider_user_id, email, is_verified, metadata)
     VALUES ($1,$2,$3,$4,true,$5)
     ON CONFLICT DO NOTHING`,
    [user.id, provider, providerId, email, profile]
  );

  return user;
};
