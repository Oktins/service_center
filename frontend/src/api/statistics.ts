import api from './axios';
import type { Statistics, CostCalculation } from '../types';
import { Priority } from '../types';

export const statisticsApi = {
  get: async (): Promise<Statistics> => {
    const response = await api.get<Statistics>('/v1/statistics');
    return response.data;
  },
};

export const costApi = {
  calculate: async (baseCost: number, priority: Priority): Promise<CostCalculation> => {
    const response = await api.get<CostCalculation>('/v1/cost/calculate', {
      params: { baseCost, priority },
    });
    return response.data;
  },
};
