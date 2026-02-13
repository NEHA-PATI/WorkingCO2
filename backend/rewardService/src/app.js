const express = require('express');
const cors = require('cors');
const rewardRoutes = require('./modules/rewards/reward.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://www.gocarbonpositive.com'
];

const allowedOrigins = Array.from(
  new Set(
    [
      ...DEFAULT_ALLOWED_ORIGINS,
      ...(process.env.CORS_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    ]
  )
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

// ✅ Versioned API
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'reward-service',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/rewards', rewardRoutes);

app.use(errorMiddleware);

module.exports = app;
