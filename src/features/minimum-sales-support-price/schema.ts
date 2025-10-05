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
  cupTypes: [
    {
      id: '1',
      name: 'Delicious 35 ml',
      monthlyProduction: 2600000,
      rawMaterialPricePerKg: 131,
      cupWeightInGrams: 1,
      sellingPricePerCup: 0.34,
      description: '35ml disposable cup',
    },
    {
      id: '2',
      name: 'Delicious 70 ml',
      monthlyProduction: 2600000,
      rawMaterialPricePerKg: 131,
      cupWeightInGrams: 1.5,
      sellingPricePerCup: 0.48,
      description: '70ml disposable cup',
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
