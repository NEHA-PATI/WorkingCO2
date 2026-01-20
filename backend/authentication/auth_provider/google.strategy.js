const axios = require("axios");
const { google } = require("../config/oauth");

exports.getGoogleAuthURL = () => {
  const params = new URLSearchParams({
    client_id: google.clientId,
    redirect_uri: google.redirectUri,
    response_type: "code",
    scope: "openid email profile"
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
};

exports.getGoogleProfile = async (code) => {
  const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: google.clientId,
    client_secret: google.clientSecret,
    code,
    redirect_uri: google.redirectUri,
    grant_type: "authorization_code"
  });

  const { access_token } = tokenRes.data;

  const profileRes = await axios.get(
    "https://openidconnect.googleapis.com/v1/userinfo",
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  return {
    id: profileRes.data.sub,
    email: profileRes.data.email,
    name: profileRes.data.name,
    raw: profileRes.data
  };
};
