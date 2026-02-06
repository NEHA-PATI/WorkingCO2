const express = require("express");
const router = express.Router();

const {
    organizationLogin,
    getAllOrganizations,
     getOrganizationByOrgId
} = require("../controllers/organizationController");

// ================= ORGANIZATION =================

// Organization login
router.post("/login", organizationLogin);

// ================= ADMIN =================

// Get all organizations
router.get("/", getAllOrganizations);


router.get("/:org_id", getOrganizationByOrgId);
module.exports = router;
