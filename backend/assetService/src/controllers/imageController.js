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
      // Debug: Log request details
      logger.info("Image upload request received", {
        hasFiles: !!req.files,
        filesCount: req.files?.length || 0,
        bodyKeys: Object.keys(req.body || {}),
      });

      if (!req.files || req.files.length === 0) {
        logger.warn("No files in request", {
          files: req.files,
          body: req.body,
        });
        return res.status(400).json({
          success: false,
          message: "No images provided. Please ensure files are sent with field name 'images'.",
          data: null
        });
      }

      // Validate file buffers
      const validFiles = req.files.filter((file) => {
        if (!file.buffer || file.buffer.length === 0) {
          logger.warn(`Invalid file: ${file.originalname} - no buffer`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid image files provided",
          data: null
        });
      }

      logger.info(`Processing ${validFiles.length} image(s)`);

      const uploadPromises = validFiles.map((file, index) => {
        return uploadImage(file.buffer, "co2plus-trees")
          .catch((error) => {
            logger.error(`Failed to upload image ${index + 1}:`, error);
            throw new Error(`Failed to upload ${file.originalname || 'image'}: ${error.message}`);
          });
      });

      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.url);
      const imageData = uploadResults.map((result) => ({
        url: result.url,
        public_id: result.public_id,
      }));

      logger.info(`Uploaded ${imageUrls.length} images successfully`);

      res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        data: {
          imageUrls: imageUrls,
          images: imageData, // Include both URL and public_id for database storage
          count: imageUrls.length,
        }
      });
    } catch (error) {
      logger.error("Error uploading images:", {
        error: error.message,
        stack: error.stack,
        files: req.files?.map(f => ({ name: f.originalname, size: f.size })) || [],
      });
      res.status(500).json({
        success: false,
        message: "Failed to upload images",
        data: {
          error: error.message,
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        }
      });
    }
  }
}

module.exports = ImageController;
