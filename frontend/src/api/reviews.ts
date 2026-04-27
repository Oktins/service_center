import api from './axios';
import type { Review, Page } from '../types';

export const reviewsApi = {
  getByMaster: async (masterId: number, page = 0, size = 10): Promise<Page<Review>> => {
    const response = await api.get<Page<Review>>(`/api/reviews/master/${masterId}`, {
      params: { page, size },
    });
    return response.data;
  },

  getByRequest: async (serviceRequestId: number): Promise<Review> => {
    const response = await api.get<Review>(`/api/reviews/request/${serviceRequestId}`);
    return response.data;
  },

  create: async (serviceRequestId: number, data: { rating: number; comment: string }): Promise<Review> => {
    const response = await api.post<Review>(`/api/reviews/request/${serviceRequestId}`, {
      serviceRequestId,
      ...data,
    });
    return response.data;
  },
};
