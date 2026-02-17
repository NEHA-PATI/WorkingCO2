const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
  return cachedToken;
};

const sendViaGraph = async ({ to, subject, html }) => {
  const token = await getAccessToken();

  await axios.post(
    `https://graph.microsoft.com/v1.0/users/${process.env.MAILBOX}/sendMail`,
    {
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: html,
        },
        toRecipients: [
          {
            emailAddress: {
              address: to,
            },
          },
        ],
      },
      saveToSentItems: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

module.exports = sendViaGraph;
