import { z } from 'zod';

// Schema for individual cost entries
export const costEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

// Schema for GST scenario
export const gstScenarioSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  gstRate: z.number().min(0).max(100, 'GST rate must be between 0 and 100'),
});

// Schema for target price scenarios
export const targetPriceScenarioSchema = z.object({
  id: z.string(),
  sellingPrice: z.number().min(0, 'Selling price must be positive'),
  name: z.string().min(1, 'Name is required'),
});

// Main schema for break-even calculator
export const breakEvenSchema = z.object({
  materialCostPerKg: z.number().min(0, 'Material cost must be positive'),
  cupWeightGrams: z.number().min(0.01, 'Cup weight must be at least 0.01 grams'),
  costs: z.array(costEntrySchema),
  gstScenarios: z.array(gstScenarioSchema),
  targetPriceScenarios: z.array(targetPriceScenarioSchema),
});

export type CostEntry = z.infer<typeof costEntrySchema>;

export type GSTScenarioEntry = z.infer<typeof gstScenarioSchema>;

export type TargetPriceScenarioEntry = z.infer<typeof targetPriceScenarioSchema>;

export type BreakEvenFormValues = z.infer<typeof breakEvenSchema>;

// Helper functions to create new entries
export const createNewCostEntry = (): CostEntry => ({
  id: Date.now().toString(),
  name: '',
  amount: 0,
  description: '',
});

export const createNewGSTScenario = (): GSTScenarioEntry => ({
  id: Date.now().toString(),
  name: '',
  gstRate: 0,
});

export const createNewTargetPriceScenario = (): TargetPriceScenarioEntry => ({
  id: Date.now().toString(),
  name: '',
  sellingPrice: 0,
});

// Default values for the form
export const defaultValues: BreakEvenFormValues = {
  materialCostPerKg: 151,
  cupWeightGrams: 1,
  costs: [
    {
      id: '1',
      name: 'Rent',
      amount: 121000,
      description: 'Monthly rent',
    },
    {
      id: '2',
      name: 'EMI',
      amount: 300000,
      description: 'Equipment loan EMI',
    },
    {
      id: '3',
      name: 'Employee Salary',
      amount: 230000,
      description: 'Staff salaries',
    },
    {
      id: '4',
      name: 'Electricity',
      amount: 149000,
      description: 'Power consumption',
    },
  ],
  gstScenarios: [
    { id: '1', name: '18% GST', gstRate: 18 },
    { id: '2', name: '9% GST', gstRate: 9 },
    { id: '3', name: 'No GST', gstRate: 0 },
  ],
  targetPriceScenarios: [
    { id: '1', name: 'Target Price 1', sellingPrice: 340 },
    { id: '2', name: 'Target Price 2', sellingPrice: 280 },
  ],
};
