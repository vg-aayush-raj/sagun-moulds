import { z } from 'zod';

export const invoiceItemSchema = z.object({
  cup_type: z.string().min(1, 'Cup type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unit: z.string().min(1, 'Unit is required'),
  base_price_per_cup: z.number().min(0, 'Base price must be positive'),
  gst_rate: z.number().min(0).max(100, 'GST rate must be between 0 and 100'),
  cash_per_cup: z.number().min(0, 'Cash amount must be positive'),
});

export const invoiceFromSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  contact: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  gstin: z.string().max(15, 'GSTIN should be max 15 characters').optional(),
});

export const invoiceSchema = z.object({
  company_id: z.number({ required_error: 'Company is required' }),
  from: invoiceFromSchema,
  billing_date: z.string().min(1, 'Billing date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;
export type InvoiceFrom = z.infer<typeof invoiceFromSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export const UNIT_OPTIONS = ['Boxes', 'Lakhs', 'Nos', 'Kgs', 'Pcs', 'Sets', 'Dozens', 'Rolls', 'Meters'];
