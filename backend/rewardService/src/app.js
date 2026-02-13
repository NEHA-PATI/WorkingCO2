const express = require('express');

const rewardRoutes = require('./modules/rewards/reward.routes');
const quizRoutes = require('./modules/quiz/quiz.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

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
