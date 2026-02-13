const resetTemplate = ({ resetLink }) => `
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

module.exports = resetTemplate;
