const passwordService = require("../services/password.service");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required",
      data: null,
    });
  }

  try {
    await passwordService.forgotPassword(email);
    res.json({
      success: true,
      message: "If the email exists, reset link sent.",
      data: null,
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      data: null,
    });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.params.token || req.body.token;
  const newPassword = req.body.newPassword || req.body.password;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Token and password required",
      data: null,
    });
  }

  try {
    await passwordService.resetPassword(token, newPassword);
    res.json({
      success: true,
      message: "Password reset successful",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.toString(),
      data: null,
    });
  }
};
