const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
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

  await resend.emails.send({
    from: "Carbon Positive <onboarding@resend.dev>",
    to: "soumikbasu2003@gmail.com",        // ✅ Hardcoded now 
    subject: "Your OTP Code",
    html: htmlContent,
  });
};

module.exports = sendOTP;
