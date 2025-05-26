import { Typography } from '@mui/material';
import styles from '../BusinessAnalysis.module.css';

interface FinalInsightsProps {
  paybackPeriod: number | string;
}

export function FinalInsights({ paybackPeriod }: FinalInsightsProps) {
  return (
    <div className={styles.finalInsights}>
      <Typography variant="h6" className={styles.finalInsightsTitle}>
        💡 Key Insights:
      </Typography>
      <Typography variant="body1">
        • Break-even expected in Month 8-10 of operations
        <br />
        • Peak profitability during summer months (ice cream season)
        <br />
        • Dahi cups provide steady base demand throughout the year
        <br />• Equipment investment recovers within {paybackPeriod}
        <br />• Manufacturing capacity can be doubled with reinvestment of profits
        <br />• Strategic expansion possible when sufficient cash flow is achieved
        <br />• EMI payments accounted for in cash flow projections
      </Typography>
    </div>
  );
}
