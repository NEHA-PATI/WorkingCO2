const TransactionModel = require('../models/transactionModel');
const EVModel = require('../models/evModel');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class TransactionController {
  /**
   * Create EV Transaction
   * POST /api/evtransaction
   */
  static async createTransaction(req, res) {
    try {
      const { ev_id, active_distance } = req.body;

      // Validate required fields
      if (!ev_id || !active_distance) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: ev_id, active_distance'
        });
      }

      // Validate active_distance is positive
      if (active_distance <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Active distance must be greater than 0'
        });
      }

      // Check if EV exists
      const ev = await EVModel.getById(ev_id);
      if (!ev) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      // Create transaction
      const newTransaction = await TransactionModel.createEVTransaction(req.body);

      logger.info(`Transaction created for EV ${ev_id}`, { 
        tran_id: newTransaction.ev_tran_id,
        distance: active_distance 
      });

      res.status(201).json({
        status: 'success',
        message: 'Transaction created successfully',
        data: newTransaction
      });
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create transaction',
        error: error.message
      });
    }
  }

  /**
   * Get all transactions for an EV
   * GET /api/by-ev/:evId
   */
  static async getTransactionsByEV(req, res) {
    try {
      const { evId } = req.params;

      if (!evId) {
        return res.status(400).json({
          status: 'error',
          message: 'EV ID is required'
        });
      }

      // Check if EV exists
      const ev = await EVModel.getById(evId);
      if (!ev) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      const transactions = await TransactionModel.getByEvId(evId);
      const totalDistance = await TransactionModel.getTotalDistance(evId);

      res.status(200).json({
        status: 'success',
        message: 'Transactions retrieved successfully',
        count: transactions.length,
        totalDistance: totalDistance,
        data: transactions
      });
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch transactions',
        error: error.message
      });
    }
  }

  /**
   * Get single transaction by ID
   * GET /api/evtransaction/:tranId
   */
  static async getTransactionById(req, res) {
    try {
      const { tranId } = req.params;

      const transaction = await TransactionModel.getById(tranId);

      if (!transaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Transaction retrieved successfully',
        data: transaction
      });
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch transaction',
        error: error.message
      });
    }
  }

  /**
   * Delete transaction
   * DELETE /api/evtransaction/:tranId
   */
  static async deleteTransaction(req, res) {
    try {
      const { tranId } = req.params;

      const deletedTransaction = await TransactionModel.delete(tranId);

      if (!deletedTransaction) {
        return res.status(404).json({
          status: 'error',
          message: 'Transaction not found'
        });
      }

      logger.info(`Transaction deleted: ${tranId}`);

      res.status(200).json({
        status: 'success',
        message: 'Transaction deleted successfully',
        data: deletedTransaction
      });
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete transaction',
        error: error.message
      });
    }
  }
}

module.exports = TransactionController;
