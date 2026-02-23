const express = require("express");
const router = express.Router();
const FleetController = require("../controllers/fleetController");

router.post("/", FleetController.createFleet);
router.get("/all", FleetController.getAll);
router.get("/org/:org_id", FleetController.getByOrgId);
router.get("/:ev_input_id", FleetController.getById);
router.put("/:ev_input_id", FleetController.updateFleet);
router.delete("/:ev_input_id", FleetController.deleteFleet);

module.exports = router;
