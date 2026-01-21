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
const sendOTP = require("../utils/sendOTP");
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
  const { username, email, password, role } = req.body;

  try {
    // Basic validation
    if (!validateUsername(username)) {
      return res.status(400).json({ message: "Username must be 2–50 characters." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars and include uppercase, lowercase, number, and special character.",
      });
    }

    // ✅ Check if user exists
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email.toLowerCase()]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    // Find role
   const roleId = 1; // ✅ default USER role


    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ Create user with 'active' status by default
    const userRes = await pool.query(
      `INSERT INTO users (username, email, password, role_id, otp_code, otp_expires_at, verified, login_attempts, lock_until, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, 0, NULL, 'active', NOW(), NOW())
       RETURNING id, username, email, status`,
      [username.trim(), email.toLowerCase(), hashed, roleId, otp, expiresAt]
    );

    const userId = userRes.rows[0].id;
    const u_id = generateUID("USR", userId);
    
    // Update with generated u_id
    await pool.query("UPDATE users SET u_id=$1 WHERE id=$2", [u_id, userId]);

    // Send OTP
    try {
      await sendOTP(email, otp);
    } catch (mailErr) {
      console.error("Send OTP Error:", mailErr);
      await pool.query("DELETE FROM users WHERE id=$1", [userId]);
      return res.status(500).json({
        message: "Failed to send OTP. Check email configuration.",
      });
    }

    // ✅ Send signup notification event to notification service
    try {
    await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/event`, {
  event_type: 'user.signup',
  user: {
    id: userId,
    username: username,
    email: email.toLowerCase(),
    role: 'USER'   // ✅ FIXED
  },
  ip_address: req.ip || req.connection.remoteAddress || 'unknown',
  device_info: req.get('user-agent') || 'Unknown device'
});

    } catch (notifError) {
      console.error('Notification service error:', notifError.message);
      // Don't fail the signup if notification fails
    }

    res.status(201).json({ 
      message: "Registration successful! Please check your email to verify your account.", 
      email,
      note: "After email verification, your account will be pending admin approval."
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ✅ VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({ message: "OTP must be 6 digits" });
    }

    // Fetch user with role
    const result = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email=$1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Check OTP
    const now = new Date();
    const expiresAt = user.otp_expires_at ? new Date(user.otp_expires_at) : null;

    if (!user.otp_code) {
      return res.status(400).json({ message: "No OTP found. Please register again." });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!expiresAt || now > expiresAt) {
      return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    // Update user as verified
    await pool.query(
      "UPDATE users SET verified=true, otp_code=NULL, otp_expires_at=NULL, updated_at=NOW() WHERE email=$1",
      [email.toLowerCase()]
    );

    // ✅ Send email verified notification event
    try {
      await axios.post(`${NOTIFICATION_SERVICE_URL}/api/notifications/event`, {
  event_type: 'user.email.verified',
  user: {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role_name   // 🔥 ensure this
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
      verified: true,
      status: user.status || 'pending',
    };

    res.status(200).json({ 
      message: "Email verified successfully! You can now login. Your account is pending admin approval.", 
      user: safeUser,
      note: "You can login, but will have limited access until admin approves your account."
    });
  } catch (err) {
    console.error("verifyOTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ✅ LOGIN USER (ALLOWS PENDING USERS)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Fetch user with role
    const userRes = await pool.query(
      `SELECT u.*, r.role_name 
       FROM users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (userRes.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userRes.rows[0];

    // Check if account is locked
    if (user.lock_until && new Date(user.lock_until) > new Date()) {
      return res.status(429).json({
        message: "Account locked due to multiple failed attempts. Try again later.",
      });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(400).json({ message: "Please verify your email first." });
    }

    // ✅ ONLY BLOCK REJECTED, SUSPENDED, AND INACTIVE USERS (ALLOW PENDING)
    if (user.status === 'rejected') {
      return res.status(403).json({
        message: "Your account has been rejected. Please contact support for more information.",
        status: 'rejected'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact support.",
        status: 'suspended'
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        message: "Your account is inactive. Please contact support to reactivate.",
        status: 'inactive'
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
            email: email.toLowerCase()
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
              email: email.toLowerCase()
            },
            ip_address: req.ip || req.connection.remoteAddress || 'unknown',
            device_info: req.get('user-agent') || 'Unknown device'
          });
        } catch (notifError) {
          console.error('Notification service error:', notifError.message);
        }
      }
      
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Reset attempts on successful login
    await pool.query(
      "UPDATE users SET login_attempts=0, lock_until=NULL, updated_at=NOW() WHERE id=$1",
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role_name, status: user.status },
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
      message,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};