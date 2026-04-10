const requireMarketplaceOnly = (req, res, next) => {
  if (req.user.role !== "marketplace_only") {
    return res.status(403).json({
      message: "Marketplace only access",
    });
  }
  next();
};

module.exports = requireMarketplaceOnly;