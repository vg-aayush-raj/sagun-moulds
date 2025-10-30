import React from 'react';
import styles from './ResultsDisplay.module.css';
import { BreakEvenResults } from '../calculations';

interface ResultsDisplayProps {
  results: BreakEvenResults;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className={styles.container}>
      <div className={styles.summaryCard}>
        <h3>Summary</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Total Infrastructure Cost:</span>
            <span className={styles.value}>₹{results.totalInfrastructureCost.toLocaleString()}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Material Cost per kg:</span>
            <span className={styles.value}>₹{results.materialCostPerKg.toFixed(2)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.label}>Cup Weight:</span>
            <span className={styles.value}>{results.cupWeightGrams} grams</span>
          </div>
        </div>
      </div>

      {results.targetPriceResults.map((targetResult, tIndex) => (
        <div key={tIndex} className={styles.targetCard}>
          <h3>
            {targetResult.scenarioName} - ₹{targetResult.targetPrice}/kg
          </h3>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>GST Scenario</th>
                  <th>GST Rate</th>
                  <th>Base Price (₹/kg)</th>
                  <th>GST Amount (₹/kg)</th>
                  <th>Selling Price (₹/kg)</th>
                  <th>Quantity (kg)</th>
                  <th>Number of Cups</th>
                </tr>
              </thead>
              <tbody>
                {targetResult.gstScenarios.map((gstResult, gIndex) => (
                  <tr key={gIndex}>
                    <td className={styles.highlight}>{gstResult.gstRateName}</td>
                    <td>{gstResult.gstRate}%</td>
                    <td>₹{gstResult.basePrice.toFixed(2)}</td>
                    <td>₹{gstResult.gstAmount.toFixed(2)}</td>
                    <td className={styles.highlight}>₹{gstResult.sellingPrice.toFixed(2)}</td>
                    <td>{gstResult.quantityKg.toFixed(2)}</td>
                    <td>{gstResult.numberOfCups.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> To achieve break-even at ₹{targetResult.targetPrice}/kg across different GST rates,
            you need to adjust the quantity sold. GST is collected from customers and paid to the government, so only
            the base price contributes to covering costs.
          </div>
        </div>
      ))}

      <div className={styles.formulaCard}>
        <h3>Key Formulas Used</h3>
        <div className={styles.formulaList}>
          <div className={styles.formula}>
            <strong>Total Infrastructure Cost:</strong>
            <code>Sum of all cost items</code>
          </div>
          <div className={styles.formula}>
            <strong>Base Price (Before GST):</strong>
            <code>Base Price = Selling Price / (1 + GST Rate)</code>
          </div>
          <div className={styles.formula}>
            <strong>GST Amount:</strong>
            <code>GST Amount = Base Price × GST Rate</code>
          </div>
          <div className={styles.formula}>
            <strong>Quantity to Break Even:</strong>
            <code>Quantity (kg) = Total Infrastructure Cost / (Base Price - Material Cost)</code>
          </div>
          <div className={styles.formula}>
            <strong>Number of Cups:</strong>
            <code>Cups = (Quantity in kg × 1000) / Cup Weight (grams)</code>
          </div>
          <div className={styles.formula}>
            <strong>Total Revenue:</strong>
            <code>Revenue = Quantity × Selling Price (including GST)</code>
          </div>
          <div className={styles.formula}>
            <strong>Total Cost:</strong>
            <code>Cost = (Quantity × Material Cost) + Infrastructure Cost</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
