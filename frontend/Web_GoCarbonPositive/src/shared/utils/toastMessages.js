export const TOAST_MSG = {
  AUTH: {
    LOGIN_SUCCESS: "Welcome back. You are now signed in.",
    LOGIN_ERROR: "Sign-in failed. Check your email and password and try again.",
    LOGIN_REQUIRED_REDIRECT: "You are not logged in. Redirecting to login...",
    NOT_VERIFIED: "Please verify your email to continue.",
    INACTIVE: "Your account is not active. Contact support for help.",
    RESET_LINK_SENT: "Reset link sent. Check your email for next steps.",
    LOGOUT_SUCCESS: "You have been signed out.",
  },

  REGISTER: {
    OTP_SENT: "We sent a verification code to your email.",
    FAILED: "Sign-up failed. Please try again.",
    TOO_MANY: "Too many attempts. Please try again later.",
  },

  OTP: {
    INVALID: "Enter a valid 6-digit verification code.",
    FAILED: "Verification failed. Please try again.",
    VERIFIED: "Email verified successfully.",
    RESENT: "A new verification code has been sent.",
    RESEND_FAILED: "Could not resend the code. Try again shortly.",
  },

  PROFILE: {
    REQUIRED: "Please fill in all required profile fields.",
    ADDRESS_REQUIRED: "Primary address and country are required.",
    SAVE_SUCCESS: "Profile saved successfully.",
    SAVE_FAILED: "Could not save your profile. Please try again.",
    FETCH_FAILED: "Could not load your profile. Please try again.",
  },

  API: {
    NETWORK: "Network error. Check your connection and try again.",
    SERVER: "Server error. Please try again in a moment.",
    UNAUTHORIZED: "Your session expired. Please sign in again.",
  },

  FORGOT: {
    EMPTY_EMAIL: "Enter your email to continue.",
    LINK_SENT: "Reset link sent. Please check your email.",
    FAILED: "Could not send reset link. Please try again.",
  },

  OAUTH: {
    SUCCESS: "Signed in with Google.",
    INVALID: "Google sign-in failed. Please try again.",
    NO_TOKEN: "Authentication token missing. Please try again.",
  },

  RESET: {
    MISMATCH: "Passwords do not match.",
    SUCCESS: "Password reset successful. You can now sign in.",
    INVALID: "Reset link is invalid or expired.",
  },

  CONTACT: {
    MESSAGE_SENT: "Message sent successfully. Reference: {id}.",
    MESSAGE_FAILED: "Could not send your message. Please try again.",
    LOGIN_REQUIRED: "Please sign in to raise a support query.",
  },

  TICKET: {
    SUBMITTED: "Your support query has been submitted. Ticket ID: {id}.",
    SUBMIT_FAILED: "Could not submit your query. Please try again.",
  },

  SHARE: {
    CANCELED: "Share canceled.",
    COPIED: "Link copied to clipboard.",
    COPY_FAILED: "Unable to copy link. Please copy it manually.",
  },

  TERMS: {
    OPENED: "Opening Terms of Service.",
  },

  PRIVACY: {
    OPENED: "Opening Privacy Policy.",
  },

  CAREER: {
    DELETE_FAILED: "Unable to delete the job. Please try again.",
  },

  ORG: {
    ID_VERIFIED: "ID verified successfully.",
    EMAIL_VERIFIED: "Email verified successfully.",
    REQUIRED_FIELDS: "Please fill all required fields.",
    VERIFY_REQUIRED: "Please verify both ID and email to continue.",
    REQUEST_SUBMITTED: "Organization request submitted successfully.",
    REQUEST_FAILED: "Could not submit organization request. Please try again.",
  },

  INFO: {
    FEATURE_TBD: "This feature is coming soon.",
    BACK: "Going back...",
  },
};
