const db = require("../config/db");

exports.findByProvider = async (provider, providerUserId) => {
  const res = await db.query(
    `SELECT * FROM user_identities 
     WHERE provider=$1 AND provider_user_id=$2`,
    [provider, providerUserId]
  );
  return res.rows[0];
};

exports.findByUserId = async (userId) => {
  const res = await db.query(
    `SELECT * FROM user_identities WHERE user_id=$1`,
    [userId]
  );
  return res.rows;
};

exports.create = async ({ user_id, provider, provider_user_id, email, is_verified, metadata }) => {
  const res = await db.query(
    `INSERT INTO user_identities
     (user_id, provider, provider_user_id, email, is_verified, metadata)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [user_id, provider, provider_user_id, email, is_verified, metadata]
  );
  return res.rows[0];
};
