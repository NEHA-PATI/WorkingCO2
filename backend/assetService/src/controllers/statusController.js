const { query } = require("../config/database");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

class StatusController {
  /**
   * Get all asset statuses for a user
   * GET /api/assets/user/:userId/status
   */
  static async getUserAssetStatuses(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
          data: null,
        });
      }

      // Get all asset statuses
      const queryText = `
        SELECT 
          'ev' as asset_type,
          ev_id as asset_id,
          status
        FROM ev_master_data
        WHERE u_id = $1
        UNION ALL
        SELECT 
          'solar' as asset_type,
          suid as asset_id,
          status
        FROM solar_panels
        WHERE u_id = $1
        UNION ALL
        SELECT 
          'tree' as asset_type,
          tid as asset_id,
          status
        FROM trees
        WHERE u_id = $1
      `;

      const result = await query(queryText, [userId]);

      // Format response as object with asset_id as key
      const statusMap = {};
      result.rows.forEach((row) => {
        statusMap[row.asset_id] = row.status;
      });

      res.status(200).json({
        success: true,
        message: "Asset statuses fetched successfully",
        data: statusMap,
      });
    } catch (error) {
      logger.error("Error fetching asset statuses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch asset statuses",
        data: { error: error.message },
      });
    }
  }
}

module.exports = StatusController;
