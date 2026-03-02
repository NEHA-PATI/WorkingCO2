const GRAPH_TOKEN_URL = (tenantId) =>
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
const GRAPH_SENDMAIL_URL = (mailbox) =>
  `https://graph.microsoft.com/v1.0/users/${mailbox}/sendMail`;

let cachedToken = null;
let tokenExpiryEpochMs = 0;

const buildRedeemSuccessTemplate = ({
  userName,
  rewardName,
  pointsUsed,
  remainingPoints,
  redeemedAt
}) => {
  const safeName = String(userName || 'Champion');
  const safeReward = String(rewardName || 'your reward');
  const safeRedeemedAt = redeemedAt
    ? new Date(redeemedAt).toLocaleString('en-IN', { hour12: true })
    : new Date().toLocaleString('en-IN', { hour12: true });

  return `
    <div style="font-family: Arial, sans-serif; background:#f4f8f6; padding:24px; color:#1f2937;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#0ea5e9,#22c55e); color:#fff; padding:24px;">
          <h1 style="margin:0; font-size:24px;">Congratulations, ${safeName}!</h1>
          <p style="margin:8px 0 0; font-size:14px; opacity:0.95;">
            Your reward redemption is successful.
          </p>
        </div>
        <div style="padding:24px;">
          <p style="margin-top:0; line-height:1.6;">
            Great work! You have successfully redeemed <strong>${safeReward}</strong>.
            Thank you for being an active part of Go Carbon Positive.
          </p>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin:16px 0;">
            
            <p style="margin:0 0 8px;"><strong>Redeemed On:</strong> ${safeRedeemedAt}</p>
            <p style="margin:0 0 8px;"><strong>Reward:</strong> ${safeReward}</p>
            <p style="margin:0 0 8px;"><strong>Points Used:</strong> ${Number(pointsUsed || 0)}</p>
            <p style="margin:0;"><strong>Remaining Points:</strong> ${Number(remainingPoints || 0)}</p>
          </div>
          <p style="line-height:1.6;">
            Our team will connect with you soon regarding next steps and fulfillment details.
          </p>
          <p style="line-height:1.6; margin-bottom:0;">
            Keep participating, keep earning, and keep creating a positive climate impact.
          </p>
        </div>
      </div>
    </div>
  `;
};

const sendRedeemSuccessEmail = async ({
  to,
  userName,
  rewardName,
  pointsUsed,
  remainingPoints,
  redeemedAt
}) => {
  if (!to) {
    return { success: false, skipped: true, reason: 'missing recipient email' };
  }

  if (!process.env.TENANT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.MAILBOX) {
    return { success: false, skipped: true, reason: 'missing microsoft graph configuration' };
  }

  const html = buildRedeemSuccessTemplate({
    userName,
    rewardName,
    pointsUsed,
    remainingPoints,
    redeemedAt
  });

  if (!cachedToken || Date.now() >= tokenExpiryEpochMs) {
    const tokenPayload = new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials'
    });

    const tokenResponse = await fetch(GRAPH_TOKEN_URL(process.env.TENANT_ID), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenPayload.toString()
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Graph token fetch failed: ${errorText}`);
    }

    const tokenJson = await tokenResponse.json();
    cachedToken = tokenJson.access_token;
    tokenExpiryEpochMs = Date.now() + ((Number(tokenJson.expires_in) || 3600) - 60) * 1000;
  }

  const response = await fetch(GRAPH_SENDMAIL_URL(process.env.MAILBOX), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cachedToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: {
        subject: 'Congratulations! Your reward redemption is successful',
        body: {
          contentType: 'HTML',
          content: html
        },
        toRecipients: [
          {
            emailAddress: {
              address: to
            }
          }
        ]
      },
      saveToSentItems: true
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Redeem email failed via Graph: ${errorText}`);
  }

  return { success: true };
};

module.exports = {
  sendRedeemSuccessEmail
};
