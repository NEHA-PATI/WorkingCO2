const router = require("express").Router();
const controller = require("./profile.controller");

router.post("/complete", controller.createCompleteProfile);

module.exports = router;
