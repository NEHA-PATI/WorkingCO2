const express = require('express');
const router = express.Router();

// Import all route modules
const evRoutes = require('./evRoutes');
const solarRoutes = require('./solarRoutes');
const treeRoutes = require('./treeRoutes');
const carbonCaptureRoutes = require('./carbonCaptureRoutes');
const transactionRoutes = require('./transactionRoutes');
const imageRoutes = require('./imageRoutes');
const statusRoutes = require('./statusRoutes');

/**
 * API Routes Configuration
 * Base URL: /api/v1 (configured in app.js)
 */

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CO2+ Asset Service is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount route modules
router.use('/evmasterdata', evRoutes);
router.use('/solarpanel', solarRoutes);
router.use('/tree', treeRoutes);
router.use('/carbon-capture', carbonCaptureRoutes);
router.use('/', transactionRoutes); // For /evtransaction and /by-ev
router.use('/image', imageRoutes);
router.use('/assets', statusRoutes);

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = router;
