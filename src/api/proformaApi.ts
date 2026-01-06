import apiClient from './client';

export interface ProformaItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Proforma {
  company_id: number;
  items: ProformaItem[];
  terms_conditions?: string;
  validity_days?: number;
}

export interface ProformaInvoice {
  id: number;
  proforma_number: string;
  company_name: string;
  items_count: number;
  total_amount: number;
  validity_date: string | null;
  created_at: string;
}

export const proformaApi = {
  create: async (data: Proforma) => {
    const response = await apiClient.post('/proforma/create', data);
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/proforma/list', { params: { page: 1, limit: 1000 } });
    return response.data.proformas as ProformaInvoice[];
  },

  list: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/proforma/list', { params: { page, limit } });
    return response.data;
  },

  get: async (proformaId: number) => {
    const response = await apiClient.get(`/proforma/${proformaId}`);
    return response.data;
  },

  downloadProformaPDF: async (proformaId: number) => {
    const response = await apiClient.get(`/proforma/${proformaId}/download`, { responseType: 'blob' });
    return response.data;
  },

  // Alias for backward compatibility
  downloadPDF: async (proformaId: number) => {
    const response = await apiClient.get(`/proforma/${proformaId}/download`, { responseType: 'blob' });
    return response.data;
  },
};
