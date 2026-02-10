const Application = require("../models/Application");

exports.getAllApplications = async (req, res, next) => {
  try {
    const apps = await Application.findAll();
    res.json({
      success: true,
      message: "Applications fetched successfully",
      data: apps
    });
  } catch (err) {
    next(err);
  }
};

exports.applyForJob = async (req, res, next) => {
  try {
    const newApp = await Application.create(req.body);
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: newApp
    });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
        data: null
      });
    }
    const updatedApp = await Application.updateStatus(req.params.id, status);
    if (!updatedApp) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
        data: null
      });
    }
    res.json({
      success: true,
      message: "Application updated successfully",
      data: updatedApp
    });
  } catch (err) {
    next(err);
  }
};
