const router = require("express").Router();
const controller = require("../controllers/passwordController");

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;
