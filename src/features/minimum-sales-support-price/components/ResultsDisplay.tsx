import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { MinimumSalesSupportPriceResult } from '../calculations';
import styles from '../MinimumSalesSupportPrice.module.css';

interface ResultsDisplayProps {
  results: MinimumSalesSupportPriceResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { cupAnalyses, overallAnalysis, expenses } = results;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div className={styles.resultsGrid}>
      {/* Overall Summary */}
      <Paper
        className={`${styles.resultCard} ${styles.overallSummary}`}
        sx={{
          background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 50%, #0d47a1 100%) !important',
          color: 'white !important',
          boxShadow: '0 12px 32px rgba(30, 136, 229, 0.6) !important',
          border: '3px solid rgba(255, 255, 255, 0.2) !important',
          borderRadius: '16px !important',
        }}
      >
        <Typography
          variant="h6"
          className={styles.resultTitle}
          sx={{
            color: '#ffffff !important',
            fontWeight: '800 !important',
            fontSize: '1.6rem !important',
            textShadow: '0 3px 6px rgba(0, 0, 0, 0.5) !important',
            marginBottom: '24px !important',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Overall Monthly Summary
        </Typography>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Expenses:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.totalMonthlyExpenses)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Raw Material Cost:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.totalMonthlyRawMaterialCost)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Cost:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.totalMonthlyCost)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Production:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatNumber(overallAnalysis.totalMonthlyProduction, 0)} cups
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Sales:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.totalMonthlySales)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Total Monthly Profit:
          </span>
          <span
            className={`${styles.resultValue} ${
              overallAnalysis.totalMonthlyProfit >= 0 ? styles.positiveValue : styles.negativeValue
            }`}
            style={{
              color: overallAnalysis.totalMonthlyProfit >= 0 ? '#4caf50' : '#f44336',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.totalMonthlyProfit)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Overall Profit Margin:
          </span>
          <span
            className={`${styles.resultValue} ${
              overallAnalysis.overallProfitMarginPercentage >= 0 ? styles.positiveValue : styles.negativeValue
            }`}
            style={{
              color: overallAnalysis.overallProfitMarginPercentage >= 0 ? '#4caf50' : '#f44336',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatNumber(overallAnalysis.overallProfitMarginPercentage, 1)}%
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: '2px solid rgba(255, 255, 255, 0.4)',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Average Cost per Cup:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.averageCostPerCup)}
          </span>
        </div>

        <div
          className={styles.resultItem}
          style={{
            borderBottom: 'none',
            padding: '16px 0',
            borderRadius: '8px',
            margin: '4px 0',
          }}
        >
          <span
            className={styles.resultLabel}
            style={{
              color: '#e3f2fd',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            }}
          >
            Break-even Price per Cup:
          </span>
          <span
            className={styles.resultValue}
            style={{
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1.2rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            {formatCurrency(overallAnalysis.breakEvenPointPerCup)}
          </span>
        </div>
      </Paper>

      {/* Expenses Breakdown */}
      <Paper className={styles.resultCard}>
        <Typography variant="h6" className={styles.resultTitle}>
          Monthly Expenses Breakdown
        </Typography>

        {expenses.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No expenses recorded
          </Typography>
        ) : (
          expenses.map((expense, index) => (
            <div key={expense.id || index} className={styles.resultItem}>
              <span className={styles.resultLabel}>{expense.name}:</span>
              <span className={styles.resultValue}>{formatCurrency(expense.amount)}</span>
            </div>
          ))
        )}
      </Paper>

      {/* Cup-wise Analysis Table */}
      {cupAnalyses.length > 0 && (
        <Paper className={styles.resultCard} style={{ gridColumn: '1 / -1' }}>
          <Typography variant="h6" className={styles.resultTitle}>
            Cup-wise Analysis
          </Typography>

          <TableContainer>
            <Table className={styles.cupAnalysisTable}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Cup Type</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Monthly Production</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Raw Material Cost/Cup</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Fixed Cost/Cup</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Total Cost/Cup</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Selling Price/Cup</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Profit/Cup</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Monthly Sales</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Monthly Profit</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Profit Margin</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cupAnalyses.map((analysis, index) => (
                  <TableRow key={analysis.id || index}>
                    <TableCell>{analysis.name || `Cup ${index + 1}`}</TableCell>
                    <TableCell align="right">{formatNumber(analysis.monthlyProduction, 0)}</TableCell>
                    <TableCell align="right">{formatCurrency(analysis.rawMaterialCostPerCup)}</TableCell>
                    <TableCell align="right">{formatCurrency(analysis.fixedCostPerCup)}</TableCell>
                    <TableCell align="right">{formatCurrency(analysis.totalCostPerCup)}</TableCell>
                    <TableCell align="right">{formatCurrency(analysis.sellingPricePerCup)}</TableCell>
                    <TableCell align="right">
                      <span className={analysis.profitPerCup >= 0 ? styles.profitPositive : styles.profitNegative}>
                        {formatCurrency(analysis.profitPerCup)}
                      </span>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(analysis.totalMonthlySales)}</TableCell>
                    <TableCell align="right">
                      <span
                        className={analysis.totalMonthlyProfit >= 0 ? styles.profitPositive : styles.profitNegative}
                      >
                        {formatCurrency(analysis.totalMonthlyProfit)}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <span
                        className={analysis.profitMarginPercentage >= 0 ? styles.profitPositive : styles.profitNegative}
                      >
                        {formatNumber(analysis.profitMarginPercentage, 1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};
