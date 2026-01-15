const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const { NOTIFICATION_TYPES } = require('../config/constants');

class NotificationService {
  // Handle user signup event
  static async handleSignup(userData, req) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const deviceInfo = req.get('user-agent') || 'Unknown device';

      const notification = await Notification.create({
        event_type: NOTIFICATION_TYPES.USER_SIGNUP,
        user_id: userData.id,
        username: userData.username,
        email: userData.email,
        user_role: userData.role_name,
        ip_address: ipAddress,
        device_info: deviceInfo,
        metadata: {
          action: 'New user registration',
          timestamp: new Date().toISOString(),
          source: 'signup'
        }
      });

      logger.info(`Signup notification created for user: ${userData.email}`);
      return notification;
    } catch (error) {
      logger.error('Error handling signup notification:', error);
      throw error;
    }
  }

  // Handle user login event
  static async handleLogin(userData, req) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const deviceInfo = req.get('user-agent') || 'Unknown device';

      const notification = await Notification.create({
        event_type: NOTIFICATION_TYPES.USER_LOGIN,
        user_id: userData.id,
        username: userData.username,
        email: userData.email,
        user_role: userData.role_name,
        ip_address: ipAddress,
        device_info: deviceInfo,
        metadata: {
          action: 'User login',
          timestamp: new Date().toISOString(),
          source: 'login'
        }
      });

      logger.info(`Login notification created for user: ${userData.email}`);
      return notification;
    } catch (error) {
      logger.error('Error handling login notification:', error);
      throw error;
    }
  }

  // Handle failed login event
  static async handleFailedLogin(email, req, attemptNumber = 1) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const deviceInfo = req.get('user-agent') || 'Unknown device';

      const severity = attemptNumber >= 3 ? 'high' : 'low';

      const notification = await Notification.create({
        event_type: NOTIFICATION_TYPES.FAILED_LOGIN,
        username: 'Unknown',
        email: email,
        user_role: 'unknown',
        ip_address: ipAddress,
        device_info: deviceInfo,
        metadata: {
          action: 'Failed login attempt',
          timestamp: new Date().toISOString(),
          attempt_number: attemptNumber,
          severity: severity,
          source: 'login'
        }
      });

      logger.warn(`Failed login attempt for: ${email} (Attempt: ${attemptNumber})`);
      return notification;
    } catch (error) {
      logger.error('Error handling failed login notification:', error);
      throw error;
    }
  }

  // Handle account locked event
  static async handleAccountLocked(email, req) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const deviceInfo = req.get('user-agent') || 'Unknown device';

      const notification = await Notification.create({
        event_type: NOTIFICATION_TYPES.ACCOUNT_LOCKED,
        username: 'Unknown',
        email: email,
        user_role: 'unknown',
        ip_address: ipAddress,
        device_info: deviceInfo,
        metadata: {
          action: 'Account locked',
          timestamp: new Date().toISOString(),
          reason: 'Multiple failed login attempts',
          severity: 'critical',
          source: 'security'
        }
      });

      logger.warn(`Account locked: ${email}`);
      return notification;
    } catch (error) {
      logger.error('Error handling account locked notification:', error);
      throw error;
    }
  }

  // Handle email verified event
  static async handleEmailVerified(userData) {
    try {
      const notification = await Notification.create({
        event_type: NOTIFICATION_TYPES.EMAIL_VERIFIED,
        user_id: userData.id,
        username: userData.username,
        email: userData.email,
        user_role: userData.role_name,
        ip_address: 'system',
        device_info: 'system',
        metadata: {
          action: 'Email verified',
          timestamp: new Date().toISOString(),
          source: 'email'
        }
      });

      logger.info(`Email verified for user: ${userData.email}`);
      return notification;
    } catch (error) {
      logger.error('Error handling email verified notification:', error);
      throw error;
    }
  }

  // Get stats
  static async getStats(hoursBack = 24) {
    try {
      const stats = await Notification.getStats(hoursBack);
      return stats;
    } catch (error) {
      logger.error('Error fetching stats:', error);
      throw error;
    }
  }
}

module.exports = NotificationService;
