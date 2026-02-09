const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const verifyToken = require('../middlewares/verifyToken');
const allowRoles = require('../middlewares/allowRoles');

// Apply auth middleware to all routes in this router
router.use(verifyToken);

/**
 * Approve user - Set status to 'active'
 * PATCH /api/users/:userId/approve
 */
router.patch('/:userId/approve', allowRoles('admin'), async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'active', 
           updated_at = NOW() 
       WHERE id = $1 
       RETURNING id, username, email, status`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User approved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to approve user',
      error: error.message
    });
  }
});

/**
 * Reject user - Set status to 'rejected'
 * PATCH /api/users/:userId/reject
 */
router.patch('/:userId/reject', allowRoles('admin'), async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = 'rejected', 
           updated_at = NOW() 
       WHERE id = $1 
       RETURNING id, username, email, status`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Optional: Log rejection reason
    console.log(`User ${userId} rejected. Reason: ${reason}`);

    res.status(200).json({
      status: 'success',
      message: 'User rejected successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject user',
      error: error.message
    });
  }
});

/**
 * Get user by email
 * GET /api/users/email/:email
 */
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, username, email, status, role_id, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user',
      error: error.message
    });
  }
});

/**
 * Get all users (Admin only)
 * GET /api/users
 */
router.get('/', allowRoles('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, status, role_id, created_at FROM users ORDER BY created_at DESC'
    );

    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

/**
 * Update user status
 * PATCH /api/users/:userId/status
 */
router.patch('/:userId/status', allowRoles('admin'), async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'active', 'inactive', 'rejected', 'suspended'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid status. Valid values: ' + validStatuses.join(', ')
    });
  }

  try {
    const result = await pool.query(
      `UPDATE users 
       SET status = $1, 
           updated_at = NOW() 
       WHERE id = $2 
       RETURNING id, username, email, status`,
      [status, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User status updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update user status',
      error: error.message
    });
  }
});

module.exports = router;
