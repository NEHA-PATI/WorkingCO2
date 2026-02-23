const bcrypt = require("bcryptjs");
const { transaction } = require("../config/database");
const orgApprovalRepository = require("../repositories/orgApproval.repository");
const { sendEmail, EMAIL_TYPES } = require("./email");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const approveOrganization = async ({ org_request_id, email, password }) => {
  const normalizedRequestId = String(org_request_id || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  if (!normalizedRequestId) {
    throw new AppError("org_request_id is required", 400);
  }
  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    throw new AppError("Valid email is required", 400);
  }
  if (!normalizedPassword || normalizedPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const result = await transaction(async (client) => {
    const orgRequest = await orgApprovalRepository.getOrgRequestById(client, normalizedRequestId, true);

    if (!orgRequest) {
      throw new AppError("Organization request not found", 404);
    }

    if (orgRequest.request_status !== "pending") {
      throw new AppError(`Request already ${orgRequest.request_status}`, 409);
    }

    const existingOrg = await orgApprovalRepository.findOrganizationByRequestIdOrEmail(
      client,
      normalizedRequestId,
      normalizedEmail
    );
    if (existingOrg) {
      throw new AppError("Organization already exists for this request/email", 409);
    }

    const passwordHash = await bcrypt.hash(normalizedPassword, 12);
    const orgId = await orgApprovalRepository.generateNextOrgId(client);

    const createdOrganization = await orgApprovalRepository.createOrganization(client, {
      orgId,
      orgRequestId: normalizedRequestId,
      orgMail: normalizedEmail,
      passwordHash,
      orgName: orgRequest.org_name,
      orgType: orgRequest.org_type,
      orgContactNumber: orgRequest.org_contact_number,
      orgContactPerson: orgRequest.org_contact_person,
      orgDesignation: orgRequest.org_designation,
      orgCountry: orgRequest.org_country,
      orgState: orgRequest.org_state,
      orgCity: orgRequest.org_city,
    });

    const loginLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/login`;

    await sendEmail({
      type: EMAIL_TYPES.ORGANIZATION_APPROVED,
      to: normalizedEmail,
      data: {
        orgName: orgRequest.org_name,
        loginEmail: normalizedEmail,
        password: normalizedPassword,
        loginLink,
      },
    });

    await orgApprovalRepository.updateRequestStatus(client, normalizedRequestId, "approved");

    return {
      org_id: createdOrganization.org_id,
      org_request_id: createdOrganization.org_request_id,
      org_mail: createdOrganization.org_mail,
      org_name: createdOrganization.org_name,
    };
  });

  return result;
};

const rejectOrganization = async ({ org_request_id, reason }) => {
  const normalizedRequestId = String(org_request_id || "").trim();
  const normalizedReason = String(reason || "").trim();

  if (!normalizedRequestId) {
    throw new AppError("org_request_id is required", 400);
  }
  if (!normalizedReason) {
    throw new AppError("Rejection reason is required", 400);
  }

  const result = await transaction(async (client) => {
    const orgRequest = await orgApprovalRepository.getOrgRequestById(client, normalizedRequestId, true);

    if (!orgRequest) {
      throw new AppError("Organization request not found", 404);
    }

    if (orgRequest.request_status !== "pending") {
      throw new AppError(`Request already ${orgRequest.request_status}`, 409);
    }

    await orgApprovalRepository.updateRequestStatus(client, normalizedRequestId, "rejected");

    await sendEmail({
      type: EMAIL_TYPES.ORGANIZATION_REJECTED,
      to: orgRequest.org_mail,
      data: {
        orgName: orgRequest.org_name,
        reason: normalizedReason,
      },
    });

    return {
      org_request_id: normalizedRequestId,
      request_status: "rejected",
      reason: normalizedReason,
    };
  });

  return result;
};

module.exports = {
  approveOrganization,
  rejectOrganization,
  AppError,
};
