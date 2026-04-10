const pool = require("../config/database");

const getAllUsers = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.u_id,
        u.username,
        u.email,
        COALESCE(
          (
            SELECT r.role_name
            FROM user_roles ur
            JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id
            ORDER BY CASE
              WHEN r.role_name = 'platform_admin' THEN 1
              WHEN r.role_name = 'marketplace_only' THEN 2
              ELSE 99
            END,
            ur.created_at DESC
            LIMIT 1
          ),
          (
            SELECT r.role_name
            FROM organization_users ou
            JOIN organizations o ON o.org_id = ou.organization_id
            JOIN roles r ON r.id = ou.role_id
            WHERE ou.user_id = u.id
              AND COALESCE(ou.status, 'active') = 'active'
            ORDER BY CASE
              WHEN r.role_name = 'org_admin' THEN 1
              WHEN r.role_name = 'org_member' THEN 2
              ELSE 99
            END,
            ou.created_at DESC
            LIMIT 1
          ),
          'user'
        ) AS role_name,
        COALESCE(
          (
            SELECT o.org_name
            FROM organization_users ou
            JOIN organizations o ON o.org_id = ou.organization_id
            WHERE ou.user_id = u.id
              AND COALESCE(ou.status, 'active') = 'active'
            ORDER BY CASE
              WHEN ou.role_id = 4 THEN 1
              WHEN ou.role_id = 5 THEN 2
              ELSE 99
            END,
            ou.created_at DESC
            LIMIT 1
          ),
          (
            SELECT o.org_name
            FROM organization_users ou
            JOIN organizations o ON o.org_id = ou.organization_id
            WHERE ou.user_id = u.id
              AND COALESCE(ou.status, 'active') = 'active'
            ORDER BY ou.created_at DESC
            LIMIT 1
          )
        ) AS organization_name,
        u.is_email_verified AS verified,
        created_at,
        updated_at,
        login_attempts,
        lock_until,
        status
      FROM users u
      ORDER BY u.created_at DESC
    `);

    return result.rows;

  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers
};
