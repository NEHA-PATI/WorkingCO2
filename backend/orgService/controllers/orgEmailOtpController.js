const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const PURPOSE = "ORG_EMAIL_VERIFY";
const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 30;
const MAX_ATTEMPTS = 5;

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || "").trim());
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, otp) => {
  const htmlContent = `
    <div style="font-family:Arial, sans-serif; padding:20px;">
      <h2>Your OTP Code</h2>
      <p>Hello,</p>
      <p>Your One-Time Password (OTP) is:</p>
      <h3 style="color:#2b6cb0;">${otp}</h3>
      <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
      <br/>
      <p>— The Team</p>
    </div>
  `;

  await resend.emails.send({
    from: "Carbon Positive <onboarding@resend.dev>",
    to: email,
    subject: "Your OTP Code",
    html: htmlContent
  });
};

/**
 * POST /api/org-email-otp/send
 */
exports.sendOrgEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }

    const latest = await pool.query(
      `SELECT id, last_sent_at
       FROM otp_logs
       WHERE destination = $1 AND purpose = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, PURPOSE]
    );

    if (latest.rows.length > 0 && latest.rows[0].last_sent_at) {
      const lastSentAt = new Date(latest.rows[0].last_sent_at).getTime();
      const now = Date.now();
      const diffSeconds = Math.floor((now - lastSentAt) / 1000);
      if (diffSeconds < RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          message: `Please wait ${RESEND_COOLDOWN_SECONDS - diffSeconds}s before requesting another OTP`
        });
      }
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await pool.query(
      `UPDATE otp_logs
       SET verified = true
       WHERE destination = $1
         AND purpose = $2
         AND verified = false`,
      [email, PURPOSE]
    );

    await pool.query(
      `INSERT INTO otp_logs (
        user_id,
        destination,
        otp_code,
        purpose,
        expires_at,
        attempts,
        verified,
        last_sent_at
      ) VALUES ($1,$2,$3,$4, NOW() + INTERVAL '${OTP_EXPIRY_MINUTES} minutes', 0, false, NOW())`,
      [null, email, hashedOtp, PURPOSE]
    );

    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("SEND ORG EMAIL OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * POST /api/org-email-otp/verify
 */
exports.verifyOrgEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email" });
    }
    if (!otp || String(otp).length !== 6) {
      return res.status(400).json({ message: "Please provide a valid OTP" });
    }

    const result = await pool.query(
      `SELECT id, otp_code, expires_at, verified, attempts
       FROM otp_logs
       WHERE destination = $1 AND purpose = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [email, PURPOSE]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "OTP not found. Please request a new one." });
    }

    const record = result.rows[0];

    if (record.verified) {
      return res.status(400).json({ message: "OTP already verified" });
    }

    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if ((record.attempts || 0) >= MAX_ATTEMPTS) {
      return res.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(String(otp), record.otp_code);

    if (!isMatch) {
      await pool.query(
        `UPDATE otp_logs SET attempts = attempts + 1 WHERE id = $1`,
        [record.id]
      );
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }

    await pool.query(
      `UPDATE otp_logs SET verified = true WHERE id = $1`,
      [record.id]
    );

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("VERIFY ORG EMAIL OTP ERROR:", error);
    return res.status(500).json({ message: "Failed to verify OTP" });
  }
};
