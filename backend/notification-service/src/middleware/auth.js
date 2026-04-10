const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');
const { MESSAGES } = require('../config/constants');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: MESSAGES.INVALID_TOKEN
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      context: decoded.context,
      app_role: decoded.app_role,
      global_role: decoded.global_role,
      org_role: decoded.org_role
    };

    logger.info(`Authenticated user: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({
      status: 'error',
      message: MESSAGES.INVALID_TOKEN,
      error: error.message
    });
  }
};

module.exports = auth;
