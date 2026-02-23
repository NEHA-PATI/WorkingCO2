const EMAIL_TYPES = require("./email.types");
const sendViaGraph = require("./providers/graph.provider");
const orgApprovedTemplate = require("./templates/orgApproved.template");
const orgRejectedTemplate = require("./templates/orgRejected.template");

const buildPayload = ({ type, data }) => {
  if (type === EMAIL_TYPES.ORGANIZATION_APPROVED) {
    return {
      subject: "Your Organization Account Is Approved",
      html: orgApprovedTemplate(data || {}),
    };
  }

  if (type === EMAIL_TYPES.ORGANIZATION_REJECTED) {
    return {
      subject: "Organization Request Rejected",
      html: orgRejectedTemplate(data || {}),
    };
  }

  throw new Error(`Unsupported email type: ${type}`);
};

const sendEmail = async ({ type, to, data }) => {
  if (!type) throw new Error("Email type is required");
  if (!to) throw new Error("Recipient email is required");
  if (!process.env.TENANT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.MAILBOX) {
    throw new Error("Microsoft Graph mail configuration is missing");
  }

  const { subject, html } = buildPayload({ type, data });
  await sendViaGraph({ to, subject, html });
};

module.exports = {
  sendEmail,
  EMAIL_TYPES,
};
