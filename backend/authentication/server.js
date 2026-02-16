const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const mailRoutes = require("./routes/mailRoutes");

const app = express();

/* ==================== IMPORTANT FOR AWS + DOCKER ==================== */
app.set("trust proxy", 1); // 🔥 REQUIRED for rate-limit behind proxy

// ==================== SECURITY ====================
app.use(helmet());

// ==================== LOGGING ====================
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// ==================== CORS CONFIGURATION ====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://15.206.213.50",          // ✅ EC2 frontend
  "http://15.206.213.50:5173",     // optional
  "https://www.gocarbonpositive.com",
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

// ==================== BODY ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RATE LIMITING ====================
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

// ==================== ROUTES ====================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const oauthRoutes = require("./routes/oauthRoutes");

app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth/password", passwordRoutes);
app.use("/api/v1/auth/oauth", oauthRoutes);


app.use("/api/v1/mail", mailRoutes);


// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "authentication-service",
    timestamp: new Date().toISOString(),
  });
});

// ==================== 404 ====================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ==================== ERROR HANDLER ====================
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

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5002; // ✅ FALLBACK ADDED

app.listen(PORT, () => {
  console.log(`
    ================================
    🚀 Auth Service Started
    ================================
    Port: ${PORT}
    Environment: ${process.env.NODE_ENV || "development"}
    CORS: ${allowedOrigins.length} origins enabled
    ================================
  `);
});

module.exports = app;
