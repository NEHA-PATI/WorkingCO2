const service = require("./profile.service");

exports.createCompleteProfile = async (req, res) => {
  const u_id = req.headers["x-user-id"];
  if (!u_id) {
    return res.status(400).json({ message: "User id missing" });
  }

  const { profile, addresses } = req.body;

  if (!profile || !addresses || !addresses.length) {
    return res.status(400).json({
      message: "Profile and address data required"
    });
  }

  const result = await service.createCompleteProfile(
    u_id,
    profile,
    addresses
  );

  res.status(201).json(result);
};


exports.getCompleteProfile = async (req, res) => {
  const u_id = req.headers["x-user-id"];

  if (!u_id) {
    return res.status(400).json({ message: "User id missing" });
  }

  try {
    const data = await service.getCompleteProfile(u_id);

    if (!data) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
