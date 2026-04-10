const jwt = require("jsonwebtoken");

const normalizeRole = (role = "") => {
  const value = String(role).trim().toLowerCase();

  if (["admin", "platform_admin", "super_admin", "superadmin"].includes(value)) {
    return "admin";
  }

  if (
    value === "organization" ||
    value === "organisation" ||
    value === "org" ||
    value === "org_admin" ||
    value === "org_member" ||
    value.startsWith("org_")
  ) {
    return "organization";
  }

  if (value === "marketplace_only" || value === "user") {
    return "user";
  }

  return value;
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const normalizedAllowed = allowedRoles.map(normalizeRole);
      const normalizedRole = normalizeRole(decoded.role);

      if (
        !allowedRoles.includes(decoded.role) &&
        !normalizedAllowed.includes(decoded.context) &&
        !normalizedAllowed.includes(normalizedRole)
      )
        return res.status(403).json({ message: "Access denied" });

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authorize;
