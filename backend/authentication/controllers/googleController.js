const googleAuth = require("../auth/google.strategy");
const oauthService = require("../services/oauth.service");

exports.googleLogin = (req, res) => {
  res.redirect(googleAuth.getGoogleAuthURL());
};

exports.googleCallback = async (req, res) => {
  try {
    const profile = await googleAuth.getGoogleProfile(req.query.code);
    const tokens = await oauthService.handleOAuthLogin("google", profile);

    res.json({ success: true, tokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "OAuth failed" });
  }
};
