const rateLimit = require("express-rate-limit");
const config = require("../config/env");

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes
  max: config.rateLimit.maxRequests, // 100 requests per window
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      status: "error",
      message: "Too many requests. Please try again later.",
      retryAfter: req.rateLimit.resetTime,
    });
  },
});

/**
 * Strict rate limiter for auth/sensitive operations
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    status: "error",
    message: "Too many attempts. Please try again later.",
  },
  skipSuccessfulRequests: false,
});

/**
 * File upload rate limiter
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    status: "error",
    message: "Upload limit reached. Please try again later.",
  },
});

/**
 * Create asset rate limiter
 */
const createAssetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 creates per 15 minutes
  message: {
    status: "error",
    message: "Too many assets created. Please slow down.",
  },
});

module.exports = {
  apiLimiter,
  strictLimiter,
  uploadLimiter,
  createAssetLimiter,
};
