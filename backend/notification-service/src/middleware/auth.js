const jwt = require('jsonwebtoken');
const config = require('../config/env');
const logger = require('../utils/logger');
const { MESSAGES } = require('../config/constants');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ');

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
      email: decoded.email
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
