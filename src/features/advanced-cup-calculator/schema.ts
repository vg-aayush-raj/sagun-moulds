import { z } from 'zod';

// Schema for individual expense entries (same as before)
export const expenseEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

// Enhanced cup type schema with new fields
export const enhancedCupTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Cup name is required'),
  dailyProduction: z.number().min(1, 'Daily production must be at least 1'),
  rawMaterialBasePricePerKg: z.number().min(0, 'Raw material base price must be positive'),
  gstPercentage: z.number().min(0).max(100, 'GST percentage must be between 0 and 100'),
  logisticsChargePerKg: z.number().min(0, 'Logistics charge must be positive'),
  cupWeightInGrams: z.number().min(0.1, 'Cup weight must be positive'),
  description: z.string().optional(),
});

// Logistics/Freight calculation schema
export const logisticsConfigSchema = z.object({
  totalBoxes: z.number().min(1, 'Number of boxes must be at least 1'),
  cupsPerBox: z.number().min(1, 'Cups per box must be at least 1'),
  freightCostTotal: z.number().min(0, 'Freight cost must be positive'),
});

// Margin configuration schema
export const marginConfigSchema = z.object({
  marginPercentage: z.number().min(0, 'Margin percentage must be positive'),
  gstOnSalesPercentage: z.number().min(0).max(100, 'GST on sales must be between 0 and 100'),
});

// Working days configuration schema
export const workingDaysConfigSchema = z.object({
  workingDaysPerMonth: z.number().min(1, 'Working days must be at least 1').max(31, 'Working days cannot exceed 31'),
});

// Main schema for the advanced cup calculator
export const advancedCupCalculatorSchema = z.object({
  expenses: z.array(expenseEntrySchema),
  cupTypes: z.array(enhancedCupTypeSchema),
  logisticsConfig: logisticsConfigSchema,
  marginConfig: marginConfigSchema,
  workingDaysConfig: workingDaysConfigSchema,
});

export type ExpenseEntry = z.infer<typeof expenseEntrySchema>;

export type EnhancedCupType = z.infer<typeof enhancedCupTypeSchema>;

export type LogisticsConfig = z.infer<typeof logisticsConfigSchema>;

export type MarginConfig = z.infer<typeof marginConfigSchema>;

export type WorkingDaysConfig = z.infer<typeof workingDaysConfigSchema>;

export type AdvancedCupCalculatorFormValues = z.infer<typeof advancedCupCalculatorSchema>;

// Default values
export const defaultValues: AdvancedCupCalculatorFormValues = {
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
      dailyProduction: 50000,
      rawMaterialBasePricePerKg: 121,
      gstPercentage: 18,
      logisticsChargePerKg: 10,
      cupWeightInGrams: 1.5,
      description: '35ml disposable cup',
    },
    {
      id: '2',
      name: 'Delicious 70 ml',
      dailyProduction: 50000,
      rawMaterialBasePricePerKg: 121,
      gstPercentage: 18,
      logisticsChargePerKg: 10,
      cupWeightInGrams: 2.5,
      description: '70ml disposable cup',
    },
  ],
  logisticsConfig: {
    totalBoxes: 20,
    cupsPerBox: 12000,
    freightCostTotal: 1800,
  },
  marginConfig: {
    marginPercentage: 10,
    gstOnSalesPercentage: 18,
  },
  workingDaysConfig: {
    workingDaysPerMonth: 26,
  },
};

// Helper functions
export const createNewExpenseEntry = (): ExpenseEntry => ({
  id: Date.now().toString(),
  name: '',
  amount: 0,
  description: '',
});

export const createNewEnhancedCupType = (): EnhancedCupType => ({
  id: Date.now().toString(),
  name: '',
  dailyProduction: 0,
  rawMaterialBasePricePerKg: 0,
  gstPercentage: 18,
  logisticsChargePerKg: 0,
  cupWeightInGrams: 0,
  description: '',
});
