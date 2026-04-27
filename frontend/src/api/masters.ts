import api from './axios';
import type { Master, Page } from '../types';

export const mastersApi = {
  getAll: async (page = 0, size = 20): Promise<Page<Master>> => {
    const response = await api.get<Page<Master>>('/masters', {
      params: { page, size },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Master> => {
    const response = await api.get<Master>(`/masters/${id}`);
    return response.data;
  },

  getAvailable: async (page = 0, size = 20): Promise<Page<Master>> => {
    const response = await api.get<Page<Master>>('/masters/available', {
      params: { page, size },
    });
    return response.data;
  },

  updateAvailability: async (id: number, isAvailable: boolean): Promise<Master> => {
    const response = await api.patch<Master>(`/masters/${id}/availability`, null, {
      params: { isAvailable },
    });
    return response.data;
  },
};
