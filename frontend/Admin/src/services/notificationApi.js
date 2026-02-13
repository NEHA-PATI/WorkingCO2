import notificationClient from '../api/notificationClient';

const BASE = '/api/v1/notifications';

export const fetchNotifications = (filters = {}) =>
  notificationClient.get(BASE, { params: filters }).then(res => res.data);

export const fetchUnreadCount = () =>
  notificationClient.get(`${BASE}/unread`).then(res => res.data);

export const fetchNotificationStats = () =>
  notificationClient.get(`${BASE}/stats`).then(res => res.data);

export const fetchUserNotifications = (userId, options = {}) =>
  notificationClient
    .get(`${BASE}/user/${userId}`, { params: options })
    .then(res => res.data);

export const markAsRead = (notificationId) =>
  notificationClient
    .patch(`${BASE}/${notificationId}/read`)
    .then(res => res.data);

export const markAllAsRead = () =>
  notificationClient
    .patch(`${BASE}/read/all`)
    .then(res => res.data);

export const deleteNotification = (notificationId) =>
  notificationClient
    .delete(`${BASE}/${notificationId}`)
    .then(res => res.data);
