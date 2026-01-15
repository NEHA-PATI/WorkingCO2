const EVModel = require('../models/evModel');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class EVController {
  /**
   * Create new EV
   * POST /api/evmasterdata
   */
  static async createEV(req, res) {
    try {
      const {
        U_ID,
        Category,
        Manufacturers,
        Model,
        Purchase_Year,
        Energy_Consumed,
        Primary_Charging_Type,
        Range,
        Grid_Emission_Factor,
        Top_Speed,
        Charging_Time,
        Motor_Power
      } = req.body;

      // Validate required fields
      if (!U_ID || !Manufacturers || !Model || !Purchase_Year || !Range) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: U_ID, Manufacturers, Model, Purchase_Year, Range'
        });
      }

      // Create EV
      const newEV = await EVModel.create(req.body);

      // Get total count for user
      const evCount = await EVModel.getCountByUser(U_ID);

      logger.info(`EV created successfully for user ${U_ID}`, { ev_id: newEV.ev_id });

      res.status(201).json({
        status: 'success',
        message: 'EV created successfully',
        data: newEV,
        evCount: evCount
      });
    } catch (error) {
      logger.error('Error creating EV:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to create EV',
        error: error.message
      });
    }
  }

  /**
   * Get all EVs for a user
   * GET /api/evmasterdata/:userId
   */
  static async getEVsByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          status: 'error',
          message: 'User ID is required'
        });
      }

      const evs = await EVModel.getByUserId(userId);

      res.status(200).json({
        status: 'success',
        message: 'EVs retrieved successfully',
        count: evs.length,
        data: evs
      });
    } catch (error) {
      logger.error('Error fetching EVs:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch EVs',
        error: error.message
      });
    }
  }

  /**
   * Get single EV by ID
   * GET /api/evmasterdata/single/:ev_id
   */
  static async getEVById(req, res) {
    try {
      const { ev_id } = req.params;

      const ev = await EVModel.getById(ev_id);

      if (!ev) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'EV retrieved successfully',
        data: ev
      });
    } catch (error) {
      logger.error('Error fetching EV:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch EV',
        error: error.message
      });
    }
  }

  /**
   * Update EV
   * PUT /api/evmasterdata/:ev_id
   */
  static async updateEV(req, res) {
    try {
      const { ev_id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated
      delete updateData.ev_id;
      delete updateData.vuid;
      delete updateData.u_id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'No valid fields to update'
        });
      }

      // Check if EV exists
      const existingEV = await EVModel.getById(ev_id);
      if (!existingEV) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      // Update EV
      const updatedEV = await EVModel.update(ev_id, updateData);

      logger.info(`EV updated successfully: ${ev_id}`);

      res.status(200).json({
        status: 'success',
        message: 'EV updated successfully',
        data: updatedEV
      });
    } catch (error) {
      logger.error('Error updating EV:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update EV',
        error: error.message
      });
    }
  }

  /**
   * Delete EV
   * DELETE /api/evmasterdata/:ev_id
   */
  static async deleteEV(req, res) {
    try {
      const { ev_id } = req.params;

      const deletedEV = await EVModel.delete(ev_id);

      if (!deletedEV) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      logger.info(`EV deleted successfully: ${ev_id}`);

      res.status(200).json({
        status: 'success',
        message: 'EV deleted successfully',
        data: deletedEV
      });
    } catch (error) {
      logger.error('Error deleting EV:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to delete EV',
        error: error.message
      });
    }
  }

  /**
   * Update EV status
   * PATCH /api/evmasterdata/:ev_id/status
   */
  static async updateEVStatus(req, res) {
    try {
      const { ev_id } = req.params;
      const { status, changed_by, reason } = req.body;

      if (!status) {
        return res.status(400).json({
          status: 'error',
          message: 'Status is required'
        });
      }

      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const updatedEV = await EVModel.updateStatus(ev_id, status, changed_by, reason);

      if (!updatedEV) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      logger.info(`EV status updated: ${ev_id} -> ${status}`);

      res.status(200).json({
        status: 'success',
        message: 'EV status updated successfully',
        data: updatedEV
      });
    } catch (error) {
      logger.error('Error updating EV status:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update EV status',
        error: error.message
      });
    }
  }
}

module.exports = EVController;
