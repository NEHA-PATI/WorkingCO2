const express = require("express");
const router = express.Router();
const CarbonCaptureController = require("../controllers/carbonCaptureController");

router.post("/", CarbonCaptureController.createCarbonCapture);
router.get("/all", CarbonCaptureController.getAll);
router.get("/org/:org_id", CarbonCaptureController.getByOrgId);
router.get("/:capture_id", CarbonCaptureController.getById);
router.put("/:capture_id", CarbonCaptureController.updateCarbonCapture);
router.delete("/:capture_id", CarbonCaptureController.deleteCarbonCapture);

module.exports = router;
