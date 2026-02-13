const express = require('express');
const rewardRoutes = require('./modules/rewards/reward.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

// ✅ Versioned API
app.use('/api/v1/rewards', rewardRoutes);

app.use(errorMiddleware);

module.exports = app;
