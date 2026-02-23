const orgApprovedTemplate = ({
  orgName,
  loginEmail,
  password,
  loginLink,
}) => `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#111827;">
    <h2 style="margin-bottom:8px;">Organization Approved</h2>
    <p style="margin:0 0 16px;">Hello ${orgName}, your organization request has been approved.</p>
    <p style="margin:0 0 8px;"><strong>Login Email:</strong> ${loginEmail}</p>
    <p style="margin:0 0 8px;"><strong>Password:</strong> ${password}</p>
    <p style="margin:0 0 16px;"><strong>Login URL:</strong> <a href="${loginLink}">${loginLink}</a></p>
    <p style="margin:0;">Please change your password after first login.</p>
  </div>
`;

module.exports = orgApprovedTemplate;
