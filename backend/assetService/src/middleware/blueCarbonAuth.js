const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const role = String(user.role || user.role_name || "").toLowerCase().replace(/[\s-]+/g, "_");
    const devFallback = process.env.NODE_ENV !== 'production' && process.env.BLUE_CARBON_ALLOW_USER_ORG_FALLBACK === 'true';
    const orgId = user.org_id || (devFallback ? process.env.BLUE_CARBON_DEV_ORG_ID : null);
    const allowedRoles = ['organization', 'organization_admin', 'org_admin', 'field_user', 'enumerator', 'community_member', 'blue_carbon_reviewer', 'admin'];
    if (!allowedRoles.includes(role) && !devFallback) {
      return res.status(403).json({ success: false, message: `Blue Carbon role is not authorized: ${role || 'missing'}` });
    }
    if (!orgId) {
      return res.status(403).json({ success: false, message: "A valid organization context is required. Sign in through organization login." });
    }
    req.blueCarbonUser = { ...user, org_id: orgId, role };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid authentication token" });
  }
};
