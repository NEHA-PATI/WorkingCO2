const otpTemplate = ({ otp }) => `
  <div style="background:#f3f4f6;padding:30px 0;font-family:Arial, sans-serif;">
    <div style="
      max-width:520px;
      margin:0 auto;
      background:#ffffff;
      border-radius:6px;
      overflow:hidden;
      box-shadow:0 2px 8px rgba(0,0,0,0.08);
    ">

      <!-- Header -->
      <div style="background:#16a34a;padding:16px;text-align:center;">
        <h2 style="margin:0;color:#ffffff;font-size:20px;">
          Your OTP Code
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:24px;color:#111827;">
        <p style="margin:0 0 12px;">Hello,</p>

        <p style="margin:0 0 16px;font-size:14px;">
          Your One-Time Password (OTP) for account verification is:
        </p>

        <!-- OTP Box -->
        <div style="
          background:#f0fdf4;
          border:1px solid #bbf7d0;
          border-radius:6px;
          padding:14px;
          text-align:center;
          margin:20px 0;
        ">
          <span style="
            font-size:26px;
            font-weight:700;
            letter-spacing:4px;
            color:#16a34a;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:13px;color:#374151;margin:0 0 10px;">
          This OTP is valid for <b>10 minutes</b>. Please do not share this code with anyone.
        </p>

        <p style="font-size:13px;color:#6b7280;margin:0;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="
        background:#f9fafb;
        border-top:1px solid #e5e7eb;
        padding:14px;
        text-align:center;
        font-size:12px;
        color:#6b7280;
      ">
        © 2026 Carbon Positive. All rights reserved.
      </div>

    </div>
  </div>
`;

module.exports = otpTemplate;
