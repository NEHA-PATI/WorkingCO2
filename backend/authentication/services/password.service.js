const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Reset = require("../models/passwordResetModel");
const pool = require("../config/db");
const sendResetEmail = require("../utils/sendResetEmail");

exports.forgotPassword = async (email) => {
  console.log("📧 PASSWORD SERVICE:", email);

  const res = await pool.query(
    "SELECT id, email FROM users WHERE email=$1",
    [email.toLowerCase()]
  );

  if (!res.rows.length) return;

  const user = res.rows[0];

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await Reset.create({
    user_id: user.id,
    token: hashedToken,
    expires_at: new Date(Date.now() + 15 * 60 * 1000),
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendResetEmail(user.email, resetLink);
};

exports.resetPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const record = await Reset.findValid(hashedToken);
  if (!record) throw "Invalid or expired reset link";

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.query(
    "UPDATE users SET password=$1, updated_at=NOW() WHERE id=$2",
    [hashedPassword, record.user_id]
  );

  await Reset.markUsed(record.id);
};
