const orgRequestsService = require("../services/orgRequests.service");

const fetchAllOrgRequests = async (req, res) => {
  try {
    const orgRequests = await orgRequestsService.getAllOrgRequests();

    res.status(200).json({
      success: true,
      totalOrgRequests: orgRequests.length,
      data: orgRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch organization requests",
      error: error.message,
    });
  }
};

module.exports = {
  fetchAllOrgRequests,
};
