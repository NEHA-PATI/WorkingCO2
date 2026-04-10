const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const verifyToken = require("../middlewares/verifyToken");
const allowRoles = require("../middlewares/allowRoles");

// Apply auth middleware globally
router.use(verifyToken);

/**
 * 🛠️ ADMIN ONLY middleware (clean)
 */
const requireAdmin = (req, res, next) => {
  const role = String(req.user?.role || "").toLowerCase();
  const context = String(req.user?.context || "").toLowerCase();
  const isAdmin =
    context === "admin" ||
    ["admin", "platform_admin", "super_admin", "superadmin"].includes(role);

  if (!isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

/**
 * ✅ Approve User
 * PATCH /api/users/:userId/approve
 */
router.patch("/:userId/approve", requireAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'active', updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, status`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User approved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

/**
 * ❌ Reject User
 */
router.patch("/:userId/reject", requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'rejected', updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, email, status`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`User ${userId} rejected. Reason: ${reason}`);

    res.json({
      message: "User rejected successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reject user" });
  }
});

/**
 * 👤 Get User by Email
 */
router.get("/email/:email", requireAdmin, async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, username, email, status, created_at 
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

/**
 * 📋 Get All Users (Admin)
 */
router.get("/", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, status, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );

    res.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * 🔄 Update User Status
 */
router.patch("/:userId/status", requireAdmin, async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "active",
    "inactive",
    "rejected",
    "suspended",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, username, email, status`,
      [status, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User status updated",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
