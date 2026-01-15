const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const { validateUserId, logUserAction } = require("../middleware/auth");
const { validateTransactionCreate } = require("../middleware/validator");

// Create EV Transaction - FIXED: Added validation
router.post(
  "/evtransaction",
  validateTransactionCreate,
  validateUserId,
  logUserAction("CREATE_EV_TRANSACTION"),
  TransactionController.createTransaction
);

// Get all transactions for an EV
router.get(
  "/by-ev/:evId",
  logUserAction("GET_EV_TRANSACTIONS"),
  TransactionController.getTransactionsByEV
);

// Get single transaction by ID
router.get(
  "/evtransaction/:tranId",
  logUserAction("GET_TRANSACTION_DETAILS"),
  TransactionController.getTransactionById
);

// Delete transaction
router.delete(
  "/evtransaction/:tranId",
  validateUserId,
  logUserAction("DELETE_TRANSACTION"),
  TransactionController.deleteTransaction
);

module.exports = router;
