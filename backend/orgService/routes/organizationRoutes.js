const express = require("express");
const router = express.Router();

const {
    organizationLogin,
    getAllOrganizations,
    getOrganizationByOrgId,
    updateOrganizationByOrgId
} = require("../controllers/organizationController");

// ================= ORGANIZATION =================

// Organization login
router.post("/login", organizationLogin);

// ================= ADMIN =================

// Get all organizations
router.get("/", getAllOrganizations);


router.get("/:org_id", getOrganizationByOrgId);
router.put("/:org_id", updateOrganizationByOrgId);
module.exports = router;
