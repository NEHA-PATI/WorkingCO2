const orgRejectedTemplate = ({ orgName, reason }) => `
  <div style="font-family:Arial,sans-serif;padding:20px;color:#111827;">
    <h2 style="margin-bottom:8px;">Organization Request Rejected</h2>
    <p style="margin:0 0 16px;">Hello ${orgName}, your organization request has been rejected.</p>
    <p style="margin:0;"><strong>Reason:</strong> ${reason}</p>
  </div>
`;

module.exports = orgRejectedTemplate;
