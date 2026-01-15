const express = require("express");
const router = express.Router();
const StatusController = require("../controllers/statusController");
const { logUserAction } = require("../middleware/auth");

// Get status of all assets for a specific user
router.get(
  "/user/:userId/status",
  logUserAction("GET_USER_ASSET_STATUS"),
  StatusController.getUserAssetStatuses
);

module.exports = router;
