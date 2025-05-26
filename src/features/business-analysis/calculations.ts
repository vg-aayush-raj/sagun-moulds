import { BusinessAnalysisFormValues } from './schema';

export interface MonthlyData {
  month: string;
  capacity: number;
  cupsProduced: number;
  revenue: string;
  costs: string;
  netProfit: string;
  cashFlow: string;
  emiPayment?: string;
  cashFlowAfterEMI?: string;
  runningCash?: string;
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
  emiPayment: string;
  profitMargin: string;
  cumulativeProfit: string;
  cashFlow: string;
  cumulativeCashFlow: string;
  expansionPossible: boolean;
  machineryAdded: boolean;
}

export interface AnalysisResult {
  monthlyData: MonthlyData[];
  yearlyProjections: YearlyProjection[];
  totalRevenue: string;
  totalProfit: string;
  avgROI: string;
  paybackPeriod: string;
  monthlyEMI: number;
  expansionYear: number;
  expansionMonth: number;
  secondExpansionYear: number;
  secondExpansionMonth: number;
  thirdExpansionYear: number;
  thirdExpansionMonth: number;
  loanClosureYear: number;
  loanClosureMonth: number;
}

export const calculateMonthlyData = (
  params: BusinessAnalysisFormValues,
  year = 1,
  overrides?: {
    thermoformingMachines?: number;
    printers?: number;
    sheetlines?: number;
  },
): MonthlyData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const capacityKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

  const avgSellingPrice =
    (params.pricePerCup.sudha * params.mixRatio.sudha + params.pricePerCup.local * params.mixRatio.local) *
    Math.pow(1 + params.growthRates.price, year - 1);

  const volumeMultiplier = 1 + (params.growthRates.volume[year - 1] || 0);
  const thermoformingMachines = overrides?.thermoformingMachines ?? params.productionSetup.thermoformingMachines;
  const printers = overrides?.printers ?? params.productionSetup.printers;
  // sheetlines is not used in baseDailyProduction, but available for future use
  // const sheetlines = overrides?.sheetlines ?? params.productionSetup.sheetlines;

  const baseDailyProduction =
    Math.min(params.cupsPerDay.thermoforming * thermoformingMachines, params.cupsPerDay.printing * printers) *
    volumeMultiplier;

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
      cashFlow: netProfit.toFixed(2),
    });
  });

  return monthlyData;
};

export const calculateYearlyProjections = (params: BusinessAnalysisFormValues): YearlyProjection[] => {
  const projections: YearlyProjection[] = [];
  let cumulativeProfit = 0;
  let cumulativeCashFlow = 0;

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

    // Calculate monthly EMI
    const monthlyEMI = calculateEMI(
      params.financingDetails.loanAmount,
      params.financingDetails.loanInterestRate,
      params.financingDetails.loanPeriodYears,
    );

    // Convert to crores for consistent display (₹ Crores)
    const monthlyEMICrores = monthlyEMI / 10000000;

    // Calculate annual EMI in crores
    const annualEMICrores = monthlyEMICrores * 12;

    // Calculate cash flow (net profit minus EMI payments, all in crores)
    const cashFlow = netProfit - annualEMICrores;

    // Update cumulative cash flow
    cumulativeCashFlow += cashFlow;

    projections.push({
      year,
      monthlyAvgCups: Math.round(annualCups / 12),
      annualRevenue: annualRevenue.toFixed(2),
      rawMaterialCost: rawMaterialCost.toFixed(2),
      fixedCosts: fixedCosts.toFixed(2),
      totalCosts: annualCosts.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      emiPayment: annualEMICrores.toFixed(2), // Now using the calculated EMI value in crores
      profitMargin: profitMargin.toFixed(1),
      cumulativeProfit: cumulativeProfit.toFixed(2),
      cashFlow: cashFlow.toFixed(2), // Updated to account for EMI payments
      cumulativeCashFlow: cumulativeCashFlow.toFixed(2),
      expansionPossible: false, // Default value
      machineryAdded: false, // Default value
    });
  }

  return projections;
};

// Calculate EMI (Equated Monthly Installment)
export const calculateEMI = (loanAmount: number, interestRate: number, years: number): number => {
  if (loanAmount <= 0 || years <= 0) return 0;

  const principal = loanAmount * 10000000; // Convert Crores to Rupees
  const monthlyRate = interestRate / (12 * 100);
  const months = years * 12;

  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(emi);
};

export const calculateAnalysisResults = (params: BusinessAnalysisFormValues): AnalysisResult => {
  // Calculate monthly EMI based on loan details
  const monthlyEMI = calculateEMI(
    params.financingDetails.loanAmount,
    params.financingDetails.loanInterestRate,
    params.financingDetails.loanPeriodYears,
  );

  // Monthly EMI in Lakhs for monthlyData, Crores for yearlyProjections
  const monthlyEMILakhs = monthlyEMI / 100000;
  const monthlyEMICrores = monthlyEMI / 10000000;

  // Setup expansion tracking
  let expansionYear = 0;
  let expansionMonth = 0;
  let secondExpansionYear = 0;
  let secondExpansionMonth = 0;
  let thirdExpansionYear = 0;
  let thirdExpansionMonth = 0;
  let loanClosureYear = 0;
  let loanClosureMonth = 0;

  // Calculate machinery expansion cost (one expansion set)
  const machinerySubtotal = Object.entries(params.machineryDetails).reduce((total, [key, value]) => {
    if (key !== 'gstRate') return total + value;
    return total;
  }, 0);

  const gstAmount = (machinerySubtotal * params.machineryDetails.gstRate) / 100;
  const totalMachineryCost = machinerySubtotal + gstAmount;

  // Cost of one expansion set (approximate 50% of original setup)
  const expansionCost = (totalMachineryCost * 0.5) / 100; // Convert from lakhs to crores

  // Generate yearly projections with expansion analysis
  const yearlyProjections: YearlyProjection[] = [];
  let cumulativeProfit = 0;
  let cumulativeCashFlow = 0;
  let hasExpanded = false;
  let secondExpansionDone = false;
  let thirdExpansionDone = false;
  let loanClosed = false;

  // Initialize the monthly data array for the first year, will be used in the return statement
  const monthlyData = calculateMonthlyData(params, 1);

  // Track current machine counts for expansion
  let currentThermoformingMachines = params.productionSetup.thermoformingMachines;
  let currentPrinters = params.productionSetup.printers;
  let currentSheetlines = params.productionSetup.sheetlines;

  for (let year = 1; year <= 10; year++) {
    // Get monthly data for this year, using current machine counts
    const currentYearMonthlyData =
      year === 1
        ? monthlyData
        : calculateMonthlyData(params, year, {
            thermoformingMachines: currentThermoformingMachines,
            printers: currentPrinters,
            sheetlines: currentSheetlines,
          });
    let yearlyEMI = 0;
    let monthlyRunningCash = cumulativeCashFlow;
    let machineryAdded = false;

    // Process each month's data for EMI payments and expansion possibilities
    currentYearMonthlyData.forEach((month, monthIndex) => {
      // Add EMI data to monthly breakdown
      // For monthlyData, EMI should be in lakhs
      const monthEMI = year * 12 + monthIndex <= params.financingDetails.loanPeriodYears * 12 ? monthlyEMILakhs : 0;
      yearlyEMI += monthlyEMICrores; // For yearly projections, keep in crores

      // Update cash flow calculations to include EMI
      const netProfit = parseFloat(month.netProfit);
      const cashFlowAfterEMI = netProfit - monthEMI;
      monthlyRunningCash += cashFlowAfterEMI;

      // Add EMI data to the monthly data (in lakhs)
      month.emiPayment = monthEMI.toFixed(2);
      month.cashFlowAfterEMI = cashFlowAfterEMI.toFixed(2);
      month.runningCash = monthlyRunningCash.toFixed(2);

      // Check for loan prepayment possibility
      if (!loanClosed && monthlyRunningCash > params.financingDetails.loanAmount) {
        loanClosureYear = year;
        loanClosureMonth = monthIndex;
        loanClosed = true;
      }

      // Check for expansion possibilities
      if (!hasExpanded && monthlyRunningCash > expansionCost) {
        expansionYear = year;
        expansionMonth = monthIndex;
        hasExpanded = true;
        machineryAdded = true;
        monthlyRunningCash -= expansionCost;

        // Update production capacity
        currentThermoformingMachines += 2;
        currentPrinters += 4;
        currentSheetlines += 1;
      } else if (hasExpanded && !secondExpansionDone && monthlyRunningCash > expansionCost) {
        secondExpansionYear = year;
        secondExpansionMonth = monthIndex;
        secondExpansionDone = true;
        machineryAdded = true;
        monthlyRunningCash -= expansionCost;

        // Update production capacity for second expansion
        currentThermoformingMachines += 2;
        currentPrinters += 4;
        currentSheetlines += 1;
      } else if (secondExpansionDone && !thirdExpansionDone && monthlyRunningCash > expansionCost) {
        thirdExpansionYear = year;
        thirdExpansionMonth = monthIndex;
        thirdExpansionDone = true;
        machineryAdded = true;
        monthlyRunningCash -= expansionCost;

        // Update production capacity for third expansion
        currentThermoformingMachines += 2;
        currentPrinters += 4;
        currentSheetlines += 1;
      }
    });

    // Calculate annual totals
    const annualCups = currentYearMonthlyData.reduce(
      (sum, month) => sum + parseFloat(month.cupsProduced as unknown as string),
      0,
    );
    const annualRevenue = currentYearMonthlyData.reduce((sum, month) => sum + parseFloat(month.revenue), 0) / 100; // Convert to crores
    const annualCosts = currentYearMonthlyData.reduce((sum, month) => sum + parseFloat(month.costs), 0) / 100;
    const rawMaterialCost = annualRevenue * params.rawMaterialCostPercent;
    const fixedCosts = annualCosts - rawMaterialCost;
    const grossProfit = annualRevenue - rawMaterialCost;
    const netProfit = annualRevenue - annualCosts;

    // Annual cash flow after EMI payments
    const annualCashFlow = netProfit - yearlyEMI;
    cumulativeProfit += netProfit;
    cumulativeCashFlow += annualCashFlow;

    // Check if expansion is possible in the coming year
    const expansionPossible = cumulativeCashFlow > expansionCost && !thirdExpansionDone;

    // Calculate profit margin
    const profitMargin = (netProfit / annualRevenue) * 100;

    // Add to yearly projections
    yearlyProjections.push({
      year,
      monthlyAvgCups: Math.round(annualCups / 12),
      annualRevenue: annualRevenue.toFixed(2),
      rawMaterialCost: rawMaterialCost.toFixed(2),
      fixedCosts: fixedCosts.toFixed(2),
      totalCosts: annualCosts.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      netProfit: netProfit.toFixed(2),
      emiPayment: yearlyEMI.toFixed(2),
      profitMargin: profitMargin.toFixed(1),
      cumulativeProfit: cumulativeProfit.toFixed(2),
      cashFlow: annualCashFlow.toFixed(2),
      cumulativeCashFlow: cumulativeCashFlow.toFixed(2),
      expansionPossible,
      machineryAdded,
    });
  }

  // Calculate summary metrics
  const totalRevenue = yearlyProjections.reduce((sum, proj) => sum + parseFloat(proj.annualRevenue), 0);
  const totalProfit = yearlyProjections.reduce((sum, proj) => sum + parseFloat(proj.netProfit), 0);
  const avgROI = (totalProfit / params.financingDetails.totalInvestment / 10) * 100;

  // Calculate payback period
  let paybackPeriod = 0;
  let runningProfit = -params.financingDetails.totalInvestment;

  for (const proj of yearlyProjections) {
    runningProfit += parseFloat(proj.netProfit);
    paybackPeriod++;
    if (runningProfit >= 0) break;
    if (paybackPeriod >= 10) break;
  }

  return {
    monthlyData,
    yearlyProjections,
    totalRevenue: totalRevenue.toFixed(1),
    totalProfit: totalProfit.toFixed(1),
    avgROI: avgROI.toFixed(1),
    paybackPeriod: paybackPeriod.toString(),
    monthlyEMI,
    expansionYear,
    expansionMonth,
    secondExpansionYear,
    secondExpansionMonth,
    thirdExpansionYear,
    thirdExpansionMonth,
    loanClosureYear,
    loanClosureMonth,
  };
};
