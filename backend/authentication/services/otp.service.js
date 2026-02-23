const OTP = require("../models/otpLogModel");
const { sendMail, MAIL_TYPES } = require("./mail");

exports.sendRegistrationOTP = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.create({
    user_id: user.id,
    destination: user.email,
    otp,
    purpose: "register",
    expires_at: new Date(Date.now() + 10 * 60 * 1000)
  });

  await sendMail({
    type: MAIL_TYPES.OTP,
    to: user.email,
    data: { otp },
  });
};

exports.verifyRegistrationOTP = async (email, otp) => {
  const record = await OTP.findValid(email, otp);
  if (!record) throw "Invalid or expired OTP";

  await OTP.markVerified(record.id);
  return record;
};
