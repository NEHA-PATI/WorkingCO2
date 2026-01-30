const express = require("express");
const {
  getMetrics,
  getWorkflowAssets,
  getApprovedAssets,
  getRejectedAssets,
  updateAssetStatus,
  getAssetDetails
} = require("../controllers/assetController");

const router = express.Router();

router.get("/metrics", getMetrics);
router.get("/workflow", getWorkflowAssets);
router.get("/approved", getApprovedAssets);
router.get("/rejected", getRejectedAssets); 
// approve / reject
router.patch("/:type/:id/status", updateAssetStatus);
router.get("/:type/:id/details", getAssetDetails);


module.exports = router;
