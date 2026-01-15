const { uploadImage } = require("../config/cloudinary");
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

class ImageController {
  /**
   * Upload images to Cloudinary
   * POST /api/image/upload
   */
  static async uploadImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          status: "error",
          message: "No images provided",
        });
      }

      const uploadPromises = req.files.map((file) => {
        return uploadImage(file.buffer, "co2plus-trees");
      });

      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.url);

      logger.info(`Uploaded ${imageUrls.length} images successfully`);

      res.status(200).json({
        status: "success",
        message: "Images uploaded successfully",
        imageUrls: imageUrls,
        count: imageUrls.length,
      });
    } catch (error) {
      logger.error("Error uploading images:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to upload images",
        error: error.message,
      });
    }
  }
}

module.exports = ImageController;
