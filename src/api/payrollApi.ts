import apiClient from './client';

export interface Payroll {
  id?: number;
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  total_working_days: number;
  days_present: number;
  days_absent: number;
  half_days: number;
  total_hours_worked: number;
  overtime_hours: number;
  piece_rate_earnings: number;
  deductions: number;
  gross_salary: number;
  net_salary: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  calculation_date?: Date;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
  employee?: any;
}

export interface PaymentRecord {
  id?: number;
  employee_id: number;
  payroll_id?: number;
  payment_date: string | Date;
  amount_paid: number;
  payment_method?: 'cash' | 'bank_transfer' | 'cheque' | 'upi';
  transaction_reference?: string;
  notes?: string;
  created_at?: Date;
  employee?: any;
  payroll?: any;
}

export interface WorkLog {
  id?: number;
  employee_id: number;
  work_date: string | Date;
  quantity: number;
  unit: string;
  rate_per_unit: number;
  total_amount: number;
  work_description?: string;
  is_paid: boolean;
  payment_date?: Date;
  is_locked?: boolean;
  created_at?: Date;
  employee?: any;
}

export const payrollApi = {
  calculatePayroll: async (employeeId: number, month: number, year: number) => {
    const response = await apiClient.post(`/payroll/calculate/${employeeId}`, { month, year });
    return response.data;
  },

  calculatePayrollForAll: async (month: number, year: number) => {
    const response = await apiClient.post('/payroll/calculate-all', {
      month,
      year,
    });
    return response.data;
  },

  list: async (params?: { employee_id?: number; month?: number; year?: number; status?: string }) => {
    const response = await apiClient.get<Payroll[]>('/payroll', { params });
    return response.data;
  },

  get: async (payrollId: number) => {
    const response = await apiClient.get<Payroll>(`/payroll/${payrollId}`);
    return response.data;
  },

  updateStatus: async (payrollId: number, status: 'draft' | 'calculated' | 'approved' | 'paid') => {
    const response = await apiClient.patch(`/payroll/${payrollId}/status`, {
      status,
    });
    return response.data;
  },

  getPendingPayments: async () => {
    const response = await apiClient.get<{
      pending_payments: Payroll[];
      count: number;
      should_notify: boolean;
    }>('/payroll/pending-payments/list');
    return response.data;
  },

  // Payment Records
  createPayment: async (data: PaymentRecord) => {
    const response = await apiClient.post('/payments', data);
    return response.data;
  },

  listPayments: async (params?: { employee_id?: number; start_date?: string; end_date?: string }) => {
    const response = await apiClient.get<PaymentRecord[]>('/payments', {
      params,
    });
    return response.data;
  },

  // Work Logs
  createWorkLog: async (data: WorkLog) => {
    const response = await apiClient.post('/work-logs', data);
    return response.data;
  },

  listWorkLogs: async (params?: {
    employee_id?: number;
    start_date?: string;
    end_date?: string;
    is_paid?: boolean;
  }) => {
    const response = await apiClient.get<WorkLog[]>('/work-logs', { params });
    return response.data;
  },

  markWorkLogsPaid: async (work_log_ids: number[], payment_date?: Date) => {
    const response = await apiClient.patch('/work-logs/mark-paid', {
      work_log_ids,
      payment_date,
    });
    return response.data;
  },
};
