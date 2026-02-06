const service = require("./address.service");

exports.addAddress = async (req, res) => {
  const u_id = req.headers["x-user-id"];
  const result = await service.addAddress(u_id, req.body);
  res.status(201).json(result);
};

exports.getAddresses = async (req, res) => {
  const u_id = req.headers["x-user-id"];
  const addresses = await service.getAddresses(u_id);
  res.json(addresses);
};

exports.deleteAddress = async (req, res) => {
  const u_id = req.headers["x-user-id"];
  const { addressId } = req.params;

  await service.deleteAddress(u_id, addressId);
  res.json({ message: "Address deleted" });
};
