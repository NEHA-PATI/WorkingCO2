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
