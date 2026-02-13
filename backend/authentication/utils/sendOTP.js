// const { Resend } = require("resend");
// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendOTP = async (email, otp) => {
//   const htmlContent = `
//     <div style="font-family:Arial, sans-serif; padding:20px;">
//         <h2>Your OTP Code</h2>
//         <p>Hello 👋,</p>
//         <p>Your One-Time Password (OTP) is:</p>
//         <h3 style="color:#2b6cb0;">${otp}</h3>
//         <p>This code will expire in 10 minutes.</p>
//         <br/>
//         <p>— The Team</p>
//       </div>
//   `;

//   await resend.emails.send({
//     from: "Carbon Positive <onboarding@resend.dev>",
//     to: "soumikbasu2003@gmail.com",        // ✅ Hardcoded now 
//     subject: "Your OTP Code",
//     html: htmlContent,
//   });
// };

// module.exports = sendOTP;


require("dotenv").config();
const axios = require("axios");
const qs = require("qs");

let cachedToken = null;
let tokenExpiry = null;

// 🔹 Get Access Token (with caching)
const getAccessToken = async () => {
  // If token exists and not expired, reuse it
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

  // Token expires in seconds → convert to ms and subtract 1 min buffer
  tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

  return cachedToken;
};

const sendOTP = async (email, otp) => {
  try {
    const token = await getAccessToken();

    const htmlContent = `
      <div style="font-family:Arial, sans-serif; padding:20px;">
        <h2>Your OTP Code</h2>
        <p>Hello 👋,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h3 style="color:#2b6cb0;">${otp}</h3>
        <p>This code will expire in 10 minutes.</p>
        <br/>
        <p>— The Team</p>
      </div>
    `;

    await axios.post(
      `https://graph.microsoft.com/v1.0/users/${process.env.MAILBOX}/sendMail`,
      {
        message: {
          subject: "Your OTP Code",
          body: {
            contentType: "HTML",
            content: htmlContent,
          },
          toRecipients: [
            {
              emailAddress: {
                address: email,
              },
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true };

  } catch (error) {
    console.error(
      "Microsoft Graph OTP Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};

module.exports = sendOTP;
