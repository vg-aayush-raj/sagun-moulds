import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
} from '@mui/material';
import { CupPriceCalculatorResult } from '../calculations';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  results: CupPriceCalculatorResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <div className={styles.container}>
      {/* Production & Material Overview */}
      <Paper className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          📦 Production & Material Overview
        </Typography>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Monthly Production
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatNumber(results.monthlyProduction)} cups
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Cup Weight
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {results.cupWeightInGrams} grams
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Total Raw Material Required
            </Typography>
            <Typography variant="h5" className={styles.infoValue} style={{ color: '#ff9800' }}>
              {formatNumber(results.totalRawMaterialRequiredKg)} kg
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Raw Material Price/Kg
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatCurrency(results.rawMaterialPricePerKg)}
            </Typography>
          </div>
        </div>
      </Paper>

      {/* Cost Breakdown */}
      <Paper className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          💰 Cost Breakdown
        </Typography>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Total Fixed Expenses/Month
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatCurrency(results.totalMonthlyExpenses)}
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Raw Material Cost/Month
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatCurrency(results.rawMaterialCostPerMonth)}
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Total Monthly Cost
            </Typography>
            <Typography variant="h5" className={styles.infoValue} style={{ color: '#f44336' }}>
              {formatCurrency(results.totalMonthlyCost)}
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Raw Material Cost/Cup
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatCurrency(results.rawMaterialCostPerCup)}
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Fixed Cost/Cup
            </Typography>
            <Typography variant="h5" className={styles.infoValue}>
              {formatCurrency(results.fixedCostPerCup)}
            </Typography>
          </div>
          <div className={styles.infoCard}>
            <Typography variant="body2" className={styles.infoLabel}>
              Base Cost/Cup (Before GST)
            </Typography>
            <Typography variant="h5" className={styles.infoValue} style={{ color: '#2c6cb0', fontWeight: 700 }}>
              {formatCurrency(results.baseCostPerCup)}
            </Typography>
          </div>
        </div>
      </Paper>

      {/* Cup Pricing with GST */}
      <Paper className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          💵 Cup Pricing with Custom GST Rates
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Final selling price per cup with your configured GST rates
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell>
                  <strong>GST Rate</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Base Cost</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>GST Amount</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Final Price with GST</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.pricesWithGST.map((priceInfo) => (
                <TableRow key={priceInfo.id} className={styles.tableRow}>
                  <TableCell>
                    <Chip
                      label={`${priceInfo.gstRate}%`}
                      color="primary"
                      size="small"
                      sx={{
                        backgroundColor: '#2c6cb0',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{priceInfo.description || '-'}</TableCell>
                  <TableCell align="right">{formatCurrency(results.baseCostPerCup)}</TableCell>
                  <TableCell align="right">{formatCurrency(priceInfo.gstAmount)}</TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c6cb0', fontSize: '1.1rem' }}>
                      {formatCurrency(priceInfo.priceWithGST)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Expenses Breakdown */}
      <Paper className={styles.section}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Expenses Breakdown
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell>
                  <strong>Expense Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Amount</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.expenses.map((expense) => (
                <TableRow key={expense.id} className={styles.tableRow}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.description || '-'}</TableCell>
                  <TableCell align="right">{formatCurrency(expense.amount)}</TableCell>
                </TableRow>
              ))}
              <TableRow className={styles.totalRow}>
                <TableCell colSpan={2}>
                  <strong>Total</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{formatCurrency(results.totalMonthlyExpenses)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Summary Box */}
      <Box className={styles.summaryBox}>
        <Typography variant="h6" className={styles.summaryTitle}>
          📊 Summary
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong>Production:</strong> {formatNumber(results.monthlyProduction)} cups/month requiring{' '}
          <strong style={{ color: '#ff9800' }}>{formatNumber(results.totalRawMaterialRequiredKg)} kg</strong> of raw
          material
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong>Total Monthly Cost:</strong> {formatCurrency(results.totalMonthlyCost)} (Fixed Expenses:{' '}
          {formatCurrency(results.totalMonthlyExpenses)} + Raw Material:{' '}
          {formatCurrency(results.rawMaterialCostPerMonth)})
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          <strong>Base Cost per Cup:</strong>{' '}
          <strong style={{ color: '#2c6cb0', fontSize: '1.1rem' }}>{formatCurrency(results.baseCostPerCup)}</strong>{' '}
          (Raw Material: {formatCurrency(results.rawMaterialCostPerCup)} + Fixed:{' '}
          {formatCurrency(results.fixedCostPerCup)})
        </Typography>
        <Typography variant="body1">
          The final selling price will vary based on the GST rate applied. Review the pricing table above to select the
          appropriate GST rate for your business. You can add or modify GST rates in the GST Configuration tab.
        </Typography>
      </Box>
    </div>
  );
};
