const contactTemplate = ({ name, email, subject, message, meta }) => `
  <div style="font-family:Arial, sans-serif; padding:20px;">
    <h2>New Contact/Admin Notification</h2>
    <p><strong>Name:</strong> ${name || "N/A"}</p>
    <p><strong>Email:</strong> ${email || "N/A"}</p>
    <p><strong>Subject:</strong> ${subject || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <div style="padding:12px;border:1px solid #ddd;border-radius:6px;background:#fafafa;">
      ${message || ""}
    </div>
    ${
      meta
        ? `<p style="margin-top:16px;"><strong>Meta:</strong> ${JSON.stringify(meta)}</p>`
        : ""
    }
  </div>
`;

module.exports = contactTemplate;
