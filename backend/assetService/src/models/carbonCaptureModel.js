const { query } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class CarbonCaptureModel {
  static async create(data) {
    const {
      org_id,
      facility_name,
      industry_type,
      total_emission_tonnes_per_year,
      capture_technology,
      capture_efficiency_percent,
    } = data;

    const c_uid = `CUID_${uuidv4()}`;

    const queryText = `
      INSERT INTO carbon_capture_assets (
        c_uid,
        org_id,
        facility_name,
        industry_type,
        total_emission_tonnes_per_year,
        capture_technology,
        capture_efficiency_percent,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      c_uid,
      org_id,
      facility_name,
      industry_type,
      total_emission_tonnes_per_year,
      capture_technology,
      capture_efficiency_percent,
      "pending",
    ];

    const result = await query(queryText, values);
    return result.rows[0];
  }

  static async getByOrgId(orgId) {
    const queryText = `
      SELECT *
      FROM carbon_capture_assets
      WHERE org_id = $1
      ORDER BY created_at DESC
    `;
    const result = await query(queryText, [orgId]);
    return result.rows;
  }

  static async getById(captureId) {
    const queryText = `
      SELECT *
      FROM carbon_capture_assets
      WHERE capture_id = $1
    `;
    const result = await query(queryText, [captureId]);
    return result.rows[0];
  }

  static async update(captureId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (!fields.length) {
      throw new Error("No fields to update");
    }

    const setClause = fields
      .map((field, index) => `${field.toLowerCase()} = $${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE carbon_capture_assets
      SET ${setClause}, updated_at = NOW()
      WHERE capture_id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await query(queryText, [...values, captureId]);
    return result.rows[0];
  }

  static async delete(captureId) {
    const queryText = `
      DELETE FROM carbon_capture_assets
      WHERE capture_id = $1
      RETURNING *
    `;
    const result = await query(queryText, [captureId]);
    return result.rows[0];
  }
}

module.exports = CarbonCaptureModel;
