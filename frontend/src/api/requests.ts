import api from './axios';
import type { ServiceRequest, ServiceRequestCreate, Page } from '../types';
import { RequestStatus } from '../types';

export const requestsApi = {
  getAll: async (page = 0, size = 20, sort = 'id,asc'): Promise<Page<ServiceRequest>> => {
    const response = await api.get<Page<ServiceRequest>>('/api/service-requests', {
      params: { page, size, sort },
    });
    return response.data;
  },

  getById: async (id: number): Promise<ServiceRequest> => {
    const response = await api.get<ServiceRequest>(`/api/service-requests/${id}`);
    return response.data;
  },

  getByClient: async (clientId: number, page = 0, size = 20): Promise<Page<ServiceRequest>> => {
    const response = await api.get<Page<ServiceRequest>>(`/api/service-requests/client/${clientId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getByMaster: async (masterId: number, page = 0, size = 20): Promise<Page<ServiceRequest>> => {
    const response = await api.get<Page<ServiceRequest>>(`/api/service-requests/master/${masterId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getByStatus: async (status: RequestStatus, page = 0, size = 20): Promise<Page<ServiceRequest>> => {
    const response = await api.get<Page<ServiceRequest>>('/api/service-requests/status', {
      params: { status, page, size },
    });
    return response.data;
  },

  create: async (data: ServiceRequestCreate): Promise<ServiceRequest> => {
    const response = await api.post<ServiceRequest>('/api/service-requests', data);
    return response.data;
  },

  updateStatus: async (id: number, status: RequestStatus): Promise<ServiceRequest> => {
    const response = await api.put<ServiceRequest>(`/api/service-requests/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  assignMaster: async (id: number, masterId: number): Promise<ServiceRequest> => {
    const response = await api.put<ServiceRequest>(`/api/service-requests/${id}/assign/${masterId}`);
    return response.data;
  },
};
