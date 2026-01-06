import apiClient from './client';

export interface Employee {
  id?: number;
  employee_id: string;
  name: string;
  employee_type: 'permanent' | 'temporary' | 'contractual';
  government_id_type?: string;
  government_id_number?: string;
  phone_number?: string;
  address?: string;
  designation?: string;
  salary_type: 'monthly' | 'daily' | 'hourly' | 'piece_rate';
  salary_amount: number;
  salary_notes?: string;
  joining_date: string | Date;
  termination_date?: string | Date;
  termination_reason?: string;
  status?: 'active' | 'inactive' | 'terminated';
  standard_work_hours?: number;
  created_at?: Date;
  updated_at?: Date;
}

export const employeeApi = {
  create: async (data: Employee) => {
    const response = await apiClient.post('/employees', data);
    return response.data;
  },

  list: async (params?: { status?: string; employee_type?: string }) => {
    const response = await apiClient.get<Employee[]>('/employees', { params });
    return response.data;
  },

  get: async (employeeId: number) => {
    const response = await apiClient.get<Employee>(`/employees/${employeeId}`);
    return response.data;
  },

  update: async (employeeId: number, data: Employee) => {
    const response = await apiClient.put(`/employees/${employeeId}`, data);
    return response.data;
  },

  updateStatus: async (
    employeeId: number,
    status: 'active' | 'inactive' | 'terminated',
    termination_reason?: string,
  ) => {
    const response = await apiClient.patch(`/employees/${employeeId}/status`, {
      status,
      termination_reason,
    });
    return response.data;
  },

  delete: async (employeeId: number) => {
    const response = await apiClient.delete(`/employees/${employeeId}`);
    return response.data;
  },
};
