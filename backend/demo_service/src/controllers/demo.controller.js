const demoService = require("../services/demo.service");

async function bookDemo(req, res) {
  try {
    const demo = await demoService.createDemoRequest(req.body);

    res.status(201).json({
      message: "Demo booked successfully",
      data: demo
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        message: "Demo request already exists for this email"
      });
    }

    if (err.code === "23514") {
      return res.status(400).json({
        message: "Invalid dropdown value"
      });
    }

    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getDemoRequests(req, res) {
  const demos = await demoService.getAllDemoRequests();
  res.status(200).json(demos);
}

module.exports = {
  bookDemo,
  getDemoRequests
};
