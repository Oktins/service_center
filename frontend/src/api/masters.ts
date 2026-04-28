import api from './axios';
import type { Master, Page, CreateMasterProfileRequest } from '../types';

export const mastersApi = {
  getAll: async (page = 0, size = 20, sort = 'id,asc'): Promise<Page<Master>> => {
    const response = await api.get<Page<Master>>('/api/masters', {
      params: { page, size, sort },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Master> => {
    const response = await api.get<Master>(`/api/masters/${id}`);
    return response.data;
  },

  createProfile: async ({ userId, specialization, experienceYears }: CreateMasterProfileRequest): Promise<Master> => {
    const response = await api.post<Master>(`/api/masters/user/${userId}`, null, {
      params: { specialization, experienceYears },
    });
    return response.data;
  },

  getAvailable: async (page = 0, size = 20): Promise<Page<Master>> => {
    const response = await api.get<Page<Master>>('/api/masters/available', {
      params: { page, size },
    });
    return response.data;
  },

  updateAvailability: async (id: number, isAvailable: boolean): Promise<Master> => {
    const response = await api.patch<Master>(`/api/masters/${id}/availability`, null, {
      params: { isAvailable },
    });
    return response.data;
  },
};
