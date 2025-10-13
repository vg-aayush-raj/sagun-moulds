import React from 'react';
import { Grid } from '../../../components/ui/Grid';
import { AdvancedCupCalculatorResult, formatCurrency, formatPercentage } from '../calculations';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  results: AdvancedCupCalculatorResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const { cupAnalyses, overallAnalysis } = results;

  return (
    <div className={styles.container}>
      {/* Overall Summary */}
      <div className={styles.summarySection}>
        <h3>Daily Business Summary</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <div className={styles.summaryCard}>
              <h4>Daily Expenses</h4>
              <p className={styles.amount}>{formatCurrency(overallAnalysis.totalDailyExpenses)}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div className={styles.summaryCard}>
              <h4>Daily Production</h4>
              <p className={styles.amount}>{overallAnalysis.totalDailyProduction.toLocaleString()} cups</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div className={styles.summaryCard}>
              <h4>Daily Revenue (GST Inc.)</h4>
              <p className={styles.amount}>{formatCurrency(overallAnalysis.totalDailyRevenueWithGST)}</p>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <div className={styles.summaryCard}>
              <h4>Daily Profit</h4>
              <p
                className={`${styles.amount} ${overallAnalysis.totalDailyProfit > 0 ? styles.positive : styles.negative}`}
              >
                {formatCurrency(overallAnalysis.totalDailyProfit)}
              </p>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Per Cup Analysis - Individual Cup Types */}
      <div className={styles.perCupSection}>
        <h3>Manufacturing & Selling Prices by Cup Type</h3>
        {cupAnalyses.map((cup) => (
          <div key={cup.id} className={styles.cupSection}>
            <h4 className={styles.cupTitle}>{cup.name}</h4>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Base Manufacturing Cost</h5>
                  <p className={styles.amount}>{formatCurrency(cup.baseManuCostPerCup)}</p>
                  <small>Without GST</small>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Manufacturing Cost + GST</h5>
                  <p className={styles.amount}>{formatCurrency(cup.baseManuCostPerCupWithRawMaterialGST)}</p>
                  <small>With Raw Material GST</small>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Selling Price</h5>
                  <p className={styles.amount}>{formatCurrency(cup.sellingPriceWithoutGST)}</p>
                  <small>Without Sales GST</small>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Final Selling Price</h5>
                  <p className={styles.amount}>{formatCurrency(cup.finalSellingPriceWithGST)}</p>
                  <small>With Sales GST</small>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Profit per Cup</h5>
                  <p
                    className={`${styles.amount} ${cup.dailyProfit / cup.dailyProduction > 0 ? styles.positive : styles.negative}`}
                  >
                    {formatCurrency(cup.dailyProfit / cup.dailyProduction)}
                  </p>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <div className={styles.summaryCard}>
                  <h5>Profit Margin</h5>
                  <p className={`${styles.amount} ${cup.dailyProfit > 0 ? styles.positive : styles.negative}`}>
                    {formatPercentage(
                      cup.dailyRevenueWithoutGST > 0 ? (cup.dailyProfit / cup.dailyRevenueWithoutGST) * 100 : 0,
                    )}
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        ))}
      </div>

      {/* GST Analysis */}
      <div className={styles.gstSection}>
        <h3>GST Analysis (Daily)</h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <div className={styles.gstCard}>
              <h4>GST Credit (Input)</h4>
              <p className={styles.amount}>
                {formatCurrency(overallAnalysis.overallGSTAnalysis.totalGSTCreditFromRawMaterial)}
              </p>
              <small>GST paid on raw materials</small>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className={styles.gstCard}>
              <h4>GST Debit (Output)</h4>
              <p className={styles.amount}>
                {formatCurrency(overallAnalysis.overallGSTAnalysis.totalGSTDebitFromSales)}
              </p>
              <small>GST collected on sales</small>
            </div>
          </Grid>
          <Grid item xs={12} sm={4}>
            <div className={styles.gstCard}>
              <h4>Net GST Position</h4>
              <p
                className={`${styles.amount} ${overallAnalysis.overallGSTAnalysis.netGSTPosition >= 0 ? styles.positive : styles.negative}`}
              >
                {formatCurrency(Math.abs(overallAnalysis.overallGSTAnalysis.netGSTPosition))}
              </p>
              <small>
                {overallAnalysis.overallGSTAnalysis.netGSTPosition >= 0 ? 'Credit Balance' : 'Amount to Pay'}
              </small>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Detailed Cup Analysis */}
      <div className={styles.detailSection}>
        <h3>Detailed Cost Analysis by Cup Type</h3>
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Cup Name</th>
                <th>Daily Production</th>
                <th>Raw Material (No GST)</th>
                <th>Raw Material + GST</th>
                <th>Production Expenses</th>
                <th>Freight</th>
                <th>Base Manu Cost</th>
                <th>Base Manu + GST</th>
                <th>Margin</th>
                <th>Selling Price</th>
                <th>Final Price + GST</th>
                <th>Daily Revenue</th>
                <th>Daily Profit</th>
              </tr>
            </thead>
            <tbody>
              {cupAnalyses.map((cup) => (
                <tr key={cup.id}>
                  <td className={styles.cupName}>{cup.name}</td>
                  <td>{cup.dailyProduction.toLocaleString()}</td>
                  <td>{formatCurrency(cup.rawMaterialCostPerCupWithoutGST)}</td>
                  <td>{formatCurrency(cup.rawMaterialCostPerCupWithGST)}</td>
                  <td>{formatCurrency(cup.productionExpensesPerCup)}</td>
                  <td>{formatCurrency(cup.freightPerCup)}</td>
                  <td>{formatCurrency(cup.baseManuCostPerCup)}</td>
                  <td className={styles.highlight}>{formatCurrency(cup.baseManuCostPerCupWithRawMaterialGST)}</td>
                  <td>{formatCurrency(cup.marginAmount)}</td>
                  <td>{formatCurrency(cup.sellingPriceWithoutGST)}</td>
                  <td className={styles.finalPrice}>{formatCurrency(cup.finalSellingPriceWithGST)}</td>
                  <td>{formatCurrency(cup.dailyRevenueWithGST)}</td>
                  <td className={cup.dailyProfit > 0 ? styles.positive : styles.negative}>
                    {formatCurrency(cup.dailyProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Material Details */}
      <div className={styles.rawMaterialSection}>
        <h3>Raw Material Cost Analysis</h3>
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Cup Name</th>
                <th>Base Price (₹/Kg)</th>
                <th>Price with GST (₹/Kg)</th>
                <th>Price with GST + Freight (₹/Kg)</th>
                <th>Required Kg (Daily)</th>
                <th>Cost without GST (Daily)</th>
                <th>Cost with GST (Daily)</th>
                <th>GST Credit (Daily)</th>
              </tr>
            </thead>
            <tbody>
              {cupAnalyses.map((cup) => (
                <tr key={cup.id}>
                  <td className={styles.cupName}>{cup.name}</td>
                  <td>{formatCurrency(cup.rawMaterialBasePricePerKg)}</td>
                  <td>{formatCurrency(cup.rawMaterialWithGSTPerKg)}</td>
                  <td>{formatCurrency(cup.rawMaterialWithGSTAndFreightPerKg)}</td>
                  <td>{cup.rawMaterialRequiredKgDaily.toFixed(2)} Kg</td>
                  <td>{formatCurrency(cup.dailyCosts.rawMaterialWithoutGST)}</td>
                  <td>{formatCurrency(cup.dailyCosts.rawMaterialWithGST)}</td>
                  <td className={styles.gstCredit}>{formatCurrency(cup.gstAnalysis.gstCreditFromRawMaterial)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Breakdown Summary */}
      <div className={styles.costBreakdownSection}>
        <h3>Daily Cost & Revenue Breakdown</h3>
        <div className={styles.tableContainer}>
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                <th>Cup Name</th>
                <th>Raw Material with GST</th>
                <th>Production Expenses</th>
                <th>Freight Costs</th>
                <th>Total Costs</th>
                <th>Revenue (No GST)</th>
                <th>Revenue (With GST)</th>
                <th>GST on Sales</th>
                <th>Profit</th>
                <th>Profit Margin %</th>
              </tr>
            </thead>
            <tbody>
              {cupAnalyses.map((cup) => {
                const profitMargin =
                  cup.dailyRevenueWithoutGST > 0 ? (cup.dailyProfit / cup.dailyRevenueWithoutGST) * 100 : 0;

                return (
                  <tr key={cup.id}>
                    <td className={styles.cupName}>{cup.name}</td>
                    <td>{formatCurrency(cup.dailyCosts.rawMaterialWithGST)}</td>
                    <td>{formatCurrency(cup.dailyCosts.production)}</td>
                    <td>{formatCurrency(cup.dailyCosts.freight)}</td>
                    <td>{formatCurrency(cup.dailyCosts.totalWithGST)}</td>
                    <td>{formatCurrency(cup.dailyRevenueWithoutGST)}</td>
                    <td>{formatCurrency(cup.dailyRevenueWithGST)}</td>
                    <td>{formatCurrency(cup.gstAnalysis.gstDebitFromSales)}</td>
                    <td className={cup.dailyProfit > 0 ? styles.positive : styles.negative}>
                      {formatCurrency(cup.dailyProfit)}
                    </td>
                    <td className={cup.dailyProfit > 0 ? styles.positive : styles.negative}>
                      {formatPercentage(profitMargin)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
