const express = require("express");
const router = express.Router();

const {
  createOrgAsset,
  getAllOrgAssets,
  getOrgAssetsByUser,
  getOrgAssetsByStatus,
  updateOrgAssetStatus,
  deleteOrgAsset,
  getOrgAssetsForWorkflow,
  getApprovedOrgAssets,
} = require("../controllers/orgAssetController");

/**
 * ORG ASSET ROUTES
 */
// CREATE
router.post("/", createOrgAsset);

// WORKFLOW (ADMIN)
router.get("/workflow/admin", getOrgAssetsForWorkflow);

// USER WISE
router.get("/user/:u_id", getOrgAssetsByUser);

// STATUS FILTER (pending / approved / rejected)
router.get("/by-status", getOrgAssetsByStatus);

// APPROVED ONLY (ADMIN LIST)
router.get("/approved", getApprovedOrgAssets);

// ALL (fallback / admin view)
router.get("/all", getAllOrgAssets);

// UPDATE STATUS
router.put("/:id/status", updateOrgAssetStatus);

// DELETE
router.delete("/:id", deleteOrgAsset);



module.exports = router;

