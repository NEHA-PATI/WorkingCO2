const express = require("express");
const router = express.Router();
const SolarController = require("../controllers/solarController");
const {
  validateUserId,
  verifyAssetOwnership,
  logUserAction,
} = require("../middleware/auth");
const { validateSolarCreate, validateSolarUpdate } = require("../middleware/validator");

// Create new solar panel - FIXED: Added validation
router.post(
  "/",
  validateSolarCreate,
  validateUserId,
  logUserAction("CREATE_SOLAR"),
  SolarController.createSolar
);

// Get all solar panels for a user
router.get(
  "/:userId",
  validateUserId,
  logUserAction("GET_USER_SOLAR"),
  SolarController.getSolarByUser
);

// Get single solar panel by ID
router.get(
  "/single/:suid",
  logUserAction("GET_SOLAR_DETAILS"),
  SolarController.getSolarById
);

// Update solar panel - FIXED: Added validation
router.put(
  "/:suid",
  validateSolarUpdate,
  validateUserId,
  verifyAssetOwnership("solar"),
  logUserAction("UPDATE_SOLAR"),
  SolarController.updateSolar
);

// Delete solar panel
router.delete(
  "/:suid",
  validateUserId,
  verifyAssetOwnership("solar"),
  logUserAction("DELETE_SOLAR"),
  SolarController.deleteSolar
);

// Update solar panel status
router.patch(
  "/:suid/status",
  logUserAction("UPDATE_SOLAR_STATUS"),
  SolarController.updateSolarStatus
);

module.exports = router;
