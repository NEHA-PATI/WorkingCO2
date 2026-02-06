const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Routes
const adminTicketRoutes = require("./routes/adminTicketRoutes");

// App init
const app = express();

/* ===================== SECURITY ===================== */
app.use(helmet());

/* ===================== LOGGING ===================== */
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ===================== CORS ===================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

/* ===================== BODY PARSING ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== RATE LIMITING ===================== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

/* ===================== ROUTES ===================== */
app.use("/api/tickets", adminTicketRoutes);

/* ===================== HEALTH CHECK ===================== */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "ticket-service",
    timestamp: new Date().toISOString()
  });
});

/* ===================== 404 HANDLER ===================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS error: origin not allowed"
    });
  }

  res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`
====================================
🎫 Ticket Service Started
====================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV || "development"}
====================================
`);
});

module.exports = app;
