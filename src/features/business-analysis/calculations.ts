import { BusinessAnalysisFormValues } from './schema';

export interface MonthlyData {
  month: string;
  capacity: number;
  cupsProduced: number;
  revenue: string;
  costs: string;
  netProfit: string;
}

export interface YearlyProjection {
  year: number;
  monthlyAvgCups: number;
  annualRevenue: string;
  rawMaterialCost: string;
  fixedCosts: string;
  totalCosts: string;
  grossProfit: string;
  netProfit: string;
  profitMargin: string;
  cumulativeProfit: string;
}

export interface AnalysisResult {
  monthlyData: MonthlyData[];
  yearlyProjections: YearlyProjection[];
  totalRevenue: string;
  totalProfit: string;
  avgROI: string;
  paybackPeriod: string;
}

export const calculateMonthlyData = (params: BusinessAnalysisFormValues, year = 1): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const capacityKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

  const avgSellingPrice =
    (params.pricePerCup.sudha * params.mixRatio.sudha + params.pricePerCup.local * params.mixRatio.local) *
    Math.pow(1 + params.growthRates.price, year - 1);

  const volumeMultiplier = 1 + (params.growthRates.volume[year - 1] || 0);
  const baseDailyProduction =
    Math.min(
      params.cupsPerDay.thermoforming * params.productionSetup.thermoformingMachines,
      params.cupsPerDay.printing * params.productionSetup.printers,
    ) * volumeMultiplier;

  const monthlyFixedCosts = Object.entries(params.fixedCostsMonthly).reduce((total, [key, value]) => {
    if (key === 'rent') {
      const rentMultiplier = 1 + params.rentIncreaseRate * Math.max(0, year - 1 + months.indexOf('Oct') / 12);
      return total + value * rentMultiplier;
    }
    return total + value * Math.pow(1 + params.growthRates.fixedCosts, year - 1);
  }, 0);

  const monthlyData: MonthlyData[] = [];

  months.forEach((month, index) => {
    const monthKey = capacityKeys[index];
    const capacity = params.seasonalCapacity[monthKey];
    const workingDays = [26, 24, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26][index];

    const cupsProduced = (baseDailyProduction * capacity * workingDays) / 1000; // in thousands
    const revenue = (cupsProduced * avgSellingPrice * 1000) / 100000; // in lakhs
    const rawMaterialCost = revenue * params.rawMaterialCostPercent;
    const fixedCostLakhs = monthlyFixedCosts / 100000;
    const totalCosts = rawMaterialCost + fixedCostLakhs;
    const netProfit = revenue - totalCosts;

    monthlyData.push({
      month,
      capacity: Math.round(capacity * 100),
      cupsProduced: Math.round(cupsProduced),
      revenue: revenue.toFixed(2),
      costs: totalCosts.toFixed(2),
      netProfit: netProfit.toFixed(2),
    });
  });

  return monthlyData;
};

export const calculateYearlyProjections = (params: BusinessAnalysisFormValues): YearlyProjection[] => {
  const projections: YearlyProjection[] = [];
  let cumulativeProfit = 0;

  for (let year = 1; year <= 10; year++) {
    const monthlyData = calculateMonthlyData(params, year);

    const annualCups = monthlyData.reduce((sum, month) => sum + parseFloat(month.cupsProduced as unknown as string), 0);

    const annualRevenue = monthlyData.reduce((sum, month) => sum + parseFloat(month.revenue), 0) / 100; // Convert to crores

    const annualCosts = monthlyData.reduce((sum, month) => sum + parseFloat(month.costs), 0) / 100;

    const rawMaterialCost = annualRevenue * params.rawMaterialCostPercent;
    const fixedCosts = annualCosts - rawMaterialCost;
    const grossProfit = annualRevenue - rawMaterialCost;
    const netProfit = annualRevenue - annualCosts;
    cumulativeProfit += netProfit;

    const profitMargin = (netProfit / annualRevenue) * 100;

    projections.push({
      year,
      monthlyAvgCups: Math.round(annualCups / 12),
      annualRevenue: annualRevenue.toFixed(2),
      rawMaterialCost: rawMaterialCost.toFixed(2),
      fixedCosts: fixedCosts.toFixed(2),
      totalCosts: annualCosts.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
      cumulativeProfit: cumulativeProfit.toFixed(2),
    });
  }

  return projections;
};

export const calculateAnalysisResults = (params: BusinessAnalysisFormValues): AnalysisResult => {
  const yearlyProjections = calculateYearlyProjections(params);
  const monthlyData = calculateMonthlyData(params, 1);

  // Calculate summary metrics
  const totalRevenue = yearlyProjections.reduce((sum, proj) => sum + parseFloat(proj.annualRevenue), 0);

  const totalProfit = yearlyProjections.reduce((sum, proj) => sum + parseFloat(proj.netProfit), 0);

  const avgROI = (totalProfit / params.initialInvestment / 10) * 100;

  // Calculate payback period
  let paybackPeriod = 0;
  let cumulativeProfit = -params.initialInvestment;

  for (const proj of yearlyProjections) {
    cumulativeProfit += parseFloat(proj.netProfit);
    paybackPeriod++;
    if (cumulativeProfit >= 0) break;
  }

  return {
    monthlyData,
    yearlyProjections,
    totalRevenue: totalRevenue.toFixed(1),
    totalProfit: totalProfit.toFixed(1),
    avgROI: avgROI.toFixed(1),
    paybackPeriod: paybackPeriod.toString(),
  };
};
