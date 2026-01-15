const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // make sure this is the app password (no spaces)
  },
});

// verify connection configuration on startup
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Mailer verify failed:", err);
  } else {
    console.log("✅ Mailer ready to send emails");
  }
});

module.exports = transporter;
