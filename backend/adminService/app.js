const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("./src/config/env");

const app = express();

/* ==================== SECURITY ==================== */
app.use(helmet());

/* ==================== LOGGING ==================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ==================== CORS ==================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost",
  process.env.FRONTEND_URL,
].filter(Boolean);

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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==================== BODY ==================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==================== ROUTES ==================== */
const userRoutes = require("./src/routes/users.routes");
const orgRequestsRoutes = require("./src/routes/orgRequests.routes");

/* ==================== TEST ROUTE ==================== */
app.get("/", (req, res) => {
  res.send("Admin Service Running 🚀");
});

/* ==================== HEALTH ROUTE (IMPORTANT) ==================== */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "admin-service",
    message: "Service is healthy",
    timestamp: new Date().toISOString(),
  });
});

/* ==================== API ROUTES ==================== */
app.use("/api/v1", userRoutes);
app.use("/api/v1", orgRequestsRoutes);

/* ==================== 404 HANDLER ==================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ==================== ERROR HANDLER ==================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "Origin not allowed",
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = app;