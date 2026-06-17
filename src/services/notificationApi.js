import { apiFetch } from './api';

export const fetchNotifications = async (unreadOnly = false) => {
  const params = new URLSearchParams();
  if (unreadOnly) params.set('unreadOnly', 'true');
  return apiFetch(`/notifications?${params.toString()}`);
};

export const markNotificationAsRead = async (id) => {
  return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
};

export const markAllNotificationsAsRead = async () => {
  return apiFetch('/notifications/read-all', { method: 'PATCH' });
};
