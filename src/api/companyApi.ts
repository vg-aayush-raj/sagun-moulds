import apiClient from './client';

export interface Company {
  id?: number;
  name: string;
  address?: string;
  gstin?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  bank_details?: {
    account_number?: string;
    ifsc?: string;
    bank_name?: string;
    branch?: string;
  };
}

export const companyApi = {
  create: async (data: Company) => {
    const response = await apiClient.post('/companies', data);
    return response.data;
  },

  list: async () => {
    const response = await apiClient.get<Company[]>('/companies');
    return response.data;
  },

  get: async (companyId: number) => {
    const response = await apiClient.get<Company>(`/companies/${companyId}`);
    return response.data;
  },

  update: async (companyId: number, data: Company) => {
    const response = await apiClient.put(`/companies/${companyId}`, data);
    return response.data;
  },

  delete: async (companyId: number) => {
    const response = await apiClient.delete(`/companies/${companyId}`);
    return response.data;
  },
};
