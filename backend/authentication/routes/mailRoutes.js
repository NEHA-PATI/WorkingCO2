const express = require("express");
const { sendMail, MAIL_TYPES } = require("../services/mail");

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

    await sendMail({
      type: MAIL_TYPES.OTP,
      to: email,
      data: { otp },
    });

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
