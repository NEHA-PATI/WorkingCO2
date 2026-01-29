const Application = require("../models/Application");

exports.getAllApplications = async (req, res, next) => {
  try {
    const apps = await Application.findAll();
    res.json({ status: "success", count: apps.length, data: apps });
  } catch (err) {
    next(err);
  }
};

exports.applyForJob = async (req, res, next) => {
  try {
    const newApp = await Application.create(req.body);
    res.status(201).json({ status: "success", data: newApp });
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: "fail", message: "Status is required" });
    }
    const updatedApp = await Application.updateStatus(req.params.id, status);
    if (!updatedApp) {
      return res.status(404).json({ status: "fail", message: "Application not found" });
    }
    res.json({ status: "success", data: updatedApp });
  } catch (err) {
    next(err);
  }
};
