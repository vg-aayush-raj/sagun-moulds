import { Typography } from '@mui/material';
import styles from '../BusinessAnalysis.module.css';
import { AnalysisResult } from '../calculations';

interface ResultsSummaryProps {
  results: AnalysisResult;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
  return (
    <div className={styles.resultsSummary}>
      <div className={styles.summaryCard}>
        <Typography className={styles.cardLabel}>Total 10-Year Revenue</Typography>
        <Typography className={styles.cardValue}>₹{results.totalRevenue}Cr</Typography>
      </div>

      <div className={styles.summaryCard}>
        <Typography className={styles.cardLabel}>Total 10-Year Profit</Typography>
        <Typography className={styles.cardValue}>₹{results.totalProfit}Cr</Typography>
      </div>

      <div className={styles.summaryCard}>
        <Typography className={styles.cardLabel}>Average Annual ROI</Typography>
        <Typography className={styles.cardValue}>{results.avgROI}%</Typography>
      </div>

      <div className={styles.summaryCard}>
        <Typography className={styles.cardLabel}>Payback Period</Typography>
        <Typography className={styles.cardValue}>{results.paybackPeriod} Years</Typography>
      </div>
    </div>
  );
}
