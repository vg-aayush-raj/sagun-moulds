import { z } from 'zod';

export const proformaItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().nonnegative('Rate cannot be negative'),
  amount: z.number().nonnegative('Amount cannot be negative'),
});

export const proformaSchema = z.object({
  company_id: z.number({ required_error: 'Company is required' }),
  validity_days: z.number().min(1, 'Validity days must be at least 1'),
  items: z.array(proformaItemSchema).min(1, 'At least one item is required'),
  terms_conditions: z.string().optional(),
});

export type ProformaItemFormData = z.infer<typeof proformaItemSchema>;

export type ProformaFormData = z.infer<typeof proformaSchema>;
