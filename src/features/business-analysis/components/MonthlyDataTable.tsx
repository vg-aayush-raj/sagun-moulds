import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import styles from '../BusinessAnalysis.module.css';
import { AnalysisResult } from '../calculations';

interface MonthlyDataTableProps {
  results: AnalysisResult;
}

export function MonthlyDataTable({ results }: MonthlyDataTableProps) {
  return (
    <>
      <Typography variant="h5" component="h2" sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}>
        📈 Monthly Breakdown - Year 1
      </Typography>

      <div className={styles.tableContainer}>
        <Table size="small">
          <TableHead className={styles.tableHeader}>
            <TableRow>
              <TableCell className={styles.tableHeaderCell}>Month</TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Capacity %
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Cups Produced
                <br />
                (Thousands)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Revenue
                <br />
                (₹ Lakhs)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Costs
                <br />
                (₹ Lakhs)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Net Profit
                <br />
                (₹ Lakhs)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                EMI Payment
                <br />
                (₹ Lakhs)
              </TableCell>
              <TableCell align="right" className={styles.tableHeaderCell}>
                Cash Flow
                <br />
                (After EMI)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.monthlyData.map((month) => (
              <TableRow
                key={month.month}
                hover
                sx={{ '&:nth-of-type(odd)': { backgroundColor: 'var(--bg-light-gray)' } }}
              >
                <TableCell component="th" scope="row" className={styles.yearColumn}>
                  {month.month}
                </TableCell>
                <TableCell align="right">{month.capacity}%</TableCell>
                <TableCell align="right">{month.cupsProduced.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                  ₹{month.revenue}
                </TableCell>
                <TableCell align="right">₹{month.costs}</TableCell>
                <TableCell
                  align="right"
                  className={parseFloat(month.netProfit) >= 0 ? styles.positiveValue : styles.negativeValue}
                >
                  ₹{month.netProfit}
                </TableCell>
                <TableCell align="right" sx={{ color: 'var(--danger)' }}>
                  ₹{month.emiPayment || '0.00'}
                </TableCell>
                <TableCell
                  align="right"
                  className={
                    parseFloat(month.cashFlowAfterEMI || '0') >= 0 ? styles.positiveValue : styles.negativeValue
                  }
                >
                  ₹{month.cashFlowAfterEMI || '0.00'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
