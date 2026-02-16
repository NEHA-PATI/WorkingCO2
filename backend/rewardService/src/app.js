const express = require('express');
<<<<<<< HEAD
const cors = require('cors');
=======

>>>>>>> 1021fdad658f8f1746659193dd88ed9a7a987ae7
const rewardRoutes = require('./modules/rewards/reward.routes');
const quizRoutes = require('./modules/quiz/quiz.routes');

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

/* ===============================
   API ROUTES
================================ */

// Rewards
app.use('/api/v1/rewards', rewardRoutes);

// Quiz USER routes
app.use('/api/v1/quiz', quizRoutes);

// Quiz ADMIN routes
app.use('/api/v1/admin/quiz', quizRoutes);

app.use(errorMiddleware);

module.exports = app;
