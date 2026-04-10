const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, u_id, context, org_id, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;