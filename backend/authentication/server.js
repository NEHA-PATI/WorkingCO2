const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const mailRoutes = require("./routes/mailRoutes");

const app = express();

/* ==================== TRUST PROXY (VERY IMPORTANT FOR AWS) ==================== */
app.set("trust proxy", 1); // Required behind Nginx / AWS / Load Balancer

/* ==================== SECURITY ==================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false, // prevent blocking frontend assets
  })
);

/* ==================== LOGGING ==================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ==================== CORS CONFIGURATION ==================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost",
  "http://15.207.54.164:3000",
  "https://www.gocarbonpositive.com",
  process.env.FRONTEND_URL, // 🔥 dynamic (EC2 / domain)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`❌ CORS blocked: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==================== BODY ==================== */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

/* ==================== RATE LIMITING ==================== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: "error",
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* ==================== ROUTES ==================== */
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const oauthRoutes = require("./routes/oauthRoutes");

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth/password", passwordRoutes);
app.use("/api/v1/auth/oauth", oauthRoutes);
app.use("/api/v1/mail", mailRoutes);

/* ==================== HEALTH CHECK (VERY IMPORTANT FOR AWS) ==================== */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "authentication-service",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ==================== ROOT CHECK ==================== */
app.get("/", (req, res) => {
  res.send("🚀 Auth Service is running");
});

/* ==================== 404 HANDLER ==================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ==================== GLOBAL ERROR HANDLER ==================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

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

/* ==================== SERVER START ==================== */
const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`
================================
🚀 Auth Service Started
================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV || "development"}
CORS Origins: ${allowedOrigins.join(", ")}
================================
`);
});

/* ==================== GRACEFUL SHUTDOWN (DOCKER/AWS) ==================== */
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("💤 Process terminated");
  });
});

module.exports = app;