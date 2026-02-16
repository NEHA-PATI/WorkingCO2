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

app.listen(PORT, () => {
  console.log(`🚀 Reward Service running on port ${PORT}`);
});
