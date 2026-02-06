const express = require("express");
const router = express.Router();

const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket
} = require("../controllers/adminTicketController");

const { verifyUser } = require("../middleware/ticketMiddleware");

router.post("/", verifyUser, createTicket);
router.get("/", verifyUser, getAllTickets);
router.get("/:ticket_id", verifyUser, getTicketById);
router.put("/:ticket_id", verifyUser, updateTicket);
router.delete("/:ticket_id", verifyUser, deleteTicket);



module.exports = router;
