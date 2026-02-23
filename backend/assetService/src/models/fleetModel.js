const { query } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

class FleetModel {
  static async create(data) {
    const {
      org_id,
      vehicle_category,
      sub_category,
      powertrain_type,
      manufacturer,
      model,
      purchase_year,
      is_fleet,
      average_distance_per_day_km,
      working_days_per_year,
      number_of_vehicles,
      average_distance_per_vehicle_per_year_km,
      fuel_type,
      fuel_efficiency_km_per_liter,
      total_fuel_consumed_per_year_liters,
      battery_capacity_kwh,
      energy_consumed_per_month_kwh,
      charging_type,
      grid_emission_factor_kgco2_per_kwh,
      vehicle_weight_kg,
      engine_capacity_cc,
      motor_power_kw,
      charging_time_hours,
      ev_uid,
    } = data;

    const uid = ev_uid || `EID_${uuidv4()}`;

    const queryText = `
      INSERT INTO fleet (
        ev_uid,
        org_id,
        vehicle_category,
        sub_category,
        powertrain_type,
        manufacturer,
        model,
        purchase_year,
        is_fleet,
        average_distance_per_day_km,
        working_days_per_year,
        number_of_vehicles,
        average_distance_per_vehicle_per_year_km,
        fuel_type,
        fuel_efficiency_km_per_liter,
        total_fuel_consumed_per_year_liters,
        battery_capacity_kwh,
        energy_consumed_per_month_kwh,
        charging_type,
        grid_emission_factor_kgco2_per_kwh,
        vehicle_weight_kg,
        engine_capacity_cc,
        motor_power_kw,
        charging_time_hours
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
        $13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24
      )
      RETURNING *
    `;

    const values = [
      uid,
      org_id,
      vehicle_category,
      sub_category,
      powertrain_type,
      manufacturer,
      model,
      purchase_year,
      is_fleet,
      average_distance_per_day_km,
      working_days_per_year,
      number_of_vehicles,
      average_distance_per_vehicle_per_year_km,
      fuel_type,
      fuel_efficiency_km_per_liter,
      total_fuel_consumed_per_year_liters,
      battery_capacity_kwh,
      energy_consumed_per_month_kwh,
      charging_type,
      grid_emission_factor_kgco2_per_kwh,
      vehicle_weight_kg,
      engine_capacity_cc,
      motor_power_kw,
      charging_time_hours,
    ];

    const result = await query(queryText, values);
    return result.rows[0];
  }

  static async getByOrgId(orgId) {
    const queryText = `
      SELECT *
      FROM fleet
      WHERE org_id = $1
      ORDER BY created_at DESC
    `;
    const result = await query(queryText, [orgId]);
    return result.rows;
  }

  static async getAll() {
    const queryText = `
      SELECT
        f.*,
        o.org_name
      FROM fleet f
      LEFT JOIN organizations o ON o.org_id = f.org_id
      ORDER BY f.created_at DESC
    `;
    const result = await query(queryText);
    return result.rows;
  }

  static async getById(evInputId) {
    const queryText = `
      SELECT *
      FROM fleet
      WHERE ev_input_id = $1
    `;
    const result = await query(queryText, [evInputId]);
    return result.rows[0];
  }

  static async update(evInputId, updateData) {
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    if (!fields.length) {
      throw new Error("No fields to update");
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const queryText = `
      UPDATE fleet
      SET ${setClause}
      WHERE ev_input_id = $${fields.length + 1}
      RETURNING *
    `;

    const result = await query(queryText, [...values, evInputId]);
    return result.rows[0];
  }

  static async delete(evInputId) {
    const queryText = `
      DELETE FROM fleet
      WHERE ev_input_id = $1
      RETURNING *
    `;
    const result = await query(queryText, [evInputId]);
    return result.rows[0];
  }
}

module.exports = FleetModel;

