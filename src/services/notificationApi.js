const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      response: {
        status: response.status,
        data: errorData,
      },
    };
  }

  return response.json();
}

export const fetchNotifications = async (userId, unreadOnly = false) => {
  return apiRequest(`/notifications?userId=${userId}&unreadOnly=${unreadOnly}`);
};

export const markNotificationAsRead = async (id) => {
  return apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
};

export const markAllNotificationsAsRead = async (userId) => {
  return apiRequest('/notifications/read-all', {
    method: 'PATCH',
    body: JSON.stringify({ userId }),
  });
};
