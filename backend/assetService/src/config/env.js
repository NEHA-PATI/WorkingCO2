const path = require('path');
// Load .env from root directory (backend/assetService/.env)
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 5000,
  
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'co2',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    url: process.env.DATABASE_URL
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  
  cors: {
  origins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://[::1]:3000",
        "http://[::1]:3001"
      ]
}
,
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

module.exports = config;
