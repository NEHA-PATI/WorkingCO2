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

/* ===================== TRUST PROXY (IMPORTANT FOR AWS) ===================== */
app.set("trust proxy", 1);

/* ===================== SECURITY ===================== */
app.use(helmet());

/* ===================== LOGGING ===================== */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* ===================== BODY ===================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===================== CORS (PRODUCTION SAFE) ===================== */
const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const allowedOrigins = [...new Set(envOrigins)];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log(`❌ CORS blocked: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-org-id"],
};

app.use(cors(corsOptions));

// ✅ FIXED (Express v5 safe)
//app.options("/*", cors(corsOptions));

/* ===================== RATE LIMIT ===================== */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* ===================== ROOT ===================== */
app.get("/", (req, res) => {
  res.send("🎫 Ticket Service Running");
});

/* ===================== HEALTH ===================== */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "ticket-service",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* ===================== ROUTES ===================== */
app.use("/api/v1/tickets", adminTicketRoutes);

/* ===================== 404 ===================== */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error("❌ Ticket Service Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      status: "error",
      message: "CORS error: origin not allowed",
    });
  }

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5004;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
====================================
🎫 Ticket Service Started
====================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
API: http://0.0.0.0:${PORT}/api/v1/tickets
Health: http://0.0.0.0:${PORT}/api/v1/health
====================================
`);
});

module.exports = app;