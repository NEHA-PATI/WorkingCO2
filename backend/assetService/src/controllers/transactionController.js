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
          success: false,
          message: 'Missing required fields: ev_id, active_distance',
          data: null
        });
      }

      // Validate active_distance is positive
      if (active_distance <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Active distance must be greater than 0',
          data: null
        });
      }

      // Check if EV exists
      const ev = await EVModel.getById(ev_id);
      if (!ev) {
        return res.status(404).json({
          success: false,
          message: 'EV not found',
          data: null
        });
      }

      // Create transaction
      const newTransaction = await TransactionModel.createEVTransaction(req.body);

      logger.info(`Transaction created for EV ${ev_id}`, { 
        tran_id: newTransaction.ev_tran_id,
        distance: active_distance 
      });

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: newTransaction
      });
    } catch (error) {
      logger.error('Error creating transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create transaction',
        data: { error: error.message }
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
          success: false,
          message: 'EV ID is required',
          data: null
        });
      }

      // Check if EV exists
      const ev = await EVModel.getById(evId);
      if (!ev) {
        return res.status(404).json({
          success: false,
          message: 'EV not found',
          data: null
        });
      }

      const transactions = await TransactionModel.getByEvId(evId);
      const totalDistance = await TransactionModel.getTotalDistance(evId);

      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: {
          transactions,
          totalDistance
        }
      });
    } catch (error) {
      logger.error('Error fetching transactions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
        data: { error: error.message }
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
          success: false,
          message: 'Transaction not found',
          data: null
        });
      }

      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: transaction
      });
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transaction',
        data: { error: error.message }
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
          success: false,
          message: 'Transaction not found',
          data: null
        });
      }

      logger.info(`Transaction deleted: ${tranId}`);

      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully',
        data: deletedTransaction
      });
    } catch (error) {
      logger.error('Error deleting transaction:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete transaction',
        data: { error: error.message }
      });
    }
  }
}

module.exports = TransactionController;
