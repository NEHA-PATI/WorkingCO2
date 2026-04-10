

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const generateUID = require("../utils/generateUID");
const { sendMail, MAIL_TYPES } = require("../services/mail");
const axios = require("axios");

// ✅ Validation helpers
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 30 * 60 * 1000; // 30 min
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5001';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
  return PASSWORD_REGEX.test(pw);
}

function validateUsername(name) {
  return typeof name === "string" && name.trim().length >= 2 && name.trim().length <= 50;
}

function resolveContext({ globalRole, orgRole }) {
  if (["platform_admin", "admin", "super_admin", "superadmin"].includes(globalRole)) {
    return "admin";
  }
  if (orgRole === "org_admin" || orgRole === "org_member") return "organization";
  return "user";
}

function resolvePrimaryRole({ globalRole, orgRole }) {
  if (["platform_admin", "admin", "super_admin", "superadmin"].includes(globalRole)) {
    return "platform_admin";
  }
  if (orgRole === "org_admin" || orgRole === "org_member") return orgRole;
  if (globalRole === "marketplace_only") return "marketplace_only";
  return "user";
}

// ✅ REGISTER USER + SEND OTP
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username",
        data: null,
      });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
        data: null,
      });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Weak password",
        data: null,
      });
    }

    // Check already exists
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email.toLowerCase()]
    );
    if (exists.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        data: null,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 TEMP JWT (NO DB)
    const tempToken = jwt.sign(
      {
        username: username.trim(),
        email: email.toLowerCase(),
        passwordHash,
        otp,
      },
      process.env.JWT_OTP_SECRET,
      { expiresIn: "10m" }
    );

    await sendMail({
      type: MAIL_TYPES.OTP,
      to: email,
      data: { otp },
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      data: { tempToken }, // 🔥 frontend must keep this
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      data: null,
    });
  }
};


// ✅ VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { otp, tempToken } = req.body;

  try {
    if (!otp || !tempToken) {
      return res.status(400).json({
        success: false,
        message: "OTP and token required",
        data: null,
      });
    }

    let payload;
    try {
      payload = jwt.verify(tempToken, process.env.JWT_OTP_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
        data: null,
      });
    }

    if (payload.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        data: null,
      });
    }

    // 🔥 FIRST TIME DB INSERT
    const userRes = await pool.query(
      `INSERT INTO users
       (username, email, password_hash, is_email_verified, status, created_at, updated_at)
       VALUES ($1,$2,$3,true,'pending',NOW(),NOW())
       RETURNING id`,
      [
        payload.username,
        payload.email,
        payload.passwordHash,
      ]
    );

    const userId = userRes.rows[0].id;
    const u_id = generateUID("USR", userId);
    await pool.query("UPDATE users SET u_id=$1 WHERE id=$2", [u_id, userId]);

    return res.status(201).json({
      success: true,
      message: "Email verified successfully. Account created.",
      data: {
        user: {
          id: userId,
          u_id,
          email: payload.email,
          verified: true,
          is_email_verified: true,
          status: "pending",
        },
      },
    });
  } catch (err) {
    console.error("verifyOTP Error:", err);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
      data: null,
    });
  }
};


// ✅ LOGIN USER (ALLOWS PENDING USERS)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        data: null,
      });
    }

    const userRes = await pool.query(
      `SELECT
         u.id,
         u.u_id,
         u.username,
         u.email,
         u.password_hash,
         u.is_email_verified,
         u.status,
         u.login_attempts,
         u.lock_until
       FROM users u
       WHERE u.email = $1`,
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    const user = userRes.rows[0];

    if (!user.is_email_verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first.",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    let globalRole = null;
    try {
      const globalRoleRes = await pool.query(
        `SELECT r.role_name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = $1
         ORDER BY CASE
           WHEN r.role_name = 'platform_admin' THEN 1
           WHEN r.role_name = 'marketplace_only' THEN 2
           ELSE 99
         END
         LIMIT 1`,
        [user.id]
      );
      globalRole = globalRoleRes.rows[0]?.role_name || null;
    } catch (roleErr) {
      if (roleErr?.code !== "42P01") {
        throw roleErr;
      }
    }

    let orgRes = { rows: [] };
    try {
      orgRes = await pool.query(
        `SELECT ou.organization_id, r.role_name
         FROM organization_users ou
         JOIN roles r ON ou.role_id = r.id
         WHERE ou.user_id = $1 AND ou.status = 'active'
         ORDER BY CASE
           WHEN r.role_name = 'org_admin' THEN 1
           WHEN r.role_name = 'org_member' THEN 2
           ELSE 99
         END, ou.created_at ASC
         LIMIT 1`,
        [user.id]
      );
    } catch (orgErr) {
      if (orgErr?.code !== "42P01") {
        throw orgErr;
      }
    }

    const orgRole = orgRes.rows[0]?.role_name || null;
    const context = resolveContext({ globalRole, orgRole });
    const resolvedRole = resolvePrimaryRole({ globalRole, orgRole });

    const payload = {
      id: user.id,
      u_id: user.u_id,
      context,
      org_id: orgRes.rows[0]?.organization_id || null,
      role: resolvedRole,
      app_role: context,
      global_role: globalRole,
      org_role: orgRole,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const safeUser = {
      id: user.id,
      u_id: user.u_id,
      username: user.username,
      email: user.email,
      role: payload.role,
      role_name: payload.role,
      app_role: payload.app_role,
      global_role: payload.global_role,
      org_role: payload.org_role,
      context: payload.context,
      org_id: payload.org_id,
      verified: user.is_email_verified,
      is_email_verified: user.is_email_verified,
      status: user.status,
    };

    res.json({
      success: true,
      token,
      user: safeUser,
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Login failed",
      data: null,
    });
  }
};

// ✅ RESEND OTP
exports.resendOTP = async (req, res) => {
  const { tempToken } = req.body;

  try {
    let payload;
    try {
      payload = jwt.verify(tempToken, process.env.JWT_OTP_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please register again.",
        data: null,
      });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newTempToken = jwt.sign(
      {
        username: payload.username,
        email: payload.email,
        passwordHash: payload.passwordHash,
        otp: newOtp,
      },
      process.env.JWT_OTP_SECRET,
      { expiresIn: "10m" }
    );

    await sendMail({
      type: MAIL_TYPES.OTP,
      to: payload.email,
      data: { otp: newOtp },
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: { tempToken: newTempToken },
    });
  } catch (err) {
    console.error("Resend OTP Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      data: null,
    });
  }
};






