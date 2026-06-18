import { apiFetch } from './api';

export const userService = {
  getUsers: async (page = 1, limit = 50) => {
    const result = await apiFetch(`/users?page=${page}&limit=${limit}`);
    return result.data || [];
  },

  getUser: async (id) => {
    return apiFetch(`/users/${id}`);
  },

  createUser: async (userData) => {
    return apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  updateUser: async (id, userData) => {
    return apiFetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },

  updateUserRole: async (id, roleData) => {
    return apiFetch(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify(roleData),
    });
  },

  updateUserStaffSettings: async (id, settingsData) => {
    return apiFetch(`/users/${id}/staff-settings`, {
      method: 'PATCH',
      body: JSON.stringify(settingsData),
    });
  },

  deleteUser: async (id) => {
    return apiFetch(`/users/${id}`, { method: 'DELETE' });
  },
};
