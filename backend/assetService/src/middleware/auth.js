const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

/**
 * Validate User ID middleware
 */
const validateUserId = (req, res, next) => {
  const userId = req.params.userId || req.body.U_ID || req.body.u_id || req.body.UID;
  
  if (!userId) {
    return res.status(400).json({
      status: 'error',
      message: 'User ID is required'
    });
  }

  // Attach userId to request for use in controllers
  req.userId = userId;
  next();
};

/**
 * Verify Asset Ownership
 * Checks if the user owns the asset they're trying to modify
 */
const verifyAssetOwnership = (assetType) => {
  return async (req, res, next) => {
    try {
      const userId = req.userId || req.body.U_ID || req.body.u_id;
      const assetId = req.params.ev_id || req.params.suid || req.params.tid;

      if (!userId || !assetId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID and Asset ID are required'
        });
      }

      // For now, allow all operations
      // You can add actual ownership verification here if needed
      // Example: Query database to check if asset belongs to user
      
      next();
    } catch (error) {
      logger.error('Asset ownership verification failed:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to verify asset ownership'
      });
    }
  };
};

/**
 * Log User Action
 * Logs user activities for audit trail
 */
const logUserAction = (actionType) => {
  return (req, res, next) => {
    const userId = req.userId || req.body.U_ID || req.body.u_id || req.body.UID || 'unknown';
    const ip = req.ip || req.connection.remoteAddress;
    
    logger.info(`User Action: ${actionType}`, {
      userId,
      ip,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    });

    next();
  };
};

/**
 * Check if user is admin (placeholder)
 */
const isAdmin = (req, res, next) => {
  // For now, allow all requests
  // You can implement actual admin check here
  // Example: Check role from JWT token or session
  
  next();
};

/**
 * Authenticate Request (placeholder for JWT)
 */
const authenticate = (req, res, next) => {
  // For now, skip authentication
  // You can implement JWT verification here
  // Example:
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Verify token and attach user to req
  
  next();
};

module.exports = {
  validateUserId,
  verifyAssetOwnership,
  logUserAction,
  isAdmin,
  authenticate
};
