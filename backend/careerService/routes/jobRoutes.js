const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router
  .route("/")
  .get(jobController.getAllJobs)
  .post(jobController.createJob);

router
  .route("/:id")
  .get(jobController.getJobById)
  .put(jobController.updateJob) // or patch
  .delete(jobController.deleteJob);

module.exports = router;
