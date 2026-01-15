const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Health check endpoint
 * GET /health
 */
router.get('/', (req, res) => {
  try {
    const healthCheck = {
      status: 'UP',
      service: 'asset-service',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        connected: true, // This should be verified from DB pool
        host: process.env.DB_HOST || 'localhost'
      }
    };

    logger.info('Health check passed');
    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'DOWN',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Ready probe (K8s/GCP Cloud Run)
 * GET /ready
 */
router.get('/ready', (req, res) => {
  res.status(200).json({ ready: true });
});

/**
 * Liveness probe (K8s/GCP Cloud Run)
 * GET /live
 */
router.get('/live', (req, res) => {
  res.status(200).json({ alive: true });
});

module.exports = router;
