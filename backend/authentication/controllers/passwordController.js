const passwordService = require("../services/password.service");

exports.forgotPassword = async (req, res) => {
  await passwordService.forgotPassword(req.body.type, req.body.value);
  res.json({ message: "If user exists, reset instructions sent." });
};

exports.resetPassword = async (req, res) => {
  await passwordService.resetPassword(req.body.token, req.body.password);
  res.json({ message: "Password updated successfully" });
};
