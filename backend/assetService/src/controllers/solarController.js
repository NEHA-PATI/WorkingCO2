const SolarModel = require('../models/solarModel');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

class SolarController {
  /**
   * Create new Solar Panel
   * POST /api/solarpanel
   */
  static async createSolar(req, res) {
    try {
      const {
        U_ID,
        Installed_Capacity,
        Installation_Date,
        Energy_Generation_Value,
        Grid_Emission_Factor,
        Inverter_Type
      } = req.body;

      // Validate required fields
      if (!U_ID || !Installed_Capacity || !Installation_Date) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: U_ID, Installed_Capacity, Installation_Date',
          data: null
        });
      }

      // Create Solar Panel
      const newSolar = await SolarModel.create(req.body);

      // Get total count for user
      const solarCount = await SolarModel.getCountByUser(U_ID);

      logger.info(`Solar Panel created successfully for user ${U_ID}`, { suid: newSolar.suid });

      res.status(201).json({
        success: true,
        message: 'Solar Panel created successfully',
        data: {
          solar: newSolar,
          solarCount: solarCount
        }
      });
    } catch (error) {
      logger.error('Error creating Solar Panel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create Solar Panel',
        data: { error: error.message }
      });
    }
  }

  /**
   * Get all Solar Panels for a user
   * GET /api/solarpanel/:userId
   */
  static async getSolarByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required',
          data: null
        });
      }

      const solarPanels = await SolarModel.getByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Solar Panels retrieved successfully',
        data: solarPanels
      });
    } catch (error) {
      logger.error('Error fetching Solar Panels:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Solar Panels',
        data: { error: error.message }
      });
    }
  }

  /**
   * Get single Solar Panel by ID
   * GET /api/solarpanel/single/:suid
   */
  static async getSolarById(req, res) {
    try {
      const { suid } = req.params;

      const solar = await SolarModel.getById(suid);

      if (!solar) {
        return res.status(404).json({
          success: false,
          message: 'Solar Panel not found',
          data: null
        });
      }

      res.status(200).json({
        success: true,
        message: 'Solar Panel retrieved successfully',
        data: solar
      });
    } catch (error) {
      logger.error('Error fetching Solar Panel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Solar Panel',
        data: { error: error.message }
      });
    }
  }

  /**
   * Update Solar Panel
   * PUT /api/solarpanel/:suid
   */
  static async updateSolar(req, res) {
    try {
      const { suid } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated
      delete updateData.suid;
      delete updateData.s_uid;
      delete updateData.u_id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
          data: null
        });
      }

      // Check if Solar Panel exists
      const existingSolar = await SolarModel.getById(suid);
      if (!existingSolar) {
        return res.status(404).json({
          success: false,
          message: 'Solar Panel not found',
          data: null
        });
      }

      // Update Solar Panel
      const updatedSolar = await SolarModel.update(suid, updateData);

      logger.info(`Solar Panel updated successfully: ${suid}`);

      res.status(200).json({
        success: true,
        message: 'Solar Panel updated successfully',
        data: updatedSolar
      });
    } catch (error) {
      logger.error('Error updating Solar Panel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update Solar Panel',
        data: { error: error.message }
      });
    }
  }

  /**
   * Delete Solar Panel
   * DELETE /api/solarpanel/:suid
   */
  static async deleteSolar(req, res) {
    try {
      const { suid } = req.params;

      const deletedSolar = await SolarModel.delete(suid);

      if (!deletedSolar) {
        return res.status(404).json({
          success: false,
          message: 'Solar Panel not found',
          data: null
        });
      }

      logger.info(`Solar Panel deleted successfully: ${suid}`);

      res.status(200).json({
        success: true,
        message: 'Solar Panel deleted successfully',
        data: deletedSolar
      });
    } catch (error) {
      logger.error('Error deleting Solar Panel:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete Solar Panel',
        data: { error: error.message }
      });
    }
  }

  /**
   * Update Solar Panel status
   * PATCH /api/solarpanel/:suid/status
   */
  static async updateSolarStatus(req, res) {
    try {
      const { suid } = req.params;
      const { status, changed_by, reason } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
          data: null
        });
      }

      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
          data: null
        });
      }

      const updatedSolar = await SolarModel.updateStatus(suid, status, changed_by, reason);

      if (!updatedSolar) {
        return res.status(404).json({
          success: false,
          message: 'Solar Panel not found',
          data: null
        });
      }

      logger.info(`Solar Panel status updated: ${suid} -> ${status}`);

      res.status(200).json({
        success: true,
        message: 'Solar Panel status updated successfully',
        data: updatedSolar
      });
    } catch (error) {
      logger.error('Error updating Solar Panel status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update Solar Panel status',
        data: { error: error.message }
      });
    }
  }
}

module.exports = SolarController;
