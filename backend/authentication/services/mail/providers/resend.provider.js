const { Resend } = require("resend");

const sendViaResend = async ({ to, subject, html }) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Resend mail error:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendViaResend;
