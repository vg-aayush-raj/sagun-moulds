import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import styles from '../BusinessAnalysis.module.css';
import { AnalysisResult } from '../calculations';

interface YearlyProjectionsTableProps {
  results: AnalysisResult;
}

export function YearlyProjectionsTable({ results }: YearlyProjectionsTableProps) {
  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}>
        📊 10-Year Revenue & Profit Projection
      </Typography>

      <div className={styles.tableContainer}>
        <Table size="small">
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell className={styles.tableHeaderCell}>Year</TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Monthly Avg Cups
                <br />
                (Thousands)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Annual Revenue
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Raw Material Cost
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Fixed Costs
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Total Costs
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Gross Profit
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Net Profit
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                EMI Payment
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Cash Flow
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Profit Margin
                <br />
                (%)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Cumulative Cash
                <br />
                (₹ Crores)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Expansion
                <br />
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.yearlyProjections.map((projection) => (
              <TableRow
                key={projection.year}
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'var(--bg-light-gray)' } }}
              >
                <TableCell component="th" scope="row" className={styles.yearColumn}>
                  Year {projection.year}
                </TableCell>
                <TableCell align="right">{projection.monthlyAvgCups.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                  ₹{projection.annualRevenue}
                </TableCell>
                <TableCell align="right">₹{projection.rawMaterialCost}</TableCell>
                <TableCell align="right">₹{projection.fixedCosts}</TableCell>
                <TableCell align="right">₹{projection.totalCosts}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                  ₹{projection.grossProfit}
                </TableCell>
                <TableCell
                  align="right"
                  className={parseFloat(projection.netProfit) >= 0 ? styles.positiveValue : styles.negativeValue}
                >
                  ₹{projection.netProfit}
                </TableCell>
                <TableCell align="right" sx={{ color: 'var(--danger)' }}>
                  ₹{projection.emiPayment || '0.00'}
                </TableCell>
                <TableCell
                  align="right"
                  className={parseFloat(projection.cashFlow || '0') >= 0 ? styles.positiveValue : styles.negativeValue}
                >
                  ₹{projection.cashFlow || '0.00'}
                </TableCell>
                <TableCell align="right">{projection.profitMargin}%</TableCell>
                <TableCell
                  align="right"
                  className={
                    parseFloat(projection.cumulativeCashFlow || '0') >= 0 ? styles.positiveValue : styles.negativeValue
                  }
                >
                  ₹{projection.cumulativeCashFlow || projection.cumulativeProfit}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: projection.machineryAdded
                      ? 'var(--success)'
                      : projection.expansionPossible
                        ? 'var(--warning)'
                        : 'inherit',
                  }}
                >
                  {projection.machineryAdded ? '✅ Expanded' : projection.expansionPossible ? '⚠️ Possible' : ''}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
