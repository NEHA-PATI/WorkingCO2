export const TOAST_MSG = {
AUTH: {
  LOGIN_SUCCESS: "Login successful! Welcome back 🌱",
  LOGIN_ERROR: "Login failed – check credentials",
  NOT_VERIFIED: "Please verify your email first",
  INACTIVE: "Your account is not active",
  RESET_LINK_SENT: "Password reset link sent to your email "
},


REGISTER: {
  OTP_SENT: "OTP sent to your email",
  FAILED: "Signup failed – try again",
  TOO_MANY: "Too many attempts – try later",
},

OTP: {
  INVALID: "Enter valid 6-digit OTP",
  FAILED: "OTP verification failed",
  VERIFIED: "Email verified successfully..",
  RESENT: "OTP resent successfully",
  RESEND_FAILED: "Could not resend OTP",
},


 
PROFILE: {
  REQUIRED: "Please fill all required fields",
  ADDRESS_REQUIRED: "Primary address and country are required",
  SAVE_SUCCESS: "Profile saved successfully 🎉",
  SAVE_FAILED: "Failed to save profile",
  FETCH_FAILED: "Could not load profile",
},

  API: {
    NETWORK: "Network issue – check internet",
    SERVER: "Server is not responding",
    UNAUTHORIZED: "Session expired – login again",
  },

  FORGOT: {
  EMPTY_EMAIL: "Please enter your email first",
  LINK_SENT: "Password reset link sent to your email 📩",
  FAILED: "Could not send reset link",
}, 
OAUTH: {
  SUCCESS: "Logged in with Google ",
  INVALID: "Google login failed",
  NO_TOKEN: "Authentication token missing",
},
RESET: {
  MISMATCH: "Passwords do not match",
  SUCCESS: "Password reset successful 🔐",
  INVALID: "Reset link expired or invalid",
}




};
