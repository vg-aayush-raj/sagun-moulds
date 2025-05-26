import { z } from 'zod';

export const businessAnalysisSchema = z.object({
  financingDetails: z.object({
    totalInvestment: z.number().positive('Investment must be positive').default(3.61),
    ownInvestment: z.number().positive('Investment must be positive').default(1.61),
    loanAmount: z.number().nonnegative('Cannot be negative').default(2.0),
    loanInterestRate: z.number().min(1, 'Too low').max(40, 'Too high').default(17),
    loanPeriodYears: z.number().int().min(1, 'Too short').max(30, 'Too long').default(15),
  }),
  machineryDetails: z.object({
    sheetExtrusionLine: z.number().positive('Price must be positive').default(56.4),
    hopperLoaderMixer: z.number().positive('Price must be positive').default(4.1),
    grinderBlower: z.number().positive('Price must be positive').default(4.8),
    formingMachine: z.number().positive('Price must be positive').default(82.92),
    moulds: z.number().positive('Price must be positive').default(24.0),
    dryOffsetPrinter: z.number().positive('Price must be positive').default(73.0),
    waterChiller: z.number().positive('Price must be positive').default(8.82),
    airCompressor: z.number().positive('Price must be positive').default(10.41),
    coolingTower: z.number().positive('Price must be positive').default(2.49),
    freightLogistics: z.number().nonnegative('Cannot be negative').default(5.0),
    gstRate: z.number().min(0, 'Cannot be negative').max(100, 'Too high').default(18),
  }),
  productionSetup: z.object({
    thermoformingMachines: z.number().int().min(1, 'Need at least 1 machine').default(2),
    printers: z.number().int().min(1, 'Need at least 1 printer').default(4),
    sheetlines: z.number().int().min(1, 'Need at least 1 sheetline').default(1),
  }),
  cupsPerDay: z.object({
    thermoforming: z.number().positive('Must be positive').default(220000),
    printing: z.number().positive('Must be positive').default(125000),
  }),
  sheetProductionPerDay: z.number().positive('Must be positive').default(300),
  pricePerCup: z.object({
    sudha: z.number().positive('Price must be positive').default(0.8),
    local: z.number().positive('Price must be positive').default(0.46),
  }),
  mixRatio: z.object({
    sudha: z.number().min(0, 'Cannot be negative').max(1, 'Cannot exceed 1').default(1.0),
    local: z.number().min(0, 'Cannot be negative').max(1, 'Cannot exceed 1').default(0.0),
  }),
  rawMaterialCostPercent: z.number().min(0.01, 'Too low').max(0.99, 'Too high').default(0.63),
  fixedCostsMonthly: z.object({
    rent: z.number().nonnegative('Cannot be negative').default(240000),
    electricity: z.number().nonnegative('Cannot be negative').default(350000),
    maintenance: z.number().nonnegative('Cannot be negative').default(50000),
    manpower: z.number().nonnegative('Cannot be negative').default(300000),
  }),
  seasonalCapacity: z.object({
    jan: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.85),
    feb: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.85),
    mar: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.9),
    apr: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.95),
    may: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.95),
    jun: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.95),
    jul: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.85),
    aug: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.7),
    sep: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.7),
    oct: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.85),
    nov: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.7),
    dec: z.number().min(0.1, 'Too low').max(1, 'Cannot exceed 100%').default(0.85),
  }),
  growthRates: z.object({
    price: z.number().min(0, 'Cannot be negative').max(0.5, 'Too high').default(0.06),
    volume: z
      .array(z.number().min(0, 'Cannot be negative').max(0.5, 'Too high'))
      .default([0, 0.12, 0.12, 0.12, 0.1, 0.08, 0.08, 0.08, 0.08, 0.08]),
    rawMaterial: z.number().min(0, 'Cannot be negative').max(0.5, 'Too high').default(0.04),
    fixedCosts: z.number().min(0, 'Cannot be negative').max(0.5, 'Too high').default(0.08),
  }),
  rentIncreaseRate: z.number().min(0, 'Cannot be negative').max(0.5, 'Too high').default(0.05),
});

export type BusinessAnalysisFormValues = z.infer<typeof businessAnalysisSchema>;

export const defaultValues: BusinessAnalysisFormValues = {
  financingDetails: {
    totalInvestment: 3.61,
    ownInvestment: 1.61,
    loanAmount: 2.0,
    loanInterestRate: 17,
    loanPeriodYears: 15,
  },
  machineryDetails: {
    sheetExtrusionLine: 56.4,
    hopperLoaderMixer: 4.1,
    grinderBlower: 4.8,
    formingMachine: 82.92,
    moulds: 24.0,
    dryOffsetPrinter: 73.0,
    waterChiller: 8.82,
    airCompressor: 10.41,
    coolingTower: 2.49,
    freightLogistics: 5.0,
    gstRate: 18,
  },
  productionSetup: {
    thermoformingMachines: 2,
    printers: 4,
    sheetlines: 1,
  },
  cupsPerDay: {
    thermoforming: 220000,
    printing: 125000,
  },
  sheetProductionPerDay: 300,
  pricePerCup: {
    sudha: 0.8,
    local: 0.46,
  },
  mixRatio: {
    sudha: 1.0,
    local: 0.0,
  },
  rawMaterialCostPercent: 0.63,
  fixedCostsMonthly: {
    rent: 240000,
    electricity: 350000,
    maintenance: 50000,
    manpower: 300000,
  },
  seasonalCapacity: {
    jan: 0.85,
    feb: 0.85,
    mar: 0.9,
    apr: 0.95,
    may: 0.95,
    jun: 0.95,
    jul: 0.85,
    aug: 0.7,
    sep: 0.7,
    oct: 0.85,
    nov: 0.7,
    dec: 0.85,
  },
  growthRates: {
    price: 0.06,
    volume: [0, 0.12, 0.12, 0.12, 0.1, 0.08, 0.08, 0.08, 0.08, 0.08],
    rawMaterial: 0.04,
    fixedCosts: 0.08,
  },
  rentIncreaseRate: 0.05,
};
