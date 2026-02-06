const jwt = require("jsonwebtoken");

exports.issueTokens = (user) => {
  const payload = { id: user.id, u_id: user.u_id, role: user.role_id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });

  return { accessToken, refreshToken };
};
