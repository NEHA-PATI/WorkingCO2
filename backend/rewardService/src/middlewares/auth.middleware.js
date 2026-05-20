const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    console.log("📥 AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {

      console.log("❌ Missing Bearer Token");

      return res.status(401).json({
        message: "Unauthorized: Bearer token required"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("🔥 TOKEN:", token);

    console.log("🔑 JWT SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ TOKEN VERIFIED:", decoded);

    req.u_id = decoded.u_id || decoded.id;
    req.role = decoded.role;

    next();

  } catch (error) {

    console.log("❌ JWT VERIFY ERROR:", error.message);

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
      error: error.message
    });
  }
};