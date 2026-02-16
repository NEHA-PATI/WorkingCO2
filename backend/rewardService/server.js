const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rewardRoutes = require("./src/modules/rewards/reward.routes");
const quizRoutes = require("./src/modules/quiz/quiz.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/quiz", quizRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "reward-service running" });
});

const PORT = process.env.PORT || 5008;

<<<<<<< HEAD
app.listen(PORT, async () => {
  console.log(`Reward service running on port ${PORT}`);

  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.warn('Reward service started, but database is not connected.');
  }
=======
app.listen(PORT, () => {
  console.log(`🚀 Reward Service running on port ${PORT}`);
>>>>>>> 1ed5770f168d7936d2a29036dc5410d8e2f26d13
});
