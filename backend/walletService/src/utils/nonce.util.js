const crypto = require("crypto");

function generateSecureNonce() {
  return crypto.randomBytes(32).toString("hex");
}

module.exports = { generateSecureNonce };