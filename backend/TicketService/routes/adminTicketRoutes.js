const express = require("express");
const router = express.Router();

const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} = require("../controllers/adminTicketController");

const { verifyToken } = require("../middleware/ticketMiddleware");

// 🔐 All routes require login
router.post("/", verifyToken, createTicket);
router.get("/", verifyToken, getAllTickets);
router.get("/:ticket_id", verifyToken, getTicketById);
router.put("/:ticket_id", verifyToken, updateTicket);
router.delete("/:ticket_id", verifyToken, deleteTicket);

module.exports = router;
