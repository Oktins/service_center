import api from './axios';
import type { User, Page, UpdateUserRole } from '../types';

export const usersApi = {
  getAll: async (page = 0, size = 20, sort = 'id,asc'): Promise<Page<User>> => {
    const response = await api.get<Page<User>>('/api/v1/users', {
      params: { page, size, sort },
    });
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/api/v1/users/${id}`);
    return response.data;
  },

  updateRole: async (id: number, data: UpdateUserRole): Promise<User> => {
    const response = await api.patch<User>(`/api/v1/users/${id}/role`, data);
    return response.data;
  },

  getCurrentUser: async (token?: string): Promise<User> => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<User>('/api/v1/users/me', config);
    return response.data;
  },
};
