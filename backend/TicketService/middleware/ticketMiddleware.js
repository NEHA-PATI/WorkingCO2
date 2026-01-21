const jwt = require("jsonwebtoken");

/**
 * Token verification middleware
 * - DEV: uses mock user (no token required)
 * - PROD: verifies JWT
 */
const verifyToken = (req, res, next) => {

  // =========================
  // 🚨 DEVELOPMENT MODE (MOCK)
  // =========================
  if (process.env.MOCK_AUTH === "true") {
    console.log("🔥 MOCK AUTH ACTIVE (Ticket Service)");

    req.user = {
      u_id: "USR0042",   // MUST exist in users table
      role: "USER"
    };

    return next();
  }

  // =========================
  // 🔐 PRODUCTION MODE (JWT)
  // =========================
  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      role: (decoded.role || decoded.role_name || "USER").toUpperCase()
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { verifyToken };
