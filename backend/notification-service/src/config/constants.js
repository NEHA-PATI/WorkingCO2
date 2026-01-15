module.exports = {
  // Notification types
  NOTIFICATION_TYPES: {
    USER_SIGNUP: 'signup',
    USER_LOGIN: 'login',
    FAILED_LOGIN: 'failed_login',
    ACCOUNT_LOCKED: 'account_locked',
    EMAIL_VERIFIED: 'email_verified',
    PASSWORD_CHANGED: 'password_changed',
    ADMIN_ACTION: 'admin_action'
  },

  // Notification status
  NOTIFICATION_STATUS: {
    NEW: 'new',
    READ: 'read',
    DISMISSED: 'dismissed'
  },

  // Roles
  ROLES: {
    USER: 'USER',
    ADMIN: 'ADMIN',
    ORG: 'ORG'
  },

  // Messages
  MESSAGES: {
    NOTIFICATION_CREATED: 'Notification created successfully',
    NOTIFICATIONS_FETCHED: 'Notifications fetched successfully',
    NOTIFICATION_MARKED_READ: 'Notification marked as read',
    ALL_MARKED_READ: 'All notifications marked as read',
    INVALID_TOKEN: 'Invalid or expired token',
    UNAUTHORIZED: 'Unauthorized access',
    NOT_FOUND: 'Notification not found',
    ERROR: 'An error occurred'
  }
};
