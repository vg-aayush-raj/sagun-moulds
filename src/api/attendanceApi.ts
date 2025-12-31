import apiClient from './client';

export interface Attendance {
  id?: number;
  employee_id: number;
  date: string | Date;
  check_in_time?: string;
  check_out_time?: string;
  total_hours?: number;
  status?: 'present' | 'absent' | 'half_day' | 'leave' | 'overtime';
  notes?: string;
  is_locked?: boolean;
  created_at?: Date;
  updated_at?: Date;
  employee?: any;
}

export interface BulkAttendance {
  date: string | Date;
  records: {
    employee_id: number;
    check_in_time?: string;
    check_out_time?: string;
    status: 'present' | 'absent' | 'half_day' | 'leave' | 'overtime';
    notes?: string;
  }[];
}

export interface AttendanceAudit {
  id: number;
  attendance_id: number;
  changed_by: string;
  change_timestamp: Date;
  field_changed: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
  created_at: Date;
}

export const attendanceApi = {
  create: async (data: Attendance) => {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  },

  bulkCreate: async (data: BulkAttendance) => {
    const response = await apiClient.post('/attendance/bulk', data);
    return response.data;
  },

  list: async (params?: {
    employee_id?: number;
    start_date?: string;
    end_date?: string;
    month?: number;
    year?: number;
  }) => {
    const response = await apiClient.get<Attendance[]>('/attendance', {
      params,
    });
    return response.data;
  },

  get: async (attendanceId: number) => {
    const response = await apiClient.get<Attendance>(`/attendance/${attendanceId}`);
    return response.data;
  },

  update: async (attendanceId: number, data: Attendance & { changed_by?: string; reason?: string }) => {
    const response = await apiClient.put(`/attendance/${attendanceId}`, data);
    return response.data;
  },

  delete: async (attendanceId: number) => {
    const response = await apiClient.delete(`/attendance/${attendanceId}`);
    return response.data;
  },

  getAuditTrail: async (attendanceId: number) => {
    const response = await apiClient.get<AttendanceAudit[]>(`/attendance/${attendanceId}/audit`);
    return response.data;
  },
};
