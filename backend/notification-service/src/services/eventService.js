const logger = require('../utils/logger');
const NotificationService = require('./notificationService');

class EventService {
  // Process events from auth service
  static async processEvent(eventData) {
    try {
      const { event_type, user, ip_address, device_info, attempt_number } = eventData;

      logger.info(`Processing event: ${event_type}`, { user: user?.email });

      switch (event_type) {
        case 'user.signup':
          await NotificationService.handleSignup(user, { 
            ip: ip_address,
            connection: { remoteAddress: ip_address },
            get: () => device_info
          });
          break;

        case 'user.login':
          await NotificationService.handleLogin(user, {
            ip: ip_address,
            connection: { remoteAddress: ip_address },
            get: () => device_info
          });
          break;

        case 'user.login.failed':
          await NotificationService.handleFailedLogin(user.email, {
            ip: ip_address,
            connection: { remoteAddress: ip_address },
            get: () => device_info
          }, attempt_number || 1);
          break;

        case 'user.account.locked':
          await NotificationService.handleAccountLocked(user.email, {
            ip: ip_address,
            connection: { remoteAddress: ip_address },
            get: () => device_info
          });
          break;

        case 'user.email.verified':
          await NotificationService.handleEmailVerified(user);
          break;

        default:
          logger.warn(`Unknown event type: ${event_type}`);
      }
    } catch (error) {
      logger.error('Error processing event:', error);
      throw error;
    }
  }
}

module.exports = EventService;
