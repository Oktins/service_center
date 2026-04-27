import api from './axios';
import type { SparePart, SparePartCreate, SparePartUsage, SparePartUsageCreate, Page } from '../types';

export const sparePartsApi = {
  getAll: async (page = 0, size = 20): Promise<Page<SparePart>> => {
    const response = await api.get<Page<SparePart>>('/spare-parts', {
      params: { page, size },
    });
    return response.data;
  },

  getById: async (id: number): Promise<SparePart> => {
    const response = await api.get<SparePart>(`/spare-parts/${id}`);
    return response.data;
  },

  create: async (data: SparePartCreate): Promise<SparePart> => {
    const response = await api.post<SparePart>('/spare-parts', data);
    return response.data;
  },

  addStock: async (id: number, quantity: number): Promise<SparePart> => {
    const response = await api.patch<SparePart>(`/spare-parts/${id}/add-stock`, null, {
      params: { quantity },
    });
    return response.data;
  },

  getLowStock: async (page = 0, size = 20): Promise<Page<SparePart>> => {
    const response = await api.get<Page<SparePart>>('/spare-parts/low-stock', {
      params: { page, size },
    });
    return response.data;
  },
};

export const sparePartUsageApi = {
  useForRequest: async (serviceRequestId: number, data: SparePartUsageCreate): Promise<SparePartUsage> => {
    const response = await api.post<SparePartUsage>(`/spare-parts-usage/request/${serviceRequestId}`, data);
    return response.data;
  },

  getByRequest: async (serviceRequestId: number, page = 0, size = 20): Promise<Page<SparePartUsage>> => {
    const response = await api.get<Page<SparePartUsage>>(`/spare-parts-usage/request/${serviceRequestId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getTotalCost: async (serviceRequestId: number): Promise<number> => {
    const response = await api.get<number>(`/spare-parts-usage/request/${serviceRequestId}/total-cost`);
    return response.data;
  },
};
