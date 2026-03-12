const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");

router.get("/nonce", walletController.getNonce);
router.post("/register", walletController.registerWallet);

module.exports = router;