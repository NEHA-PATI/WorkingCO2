const jwt = require("jsonwebtoken");

/**
 * verifyToken middleware
 *
 * - Expects "Authorization: Bearer <token>"
 * - Verifies JWT using JWT_SECRET
 * - Attaches decoded payload to req.user
 * - Returns 401 on any failure
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = parts[1].trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
