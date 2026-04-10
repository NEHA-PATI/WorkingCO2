const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const verifyToken = require("../middlewares/verifyToken");
const requireOrg = require("../middlewares/requireOrg");
const allowRoles = require("../middlewares/allowRoles");

// Apply auth
router.use(verifyToken);

/**
 * 🏢 Org Dashboard
 * GET /api/org/dashboard
 */
router.get("/dashboard", requireOrg, async (req, res) => {
  try {
    res.json({
      message: "Org Dashboard",
      org_id: req.user.org_id,
      role: req.user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard" });
  }
});

/**
 * 👥 Get all users in organization
 * GET /api/org/users
 */
router.get("/users", requireOrg, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, r.role_name
       FROM organization_users ou
       JOIN users u ON ou.user_id = u.id
       JOIN roles r ON ou.role_id = r.id
       WHERE ou.organization_id = $1`,
      [req.user.org_id]
    );

    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * ➕ Add user to organization (Admin only)
 * POST /api/org/add-user
 */
router.post(
  "/add-user",
  requireOrg,
  allowRoles("org_admin"),
  async (req, res) => {
    const { email, role } = req.body;

    try {
      // find user
      const userRes = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (userRes.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId = userRes.rows[0].id;

      // get role id
      const roleRes = await pool.query(
        `SELECT id FROM roles WHERE role_name = $1`,
        [role]
      );

      if (roleRes.rows.length === 0) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const roleId = roleRes.rows[0].id;

      // insert
      await pool.query(
        `INSERT INTO organization_users (organization_id, user_id, role_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [req.user.org_id, userId, roleId]
      );

      res.json({ message: "User added to organization" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to add user" });
    }
  }
);

/**
 * ❌ Remove user from organization
 * DELETE /api/org/remove-user/:userId
 */
router.delete(
  "/remove-user/:userId",
  requireOrg,
  allowRoles("org_admin"),
  async (req, res) => {
    const { userId } = req.params;

    try {
      await pool.query(
        `DELETE FROM organization_users
         WHERE organization_id = $1 AND user_id = $2`,
        [req.user.org_id, userId]
      );

      res.json({ message: "User removed from organization" });
    } catch (err) {
      res.status(500).json({ message: "Failed to remove user" });
    }
  }
);

/**
 * 🔄 Update user role
 * PATCH /api/org/update-role
 */
router.patch(
  "/update-role",
  requireOrg,
  allowRoles("org_admin"),
  async (req, res) => {
    const { userId, role } = req.body;

    try {
      const roleRes = await pool.query(
        `SELECT id FROM roles WHERE role_name = $1`,
        [role]
      );

      if (roleRes.rows.length === 0) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const roleId = roleRes.rows[0].id;

      await pool.query(
        `UPDATE organization_users
         SET role_id = $1
         WHERE organization_id = $2 AND user_id = $3`,
        [roleId, req.user.org_id, userId]
      );

      res.json({ message: "Role updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update role" });
    }
  }
);

module.exports = router;