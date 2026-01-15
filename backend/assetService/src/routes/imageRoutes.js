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
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Upload images
router.post(
  "/upload",
  upload.array("images", 5), // Max 5 images
  logUserAction("UPLOAD_IMAGES"),
  ImageController.uploadImages
);

// Error handler for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "File size too large. Maximum 5MB per file.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "error",
        message: "Too many files. Maximum 5 files allowed.",
      });
    }
  }

  res.status(400).json({
    status: "error",
    message: error.message || "File upload failed",
  });
});

module.exports = router;
