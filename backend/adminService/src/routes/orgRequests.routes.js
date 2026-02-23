const express = require("express");
const router = express.Router();
const { fetchAllOrgRequests } = require("../controllers/orgRequests.controller");
const {
  approveOrganization,
  rejectOrganization,
} = require("../controllers/orgApproval.controller");

router.get("/org-requests", fetchAllOrgRequests);
router.post("/admin/approve-organization", approveOrganization);
router.post("/admin/reject-organization", rejectOrganization);

module.exports = router;
