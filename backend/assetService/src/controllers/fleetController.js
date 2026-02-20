const FleetModel = require("../models/fleetModel");

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "yes" || normalized === "true") return true;
    if (normalized === "no" || normalized === "false") return false;
  }
  return false;
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const pick = (body, snake, camel) => {
  if (body[snake] !== undefined) return body[snake];
  if (camel && body[camel] !== undefined) return body[camel];
  return undefined;
};

const normalizePayload = (body) => {
  const isFleet = toBoolean(pick(body, "is_fleet", "isFleet"));

  return {
    ev_uid: pick(body, "ev_uid", "evUid"),
    org_id: pick(body, "org_id", "orgId"),

    vehicle_category: pick(body, "vehicle_category", "vehicleCategory"),
    sub_category: pick(body, "sub_category", "subCategory"),
    powertrain_type: pick(body, "powertrain_type", "powertrainType"),
    manufacturer: pick(body, "manufacturer", "manufacturer"),
    model: pick(body, "model", "model"),
    purchase_year: toNumberOrNull(pick(body, "purchase_year", "purchaseYear")),

    is_fleet: isFleet,
    average_distance_per_day_km: toNumberOrNull(
      pick(body, "average_distance_per_day_km", "averageDistancePerDay")
    ),
    working_days_per_year: toNumberOrNull(
      pick(body, "working_days_per_year", "workingDaysPerYear")
    ),
    number_of_vehicles: toNumberOrNull(
      pick(body, "number_of_vehicles", "numberOfVehicles")
    ),
    average_distance_per_vehicle_per_year_km: toNumberOrNull(
      pick(
        body,
        "average_distance_per_vehicle_per_year_km",
        "averageDistancePerVehiclePerYear"
      )
    ),

    fuel_type: pick(body, "fuel_type", "fuelType"),
    fuel_efficiency_km_per_liter: toNumberOrNull(
      pick(body, "fuel_efficiency_km_per_liter", "fuelEfficiency")
    ),
    total_fuel_consumed_per_year_liters: toNumberOrNull(
      pick(body, "total_fuel_consumed_per_year_liters", "totalFuelConsumedPerYear")
    ),
    battery_capacity_kwh: toNumberOrNull(
      pick(body, "battery_capacity_kwh", "batteryCapacity")
    ),
    energy_consumed_per_month_kwh: toNumberOrNull(
      pick(body, "energy_consumed_per_month_kwh", "energyConsumedPerMonth")
    ),
    charging_type: pick(body, "charging_type", "chargingType"),
    grid_emission_factor_kgco2_per_kwh: toNumberOrNull(
      pick(
        body,
        "grid_emission_factor_kgco2_per_kwh",
        "gridEmissionFactor"
      )
    ),

    vehicle_weight_kg: toNumberOrNull(pick(body, "vehicle_weight_kg", "vehicleWeight")),
    engine_capacity_cc: toNumberOrNull(
      pick(body, "engine_capacity_cc", "engineCapacity")
    ),
    motor_power_kw: toNumberOrNull(pick(body, "motor_power_kw", "motorPower")),
    charging_time_hours: toNumberOrNull(
      pick(body, "charging_time_hours", "chargingTime")
    ),
  };
};

const validateRequired = (data) => {
  const required = [
    "org_id",
    "vehicle_category",
    "sub_category",
    "powertrain_type",
    "manufacturer",
    "model",
    "purchase_year",
    "fuel_type",
    "fuel_efficiency_km_per_liter",
    "total_fuel_consumed_per_year_liters",
    "battery_capacity_kwh",
    "energy_consumed_per_month_kwh",
    "charging_type",
    "grid_emission_factor_kgco2_per_kwh",
  ];

  const missing = required.filter(
    (key) => data[key] === undefined || data[key] === null || data[key] === ""
  );

  if (data.is_fleet) {
    if (!data.number_of_vehicles) missing.push("number_of_vehicles");
    if (!data.average_distance_per_vehicle_per_year_km) {
      missing.push("average_distance_per_vehicle_per_year_km");
    }
  } else {
    if (!data.average_distance_per_day_km) missing.push("average_distance_per_day_km");
    if (!data.working_days_per_year) missing.push("working_days_per_year");
  }

  return missing;
};

class FleetController {
  static async createFleet(req, res) {
    try {
      const payload = normalizePayload(req.body || {});
      const missing = validateRequired(payload);

      if (missing.length) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missing.join(", ")}`,
          data: null,
        });
      }

      const created = await FleetModel.create(payload);
      return res.status(201).json({
        success: true,
        message: "Fleet entry created successfully",
        data: created,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create fleet entry",
        data: { error: error.message },
      });
    }
  }

  static async getByOrgId(req, res) {
    try {
      const { org_id } = req.params;
      if (!org_id) {
        return res.status(400).json({
          success: false,
          message: "org_id is required",
          data: null,
        });
      }

      const rows = await FleetModel.getByOrgId(org_id);
      return res.status(200).json({
        success: true,
        message: "Fleet entries fetched successfully",
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch fleet entries",
        data: { error: error.message },
      });
    }
  }

  static async getById(req, res) {
    try {
      const { ev_input_id } = req.params;
      const row = await FleetModel.getById(ev_input_id);

      if (!row) {
        return res.status(404).json({
          success: false,
          message: "Fleet entry not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fleet entry fetched successfully",
        data: row,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch fleet entry",
        data: { error: error.message },
      });
    }
  }

  static async updateFleet(req, res) {
    try {
      const { ev_input_id } = req.params;
      const existing = await FleetModel.getById(ev_input_id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Fleet entry not found",
          data: null,
        });
      }

      const normalized = normalizePayload(req.body || {});
      const immutable = ["ev_uid", "org_id"];
      const updateData = {};

      Object.keys(normalized).forEach((key) => {
        if (immutable.includes(key)) return;
        if (normalized[key] !== undefined) {
          updateData[key] = normalized[key];
        }
      });

      const hasAnyField = Object.values(updateData).some(
        (value) => value !== undefined
      );

      if (!hasAnyField) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update",
          data: null,
        });
      }

      const updated = await FleetModel.update(ev_input_id, updateData);
      return res.status(200).json({
        success: true,
        message: "Fleet entry updated successfully",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update fleet entry",
        data: { error: error.message },
      });
    }
  }

  static async deleteFleet(req, res) {
    try {
      const { ev_input_id } = req.params;
      const deleted = await FleetModel.delete(ev_input_id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Fleet entry not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Fleet entry deleted successfully",
        data: deleted,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete fleet entry",
        data: { error: error.message },
      });
    }
  }
}

module.exports = FleetController;
