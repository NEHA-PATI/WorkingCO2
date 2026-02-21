const express = require("express");
const router = express.Router();
const PlantationController = require("../controllers/plantationController");

router.post("/", PlantationController.createPlantation);
router.get("/org/:org_id", PlantationController.getByOrgId);
router.get("/:p_id", PlantationController.getById);

module.exports = router;
