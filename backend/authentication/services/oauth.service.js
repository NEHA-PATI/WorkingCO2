const identityService = require("./identity.service");
const jwt = require("jsonwebtoken");

exports.handleOAuthLogin = async (provider, profile) => {
  const user = await identityService.resolveOAuthUser(provider, profile);

  const token = jwt.sign(
    {
      id: user.id,
      u_id: user.u_id,
      email: user.email,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};
