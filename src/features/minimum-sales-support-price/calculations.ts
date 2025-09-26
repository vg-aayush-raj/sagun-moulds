import { MinimumSalesSupportPriceFormValues, ExpenseEntry } from './schema';

export interface CupAnalysis {
  id: string;
  name: string;
  monthlyProduction: number;
  rawMaterialCostPerMonth: number;
  rawMaterialCostPerCup: number;
  fixedCostPerCup: number;
  totalCostPerCup: number;
  sellingPricePerCup: number;
  profitPerCup: number;
  totalMonthlySales: number;
  totalMonthlyProfit: number;
  profitMarginPercentage: number;
}

export interface OverallAnalysis {
  totalMonthlyExpenses: number;
  totalMonthlyRawMaterialCost: number;
  totalMonthlyCost: number;
  totalMonthlyProduction: number;
  totalMonthlySales: number;
  totalMonthlyProfit: number;
  overallProfitMarginPercentage: number;
  averageCostPerCup: number;
  breakEvenPointPerCup: number;
}

export interface MinimumSalesSupportPriceResult {
  cupAnalyses: CupAnalysis[];
  overallAnalysis: OverallAnalysis;
  expenses: ExpenseEntry[];
}

export function calculateMinimumSalesSupportPrice(
  data: MinimumSalesSupportPriceFormValues,
): MinimumSalesSupportPriceResult {
  const { expenses, cupTypes } = data;

  // Calculate total monthly expenses
  const totalMonthlyExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  // Calculate cup analyses
  const cupAnalyses: CupAnalysis[] = cupTypes.map((cupType) => {
    // Raw material cost calculation
    const rawMaterialRequiredKg = (cupType.cupWeightInGrams * cupType.monthlyProduction) / 1000;
    const rawMaterialCostPerMonth = rawMaterialRequiredKg * cupType.rawMaterialPricePerKg;
    const rawMaterialCostPerCup = rawMaterialCostPerMonth / cupType.monthlyProduction;

    return {
      id: cupType.id,
      name: cupType.name,
      monthlyProduction: cupType.monthlyProduction,
      rawMaterialCostPerMonth,
      rawMaterialCostPerCup,
      fixedCostPerCup: 0, // Will be calculated after we know total production
      totalCostPerCup: 0, // Will be calculated after fixed cost per cup
      sellingPricePerCup: cupType.sellingPricePerCup,
      profitPerCup: 0, // Will be calculated after total cost per cup
      totalMonthlySales: cupType.monthlyProduction * cupType.sellingPricePerCup,
      totalMonthlyProfit: 0, // Will be calculated after profit per cup
      profitMarginPercentage: 0, // Will be calculated after profit per cup
    };
  });

  // Calculate total monthly production to distribute fixed costs
  const totalMonthlyProduction = cupAnalyses.reduce((total, analysis) => total + analysis.monthlyProduction, 0);

  // Calculate fixed cost per cup (distributed uniformly across all cups)
  const fixedCostPerCup = totalMonthlyProduction > 0 ? totalMonthlyExpenses / totalMonthlyProduction : 0;

  // Update cup analyses with fixed costs and profits
  cupAnalyses.forEach((analysis) => {
    analysis.fixedCostPerCup = fixedCostPerCup;
    analysis.totalCostPerCup = analysis.rawMaterialCostPerCup + analysis.fixedCostPerCup;
    analysis.profitPerCup = analysis.sellingPricePerCup - analysis.totalCostPerCup;
    analysis.totalMonthlyProfit = analysis.profitPerCup * analysis.monthlyProduction;
    analysis.profitMarginPercentage =
      analysis.sellingPricePerCup > 0 ? (analysis.profitPerCup / analysis.sellingPricePerCup) * 100 : 0;
  });

  // Calculate overall analysis
  const totalMonthlyRawMaterialCost = cupAnalyses.reduce(
    (total, analysis) => total + analysis.rawMaterialCostPerMonth,
    0,
  );

  const totalMonthlyCost = totalMonthlyExpenses + totalMonthlyRawMaterialCost;

  const totalMonthlySales = cupAnalyses.reduce((total, analysis) => total + analysis.totalMonthlySales, 0);

  const totalMonthlyProfit = cupAnalyses.reduce((total, analysis) => total + analysis.totalMonthlyProfit, 0);

  const overallProfitMarginPercentage = totalMonthlySales > 0 ? (totalMonthlyProfit / totalMonthlySales) * 100 : 0;

  const averageCostPerCup = totalMonthlyProduction > 0 ? totalMonthlyCost / totalMonthlyProduction : 0;

  const breakEvenPointPerCup = averageCostPerCup; // Minimum selling price to break even

  const overallAnalysis: OverallAnalysis = {
    totalMonthlyExpenses,
    totalMonthlyRawMaterialCost,
    totalMonthlyCost,
    totalMonthlyProduction,
    totalMonthlySales,
    totalMonthlyProfit,
    overallProfitMarginPercentage,
    averageCostPerCup,
    breakEvenPointPerCup,
  };

  return {
    cupAnalyses,
    overallAnalysis,
    expenses,
  };
}
