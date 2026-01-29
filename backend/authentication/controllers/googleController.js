const googleAuth = require("../auth_provider/google.strategy");
const oauthService = require("../services/oauth.service");

exports.googleLogin = (req, res) => {
  const url = googleAuth.getGoogleAuthURL();
  res.redirect(url);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const profile = await googleAuth.getGoogleProfile(code);
    const { token, user } = await oauthService.handleOAuthLogin(
      "google",
      profile
    );

    // redirect to user dashboard
   res.redirect(
  `${process.env.FRONTEND_URL}/oauth-success?token=${token}`
);

  } catch (err) {
    console.error("GOOGLE OAUTH ERROR:", err);
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
    );
  }
};
