const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  sendOrgEmailOtp,
  verifyOrgEmailOtp
} = require("../controllers/orgEmailOtpController");

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many OTP requests. Please try again later." }
});

router.post("/send", otpLimiter, sendOrgEmailOtp);
router.post("/verify", otpLimiter, verifyOrgEmailOtp);

module.exports = router;
