import api from './axios';
import type { ServiceCatalog, ServiceCatalogCreate } from '../types';
import { ServiceCategory } from '../types';

export const servicesApi = {
  getAll: async (): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>('/services');
    return response.data;
  },

  getByCategory: async (category: ServiceCategory): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>(`/services/category/${category}`);
    return response.data;
  },

  create: async (data: ServiceCatalogCreate): Promise<ServiceCatalog> => {
    const response = await api.post<ServiceCatalog>('/services', data);
    return response.data;
  },

  update: async (id: number, data: ServiceCatalogCreate): Promise<ServiceCatalog> => {
    const response = await api.put<ServiceCatalog>(`/services/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
