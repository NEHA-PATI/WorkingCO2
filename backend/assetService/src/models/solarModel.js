const { query, transaction } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class SolarModel {
  /**
   * Create new Solar Panel
   */
  static async create(solarData) {
    const {
      U_ID,
      Installed_Capacity,
      Installation_Date,
      Energy_Generation_Value,
      Grid_Emission_Factor,
      Inverter_Type,
    } = solarData;

    const S_UID = `SUID_${uuidv4()}`;

    const queryText = `
      INSERT INTO solar_panels (
        s_uid, u_id, installed_capacity, installation_date,
        energy_generation_value, grid_emission_factor, inverter_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      S_UID,
      U_ID,
      Installed_Capacity,
      Installation_Date,
      Energy_Generation_Value,
      Grid_Emission_Factor,
      Inverter_Type,
      "pending",
    ];

    const result = await query(queryText, values);
    return result.rows[0];
  }

  /**
   * Get all Solar Panels by user ID
   */
  static async getByUserId(userId) {
    const queryText = `
      SELECT * FROM solar_panels 
      WHERE u_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await query(queryText, [userId]);
    return result.rows;
  }

  /**
   * Get single Solar Panel by ID
   */
  static async getById(suid) {
    const queryText = `
      SELECT * FROM solar_panels 
      WHERE suid = $1
    `;
    const result = await query(queryText, [suid]);
    return result.rows[0];
  }

  /**
   * Update Solar Panel
   */
  static async update(suid, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = fields
      .map((field, index) => `${field.toLowerCase()} = $${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE solar_panels 
      SET ${setClause}
      WHERE suid = $${fields.length + 1}
      RETURNING *
    `;

    const result = await query(queryText, [...values, suid]);
    return result.rows[0];
  }

  /**
   * Delete Solar Panel
   */
  static async delete(suid) {
    const queryText = `
      DELETE FROM solar_panels 
      WHERE suid = $1
      RETURNING *
    `;
    const result = await query(queryText, [suid]);
    return result.rows[0];
  }

  /**
   * Get Solar Panel count by user
   */
  static async getCountByUser(userId) {
    const queryText = `
      SELECT COUNT(*) as count 
      FROM solar_panels 
      WHERE u_id = $1
    `;
    const result = await query(queryText, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Update Solar Panel status
   */
  static async updateStatus(suid, status, changedBy = null, reason = null) {
    return await transaction(async (client) => {
      const oldStatusResult = await client.query(
        "SELECT status FROM solar_panels WHERE suid = $1",
        [suid]
      );
      const oldStatus = oldStatusResult.rows[0]?.status;

      const updateResult = await client.query(
        "UPDATE solar_panels SET status = $1 WHERE suid = $2 RETURNING *",
        [status, suid]
      );

      await client.query(
        `INSERT INTO asset_status_history 
         (asset_type, asset_id, old_status, new_status, changed_by, change_reason)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["solar", suid, oldStatus, status, changedBy, reason]
      );

      return updateResult.rows[0];
    });
  }
}

module.exports = SolarModel;
