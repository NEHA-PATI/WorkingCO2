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
      // ✅ MAP PascalCase frontend fields to lowercase snake_case for database
      const {
        U_ID,           // Frontend sends PascalCase
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

      // Also check for lowercase versions (backward compatibility)
      const u_id = U_ID || req.body.u_id;
      const category = Category || req.body.category || null;
      const manufacturers = Manufacturers || req.body.manufacturers || null;
      const model = Model || req.body.model || null;
      
      // Safe integer conversion - only convert if value exists, otherwise null
      const purchase_year = (Purchase_Year !== undefined && Purchase_Year !== null && Purchase_Year !== '') 
        ? parseInt(Purchase_Year) 
        : (req.body.purchase_year !== undefined && req.body.purchase_year !== null && req.body.purchase_year !== '')
          ? parseInt(req.body.purchase_year)
          : null;
      
      // Safe float conversion
      const energy_consumed = (Energy_Consumed !== undefined && Energy_Consumed !== null && Energy_Consumed !== '')
        ? parseFloat(Energy_Consumed)
        : (req.body.energy_consumed !== undefined && req.body.energy_consumed !== null && req.body.energy_consumed !== '')
          ? parseFloat(req.body.energy_consumed)
          : null;
      
      const primary_charging_type = Primary_Charging_Type || req.body.primary_charging_type || null;
      
      // Safe integer conversion for range
      const range = (Range !== undefined && Range !== null && Range !== '')
        ? parseInt(Range)
        : (req.body.range !== undefined && req.body.range !== null && req.body.range !== '')
          ? parseInt(req.body.range)
          : null;
      
      // Safe float conversion
      const grid_emission_factor = (Grid_Emission_Factor !== undefined && Grid_Emission_Factor !== null && Grid_Emission_Factor !== '')
        ? parseFloat(Grid_Emission_Factor)
        : (req.body.grid_emission_factor !== undefined && req.body.grid_emission_factor !== null && req.body.grid_emission_factor !== '')
          ? parseFloat(req.body.grid_emission_factor)
          : null;
      
      // Safe integer conversion
      const top_speed = (Top_Speed !== undefined && Top_Speed !== null && Top_Speed !== '')
        ? parseInt(Top_Speed)
        : (req.body.top_speed !== undefined && req.body.top_speed !== null && req.body.top_speed !== '')
          ? parseInt(req.body.top_speed)
          : null;
      
      // Safe float conversion
      const charging_time = (Charging_Time !== undefined && Charging_Time !== null && Charging_Time !== '')
        ? parseFloat(Charging_Time)
        : (req.body.charging_time !== undefined && req.body.charging_time !== null && req.body.charging_time !== '')
          ? parseFloat(req.body.charging_time)
          : null;
      
      const motor_power = (Motor_Power !== undefined && Motor_Power !== null && Motor_Power !== '')
        ? String(Motor_Power)
        : (req.body.motor_power !== undefined && req.body.motor_power !== null && req.body.motor_power !== '')
          ? String(req.body.motor_power)
          : null;

      // ✅ Required field validation - ONLY u_id is required (NOT NULL in DB)
      // According to schema: only ev_id, vuid, and u_id are NOT NULL
      if (!u_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required field: u_id'
        });
      }
      
      // Validate integer fields are not NaN if provided
      if (purchase_year !== null && (isNaN(purchase_year) || purchase_year < 2000 || purchase_year > 2030)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid purchase_year. Must be a number between 2000 and 2030'
        });
      }
      
      if (range !== null && (isNaN(range) || range <= 0)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid range. Must be a positive integer'
        });
      }
      
      if (top_speed !== null && isNaN(top_speed)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid top_speed. Must be a number'
        });
      }
      
      // Validate numeric fields are not NaN if provided
      if (energy_consumed !== null && isNaN(energy_consumed)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid energy_consumed. Must be a number'
        });
      }
      
      if (grid_emission_factor !== null && isNaN(grid_emission_factor)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid grid_emission_factor. Must be a number'
        });
      }
      
      if (charging_time !== null && isNaN(charging_time)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid charging_time. Must be a number'
        });
      }

      // ✅ Create EV with ONLY valid DB columns
      const newEV = await EVModel.create({
        u_id,
        category,
        manufacturers,
        model,
        purchase_year,
        energy_consumed,
        primary_charging_type,
        range,
        grid_emission_factor,
        top_speed,
        charging_time,
        motor_power
      });

      // ✅ Count EVs for user
      const evCount = await EVModel.getCountByUser(u_id);

      logger.info(`EV created successfully for user ${u_id}`, {
        ev_id: newEV.ev_id
      });

      return res.status(201).json({
        status: 'success',
        message: 'EV created successfully',
        data: newEV,
        evCount
      });
    } catch (error) {
      logger.error('Error creating EV:', error);
      console.error("EV INSERT DB ERROR 👉", error.message);
      console.error("Full error:", error);
      
      // Handle specific database errors
      let statusCode = 500;
      let errorMessage = 'Failed to create EV';
      
      // Foreign key constraint violation - user doesn't exist
      if (error.code === '23503') {
        statusCode = 400;
        errorMessage = 'User not found. Please ensure you are logged in with a valid account.';
      }
      // Check constraint violation
      else if (error.code === '23514') {
        statusCode = 400;
        errorMessage = 'Invalid data: ' + error.message;
      }
      // Unique constraint violation
      else if (error.code === '23505') {
        statusCode = 409;
        errorMessage = 'EV with this information already exists.';
      }
      // Invalid input format
      else if (error.code === '22P02') {
        statusCode = 400;
        errorMessage = 'Invalid data format. Please check your input values.';
      }
      else {
        errorMessage = error.message || 'Failed to create EV';
      }
      
      // Return more detailed error information
      return res.status(statusCode).json({
        status: 'error',
        message: errorMessage,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: error.stack,
          name: error.name,
          code: error.code
        } : undefined
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

      return res.status(200).json({
        status: 'success',
        message: 'EVs retrieved successfully',
        count: evs.length,
        data: evs
      });
    } catch (error) {
      logger.error('Error fetching EVs:', error);
      return res.status(500).json({
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

      return res.status(200).json({
        status: 'success',
        message: 'EV retrieved successfully',
        data: ev
      });
    } catch (error) {
      logger.error('Error fetching EV:', error);
      return res.status(500).json({
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
      const updateData = { ...req.body };

      // ❌ Fields not allowed to update
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

      const existingEV = await EVModel.getById(ev_id);
      if (!existingEV) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      const updatedEV = await EVModel.update(ev_id, updateData);

      logger.info(`EV updated successfully: ${ev_id}`);

      return res.status(200).json({
        status: 'success',
        message: 'EV updated successfully',
        data: updatedEV
      });
    } catch (error) {
      logger.error('Error updating EV:', error);
      return res.status(500).json({
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

      return res.status(200).json({
        status: 'success',
        message: 'EV deleted successfully',
        data: deletedEV
      });
    } catch (error) {
      logger.error('Error deleting EV:', error);
      return res.status(500).json({
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

      const updatedEV = await EVModel.updateStatus(
        ev_id,
        status,
        changed_by,
        reason
      );

      if (!updatedEV) {
        return res.status(404).json({
          status: 'error',
          message: 'EV not found'
        });
      }

      logger.info(`EV status updated: ${ev_id} -> ${status}`);

      return res.status(200).json({
        status: 'success',
        message: 'EV status updated successfully',
        data: updatedEV
      });
    } catch (error) {
      logger.error('Error updating EV status:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update EV status',
        error: error.message
      });
    }
  }
}

module.exports = EVController;
