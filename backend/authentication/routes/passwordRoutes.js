const router = require("express").Router();
const controller = require("../controllers/passwordController");

router.post("/forgot-password", controller.forgotPassword);
// Support both legacy and current reset endpoints
router.post("/reset/:token", controller.resetPassword);
router.post("/reset-password/:token", controller.resetPassword);

module.exports = router;
