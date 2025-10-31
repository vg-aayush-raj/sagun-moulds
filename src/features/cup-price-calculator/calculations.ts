import { CupPriceCalculatorFormValues, ExpenseEntry, GSTRateEntry } from './schema';

export interface CupPriceWithGST {
  id: string;
  gstRate: number;
  priceWithGST: number;
  gstAmount: number;
  description?: string;
}

export interface CupPriceCalculatorResult {
  totalMonthlyExpenses: number;
  monthlyProduction: number;
  rawMaterialPricePerKg: number;
  cupWeightInGrams: number;
  totalRawMaterialRequiredKg: number;
  rawMaterialCostPerMonth: number;
  rawMaterialCostPerCup: number;
  fixedCostPerCup: number;
  baseCostPerCup: number;
  totalMonthlyCost: number;
  pricesWithGST: CupPriceWithGST[];
  expenses: ExpenseEntry[];
  gstRates: GSTRateEntry[];
}

export function calculateCupPrice(data: CupPriceCalculatorFormValues): CupPriceCalculatorResult {
  const { expenses, monthlyProduction, rawMaterialConfig, gstRates } = data;

  // Calculate total monthly expenses (EMI, Electricity, Rent, Employee, etc.)
  const totalMonthlyExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Extract production and raw material details
  const production = monthlyProduction.production;
  const rawMaterialPricePerKg = rawMaterialConfig.pricePerKg;
  const cupWeightInGrams = rawMaterialConfig.cupWeightInGrams;

  // Calculate raw material cost
  const rawMaterialRequiredKg = (cupWeightInGrams * production) / 1000;
  const rawMaterialCostPerMonth = rawMaterialRequiredKg * rawMaterialPricePerKg;
  const rawMaterialCostPerCup = rawMaterialCostPerMonth / production;

  // Calculate fixed cost per cup (expenses distributed across all cups)
  const fixedCostPerCup = production > 0 ? totalMonthlyExpenses / production : 0;

  // Calculate base cost per cup (raw material + fixed costs)
  const baseCostPerCup = rawMaterialCostPerCup + fixedCostPerCup;

  // Calculate total monthly cost
  const totalMonthlyCost = totalMonthlyExpenses + rawMaterialCostPerMonth;

  // Calculate prices with different GST rates (using dynamic GST rates from form)
  const pricesWithGST: CupPriceWithGST[] = gstRates.map((gstRateEntry) => {
    const gstAmount = (baseCostPerCup * gstRateEntry.rate) / 100;
    const priceWithGST = baseCostPerCup + gstAmount;

    return {
      id: gstRateEntry.id,
      gstRate: gstRateEntry.rate,
      priceWithGST,
      gstAmount,
      description: gstRateEntry.description,
    };
  });

  return {
    totalMonthlyExpenses,
    monthlyProduction: production,
    rawMaterialPricePerKg,
    cupWeightInGrams,
    totalRawMaterialRequiredKg: rawMaterialRequiredKg,
    rawMaterialCostPerMonth,
    rawMaterialCostPerCup,
    fixedCostPerCup,
    baseCostPerCup,
    totalMonthlyCost,
    pricesWithGST,
    expenses,
    gstRates,
  };
}
