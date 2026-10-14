const helmet = require("helmet");
const cors = require("cors");
const config = require("../config/env");

/**
 * Allowed Origins
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

console.log("🌐 Allowed Origins:", allowedOrigins);

/**
 * CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {

    console.log("🌍 Incoming Origin:", origin);

    // allow non-browser tools (Postman, Thunder Client)
    if (!origin) {
      return callback(null, true);
    }

    // localhost support
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      console.log("✅ Localhost CORS allowed");
      return callback(null, true);
    }

    // production frontend support
    if (allowedOrigins.includes(origin)) {
      console.log("✅ CORS allowed:", origin);
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);

    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-user-id"
  ],
};

/**
 * Security headers configuration
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
        "https://res.cloudinary.com"
      ],
      connectSrc: [
        "'self'",
        "http://3.7.181.15:3000",
        "http://3.7.181.15:5000",
        "http://3.7.181.15:5002",
        "http://3.7.181.15:5008"
      ],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },

  crossOriginEmbedderPolicy: false,

  crossOriginResourcePolicy: {
    policy: "cross-origin"
  },
});

/**
 * Request sanitization
 */
const sanitizeRequest = (req, res, next) => {

  // Skip sanitization for multipart/form-data
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].includes("multipart/form-data")
  ) {
    return next();
  }

  const sanitize = (obj) => {

    if (typeof obj === "string") {
      return obj.replace(/\0/g, "");
    }

    if (typeof obj === "object" && obj !== null) {

      for (let key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }

    return obj;
  };

  if (req.body && typeof req.body === "object") {
    req.body = sanitize(req.body);
  }

  req.params = sanitize(req.params);
  req.query = sanitize(req.query);

  next();
};

module.exports = {
  corsOptions,
  helmetConfig,
  sanitizeRequest,
  configureCORS: () => cors(corsOptions),
  configureHelmet: () => helmetConfig,
};