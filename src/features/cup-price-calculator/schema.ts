import { z } from 'zod';

// Schema for individual expense entries
export const expenseEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

// Schema for monthly production input
export const monthlyProductionSchema = z.object({
  production: z.number().min(1, 'Monthly production must be at least 1'),
});

// Schema for raw material configuration
export const rawMaterialConfigSchema = z.object({
  pricePerKg: z.number().min(0, 'Raw material price must be positive'),
  cupWeightInGrams: z.number().min(0.1, 'Cup weight must be positive'),
});

// Schema for GST rate entries
export const gstRateEntrySchema = z.object({
  id: z.string(),
  rate: z.number().min(0, 'GST rate must be positive').max(100, 'GST rate cannot exceed 100%'),
  description: z.string().optional(),
});

// Main schema for the cup price calculator
export const cupPriceCalculatorSchema = z.object({
  expenses: z.array(expenseEntrySchema),
  monthlyProduction: monthlyProductionSchema,
  rawMaterialConfig: rawMaterialConfigSchema,
  gstRates: z.array(gstRateEntrySchema),
});

export type ExpenseEntry = z.infer<typeof expenseEntrySchema>;

export type MonthlyProduction = z.infer<typeof monthlyProductionSchema>;

export type RawMaterialConfig = z.infer<typeof rawMaterialConfigSchema>;

export type GSTRateEntry = z.infer<typeof gstRateEntrySchema>;

export type CupPriceCalculatorFormValues = z.infer<typeof cupPriceCalculatorSchema>;

// Default values
export const defaultValues: CupPriceCalculatorFormValues = {
  expenses: [
    {
      id: '1',
      name: 'Rent',
      amount: 121000,
      description: 'Monthly office/factory rent',
    },
    {
      id: '2',
      name: 'Electricity',
      amount: 280000,
      description: 'Monthly electricity bill',
    },
    {
      id: '3',
      name: 'Employee',
      amount: 230000,
      description: 'Employee salaries and benefits',
    },
    {
      id: '4',
      name: 'EMI',
      amount: 300000,
      description: 'Equipment/loan EMI',
    },
  ],
  monthlyProduction: {
    production: 2600000,
  },
  rawMaterialConfig: {
    pricePerKg: 131,
    cupWeightInGrams: 1,
  },
  gstRates: [
    {
      id: '1',
      rate: 0,
      description: 'No GST',
    },
    {
      id: '2',
      rate: 9,
      description: 'Standard GST',
    },
    {
      id: '3',
      rate: 18,
      description: 'Higher GST',
    },
  ],
};

// Helper function to create a new expense entry
export const createNewExpenseEntry = (): ExpenseEntry => ({
  id: Date.now().toString(),
  name: '',
  amount: 0,
  description: '',
});

// Helper function to create a new GST rate entry
export const createNewGSTRateEntry = (): GSTRateEntry => ({
  id: Date.now().toString(),
  rate: 0,
  description: '',
});
