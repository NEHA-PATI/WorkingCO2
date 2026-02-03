const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const config = require("./config/env");
const logger = require("./utils/logger");
const assetRoutes = require("./routes/assetRoutes");
 const orgAssetRoutes = require("./routes/orgAssetRoutes");



// Security middleware
const {
  configureCORS,
  configureHelmet,
  sanitizeRequest,
} = require("./middleware/security");

const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Routes
const routes = require("./routes");

const app = express();

/**
 * ========================================
 * GLOBAL MIDDLEWARE
 * ========================================
 */

// Security headers & CORS
app.use(configureHelmet());
app.use(configureCORS());

// Body parsing - express.json() automatically skips multipart/form-data
// But we'll be explicit to avoid any issues
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Sanitize input
app.use(sanitizeRequest);

// Logging
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (msg) => logger.info(msg.trim()),
      },
    })
  );
}

/**
 * ========================================
 * ROUTES
 * ========================================
 */

//asset management route 
app.use("/api/assets", assetRoutes);
app.use("/api/org-assets", orgAssetRoutes);

// Root
app.get("/", (req, res) => {
  res.json({
    status: "success",
    service: "CO2+ Asset Management API",
    version: "1.0.0",
    environment: config.nodeEnv,
  });
});



// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Service is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Rate limit ONLY API
app.use("/api/v1", apiLimiter);

// API routes
app.use("/api/v1", routes);

/**
 * ========================================
 * ERROR HANDLING
 * ========================================
 */

app.use(notFoundHandler);
app.use(errorHandler);

/**
 * ========================================
 * PROCESS SAFETY
 * ========================================
 */

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED PROMISE REJECTION 💥", {
    error: err.message,
    stack: err.stack,
  });

  if (config.nodeEnv === "production") {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION 💥", {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

module.exports = app;

