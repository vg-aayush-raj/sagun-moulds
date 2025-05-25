import { Stack, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function BusinessInsights() {
  const { getValues } = useFormContext<BusinessAnalysisFormValues>();

  return (
    <>
      {/* Key Assumptions */}
      <div className={styles.keyInsightsPanel}>
        <Typography variant="h6" className={styles.insightTitle}>
          🔍 Key Business Assumptions
        </Typography>
        <div className={styles.insightGrid}>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Production Setup:
            </Typography>
            <Typography variant="body2">
              • Thermoforming Machines: {getValues().productionSetup.thermoformingMachines}
              <br />• Printers: {getValues().productionSetup.printers}
              <br />• Sheetlines: {getValues().productionSetup.sheetlines}
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Seasonal Variations:
            </Typography>
            <Typography variant="body2">
              • Aug, Sep, Nov: {getValues().seasonalCapacity.aug * 100}% capacity
              <br />
              • Other months: 85% capacity
              <br />• Peak months (Apr-Jun): {getValues().seasonalCapacity.apr * 100}% capacity
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Cost Escalations:
            </Typography>
            <Typography variant="body2">
              • Rent: {getValues().rentIncreaseRate * 100}% annually from October
              <br />• Raw materials: {getValues().growthRates.rawMaterial * 100}% annually
              <br />• Labor: {getValues().growthRates.fixedCosts * 100}% annually
            </Typography>
          </div>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Revenue Growth:
            </Typography>
            <Typography variant="body2">
              • Price increase: {getValues().growthRates.price * 100}% annually
              <br />• Market expansion: {getValues().growthRates.volume[1] * 100}% Y2-Y5
              <br />• Mature growth: {getValues().growthRates.volume[5] * 100}% Y6-Y10
            </Typography>
          </div>
        </div>
      </div>

      {/* Calculation Methodology */}
      <div className={styles.methodologyCard}>
        <Typography variant="h6" className={styles.methodologyTitle}>
          🧮 Calculation Methodology
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body1">
            <strong>Revenue Calculation:</strong> Monthly Cups × Average Selling Price (₹
            {getValues().pricePerCup.sudha} Sudha + ₹{getValues().pricePerCup.local} Local)
          </Typography>
          <Typography variant="body1">
            <strong>Seasonal Adjustments:</strong> August, September, November at 70% | Peak Summer (Apr-Jun) at 95% |
            Others at 85%
          </Typography>
          <Typography variant="body1">
            <strong>Cost Structure:</strong> Raw Materials ({getValues().rawMaterialCostPercent * 100}% of revenue) +
            Fixed Costs (Rent, Utilities, Labor, Maintenance)
          </Typography>
          <Typography variant="body1">
            <strong>Growth Assumptions:</strong> Conservative market expansion with realistic seasonal fluctuations
          </Typography>
        </Stack>
      </div>
    </>
  );
}
