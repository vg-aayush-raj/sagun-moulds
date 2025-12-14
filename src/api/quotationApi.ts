import apiClient from './client';

export interface QuotationItem {
  sn: number;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface QuotationFrom {
  company_name: string;
  address: string;
  contact?: string;
  email?: string;
  gstin?: string;
}

export interface Quotation {
  company_id: number;
  from: QuotationFrom;
  items: QuotationItem[];
  terms_conditions: string;
  gst?: string;
  quotation_date: string | Date;
  validity_days?: number;
  remarks?: string;
}

export interface QuotationListItem {
  id: number;
  quotation_number: string;
  company: string;
  quotation_date: string;
  total_amount: number;
  items_count: number;
  created_at: string;
}

export interface QuotationDetail extends QuotationListItem {
  from: QuotationFrom;
  items: QuotationItem[];
  terms_conditions: string;
  gst?: string;
  subtotal: number;
  gst_amount?: number;
  validity_days: number;
  remarks?: string;
}

export const quotationApi = {
  create: async (data: Quotation) => {
    const response = await apiClient.post('/quotations/create', data);
    return response.data;
  },

  list: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/quotations/list', { params: { page, limit } });
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/quotations/list', { params: { page: 1, limit: 1000 } });
    return response.data.quotations as QuotationListItem[];
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/quotations/${id}`);
    return response.data as QuotationDetail;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/quotations/${id}`);
    return response.data;
  },

  viewPDF: async (id: number) => {
    const response = await apiClient.get(`/quotations/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },

  downloadPDF: async (id: number) => {
    const response = await apiClient.get(`/quotations/${id}/download`, { responseType: 'blob' });
    return response.data;
  },
};
