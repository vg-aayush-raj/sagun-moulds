import apiClient from './client';

export interface InvoiceItem {
  cup_type: string;
  base_price_per_cup: number;
  quantity: number;
  gst_rate: number;
  cash_per_cup: number;
}

export interface Invoice {
  company_id: number;
  billing_date: string;
  items: InvoiceItem[];
}

export interface InvoiceListItem {
  id: number;
  invoice_number: string;
  company_name: string;
  billing_date: string;
  final_total: number;
  status: string;
  created_at: string;
}

export interface InvoiceDetailItem {
  cup_type: string;
  base_price_per_cup: number;
  quantity: number;
  gst_rate: number;
  gst_amount: number;
  cash_per_cup: number;
  cash_total: number;
  line_total: number;
}

export interface InvoiceDetail {
  id: number;
  invoice_number: string;
  company_name: string;
  billing_date: string;
  items: InvoiceDetailItem[];
  base_total: number;
  gst_total: number;
  cash_total: number;
  final_total: number;
  status: string;
  created_at: string;
}

export interface InvoicePreviewResponse {
  message: string;
  invoice: InvoiceDetail;
  preview_html: string;
}

export interface GSTBalance {
  total_credit: number;
  total_debit: number;
  available_balance: number;
}

export const invoiceApi = {
  getGSTCreditBalance: async () => {
    const response = await apiClient.get<GSTBalance>('/invoices/gst-credit-balance');
    return response.data;
  },

  createInvoice: async (data: Invoice) => {
    const response = await apiClient.post('/invoices/create', data);
    return response.data;
  },

  confirmInvoice: async (invoiceId: number) => {
    const response = await apiClient.post(`/invoices/confirm/${invoiceId}`);
    return response.data;
  },

  deleteInvoice: async (invoiceId: number) => {
    const response = await apiClient.delete(`/invoices/${invoiceId}`);
    return response.data;
  },

  getAllInvoices: async () => {
    const response = await apiClient.get('/invoices/list', { params: { page: 1, limit: 1000 } });
    return response.data.invoices as InvoiceListItem[];
  },

  listInvoices: async (page: number = 1, limit: number = 10) => {
    const response = await apiClient.get('/invoices/list', { params: { page, limit } });
    return response.data;
  },

  getInvoice: async (invoiceId: number) => {
    const response = await apiClient.get(`/invoices/${invoiceId}`);
    return response.data;
  },

  downloadInvoicePDF: async (invoiceId: number) => {
    const response = await apiClient.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
    return response.data;
  },
};
