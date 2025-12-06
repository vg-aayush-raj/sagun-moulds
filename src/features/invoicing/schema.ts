import { z } from 'zod';

export const invoiceItemSchema = z.object({
  cup_type: z.string().min(1, 'Cup type is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  base_price_per_cup: z.number().min(0, 'Base price must be positive'),
  gst_rate: z.number().min(0).max(100, 'GST rate must be between 0 and 100'),
  cash_per_cup: z.number().min(0, 'Cash amount must be positive'),
});

export const invoiceSchema = z.object({
  company_id: z.number({ required_error: 'Company is required' }),
  billing_date: z.string().min(1, 'Billing date is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>;

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
