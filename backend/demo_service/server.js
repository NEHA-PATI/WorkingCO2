const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const demoRoutes = require("../demo_service/src/routes/demo.routes");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/demo", demoRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "demo-service",
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Demo Service Error:", err);
  res.status(500).json({
    message: "Internal server error"
  });
});

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
  console.log(`📊 Demo Service running on port ${PORT}`);
});
