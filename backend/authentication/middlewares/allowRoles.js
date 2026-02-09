/**
 * Role-based access control middleware
 *
 * Usage: allowRoles("admin", "organization")
 */
const allowRoles = (...allowedRoles) => {
  const normalized = allowedRoles.map((r) => String(r).toLowerCase());

  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !normalized.includes(String(role).toLowerCase())) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return next();
  };
};

module.exports = allowRoles;
