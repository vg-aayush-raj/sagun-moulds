import { z } from 'zod';

export const rawMaterialEntrySchema = z.object({
  material_type_id: z.number({ required_error: 'Material type is required' }),
  kg_quantity: z.number().positive('Quantity must be positive'),
  base_price: z.number().positive('Base price must be positive'),
  gst_rate: z.number().min(0).max(100, 'GST rate must be between 0 and 100'),
  entry_date: z.string().min(1, 'Date is required'),
  supplier_name: z.string().optional(),
  notes: z.string().optional(),
});

export type RawMaterialEntryFormData = z.infer<typeof rawMaterialEntrySchema>;

export const stockOperationSchema = z.object({
  material_type_id: z.number({ required_error: 'Material type is required' }),
  kg_quantity: z.number().positive('Quantity must be positive'),
  notes: z.string().optional(),
});

export type StockOperationFormData = z.infer<typeof stockOperationSchema>;
