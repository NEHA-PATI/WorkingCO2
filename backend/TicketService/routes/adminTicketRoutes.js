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
router.get("/", getAllTickets);
router.get("/:ticket_id", getTicketById);
router.put("/:ticket_id", updateTicket);
router.delete("/:ticket_id", deleteTicket);



module.exports = router;
