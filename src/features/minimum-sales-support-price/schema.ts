import { z } from 'zod';

// Schema for individual expense entries
export const expenseEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

// Schema for cup type entries
export const cupTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Cup name is required'),
  monthlyProduction: z.number().min(1, 'Monthly production must be at least 1'),
  rawMaterialPricePerKg: z.number().min(0, 'Raw material price must be positive'),
  cupWeightInGrams: z.number().min(0.1, 'Cup weight must be positive'),
  sellingPricePerCup: z.number().min(0, 'Selling price must be positive'),
  description: z.string().optional(),
});

// Main schema for the minimum sales support price feature
export const minimumSalesSupportPriceSchema = z.object({
  expenses: z.array(expenseEntrySchema).default([]),
  cupTypes: z.array(cupTypeSchema).default([]),
});

export type ExpenseEntry = z.infer<typeof expenseEntrySchema>;

export type CupType = z.infer<typeof cupTypeSchema>;

export type MinimumSalesSupportPriceFormValues = z.infer<typeof minimumSalesSupportPriceSchema>;

// Default values
export const defaultValues: MinimumSalesSupportPriceFormValues = {
  expenses: [],
  cupTypes: [],
};

// Helper function to create a new expense entry
export const createNewExpenseEntry = (): ExpenseEntry => ({
  id: Date.now().toString(),
  name: '',
  amount: 0,
  description: '',
});

// Helper function to create a new cup type
export const createNewCupType = (): CupType => ({
  id: Date.now().toString(),
  name: '',
  monthlyProduction: 0,
  rawMaterialPricePerKg: 0,
  cupWeightInGrams: 0,
  sellingPricePerCup: 0,
  description: '',
});
