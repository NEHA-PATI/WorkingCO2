const { query, transaction } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class EVModel {
  /**
   * Create new EV
   */
  static async create(evData) {
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
      Motor_Power,
    } = evData;

    const VUID = `VUID_${uuidv4()}`;

    const queryText = `
      INSERT INTO ev_master_data (
        vuid, u_id, category, manufacturers, model, purchase_year,
        energy_consumed, primary_charging_type, range, grid_emission_factor,
        top_speed, charging_time, motor_power, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      VUID,
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
      Motor_Power,
      "pending",
    ];

    const result = await query(queryText, values);
    return result.rows[0];
  }

  /**
   * Get all EVs by user ID
   */
  static async getByUserId(userId) {
    const queryText = `
      SELECT * FROM ev_master_data 
      WHERE u_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await query(queryText, [userId]);
    return result.rows;
  }

  /**
   * Get single EV by ID
   */
  static async getById(evId) {
    const queryText = `
      SELECT * FROM ev_master_data 
      WHERE ev_id = $1
    `;
    const result = await query(queryText, [evId]);
    return result.rows[0];
  }

  /**
   * Update EV
   */
  static async update(evId, updateData) {
    // Build dynamic UPDATE query
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = fields
      .map((field, index) => `${field.toLowerCase()} = $${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE ev_master_data 
      SET ${setClause}
      WHERE ev_id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await query(queryText, [...values, evId]);
    return result.rows[0];
  }

  /**
   * Delete EV
   */
  static async delete(evId) {
    const queryText = `
      DELETE FROM ev_master_data 
      WHERE ev_id = $1
      RETURNING *
    `;
    const result = await query(queryText, [evId]);
    return result.rows[0];
  }

  /**
   * Get EV count by user
   */
  static async getCountByUser(userId) {
    const queryText = `
      SELECT COUNT(*) as count 
      FROM ev_master_data 
      WHERE u_id = $1
    `;
    const result = await query(queryText, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Update EV status
   */
  static async updateStatus(evId, status, changedBy = null, reason = null) {
    return await transaction(async (client) => {
      // Get old status
      const oldStatusResult = await client.query(
        "SELECT status FROM ev_master_data WHERE ev_id = $1",
        [evId]
      );
      const oldStatus = oldStatusResult.rows[0]?.status;

      // Update status
      const updateResult = await client.query(
        "UPDATE ev_master_data SET status = $1 WHERE ev_id = $2 RETURNING *",
        [status, evId]
      );

      // Log status change
      await client.query(
        `INSERT INTO asset_status_history 
         (asset_type, asset_id, old_status, new_status, changed_by, change_reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["ev", evId, oldStatus, status, changedBy, reason]
      );

      return updateResult.rows[0];
    });
  }
}

module.exports = EVModel;
