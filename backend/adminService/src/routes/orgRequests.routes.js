const express = require("express");
const router = express.Router();
const { fetchAllOrgRequests } = require("../controllers/orgRequests.controller");

router.get("/org-requests", fetchAllOrgRequests);

module.exports = router;
