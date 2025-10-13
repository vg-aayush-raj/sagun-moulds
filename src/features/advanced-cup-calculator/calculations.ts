import {
  AdvancedCupCalculatorFormValues,
  ExpenseEntry,
  LogisticsConfig,
  MarginConfig,
  WorkingDaysConfig,
} from './schema';

export interface EnhancedCupAnalysis {
  id: string;
  name: string;

  // Production data (daily basis only)
  dailyProduction: number;

  // Raw material calculations
  rawMaterialBasePricePerKg: number;
  rawMaterialWithGSTPerKg: number;
  rawMaterialWithGSTAndFreightPerKg: number;
  rawMaterialRequiredKgDaily: number;

  // Cost calculations per cup (manufacturing cost basis)
  rawMaterialCostPerCupWithoutGST: number;
  rawMaterialCostPerCupWithGST: number;
  productionExpensesPerCup: number;
  freightPerCup: number;

  // Base manufacturing cost per cup
  baseManuCostPerCup: number; // Without any GST considerations
  baseManuCostPerCupWithRawMaterialGST: number; // With raw material GST only

  // With margin calculations
  marginAmount: number;
  sellingPriceWithoutGST: number;
  gstOnSales: number;
  finalSellingPriceWithGST: number;

  // Daily totals
  dailyCosts: {
    rawMaterialWithoutGST: number;
    rawMaterialWithGST: number;
    production: number;
    freight: number;
    totalWithoutGST: number;
    totalWithGST: number;
  };

  // GST Analysis
  gstAnalysis: {
    gstCreditFromRawMaterial: number; // GST paid on raw material (input credit)
    gstDebitFromSales: number; // GST collected on sales (output liability)
    netGSTPosition: number; // Credit - Debit (negative means you owe GST)
  };

  // Revenue calculations (daily)
  dailyRevenueWithoutGST: number;
  dailyRevenueWithGST: number;
  dailyProfit: number;
}

export interface EnhancedOverallAnalysis {
  totalDailyExpenses: number;

  // Production totals (daily)
  totalDailyProduction: number;

  // Cost totals (daily)
  totalDailyCostsWithoutGST: number;
  totalDailyCostsWithGST: number;
  totalDailyRevenueWithoutGST: number;
  totalDailyRevenueWithGST: number;
  totalDailyProfit: number;

  // Per cup averages
  averageBaseManuCostPerCup: number;
  averageBaseManuCostPerCupWithGST: number;
  averageSellingPricePerCupWithoutGST: number;
  averageSellingPricePerCupWithGST: number;
  averageProfitPerCup: number;

  // Freight calculations based on logistics config
  freightPerCup: number;

  // GST Summary
  overallGSTAnalysis: {
    totalGSTCreditFromRawMaterial: number;
    totalGSTDebitFromSales: number;
    netGSTPosition: number;
  };

  overallProfitMarginPercentage: number;
}

export interface AdvancedCupCalculatorResult {
  cupAnalyses: EnhancedCupAnalysis[];
  overallAnalysis: EnhancedOverallAnalysis;
  expenses: ExpenseEntry[];
  logisticsConfig: LogisticsConfig;
  marginConfig: MarginConfig;
  workingDaysConfig: WorkingDaysConfig;
}

export function calculateAdvancedCupCalculator(data: AdvancedCupCalculatorFormValues): AdvancedCupCalculatorResult {
  const { expenses, cupTypes, logisticsConfig, marginConfig, workingDaysConfig } = data;

  // Calculate total daily expenses (based on working days)
  const totalMonthlyExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const totalDailyExpenses = totalMonthlyExpenses / workingDaysConfig.workingDaysPerMonth;

  // Calculate freight per cup based on logistics config
  const totalCupsInLogistics = logisticsConfig.totalBoxes * logisticsConfig.cupsPerBox;
  const freightPerCup = logisticsConfig.freightCostTotal / totalCupsInLogistics;

  // Calculate total daily production for expense distribution
  const totalDailyProduction = cupTypes.reduce((total, cup) => total + cup.dailyProduction, 0);

  // Calculate cup analyses
  const cupAnalyses: EnhancedCupAnalysis[] = cupTypes.map((cupType) => {
    // Raw material calculations
    const rawMaterialWithGSTPerKg = cupType.rawMaterialBasePricePerKg * (1 + cupType.gstPercentage / 100);
    const rawMaterialWithGSTAndFreightPerKg = rawMaterialWithGSTPerKg + cupType.logisticsChargePerKg;

    // Required raw material (daily)
    const rawMaterialRequiredKgDaily = (cupType.cupWeightInGrams * cupType.dailyProduction) / 1000;

    // Cost per cup calculations
    const rawMaterialCostPerCupWithoutGST = (cupType.rawMaterialBasePricePerKg * cupType.cupWeightInGrams) / 1000;
    const rawMaterialCostPerCupWithGST = (rawMaterialWithGSTPerKg * cupType.cupWeightInGrams) / 1000;

    // Production expenses per cup (distributed based on production volume)
    const productionExpensesPerCup =
      totalDailyProduction > 0
        ? (totalDailyExpenses * (cupType.dailyProduction / totalDailyProduction)) / cupType.dailyProduction
        : 0;

    // Base manufacturing cost per cup (minimum cost to produce)
    const baseManuCostPerCup = rawMaterialCostPerCupWithoutGST + productionExpensesPerCup + freightPerCup;
    const baseManuCostPerCupWithRawMaterialGST =
      rawMaterialCostPerCupWithGST + productionExpensesPerCup + freightPerCup;

    // Margin and selling price calculations
    const marginAmount = baseManuCostPerCupWithRawMaterialGST * (marginConfig.marginPercentage / 100);
    const sellingPriceWithoutGST = baseManuCostPerCupWithRawMaterialGST + marginAmount;
    const gstOnSales = sellingPriceWithoutGST * (marginConfig.gstOnSalesPercentage / 100);
    const finalSellingPriceWithGST = sellingPriceWithoutGST + gstOnSales;

    // Daily costs
    const dailyCosts = {
      rawMaterialWithoutGST: rawMaterialRequiredKgDaily * cupType.rawMaterialBasePricePerKg,
      rawMaterialWithGST: rawMaterialRequiredKgDaily * rawMaterialWithGSTPerKg,
      production: totalDailyProduction > 0 ? totalDailyExpenses * (cupType.dailyProduction / totalDailyProduction) : 0,
      freight: freightPerCup * cupType.dailyProduction,
      totalWithoutGST: 0, // Will be calculated below
      totalWithGST: 0, // Will be calculated below
    };

    dailyCosts.totalWithoutGST = dailyCosts.rawMaterialWithoutGST + dailyCosts.production + dailyCosts.freight;
    dailyCosts.totalWithGST = dailyCosts.rawMaterialWithGST + dailyCosts.production + dailyCosts.freight;

    // GST Analysis
    const gstCreditFromRawMaterial =
      rawMaterialRequiredKgDaily * cupType.rawMaterialBasePricePerKg * (cupType.gstPercentage / 100);
    const gstDebitFromSales =
      cupType.dailyProduction * sellingPriceWithoutGST * (marginConfig.gstOnSalesPercentage / 100);
    const netGSTPosition = gstCreditFromRawMaterial - gstDebitFromSales;

    // Revenue and profit (daily)
    const dailyRevenueWithoutGST = sellingPriceWithoutGST * cupType.dailyProduction;
    const dailyRevenueWithGST = finalSellingPriceWithGST * cupType.dailyProduction;
    const dailyProfit = dailyRevenueWithoutGST - dailyCosts.totalWithGST;

    return {
      id: cupType.id,
      name: cupType.name,
      dailyProduction: cupType.dailyProduction,
      rawMaterialBasePricePerKg: cupType.rawMaterialBasePricePerKg,
      rawMaterialWithGSTPerKg,
      rawMaterialWithGSTAndFreightPerKg,
      rawMaterialRequiredKgDaily,
      rawMaterialCostPerCupWithoutGST,
      rawMaterialCostPerCupWithGST,
      productionExpensesPerCup,
      freightPerCup,
      baseManuCostPerCup,
      baseManuCostPerCupWithRawMaterialGST,
      marginAmount,
      sellingPriceWithoutGST,
      gstOnSales,
      finalSellingPriceWithGST,
      dailyCosts,
      gstAnalysis: {
        gstCreditFromRawMaterial,
        gstDebitFromSales,
        netGSTPosition,
      },
      dailyRevenueWithoutGST,
      dailyRevenueWithGST,
      dailyProfit,
    };
  });

  // Calculate overall analysis
  const totalDailyCostsWithoutGST = cupAnalyses.reduce((total, cup) => total + cup.dailyCosts.totalWithoutGST, 0);
  const totalDailyCostsWithGST = cupAnalyses.reduce((total, cup) => total + cup.dailyCosts.totalWithGST, 0);
  const totalDailyRevenueWithoutGST = cupAnalyses.reduce((total, cup) => total + cup.dailyRevenueWithoutGST, 0);
  const totalDailyRevenueWithGST = cupAnalyses.reduce((total, cup) => total + cup.dailyRevenueWithGST, 0);
  const totalDailyProfit = cupAnalyses.reduce((total, cup) => total + cup.dailyProfit, 0);

  const averageBaseManuCostPerCup = totalDailyProduction > 0 ? totalDailyCostsWithoutGST / totalDailyProduction : 0;
  const averageBaseManuCostPerCupWithGST = totalDailyProduction > 0 ? totalDailyCostsWithGST / totalDailyProduction : 0;
  const averageSellingPricePerCupWithoutGST =
    totalDailyProduction > 0 ? totalDailyRevenueWithoutGST / totalDailyProduction : 0;
  const averageSellingPricePerCupWithGST =
    totalDailyProduction > 0 ? totalDailyRevenueWithGST / totalDailyProduction : 0;
  const averageProfitPerCup = totalDailyProduction > 0 ? totalDailyProfit / totalDailyProduction : 0;

  // Overall GST Analysis
  const totalGSTCreditFromRawMaterial = cupAnalyses.reduce(
    (total, cup) => total + cup.gstAnalysis.gstCreditFromRawMaterial,
    0,
  );
  const totalGSTDebitFromSales = cupAnalyses.reduce((total, cup) => total + cup.gstAnalysis.gstDebitFromSales, 0);
  const netGSTPosition = totalGSTCreditFromRawMaterial - totalGSTDebitFromSales;

  const overallProfitMarginPercentage =
    totalDailyRevenueWithoutGST > 0 ? (totalDailyProfit / totalDailyRevenueWithoutGST) * 100 : 0;

  const overallAnalysis: EnhancedOverallAnalysis = {
    totalDailyExpenses,
    totalDailyProduction,
    totalDailyCostsWithoutGST,
    totalDailyCostsWithGST,
    totalDailyRevenueWithoutGST,
    totalDailyRevenueWithGST,
    totalDailyProfit,
    averageBaseManuCostPerCup,
    averageBaseManuCostPerCupWithGST,
    averageSellingPricePerCupWithoutGST,
    averageSellingPricePerCupWithGST,
    averageProfitPerCup,
    freightPerCup,
    overallGSTAnalysis: {
      totalGSTCreditFromRawMaterial,
      totalGSTDebitFromSales,
      netGSTPosition,
    },
    overallProfitMarginPercentage,
  };

  return {
    cupAnalyses,
    overallAnalysis,
    expenses,
    logisticsConfig,
    marginConfig,
    workingDaysConfig,
  };
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
};

// Helper function to format percentage
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};
