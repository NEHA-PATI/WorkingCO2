const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");

const app = express();

/* =======================================
   TRUST PROXY (IMPORTANT FOR EC2)
======================================= */
app.set("trust proxy", 1);

/* =======================================
   SECURITY
======================================= */
app.use(helmet());

/* =======================================
   CORS CONFIG (PRODUCTION SAFE)
======================================= */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/* =======================================
   BODY PARSER
======================================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =======================================
   LOGGING
======================================= */
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

/* =======================================
   ROUTES
======================================= */
app.use("/api/contact", contactRoutes);

/* =======================================
   HEALTH CHECK
======================================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "contact-service",
    status: "ok",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* =======================================
   404
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

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`
================================
📨 Contact Service Started
================================
Port: ${PORT}
Environment: ${process.env.NODE_ENV}
================================
`);
});
