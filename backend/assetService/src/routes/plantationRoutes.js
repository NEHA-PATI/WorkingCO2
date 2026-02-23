const express = require("express");
const router = express.Router();
const PlantationController = require("../controllers/plantationController");

router.post("/", PlantationController.createPlantation);
router.get("/all", PlantationController.getAll);
router.get("/org/:org_id", PlantationController.getByOrgId);
router.put("/:p_id/status", PlantationController.updateVerificationStatus);
router.get("/:p_id", PlantationController.getById);

module.exports = router;
