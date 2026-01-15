const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    const htmlContent = `
      <div style="font-family:Arial, sans-serif; padding:20px;">
        <h2>Your OTP Code</h2>
        <p>Hello 👋,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h3 style="color:#2b6cb0;">${otp}</h3>
        <p>This code will expire in 10 minutes.</p>
        <br/>
        <p>— The Team</p>
      </div>
    `;

    const response = await resend.emails.send({
  from: "Soumik <onboarding@resend.dev>", // ✅ use this directly for testing
  to: "soumikbasu2003@gmail.com",         // ✅ send only to your own email
  subject: "Your OTP Code",
  html: htmlContent,
});
    console.log("✅ OTP sent successfully:", response);
  } catch (error) {
    console.error("❌ Failed to send OTP:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendOTP;

