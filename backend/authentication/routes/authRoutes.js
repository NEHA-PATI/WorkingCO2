const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// OTP / local auth
router.post("/register", authController.register);
router.post("/verify", authController.verifyOTP);
router.post("/login", authController.login);
// router.post("/resend-otp", authController.resendOTP);

// (future – we will plug these next)
// router.use("/password", require("./passwordRoutes"));
// router.use("/oauth", require("./oauthRoutes"));

module.exports = router;
