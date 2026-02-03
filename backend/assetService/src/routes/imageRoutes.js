const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageController = require("../controllers/imageController");
const { logUserAction } = require("../middleware/auth");

/**
 * Image Upload Routes
 * Base URL: /api/image
 */

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    // Be more lenient - accept if mimetype is image/* or if mimetype is missing (browser might not send it)
    if (!file.mimetype || file.mimetype.startsWith("image/") || file.mimetype === "application/octet-stream") {
      cb(null, true);
    } else {
      console.warn(`Rejected file: ${file.originalname}, mimetype: ${file.mimetype}`);
      cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
    }
  },
});

// Upload images with proper error handling
router.post(
  "/upload",
  (req, res, next) => {
    try {
      console.log("Image upload request received", {
        contentType: req.headers['content-type'],
        hasBody: !!req.body,
      });
      
      upload.array("images", 5)(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err);
          
          // Handle multer errors
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              return res.status(400).json({
                status: "error",
                message: "File size too large. Maximum 5MB per file.",
              });
            }
            if (err.code === "LIMIT_FILE_COUNT") {
              return res.status(400).json({
                status: "error",
                message: "Too many files. Maximum 5 files allowed.",
              });
            }
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
              return res.status(400).json({
                status: "error",
                message: "Unexpected file field. Use 'images' as the field name.",
              });
            }
            return res.status(400).json({
              status: "error",
              message: `File upload error: ${err.message}`,
              code: err.code,
            });
          }
          
          // Handle other errors (like fileFilter rejection)
          return res.status(400).json({
            status: "error",
            message: err.message || "File upload failed",
          });
        }
        
        console.log("Multer processed files:", req.files?.length || 0);
        next();
      });
    } catch (error) {
      console.error("Error in upload middleware:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error during file upload",
        error: error.message,
      });
    }
  },
  logUserAction("UPLOAD_IMAGES"),
  (req, res, next) => {
    // Wrap in async handler to catch any unhandled promise rejections
    Promise.resolve(ImageController.uploadImages(req, res)).catch((error) => {
      console.error("Unhandled error in uploadImages:", error);
      if (!res.headersSent) {
        return res.status(500).json({
          status: "error",
          message: "Failed to process image upload",
          error: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        });
      }
    });
  }
);

module.exports = router;
