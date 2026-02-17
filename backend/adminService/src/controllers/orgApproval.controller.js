const orgApprovalService = require("../services/orgApproval.service");

const approveOrganization = async (req, res) => {
  try {
    const data = await orgApprovalService.approveOrganization(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Organization approved successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to approve organization",
    });
  }
};

const rejectOrganization = async (req, res) => {
  try {
    const data = await orgApprovalService.rejectOrganization(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Organization rejected successfully",
      data,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to reject organization",
    });
  }
};

module.exports = {
  approveOrganization,
  rejectOrganization,
};
