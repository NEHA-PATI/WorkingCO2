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

/* ===================== TRUST PROXY (IMPORTANT FOR EC2 / LB) ===================== */
app.set("trust proxy", 1);

/* ===================== SECURITY ===================== */
app.use(helmet());

/* ===================== LOGGING ===================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ===================== CORS (PRODUCTION SAFE) ===================== */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / curl / server-to-server calls
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`❌ CORS Blocked: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

/* ===================== BODY PARSING ===================== */
app.use(express.json({ limit: "10mb" }));
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
    environment: process.env.NODE_ENV,
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

/* ===================== GLOBAL ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error("❌ Ticket Service Error:", err.message);

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
