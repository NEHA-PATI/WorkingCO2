import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.config.js';
import { testSanityConnection } from './config/sanity.config.js';
import { initRedis } from './config/redis.config.js';
import blogRoutes from './routes/blog.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'BlogService',
  });
});

// API routes
app.use('/api/blog', blogRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize connections and start server
const startServer = async () => {
  try {
    // Test Sanity connection
    await testSanityConnection();

    // Initialize Redis (optional)
    await initRedis();

    // Start server
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`\n🚀 BlogService running on port ${PORT}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`🌐 API: http://localhost:${PORT}/api/blog`);
      console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
