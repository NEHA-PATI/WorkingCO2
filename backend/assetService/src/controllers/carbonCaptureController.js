const CarbonCaptureModel = require("../models/carbonCaptureModel");

class CarbonCaptureController {
  static async createCarbonCapture(req, res) {
    try {
      const {
        org_id,
        industry_type,
        total_emission_tonnes_per_year,
        capture_technology,
        capture_efficiency_percent,
      } = req.body;

      if (
        !org_id ||
        !industry_type ||
        total_emission_tonnes_per_year === undefined ||
        !capture_technology ||
        capture_efficiency_percent === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
          data: null,
        });
      }

      const created = await CarbonCaptureModel.create({
        org_id,
        industry_type,
        total_emission_tonnes_per_year,
        capture_technology,
        capture_efficiency_percent,
      });

      return res.status(201).json({
        success: true,
        message: "Carbon capture asset created successfully",
        data: created,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create carbon capture asset",
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

      const assets = await CarbonCaptureModel.getByOrgId(org_id);
      return res.status(200).json({
        success: true,
        message: "Carbon capture assets fetched successfully",
        data: assets,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch carbon capture assets",
        data: { error: error.message },
      });
    }
  }

  static async getById(req, res) {
    try {
      const { capture_id } = req.params;
      const asset = await CarbonCaptureModel.getById(capture_id);

      if (!asset) {
        return res.status(404).json({
          success: false,
          message: "Carbon capture asset not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Carbon capture asset fetched successfully",
        data: asset,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch carbon capture asset",
        data: { error: error.message },
      });
    }
  }

  static async updateCarbonCapture(req, res) {
    try {
      const { capture_id } = req.params;
      const updateData = { ...req.body };

      delete updateData.capture_id;
      delete updateData.c_uid;
      delete updateData.org_id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (!Object.keys(updateData).length) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update",
          data: null,
        });
      }

      const existing = await CarbonCaptureModel.getById(capture_id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Carbon capture asset not found",
          data: null,
        });
      }

      const updated = await CarbonCaptureModel.update(capture_id, updateData);
      return res.status(200).json({
        success: true,
        message: "Carbon capture asset updated successfully",
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update carbon capture asset",
        data: { error: error.message },
      });
    }
  }

  static async deleteCarbonCapture(req, res) {
    try {
      const { capture_id } = req.params;
      const deleted = await CarbonCaptureModel.delete(capture_id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Carbon capture asset not found",
          data: null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Carbon capture asset deleted successfully",
        data: deleted,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete carbon capture asset",
        data: { error: error.message },
      });
    }
  }
}

module.exports = CarbonCaptureController;
