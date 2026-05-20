const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rewardRoutes = require("./src/modules/rewards/reward.routes");
const quizRoutes = require("./src/modules/quiz/quiz.routes");

const app = express();

/* -------------------- CORS CONFIG -------------------- */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl/postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  })
);

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- HEALTH CHECK -------------------- */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "reward-service",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* -------------------- ROUTES -------------------- */
app.use("/api/v1/rewards", rewardRoutes);
app.use("/api/v1/quiz", quizRoutes);

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

/* -------------------- GLOBAL ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 5008;

app.listen(PORT, () => {
  console.log(`🚀 Reward Service running on port ${PORT}`);
});