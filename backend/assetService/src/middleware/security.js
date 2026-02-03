const helmet = require("helmet");
const cors = require("cors");
const config = require("../config/env");

/**
 * CORS configuration
 */
const corsOptions = {
  origin: function (origin, callback) {
    // allow non-browser tools (Thunder, Postman)
    if (!origin) return callback(null, true);

    // allow all localhost ports (3000, 3001, etc.)
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1")
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

/**
 * Request sanitization
 */
const sanitizeRequest = (req, res, next) => {
  // Skip sanitization for multipart/form-data (file uploads)
  // Multer will handle these requests
  if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
    return next();
  }

  // Remove any null bytes from strings
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

  // Only sanitize if body exists and is not a file upload
  if (req.body && typeof req.body === 'object') {
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
