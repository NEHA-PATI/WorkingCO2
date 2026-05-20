const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const demoRoutes = require("./src/routes/demo.routes");

const app = express();

/* ==================== TRUST PROXY ==================== */
app.set("trust proxy", 1);

/* ==================== SECURITY ==================== */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* ==================== CORS ==================== */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`❌ CORS Blocked: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==================== BODY ==================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ==================== RATE LIMIT ==================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

/* ==================== LOGGING ==================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ==================== ROOT ==================== */
app.get("/", (req, res) => {
  res.send("📊 Demo Service Running 🚀");
});

/* ==================== HEALTH ==================== */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "demo-service",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ==================== ROUTES ==================== */
app.use("/api/v1/demo", demoRoutes);

/* ==================== 404 ==================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ==================== ERROR HANDLER ==================== */
app.use((err, req, res, next) => {
  console.error("❌ Demo Service Error:", err.message);

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
const PORT = process.env.PORT || 5007;

// 🔥 IMPORTANT for EC2 access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
================================
📊 Demo Service Started
================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
API: http://0.0.0.0:${PORT}/api/v1/demo
Health: http://0.0.0.0:${PORT}/api/v1/health
================================
`);
});