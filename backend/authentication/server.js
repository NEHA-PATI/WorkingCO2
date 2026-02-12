const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const mailRoutes = require("./routes/mailRoutes");

const sendOTP = require("../authentication/utils/sendOTP"); // adjust path if needed

const app = express();

// ==================== SECURITY ====================
app.use(helmet());

// ==================== LOGGING ====================
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// ==================== CORS ====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
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
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ==================== BODY ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== RATE LIMIT ====================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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

// ==================== 404 (MUST BE LAST ROUTE) ====================
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// ==================== GLOBAL ERROR ====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
================================
🚀 Auth Service Started
Port: ${PORT}
================================
  `);
});

module.exports = app;
