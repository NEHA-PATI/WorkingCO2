require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5001,
  serviceName: process.env.SERVICE_NAME || 'notification-service',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'gocarbonpositive',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    serviceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
  },

  cors: {
    origins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5174', 'http://localhost:5173']
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
