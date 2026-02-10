const demoService = require("../services/demo.service");

async function bookDemo(req, res) {
  try {
    const demo = await demoService.createDemoRequest(req.body);

    res.status(201).json({
      success: true,
      message: "Demo booked successfully",
      data: demo
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Demo request already exists for this email",
        data: null
      });
    }

    if (err.code === "23514") {
      return res.status(400).json({
        success: false,
        message: "Invalid dropdown value",
        data: null
      });
    }

    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null
    });
  }
}

async function getDemoRequests(req, res) {
  const demos = await demoService.getAllDemoRequests();
  res.status(200).json({
    success: true,
    message: "Demo requests fetched successfully",
    data: demos
  });
}

module.exports = {
  bookDemo,
  getDemoRequests
};
