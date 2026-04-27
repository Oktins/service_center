import api from './axios';
import type { News, NewsCreate } from '../types';

export const newsApi = {
  getAll: async (): Promise<News[]> => {
    const response = await api.get<News[]>('/news');
    return response.data;
  },

  create: async (data: NewsCreate): Promise<News> => {
    const response = await api.post<News>('/news', data);
    return response.data;
  },

  update: async (id: number, data: NewsCreate): Promise<News> => {
    const response = await api.put<News>(`/news/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/news/${id}`);
  },
};
