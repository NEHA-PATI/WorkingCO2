const getOrgRequestById = async (client, orgRequestId, lock = false) => {
  const lockClause = lock ? "FOR UPDATE" : "";
  const result = await client.query(
    `
      SELECT
        org_request_id,
        org_name,
        org_type,
        org_mail,
        org_contact_number,
        org_contact_person,
        org_designation,
        org_country,
        org_state,
        org_city,
        request_status
      FROM org_requests
      WHERE org_request_id = $1
      ${lockClause}
    `,
    [orgRequestId]
  );

  return result.rows[0] || null;
};

const findOrganizationByRequestIdOrEmail = async (client, orgRequestId, email) => {
  const result = await client.query(
    `
      SELECT org_id, org_request_id, org_mail
      FROM organizations
      WHERE org_request_id = $1
         OR LOWER(org_mail) = LOWER($2)
      LIMIT 1
    `,
    [orgRequestId, email]
  );

  return result.rows[0] || null;
};

const generateNextOrgId = async (client) => {
  const result = await client.query(
    `
      SELECT org_id
      FROM organizations
      WHERE org_id ~ '^ORG[0-9]+$'
      ORDER BY CAST(SUBSTRING(org_id FROM 4) AS INTEGER) DESC
      LIMIT 1
      FOR UPDATE
    `
  );

  if (result.rows.length === 0) {
    return "ORG0001";
  }

  const lastOrgId = result.rows[0].org_id;
  const numericPart = Number.parseInt(lastOrgId.replace("ORG", ""), 10) + 1;
  return `ORG${String(numericPart).padStart(4, "0")}`;
};

const createOrganization = async (client, payload) => {
  const {
    orgId,
    orgRequestId,
    orgMail,
    passwordHash,
    orgName,
    orgType,
    orgContactNumber,
    orgContactPerson,
    orgDesignation,
    orgCountry,
    orgState,
    orgCity,
  } = payload;

  const result = await client.query(
    `
      INSERT INTO organizations (
        org_id,
        org_request_id,
        org_mail,
        password_hash,
        org_name,
        org_type,
        org_contact_number,
        org_contact_person,
        org_designation,
        org_country,
        org_state,
        org_city
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING org_id, org_request_id, org_mail, org_name, created_at
    `,
    [
      orgId,
      orgRequestId,
      orgMail,
      passwordHash,
      orgName,
      orgType,
      orgContactNumber,
      orgContactPerson,
      orgDesignation,
      orgCountry,
      orgState,
      orgCity,
    ]
  );

  return result.rows[0];
};

const updateRequestStatus = async (client, orgRequestId, status) => {
  await client.query(
    `
      UPDATE org_requests
      SET request_status = $2
      WHERE org_request_id = $1
    `,
    [orgRequestId, status]
  );
};

module.exports = {
  getOrgRequestById,
  findOrganizationByRequestIdOrEmail,
  generateNextOrgId,
  createOrganization,
  updateRequestStatus,
};
