const Job = require("../models/Job");

exports.getAllJobs = async (req, res, next) => {
  try {
    const { status, type, department } = req.query;
    // Basic filter support
    const jobs = await Job.findAll({ status, department }); // Add type to model if needed
    
    // If type filtering is needed we can add it to model or filter here
    let filtered = jobs;
    if (type) {
      filtered = jobs.filter(j => j.type === type);
    }

    res.json({ status: "success", count: filtered.length, data: filtered });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ status: "fail", message: "Job not found" });
    }
    res.json({ status: "success", data: job });
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    // Add validation here if needed
    const newJob = await Job.create(req.body);
    res.status(201).json({ status: "success", data: newJob });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const updatedJob = await Job.update(req.params.id, req.body);
    if (!updatedJob) {
      return res.status(404).json({ status: "fail", message: "Job not found" });
    }
    res.json({ status: "success", data: updatedJob });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.delete(req.params.id);
    if (!job) {
      return res.status(404).json({ status: "fail", message: "Job not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    next(err);
  }
};
