const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const config = require("./config/env");
const { testConnection } = require("./config/database");
const notificationRoutes = require("./routes/notificationRoutes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

/* ==================== TRUST PROXY (IMPORTANT FOR AWS) ==================== */
app.set("trust proxy", 1);

/* ==================== SECURITY ==================== */
app.use(helmet());

/* ==================== LOGGING ==================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ==================== BODY ==================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ==================== CORS (PRODUCTION SAFE) ==================== */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==================== ROOT ==================== */
app.get("/", (req, res) => {
  res.send("🚀 Notification Service Running");
});

/* ==================== HEALTH ==================== */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: config.serviceName,
    timestamp: new Date().toISOString(),
  });
});

/* ==================== ROUTES ==================== */
app.use("/api/v1/notifications", notificationRoutes);

/* ==================== 404 ==================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ==================== ERROR HANDLER ==================== */
app.use((err, req, res, next) => {
  console.error("❌ Notification Service Error:", err);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "Origin not allowed",
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

/* ==================== START SERVER ==================== */
const PORT = process.env.PORT || config.port || 5001;

const startServer = async () => {
  try {
    console.log("🔄 Starting Notification Service...");

    // DB check
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error("Database connection failed");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`
================================
🚀 Notification Service Started
================================
Service: ${config.serviceName}
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
API: http://0.0.0.0:${PORT}/api/v1/notifications
Health: http://0.0.0.0:${PORT}/api/v1/health
================================
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start service:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;