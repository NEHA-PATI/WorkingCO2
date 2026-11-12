const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = require('./config/env');
const { testConnection } = require('./config/database');
const notificationRoutes = require('./routes/notificationRoutes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration - HARDCODED FOR TESTING
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  'http://localhost:5174,http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==================== ROUTES ====================
app.use('/api/v1/notifications', notificationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    service: config.serviceName,
    timestamp: new Date().toISOString()
  });
});

// ==================== ERROR HANDLING ====================
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use(errorHandler);

// ==================== START SERVER ====================
const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`
        ================================
        🚀 Notification Service Started
        ================================
        Service: ${config.serviceName}
        Port: ${PORT}
        Environment: ${config.nodeEnv}
        Database: ${config.db.host}:${config.db.port}/${config.db.name}
        CORS: Enabled for http://localhost:3001
        ================================
      `);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
