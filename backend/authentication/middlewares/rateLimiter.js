const rateLimit = require("express-rate-limit");

/**
 * Basic rate limiter with sensible defaults
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

module.exports = rateLimiter;
