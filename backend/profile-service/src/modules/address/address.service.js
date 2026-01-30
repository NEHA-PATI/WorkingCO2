const repo = require("./address.repository");
const { v4: uuid } = require("uuid");

exports.addAddress = (u_id, data) =>
  repo.create({
    address_id: uuid(),
    u_id,
    ...data
  });

exports.getAddresses = (u_id) => repo.findByUserId(u_id);

exports.deleteAddress = (u_id, addressId) =>
  repo.delete(u_id, addressId);
