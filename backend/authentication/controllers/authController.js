// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/db");
// const generateUID = require("../utils/generateUID");
// const otpService = require("../services/otp.service");
// const axios = require("axios");

// const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const MAX_ATTEMPTS = 5;
// const LOCK_TIME_MS = 30 * 60 * 1000;

// const NOTIFICATION_SERVICE_URL =
//   process.env.NOTIFICATION_SERVICE_URL || "http://localhost:5001";

// function validateEmail(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }
// function validatePassword(pw) {
//   return PASSWORD_REGEX.test(pw);
// }
// function validateUsername(name) {
//   return typeof name === "string" && name.trim().length >= 2;
// }

// /* ================= REGISTER ================= */

// exports.register = async (req, res) => {
//   const { username, email, password, role } = req.body;

//   try {
//     if (!validateUsername(username)) return res.status(400).json({ message: "Invalid username" });
//     if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email" });
//     if (!validatePassword(password)) return res.status(400).json({ message: "Weak password" });

//     const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email.toLowerCase()]);
//     if (exists.rows.length) return res.status(400).json({ message: "User already exists" });

//     const hashed = await bcrypt.hash(password, 12);

//     const roleId = 1; // default to 'user' role

//     const userRes = await pool.query(`
//       INSERT INTO users (username,email,password,role_id,verified,status)
//       VALUES ($1,$2,$3,$4,false,'active')
//       RETURNING id, email, username
//     `, [username.trim(), email.toLowerCase(), hashed, roleId]);

//     const user = userRes.rows[0];
//     const u_id = generateUID("USR", user.id);
//     await pool.query("UPDATE users SET u_id=$1 WHERE id=$2", [u_id, user.id]);

//     await otpService.sendRegistrationOTP(user);

//     res.status(201).json({
//       message: "Registration successful. OTP sent to email.",
//       email: user.email
//     });

//   } catch (err) {
//     console.error("REGISTER:", err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// /* ================= VERIFY OTP ================= */

// exports.verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     await otpService.verifyRegistrationOTP(email, otp);

//     const result = await pool.query(`
//       UPDATE users 
//       SET verified=true, status='active', updated_at=NOW()
//       WHERE email=$1
//       RETURNING id, u_id, username, email, status
//     `, [email.toLowerCase()]);

//     res.json({
//       message: "Email verified successfully",
//       user: result.rows[0]
//     });

//   } catch (err) {
//     res.status(400).json({ message: err.toString() });
//   }
// };

// /* ================= RESEND OTP ================= */

// exports.resendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const userRes = await pool.query("SELECT id, email FROM users WHERE email=$1", [email.toLowerCase()]);
//     if (!userRes.rows.length) return res.json({ message: "If user exists, OTP sent." });

//     await otpService.sendRegistrationOTP(userRes.rows[0]);
//     res.json({ message: "OTP resent successfully" });

//   } catch (err) {
//     console.error("RESEND OTP:", err);
//     res.status(500).json({ message: "Failed to resend OTP" });
//   }
// };

// /* ================= LOGIN ================= */

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userRes = await pool.query(`
//       SELECT u.*, r.role_name 
//       FROM users u 
//       LEFT JOIN roles r ON u.role_id=r.id
//       WHERE u.email=$1
//     `, [email.toLowerCase()]);

//     if (!userRes.rows.length) return res.status(400).json({ message: "Invalid credentials" });

//     const user = userRes.rows[0];

//     if (!user.verified) return res.status(403).json({ message: "Please verify email" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user.id, u_id: user.u_id, role: user.role_name },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user.id,
//         u_id: user.u_id,
//         email: user.email,
//         role: user.role_name
//       }
//     });

//   } catch (err) {
//     console.error("LOGIN:", err);
//     res.status(500).json({ message: "Login failed" });
//   }
// };





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
        roleId: 1,
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
       (username, email, password, role_id, verified, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,true,'active',NOW(),NOW())
       RETURNING id`,
      [
        payload.username,
        payload.email,
        payload.passwordHash,
        payload.roleId,
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

    // Validation
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        data: null,
      });
    }

    if (!validateEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    // Fetch user with role
    const userRes = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1`,
      [normalizedEmail]
    );

    if (userRes.rows.length === 0) {
      // Fallback: login from organizations table
      const orgRes = await pool.query(
        `SELECT
           org_id,
           org_mail,
           password_hash
         FROM organizations
         WHERE org_mail = $1`,
        [normalizedEmail]
      );

      if (orgRes.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
      }

      const organization = orgRes.rows[0];
      const orgPasswordMatch = await bcrypt.compare(password, organization.password_hash);

      if (!orgPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
      }

      const orgToken = jwt.sign(
        {
          id: organization.org_id,
          u_id: organization.org_id,
          role: "organization",
          status: "active",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      return res.status(200).json({
        success: true,
        message: "Welcome back!",
        data: {
          token: orgToken,
          user: {
            id: organization.org_id,
            u_id: organization.org_id,
            email: organization.org_mail,
            role_name: "organization",
            verified: true,
            status: "active",
          },
        },
      });
    }

    const user = userRes.rows[0];

    // Check if account is locked
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      return res.status(429).json({
        success: false,
        message: "Account locked due to multiple failed attempts. Try again later.",
        data: null,
      });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first.",
        data: null,
      });
    }

    // ✅ ONLY BLOCK REJECTED, SUSPENDED, AND INACTIVE USERS (ALLOW PENDING)
    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: "Your account has been rejected. Please contact support for more information.",
        data: { status: 'rejected' }
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
        data: { status: 'suspended' }
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Please contact support to reactivate.",
        data: { status: 'inactive' }
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      const attempts = (user.login_attempts || 0) + 1;
      let lockUntil = null;
      
      if (attempts >= MAX_ATTEMPTS) {
        lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      }
      
      // Update user with failed attempts
      await pool.query(
        "UPDATE users SET login_attempts=$1, lock_until=$2, updated_at=NOW() WHERE id=$3",
        [attempts, lockUntil, user.id]
      );
      
      // ✅ Send failed login notification event
      try {
        await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/event`, {
          event_type: 'user.login.failed',
          user: {
            id: user.id,
            email: normalizedEmail
          },
          ip_address: req.ip || req.connection.remoteAddress || 'unknown',
          device_info: req.get('user-agent') || 'Unknown device',
          attempt_number: attempts
        });
      } catch (notifError) {
        console.error('Notification service error:', notifError.message);
      }
      
      // ✅ Send account locked notification if max attempts reached
      if (lockUntil) {
        try {
          await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/event`, {
            event_type: 'user.account.locked',
            user: {
              id: user.id,
              email: normalizedEmail
            },
            ip_address: req.ip || req.connection.remoteAddress || 'unknown',
            device_info: req.get('user-agent') || 'Unknown device'
          });
        } catch (notifError) {
          console.error('Notification service error:', notifError.message);
        }
      }
      
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    // Reset attempts on successful login
    await pool.query(
      "UPDATE users SET login_attempts=0, lock_until=NULL, updated_at=NOW() WHERE id=$1",
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id,u_id: user.u_id, role: user.role_name, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Store token in database
    await pool.query(
      "INSERT INTO tokens (user_id, token, token_type, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')",
      [user.id, token, "ACCESS"]
    );

    // ✅ Send successful login notification event
    try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/event`, {
  event_type: 'user.login',
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role_name     // ✅ FIX
  },
  ip_address: req.ip || req.connection.remoteAddress || 'unknown',
  device_info: req.get('user-agent') || 'Unknown device'
});

    } catch (notifError) {
      console.error('Notification service error:', notifError.message);
    }

    const safeUser = {
      id: user.id,
      u_id: user.u_id,
      username: user.username,
      email: user.email,
      role_name: user.role_name,
      verified: user.verified,
      status: user.status,
    };

    // ✅ Different messages based on status
    let message = "Login successful!";
    if (user.status === 'pending') {
      message = "Login successful! Your account is pending admin approval.";
    } else if (user.status === 'active') {
      message = "Welcome back!";
    }

    res.status(200).json({
      success: true,
      message,
      data: { token, user: safeUser },
    });
  } catch (err) {
    console.error("Login Error:", err);
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
        roleId: payload.roleId,
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






