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

    res.json({
      success: true,
      message: "Jobs fetched successfully",
      data: filtered
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        data: null
      });
    }
    res.json({
      success: true,
      message: "Job fetched successfully",
      data: job
    });
  } catch (err) {
    next(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    // Add validation here if needed
    const newJob = await Job.create(req.body);
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: newJob
    });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const updatedJob = await Job.update(req.params.id, req.body);
    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        data: null
      });
    }
    res.json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.delete(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
        data: null
      });
    }
    res.status(204).json({
      success: true,
      message: "Job deleted successfully",
      data: null
    });
  } catch (err) {
    next(err);
  }
};
