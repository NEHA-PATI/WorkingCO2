const express = require("express");
const router = express.Router();
const TreeController = require("../controllers/treeController");
const {
  validateUserId,
  verifyAssetOwnership,
  logUserAction,
} = require("../middleware/auth");
const { validateTreeCreate, validateTreeUpdate } = require("../middleware/validator");

// Create new tree - FIXED: Added validation
router.post(
  "/",
  validateTreeCreate,
  validateUserId,
  logUserAction("CREATE_TREE"),
  TreeController.createTree
);

// Get all trees for a user
router.get(
  "/:userId",
  validateUserId,
  logUserAction("GET_USER_TREES"),
  TreeController.getTreesByUser
);

// Get single tree by ID
router.get(
  "/single/:tid",
  logUserAction("GET_TREE_DETAILS"),
  TreeController.getTreeById
);

// Update tree - FIXED: Added validation
router.put(
  "/:tid",
  validateTreeUpdate,
  validateUserId,
  verifyAssetOwnership("tree"),
  logUserAction("UPDATE_TREE"),
  TreeController.updateTree
);

// Delete tree
router.delete(
  "/:tid",
  validateUserId,
  verifyAssetOwnership("tree"),
  logUserAction("DELETE_TREE"),
  TreeController.deleteTree
);

// Update tree status
router.patch(
  "/:tid/status",
  logUserAction("UPDATE_TREE_STATUS"),
  TreeController.updateTreeStatus
);

module.exports = router;
