import { z } from 'zod';

export const quotationItemSchema = z.object({
  sn: z.number().int().positive(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  rate: z.number().min(0, 'Rate must be non-negative'),
  amount: z.number().min(0, 'Amount must be non-negative'),
});

export const quotationFromSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  address: z.string().min(1, 'Address is required'),
  contact: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  gstin: z.string().max(15, 'GSTIN should be max 15 characters').optional(),
});

export const quotationSchema = z
  .object({
    company_id: z.number().int().positive('Please select a company'),
    from: quotationFromSchema,
    items: z.array(quotationItemSchema).min(1, 'At least one item is required'),
    terms_conditions: z.string().min(1, 'Terms and conditions are required'),
    gst_type: z.enum(['As Applicable', 'Custom']),
    gst_value: z.number().min(0).max(100).optional(),
    quotation_date: z.string(),
    validity_days: z.number().int().positive().default(30),
    remarks: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.gst_type === 'Custom') {
        return data.gst_value !== undefined;
      }
      return true;
    },
    {
      message: 'GST value is required when GST Percentage is selected',
      path: ['gst_value'],
    },
  );

export type QuotationItem = z.infer<typeof quotationItemSchema>;
export type QuotationFrom = z.infer<typeof quotationFromSchema>;
export type QuotationFormData = z.infer<typeof quotationSchema>;

export const DEFAULT_TERMS = `1. Payment Terms: 
   - 50% advance payment with order confirmation
   - Balance 50% before dispatch

2. GST: 
   - GST extra as applicable
   
3. Freight charges are extra, as applicable.

4. The above prices are ex-factory. Any requested changes will be subject to price revision.

5. Prices are subject to change based on fluctuations in raw material costs.

6. Delivery will be made as per mutually agreed customer demand.`;

export const UNIT_OPTIONS = ['Boxes', 'Lakhs', 'Nos', 'Kgs', 'Pcs', 'Sets', 'Dozens', 'Rolls', 'Meters'];
