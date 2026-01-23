import apiClient from './client';

// ============ Enums ============

export enum InvoicePatternType {
  NORMAL_WITH_GST = 'NORMAL_WITH_GST',
  MIXED_GST_CASH = 'MIXED_GST_CASH',
  UNDERBILLING = 'UNDERBILLING',
  MOSTLY_CASH = 'MOSTLY_CASH',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERPAID = 'OVERPAID',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI',
  CARD = 'CARD',
  NEFT_RTGS = 'NEFT_RTGS',
  OTHER = 'OTHER',
}

export enum PaymentType {
  REGULAR = 'REGULAR',
  ADVANCE = 'ADVANCE',
  CREDIT = 'CREDIT',
}

// ============ Invoice Types ============

export interface InvoiceItem {
  cup_type: string;
  base_price_per_cup: number;
  quantity: number;
  unit: string;
  gst_rate: number;
  gst_amount?: number;
  cash_per_cup: number;
  cash_total?: number;
  line_total?: number;
  billed_quantity?: number;
  cash_quantity?: number;
}

export interface UnderbillingConfig {
  agreed_price_per_unit: number;
  billed_price_per_unit: number;
  gst_rate: number;
  cash_difference_per_unit: number;
  underbilling_percentage: number;
  has_warning: boolean;
  warning_message?: string;
}

export interface InvoiceFrom {
  company_name: string;
  address?: string;
  contact?: string;
  email?: string;
  gstin?: string;
}

// Pattern Input Types
export interface NormalPatternInput {
  items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    base_price_per_cup: number;
    gst_rate: number;
  }>;
}

export interface MixedPatternInput {
  items: Array<{
    cup_type: string;
    gst_quantity: number;
    cash_quantity: number;
    unit: string;
    base_price_per_cup: number;
    gst_rate: number;
  }>;
}

export interface UnderbillingPatternInput {
  items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    agreed_price_per_cup: number;
    billed_price_per_cup: number;
    gst_rate: number;
  }>;
}

export interface MostlyCashPatternInput {
  items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    cash_price_per_cup: number;
  }>;
  gst_items?: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    base_price_per_cup: number;
    gst_rate: number;
  }>;
}

export interface CreateInvoiceRequest {
  company_id: number;
  from: InvoiceFrom;
  billing_date: string;
  due_date?: string;
  payment_terms?: string;
  pattern_type: InvoicePatternType;
  pattern_input: NormalPatternInput | MixedPatternInput | UnderbillingPatternInput | MostlyCashPatternInput;
  notes?: string;
  terms_conditions?: string;
  include_vehicle?: boolean;
  vehicle_type?: string;
  vehicle_number?: string;
  destination?: string;
}

export interface InvoiceListItem {
  id: number;
  invoice_number: string;
  company_name: string;
  billing_date: string;
  due_date: string | null;
  pattern_type: InvoicePatternType;
  final_total: number;
  billed_amount: number;
  amount_paid: number;
  amount_due: number;
  payment_status: PaymentStatus;
  status: string;
  created_at: string;
}

// Alias for backward compatibility
export type Invoice = InvoiceListItem;

export interface ListInvoicesResponse {
  invoices: InvoiceListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface InvoiceDetail {
  id: number;
  invoice_number: string;
  company_name: string;
  company_id: number;
  from: InvoiceFrom;
  billing_date: string;
  due_date: string | null;
  payment_terms: string | null;
  pattern_type: InvoicePatternType;
  underbilling_config: UnderbillingConfig | null;
  items: InvoiceItem[];
  base_total: number;
  gst_total: number;
  cash_total: number;
  final_total: number;
  billed_amount: number;
  amount_paid: number;
  amount_due: number;
  payment_status: PaymentStatus;
  status: string;
  notes: string | null;
  terms_conditions: string | null;
  include_vehicle: boolean;
  vehicle_type: string | null;
  vehicle_number: string | null;
  destination: string | null;
  payments: PaymentRecord[];
  created_at: string;
  updated_at: string;
}

export interface InvoicePreviewResponse {
  message: string;
  invoice: {
    id: number;
    invoice_number: string;
    company: string;
    billing_date: string;
    due_date: string | null;
    pattern_type: InvoicePatternType;
    base_total: number;
    gst_total: number;
    cash_total: number;
    final_total: number;
    billed_amount: number;
    payment_status: PaymentStatus;
    status: string;
  };
  preview_html: string;
  warning?: string;
}

export interface GSTBalance {
  total_credit: number;
  total_debit: number;
  available_balance: number;
}

// ============ Payment Types ============

export interface PaymentRecord {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  reference_number: string | null;
  notes: string | null;
  recorded_by?: string | null;
  created_at?: string;
}

export interface RecordPaymentRequest {
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_type?: PaymentType;
  reference_number?: string;
  notes?: string;
  recorded_by?: string;
}

export interface MultiInvoicePaymentRequest {
  company_id: number;
  total_amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
  allocations?: Array<{
    invoice_id: number;
    amount: number;
  }>;
}

export interface PaymentSummary {
  total_invoiced: number;
  total_paid: number;
  total_due: number;
  payment_count: number;
}

export interface CustomerDuesSummary {
  company_id: number;
  company_name: string;
  total_invoiced: number;
  total_paid: number;
  total_due: number;
  oldest_due_date: string | null;
  invoice_count: number;
}

// ============ Report Types ============

export interface CashInflowReport {
  total_cash_collected: number;
  by_pattern: Array<{
    pattern_type: InvoicePatternType;
    pattern_name: string;
    total_cash: number;
    invoice_count: number;
  }>;
  by_payment_method: Array<{
    payment_method: string;
    amount: number;
    count: number;
  }>;
  period_start: string;
  period_end: string;
}

export interface BankPaymentReport {
  total_bank_payments: number;
  by_method: Array<{
    payment_method: PaymentMethod;
    amount: number;
    transaction_count: number;
  }>;
  period_start: string;
  period_end: string;
}

export interface GSTReport {
  inflow: {
    total_credit: number;
    total_debit: number;
    net_gst_payable: number;
  };
  by_pattern: Array<{
    pattern_type: InvoicePatternType;
    pattern_name: string;
    total_gst: number;
    invoice_count: number;
  }>;
  period_start: string;
  period_end: string;
}

export interface AgingBucket {
  label: string;
  days_range: string;
  total_due: number;
  invoice_count: number;
  invoices: Array<{
    invoice_number: string;
    company_name: string;
    billing_date: string;
    due_date: string | null;
    days_overdue: number;
    amount_due: number;
  }>;
}

export interface AgingReport {
  current: AgingBucket;
  overdue_1_30: AgingBucket;
  overdue_31_60: AgingBucket;
  overdue_61_90: AgingBucket;
  overdue_90_plus: AgingBucket;
  total_outstanding: number;
  as_of_date: string;
}

export interface CustomerStatementEntry {
  date: string;
  type: 'INVOICE' | 'PAYMENT';
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerStatement {
  company_id: number;
  company_name: string;
  statement_period_start: string;
  statement_period_end: string;
  opening_balance: number;
  closing_balance: number;
  total_invoiced: number;
  total_paid: number;
  entries: CustomerStatementEntry[];
}

// ============ API Methods ============

export const invoiceApi = {
  // ========== Invoice Management ==========

  getGSTCreditBalance: async () => {
    const response = await apiClient.get<GSTBalance>('/invoices/gst-credit-balance');
    return response.data;
  },

  createInvoice: async (data: CreateInvoiceRequest) => {
    const response = await apiClient.post<InvoicePreviewResponse>('/invoices/create', data);
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

  listInvoices: async (params?: {
    page?: number;
    limit?: number;
    pattern_type?: InvoicePatternType;
    payment_status?: PaymentStatus | PaymentStatus[];
    status?: string;
    company_id?: number;
  }): Promise<ListInvoicesResponse> => {
    const response = await apiClient.get('/invoices/list', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        ...params,
      },
    });
    return response.data;
  },

  getAllInvoices: async () => {
    const response = await apiClient.get('/invoices/list', { params: { page: 1, limit: 1000 } });
    return response.data.invoices as InvoiceListItem[];
  },

  getInvoice: async (invoiceId: number) => {
    const response = await apiClient.get<InvoiceDetail>(`/invoices/${invoiceId}`);
    return response.data;
  },

  downloadInvoicePDF: async (invoiceId: number) => {
    const response = await apiClient.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
    return response.data;
  },

  // ========== Payment Management ==========

  recordPayment: async (invoiceId: number, data: RecordPaymentRequest) => {
    const response = await apiClient.post(`/invoices/${invoiceId}/payments`, data);
    return response.data;
  },

  getPaymentHistory: async (invoiceId: number) => {
    const response = await apiClient.get<{
      summary: PaymentSummary;
      payments: PaymentRecord[];
    }>(`/invoices/${invoiceId}/payments`);
    return response.data;
  },

  recordMultiInvoicePayment: async (data: MultiInvoicePaymentRequest) => {
    const response = await apiClient.post('/invoices/payments/multi', data);
    return response.data;
  },

  getCompanyDues: async (companyId: number) => {
    const response = await apiClient.get<CustomerDuesSummary>(`/invoices/companies/${companyId}/dues`);
    return response.data;
  },

  getAllCustomerDues: async () => {
    const response = await apiClient.get<{
      total_customers: number;
      total_outstanding: number;
      customers: CustomerDuesSummary[];
    }>('/invoices/dues/all');
    return response.data;
  },

  // ========== Reports ==========

  getCashInflowReport: async (params: { start_date: string; end_date: string }) => {
    const response = await apiClient.get<CashInflowReport>('/reports/cash-inflow', {
      params,
    });
    return response.data;
  },

  getBankPaymentReport: async (params: { start_date: string; end_date: string }) => {
    const response = await apiClient.get<BankPaymentReport>('/reports/bank-payments', {
      params,
    });
    return response.data;
  },

  getGSTReport: async (params: { start_date: string; end_date: string }) => {
    const response = await apiClient.get<GSTReport>('/reports/gst', {
      params,
    });
    return response.data;
  },

  getAgingReport: async (params?: { as_of_date?: string }) => {
    const response = await apiClient.get<AgingReport>('/reports/aging', {
      params,
    });
    return response.data;
  },

  getCustomerStatement: async (companyId: number, params: { start_date: string; end_date: string }) => {
    const response = await apiClient.get<CustomerStatement>(`/reports/customer-statement/${companyId}`, {
      params,
    });
    return response.data;
  },

  downloadGSTR1Excel: async (params: { start_date: string; end_date: string }) => {
    const response = await apiClient.get('/reports/gstr1/download', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};
