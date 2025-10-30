import type { BreakEvenFormValues } from './schema';

export interface GSTScenarioResult {
  gstRateName: string;
  gstRate: number;
  basePrice: number;
  gstAmount: number;
  sellingPrice: number;
  quantityKg: number;
  numberOfCups: number;
  totalRevenue: number;
  totalCost: number;
}

export interface TargetPriceResult {
  scenarioName: string;
  targetPrice: number;
  gstScenarios: GSTScenarioResult[];
}

export interface BreakEvenResults {
  totalInfrastructureCost: number;
  materialCostPerKg: number;
  cupWeightGrams: number;
  targetPriceResults: TargetPriceResult[];
}

/**
 * Calculate break-even scenarios with different GST rates and target prices
 *
 * Key formulas:
 * 1. Total Infrastructure Cost = Sum of all cost items
 * 2. Base Price = Target Selling Price / (1 + GST Rate)
 * 3. GST Amount = Base Price × GST Rate
 * 4. Quantity to Break Even = Infrastructure Cost / (Base Price - Material Cost)
 * 5. Number of Cups = (Quantity in kg × 1000) / Cup Weight (grams)
 * 6. Total Revenue = Quantity × Selling Price
 * 7. Total Cost = (Quantity × Material Cost) + Infrastructure Cost
 */
export function calculateBreakEven(inputs: BreakEvenFormValues): BreakEvenResults {
  const { materialCostPerKg, cupWeightGrams, costs, gstScenarios, targetPriceScenarios } = inputs;

  // Calculate total infrastructure cost from all cost items
  const totalInfrastructureCost = costs.reduce((sum, cost) => sum + cost.amount, 0);

  // Calculate scenario for a given target selling price and GST rate
  const calculateScenario = (targetPrice: number, gstRateName: string, gstRatePercent: number): GSTScenarioResult => {
    const gstRate = gstRatePercent / 100;

    // Base price is the price before adding GST
    const basePrice = targetPrice / (1 + gstRate);
    const gstAmount = basePrice * gstRate;

    // Calculate quantity needed to break even
    // Total Revenue = Quantity × Base Price (GST is collected but paid to govt, so net is base price)
    // Total Cost = (Quantity × Material Cost) + Infrastructure Cost
    // Break-even: Quantity × Base Price = (Quantity × Material Cost) + Infrastructure Cost
    // Quantity × (Base Price - Material Cost) = Infrastructure Cost
    // Quantity = Infrastructure Cost / (Base Price - Material Cost)

    const priceMargin = basePrice - materialCostPerKg;
    const quantityKg = priceMargin > 0 ? totalInfrastructureCost / priceMargin : 0;
    const numberOfCups = (quantityKg * 1000) / cupWeightGrams;
    const totalRevenue = quantityKg * targetPrice;
    const totalCost = quantityKg * materialCostPerKg + totalInfrastructureCost;

    return {
      gstRateName,
      gstRate: gstRatePercent,
      basePrice,
      gstAmount,
      sellingPrice: targetPrice,
      quantityKg,
      numberOfCups,
      totalRevenue,
      totalCost,
    };
  };

  // Calculate results for each target price scenario with all GST scenarios
  const targetPriceResults: TargetPriceResult[] = targetPriceScenarios.map((targetScenario) => {
    const gstResults = gstScenarios.map((gstScenario) =>
      calculateScenario(targetScenario.sellingPrice, gstScenario.name, gstScenario.gstRate),
    );

    return {
      scenarioName: targetScenario.name,
      targetPrice: targetScenario.sellingPrice,
      gstScenarios: gstResults,
    };
  });

  return {
    totalInfrastructureCost,
    materialCostPerKg,
    cupWeightGrams,
    targetPriceResults,
  };
}

/**
 * Example calculations for reference:
 *
 * Given:
 * - Material Cost: ₹151/kg
 * - Infrastructure Cost: ₹800,000 (Rent: ₹121k + EMI: ₹300k + Employee: ₹230k + Electricity: ₹149k)
 * - Target Selling Price: ₹340/kg
 * - Cup Weight: 1 gram
 *
 * For 18% GST:
 * - Base Price = 340 / 1.18 = ₹288.14/kg
 * - GST Amount = 288.14 × 0.18 = ₹51.86/kg
 * - Quantity Needed = 800,000 / (288.14 - 151) = 5,831.27 kg
 * - Number of Cups = 5,831.27 × 1000 / 1 = 5,831,270 pieces
 *
 * For 9% GST:
 * - Base Price = 340 / 1.09 = ₹311.93/kg
 * - GST Amount = 311.93 × 0.09 = ₹28.07/kg
 * - Quantity Needed = 800,000 / (311.93 - 151) = 4,969.33 kg
 * - Number of Cups = 4,969.33 × 1000 / 1 = 4,969,330 pieces
 *
 * For No GST:
 * - Base Price = 340 / 1.00 = ₹340/kg
 * - GST Amount = 0
 * - Quantity Needed = 800,000 / (340 - 151) = 4,232.80 kg
 * - Number of Cups = 4,232.80 × 1000 / 1 = 4,232,804 pieces
 */
