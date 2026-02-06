const { Resend } = require("resend");

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (email, resetLink) => {
  console.log("📤 SENDING RESET EMAIL");

  const html = `
    <div style="font-family:Arial; padding:20px;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <a href="${resetLink}"
         style="display:inline-block;padding:10px 16px;
                background:#2563eb;color:white;border-radius:6px;
                text-decoration:none;">
        Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
    </div>
  `;

  const result = await resend.emails.send({
    from: "Carbon Positive <onboarding@resend.dev>",
    to: "soumikbasu2003@gmail.com", // hardcoded
    subject: `Reset your password - ${Date.now()}`,
    html,
  });

  console.log("✅ RESEND RESULT:", result);
};
