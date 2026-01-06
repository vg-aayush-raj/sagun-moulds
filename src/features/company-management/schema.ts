import { z } from 'zod';

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(200),
  address: z.string().optional(),
  gstin: z.string().max(15).optional(),
  contact_name: z.string().max(100).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  bank_details: z
    .object({
      account_number: z.string().optional(),
      ifsc: z.string().optional(),
      bank_name: z.string().optional(),
      branch: z.string().optional(),
    })
    .optional(),
});

export type CompanyFormData = z.infer<typeof companySchema>;
