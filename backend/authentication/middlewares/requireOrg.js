const requireOrg = (req, res, next) => {
  const isOrg =
    req.user?.context === "organization" ||
    req.user?.role === "organization" ||
    Boolean(req.user?.org_id);

  if (!isOrg) {
    return res.status(403).json({
      message: "Organization access required",
    });
  }
  next();
};

module.exports = requireOrg;
