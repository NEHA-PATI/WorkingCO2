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
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ===================== CORS ===================== */
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const devDefaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

const allowedOrigins = Array.from(
  new Set([
    ...envOrigins,
    ...(process.env.NODE_ENV === "production" ? [] : devDefaultOrigins)
  ])
);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server/curl/postman requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(`CORS blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

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
  console.error("Ticket Service Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS error: origin not allowed"
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  });
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`\n====================================\nTicket Service Started\n====================================\nPort: ${PORT}\nEnvironment: ${process.env.NODE_ENV || "development"}\n====================================\n`);
});

module.exports = app;
