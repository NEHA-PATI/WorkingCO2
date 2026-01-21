const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (email, resetLink) => {
  const html = `
    <div style="font-family:Arial; padding:20px;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password.</p>
      <p>Click the button below to continue:</p>
      <a href="${resetLink}" 
         style="display:inline-block;padding:10px 16px;
                background:#2563eb;color:white;border-radius:6px;
                text-decoration:none;">
         Reset Password
      </a>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;

  await resend.emails.send({
    from: "Carbon Positive <onboarding@resend.dev>",
    to: "soumikbasu2003@gmail.com",
    subject: "Reset your password",
    html
  });
};
