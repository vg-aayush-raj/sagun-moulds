import { z } from 'zod';
import dayjs, { Dayjs } from 'dayjs';

// Custom date schema to handle Date, Dayjs, and string inputs
const dateSchema = z.preprocess((val) => {
  // If it's already a Date object, return it
  if (val instanceof Date) return val;

  // If it's a Dayjs object, convert to Date
  if (dayjs.isDayjs(val)) return val.toDate();

  // If it's a string, parse it
  if (typeof val === 'string') {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }

  // If it's null or undefined, return undefined
  if (val === null || val === undefined) return undefined;

  // For anything else, try to parse it
  return val;
}, z.date());

const optionalDateSchema = z.preprocess((val) => {
  // If explicitly undefined or null, return undefined
  if (val === null || val === undefined || val === '') return undefined;

  // If it's already a Date object, return it
  if (val instanceof Date) return val;

  // If it's a Dayjs object, convert to Date
  if (dayjs.isDayjs(val)) return val.toDate();

  // If it's a string, parse it
  if (typeof val === 'string') {
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }

  return val;
}, z.date().optional());

export const employeeSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required').max(100),
  name: z.string().min(1, 'Name is required').max(200),
  employee_type: z.enum(['permanent', 'temporary', 'contractual'], {
    required_error: 'Employee type is required',
  }),
  government_id_type: z.string().max(100).optional(),
  government_id_number: z.string().max(100).optional(),
  phone_number: z.string().max(20).optional(),
  address: z.string().optional(),
  designation: z.string().max(100).optional(),
  salary_type: z.enum(['monthly', 'daily', 'hourly', 'piece_rate'], {
    required_error: 'Salary type is required',
  }),
  salary_amount: z.number().nonnegative('Salary must be a positive number'),
  salary_notes: z.string().optional(),
  joining_date: dateSchema,
  termination_date: optionalDateSchema,
  termination_reason: z.string().optional(),
  status: z.enum(['active', 'inactive', 'terminated']).optional(),
  standard_work_hours: z.number().int().positive().optional(),
});

export const attendanceSchema = z.object({
  employee_id: z.number().int().positive(),
  date: dateSchema,
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional(),
  total_hours: z.number().nonnegative().optional(),
  status: z.enum(['present', 'absent', 'half_day', 'leave', 'overtime']).optional(),
  notes: z.string().optional(),
});

export const workLogSchema = z.object({
  employee_id: z.number().int().positive(),
  work_date: dateSchema,
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required').max(50),
  rate_per_unit: z.number().positive('Rate must be positive'),
  total_amount: z.number().positive('Total amount must be positive'),
  work_description: z.string().optional(),
});

export const paymentRecordSchema = z.object({
  employee_id: z.number().int().positive(),
  payroll_id: z.number().int().positive().optional(),
  payment_date: dateSchema,
  amount_paid: z.number().positive('Amount must be positive'),
  payment_method: z.enum(['cash', 'bank_transfer', 'cheque', 'upi']).optional(),
  transaction_reference: z.string().max(100).optional(),
  notes: z.string().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type AttendanceFormData = z.infer<typeof attendanceSchema>;
export type WorkLogFormData = z.infer<typeof workLogSchema>;
export type PaymentRecordFormData = z.infer<typeof paymentRecordSchema>;
