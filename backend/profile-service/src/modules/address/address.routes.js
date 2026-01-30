const router = require("express").Router();
const controller = require("./address.controller");

router.post("/", controller.addAddress);
router.get("/", controller.getAddresses);
router.delete("/:addressId", controller.deleteAddress);

module.exports = router;
