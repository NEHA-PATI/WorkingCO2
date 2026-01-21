const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  getContactById
} = require("../controllers/contactController");

// Public
router.post("/", createContactMessage);

// Admin (auth can be added later)
router.get("/", getAllContactMessages);
router.get("/:contact_id", getContactById);

module.exports = router;