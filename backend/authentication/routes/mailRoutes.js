const express = require("express");
const sendOTP = require("../../authentication/utils/sendOTP");

const router = express.Router();

// Send OTP Email
router.post("/send-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = await sendOTP(email, otp);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json({
      success: true,
      message: "OTP email sent successfully",
    });

  } catch (error) {
    console.error("Send OTP Route Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

module.exports = router;
