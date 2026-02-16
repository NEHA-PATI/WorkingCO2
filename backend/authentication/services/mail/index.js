const MAIL_TYPES = require("./mail.types");
const sendViaGraph = require("./providers/graph.provider");
const sendViaResend = require("./providers/resend.provider");
const otpTemplate = require("./templates/otp.template");
const resetTemplate = require("./templates/reset.template");
const contactTemplate = require("./templates/contact.template");

const buildPayload = ({ type, data }) => {
  switch (type) {
    case MAIL_TYPES.OTP:
      return {
        subject: "Your OTP Code",
        html: otpTemplate(data || {}),
      };
    case MAIL_TYPES.PASSWORD_RESET:
      return {
        subject: `Reset your password - ${Date.now()}`,
        html: resetTemplate(data || {}),
      };
    case MAIL_TYPES.CONTACT_ADMIN:
      return {
        subject: data?.subject || "New Contact/Admin Notification",
        html: contactTemplate(data || {}),
      };
    default:
      throw new Error(`Unsupported mail type: ${type}`);
  }
};

const resolveProvider = (type) => {
  if (type === MAIL_TYPES.OTP) return sendViaGraph;
  if (type === MAIL_TYPES.PASSWORD_RESET) return sendViaResend;
  if (type === MAIL_TYPES.CONTACT_ADMIN) return sendViaResend;
  throw new Error(`No provider configured for mail type: ${type}`);
};

const sendMail = async ({ type, to, data }) => {
  if (!type) throw new Error("Mail type is required");
  if (!to) throw new Error("Recipient email is required");

  if (
    (type === MAIL_TYPES.PASSWORD_RESET || type === MAIL_TYPES.CONTACT_ADMIN) &&
    !process.env.RESEND_API_KEY
  ) {
    throw new Error("RESEND_API_KEY is missing");
  }

  if (
    (type === MAIL_TYPES.PASSWORD_RESET || type === MAIL_TYPES.CONTACT_ADMIN) &&
    !process.env.FROM_EMAIL
  ) {
    throw new Error("FROM_EMAIL is missing");
  }

  const { subject, html } = buildPayload({ type, data });
  const provider = resolveProvider(type);
  const result = await provider({ to, subject, html });

  if (!result?.success) {
    throw new Error(result?.error || "Email delivery failed");
  }

  return result;
};

module.exports = {
  sendMail,
  MAIL_TYPES,
};
