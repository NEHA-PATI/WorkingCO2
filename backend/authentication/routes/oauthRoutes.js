const router = require("express").Router();
const google = require("../controllers/googleController");

router.get("/google/login", google.googleLogin);
router.get("/google/callback", google.googleCallback);

module.exports = router;
