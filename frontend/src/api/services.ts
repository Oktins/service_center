import api from './axios';
import type { ServiceCatalog, ServiceCatalogCreate } from '../types';
import { ServiceCategory } from '../types';

export const servicesApi = {
  getAll: async (): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>('/api/services');
    return response.data;
  },

  getByCategory: async (category: ServiceCategory): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>(`/api/services/category/${category}`);
    return response.data;
  },

  create: async (data: ServiceCatalogCreate): Promise<ServiceCatalog> => {
    const response = await api.post<ServiceCatalog>('/api/services', data);
    return response.data;
  },

  update: async (id: number, data: ServiceCatalogCreate): Promise<ServiceCatalog> => {
    const response = await api.put<ServiceCatalog>(`/api/services/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/services/${id}`);
  },
};
