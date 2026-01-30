const router = require("express").Router();
const controller = require("./profile.controller");

router.post("/complete", controller.createCompleteProfile);
router.get("/complete", controller.getCompleteProfile); // ✅ ADD THIS

module.exports = router;
