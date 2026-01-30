const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router
  .route("/")
  .get(applicationController.getAllApplications)
  .post(applicationController.applyForJob);

router
  .route("/:id/status")
  .put(applicationController.updateApplicationStatus);

module.exports = router;
