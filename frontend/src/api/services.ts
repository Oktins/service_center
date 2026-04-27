import api from './axios';
import type { ServiceCatalog, ServiceCatalogCreate, Category } from '../types';

export const servicesApi = {
  getAll: async (): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>('/api/services');
    return response.data;
  },

  getByCategory: async (categoryId: number): Promise<ServiceCatalog[]> => {
    const response = await api.get<ServiceCatalog[]>(`/api/services/category/${categoryId}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/api/categories/tree');
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
