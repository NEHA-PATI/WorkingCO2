const express = require("express");
const router = express.Router();

const {
    createOrgRequest,
    getAllOrgRequests,
    getOrgRequestById,
    approveOrgRequest,
    rejectOrgRequest,
    deleteOrgRequest
} = require("../controllers/orgRequestController");

// ================= FRONTEND =================

// Create organization request
router.post("/", createOrgRequest);

// ================= ADMIN =================

// Get all org requests
router.get("/", getAllOrgRequests);

// Get single org request
router.get("/:id", getOrgRequestById);

// Approve request + create organization (password required)
router.put("/:id/approve", approveOrgRequest);

// Reject request
router.put("/:id/reject", rejectOrgRequest);

// Delete request (optional)
router.delete("/:id", deleteOrgRequest);

module.exports = router;
