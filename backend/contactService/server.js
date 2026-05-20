const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();

/* =======================================
   TRUST PROXY (IMPORTANT FOR AWS / NGINX)
======================================= */
app.set("trust proxy", 1);

/* =======================================
   SECURITY (HELMET)
======================================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/* =======================================
   CORS CONFIG (PRODUCTION SAFE)
======================================= */
const splitCsv = (value) =>
  value
    ? value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

// Prefer explicit allow-list via `ALLOWED_ORIGINS`, but fall back to `FRONTEND_URL`
// and common local dev origins so a missing env var doesn't break preflight.
const allowedOrigins = new Set([
  ...splitCsv(process.env.ALLOWED_ORIGINS),
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / curl

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // In non-production, be permissive to reduce local dev friction.
    if (process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }

    console.log(`CORS Blocked: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =======================================
   BODY PARSER
======================================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =======================================
   RATE LIMITING (ANTI-SPAM 🔥)
======================================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

/* =======================================
   LOGGING
======================================= */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* =======================================
   ROOT ROUTE (DEBUG FRIENDLY)
======================================= */
app.get("/", (req, res) => {
  res.send("📨 Contact Service Running 🚀");
});

/* =======================================
   HEALTH CHECK (STANDARDIZED)
======================================= */
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    service: "contact-service",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* =======================================
   ROUTES
======================================= */
app.use("/api/v1/contact", contactRoutes);

/* =======================================
   404 HANDLER
======================================= */
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

/* =======================================
   GLOBAL ERROR HANDLER
======================================= */
app.use((err, req, res, next) => {
  console.error("❌ Contact Service Error:", err.message);

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

/* =======================================
   START SERVER (IMPORTANT FIX)
======================================= */
const PORT = process.env.PORT || 5005;

// 🔥 IMPORTANT: bind 0.0.0.0 for EC2 access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
================================
📨 Contact Service Started
================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
API: http://0.0.0.0:${PORT}/api/v1/contact
Health: http://0.0.0.0:${PORT}/api/v1/health
================================
`);
});
