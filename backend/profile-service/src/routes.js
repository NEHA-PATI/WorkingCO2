const router = require("express").Router();

router.use("/profiles", require("./modules/profile/profile.routes"));
router.use("/addresses", require("./modules/address/address.routes"));

module.exports = router;
