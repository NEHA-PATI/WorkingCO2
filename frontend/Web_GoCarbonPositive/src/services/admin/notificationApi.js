import { notificationApiClient as apiClient } from "../apiClient";


const BASE = "/api/v1/notifications";

export const fetchNotifications = (filters = {}) =>
  apiClient.get(BASE, { params: filters }).then((res) => res.data);

export const fetchUnreadCount = () =>
  apiClient.get(`${BASE}/unread`).then((res) => res.data);

export const fetchNotificationStats = () =>
  apiClient.get(`${BASE}/stats`).then((res) => res.data);

export const fetchUserNotifications = (userId, options = {}) =>
  apiClient
    .get(`${BASE}/user/${userId}`, { params: options })
    .then((res) => res.data);

export const markAsRead = (notificationId) =>
  apiClient
    .patch(`${BASE}/${notificationId}/read`)
    .then((res) => res.data);

export const markAllAsRead = () =>
  apiClient.patch(`${BASE}/read/all`).then((res) => res.data);

export const deleteNotification = (notificationId) =>
  apiClient
    .delete(`${BASE}/${notificationId}`)
    .then((res) => res.data);
