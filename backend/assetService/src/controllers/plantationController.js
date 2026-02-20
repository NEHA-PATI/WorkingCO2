const PlantationModel = require("../models/plantationModel");

class PlantationController {
  static async createPlantation(req, res) {
    try {
      const {
        org_id,
        plantation_name,
        plantation_date,
        total_area,
        area_unit,
        manager_name,
        manager_contact,
        trees_planted,
        species_name,
        plant_age_years,
        points,
      } = req.body;

      if (
        !org_id ||
        !plantation_name ||
        !plantation_date ||
        total_area === undefined ||
        !area_unit ||
        !manager_name ||
        !manager_contact ||
        trees_planted === undefined ||
        !species_name ||
        plant_age_years === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          data: null,
        });
      }

      if (!Array.isArray(points) || points.length < 3) {
        return res.status(400).json({
          success: false,
          message: "At least 3 map points are required",
          data: null,
        });
      }

      const created = await PlantationModel.create({
        org_id,
        plantation_name,
        plantation_date,
        total_area: Number(total_area),
        area_unit,
        manager_name,
        manager_contact,
        trees_planted: Number(trees_planted),
        species_name,
        plant_age_years: Number(plant_age_years),
        points,
      });

      return res.status(201).json({
        success: true,
        message: "Plantation created successfully",
        data: created,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create plantation",
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

      const rows = await PlantationModel.getByOrgId(org_id);
      return res.status(200).json({
        success: true,
        message: "Plantations fetched successfully",
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plantations",
        data: { error: error.message },
      });
    }
  }

  static async getById(req, res) {
    try {
      const { p_id } = req.params;
      const row = await PlantationModel.getById(p_id);

      if (!row) {
        return res.status(404).json({
          success: false,
          message: "Plantation not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Plantation fetched successfully",
        data: row,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch plantation",
        data: { error: error.message },
      });
    }
  }
}

module.exports = PlantationController;
