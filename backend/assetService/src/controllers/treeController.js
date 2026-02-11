const TreeModel = require("../models/treeModel");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

class TreeController {
  /**
   * Create new Tree
   * POST /api/tree
   */
  static async createTree(req, res) {
    try {
      const {
        UID,
        TreeName,
        BotanicalName,
        PlantingDate,
        Height,
        DBH,
        Location,
        CreatedBy,
        imageIds,
      } = req.body;

      // Validate required fields
      if (!UID || !TreeName || !PlantingDate || !Height) {
        return res.status(400).json({
          success: false,
          message:
            "Missing required fields: UID, TreeName, PlantingDate, Height",
          data: null,
        });
      }

      // Create Tree
      const newTree = await TreeModel.create(req.body);

      // Get total count for user
      const treeCount = await TreeModel.getCountByUser(UID);

      logger.info(`Tree created successfully for user ${UID}`, {
        tid: newTree.tid,
      });

      res.status(201).json({
        success: true,
        message: "Tree created successfully",
        data: {
          tree: newTree,
          treeCount: treeCount,
        },
      });
    } catch (error) {
      logger.error("Error creating Tree:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create Tree",
        data: { error: error.message },
      });
    }
  }

  /**
   * Get all Trees for a user
   * GET /api/tree/:userId
   */
  static async getTreesByUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
          data: null,
        });
      }

      const trees = await TreeModel.getByUserId(userId);

      res.status(200).json({
        success: true,
        message: "Trees retrieved successfully",
        data: trees,
      });
    } catch (error) {
      logger.error("Error fetching Trees:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch Trees",
        data: { error: error.message },
      });
    }
  }

  /**
   * Get single Tree by ID
   * GET /api/tree/single/:tid
   */
  static async getTreeById(req, res) {
    try {
      const { tid } = req.params;

      const tree = await TreeModel.getById(tid);

      if (!tree) {
        return res.status(404).json({
          success: false,
          message: "Tree not found",
          data: null,
        });
      }

      res.status(200).json({
        success: true,
        message: "Tree retrieved successfully",
        data: tree,
      });
    } catch (error) {
      logger.error("Error fetching Tree:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch Tree",
        data: { error: error.message },
      });
    }
  }

  /**
   * Update Tree
   * PUT /api/tree/:tid
   */
  static async updateTree(req, res) {
    try {
      const { tid } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated
      delete updateData.tid;
      delete updateData.t_uid;
      delete updateData.u_id;
      delete updateData.created_at;
      delete updateData.updated_at;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid fields to update",
          data: null,
        });
      }

      // Check if Tree exists
      const existingTree = await TreeModel.getById(tid);
      if (!existingTree) {
        return res.status(404).json({
          success: false,
          message: "Tree not found",
          data: null,
        });
      }

      // Update Tree
      const updatedTree = await TreeModel.update(tid, updateData);

      logger.info(`Tree updated successfully: ${tid}`);

      res.status(200).json({
        success: true,
        message: "Tree updated successfully",
        data: updatedTree,
      });
    } catch (error) {
      logger.error("Error updating Tree:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update Tree",
        data: { error: error.message },
      });
    }
  }

  /**
   * Delete Tree
   * DELETE /api/tree/:tid
   */
  static async deleteTree(req, res) {
    try {
      const { tid } = req.params;

      const deletedTree = await TreeModel.delete(tid);

      if (!deletedTree) {
        return res.status(404).json({
          success: false,
          message: "Tree not found",
          data: null,
        });
      }

      logger.info(`Tree deleted successfully: ${tid}`);

      res.status(200).json({
        success: true,
        message: "Tree deleted successfully",
        data: deletedTree,
      });
    } catch (error) {
      logger.error("Error deleting Tree:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Tree",
        data: { error: error.message },
      });
    }
  }

  /**
   * Add image to Tree
   * POST /api/tree/:tid/image
   */
  static async addTreeImage(req, res) {
    try {
      const { tid } = req.params;
      const { image_url, cloudinary_public_id } = req.body;

      if (!image_url) {
        return res.status(400).json({
          success: false,
          message: "Image URL is required",
          data: null,
        });
      }

      const newImage = await TreeModel.addImage(
        tid,
        image_url,
        cloudinary_public_id
      );

      logger.info(`Image added to tree ${tid}`);

      res.status(201).json({
        success: true,
        message: "Image added successfully",
        data: newImage,
      });
    } catch (error) {
      logger.error("Error adding tree image:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add image",
        data: { error: error.message },
      });
    }
  }

  /**
   * Delete Tree image
   * DELETE /api/tree/image/:imageId
   */
  static async deleteTreeImage(req, res) {
    try {
      const { imageId } = req.params;

      const deletedImage = await TreeModel.deleteImage(imageId);

      if (!deletedImage) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
          data: null,
        });
      }

      logger.info(`Tree image deleted: ${imageId}`);

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
        data: deletedImage,
      });
    } catch (error) {
      logger.error("Error deleting tree image:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete image",
        data: { error: error.message },
      });
    }
  }

  /**
   * Update Tree status
   * PATCH /api/tree/:tid/status
   */
  static async updateTreeStatus(req, res) {
    try {
      const { tid } = req.params;
      const { status, changed_by, reason } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required",
          data: null,
        });
      }

      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          data: null,
        });
      }

      const updatedTree = await TreeModel.updateStatus(
        tid,
        status,
        changed_by,
        reason
      );

      if (!updatedTree) {
        return res.status(404).json({
          success: false,
          message: "Tree not found",
          data: null,
        });
      }

      logger.info(`Tree status updated: ${tid} -> ${status}`);

      res.status(200).json({
        success: true,
        message: "Tree status updated successfully",
        data: updatedTree,
      });
    } catch (error) {
      logger.error("Error updating Tree status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update Tree status",
        data: { error: error.message },
      });
    }
  }
}

module.exports = TreeController;
