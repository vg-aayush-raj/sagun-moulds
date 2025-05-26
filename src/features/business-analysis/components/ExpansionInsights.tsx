import { Box, Typography } from '@mui/material';
import styles from '../BusinessAnalysis.module.css';

interface ExpansionInsightsProps {
  expansionYear: number;
  expansionMonth: number;
  secondExpansionYear: number;
  secondExpansionMonth: number;
  thirdExpansionYear: number;
  thirdExpansionMonth: number;
  loanClosureYear: number;
  loanClosureMonth: number;
  monthlyEMI: number;
}

const getMonthName = (monthIndex: number): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthIndex] || '';
};

export function ExpansionInsights({
  expansionYear,
  expansionMonth,
  secondExpansionYear,
  secondExpansionMonth,
  thirdExpansionYear,
  thirdExpansionMonth,
  loanClosureYear,
  loanClosureMonth,
  monthlyEMI,
}: ExpansionInsightsProps) {
  return (
    <Box className={styles.expansionInsights}>
      <Typography variant="h6" className={styles.insightTitle}>
        🚀 Expansion & Financial Milestones
      </Typography>

      <Box className={styles.insightContent} sx={{ mt: 2 }}>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
          Loan Information:
        </Typography>

        <Typography variant="body1">
          • Monthly EMI: ₹ {monthlyEMI.toLocaleString()} per month
          {loanClosureYear > 0 && (
            <>
              <br />• Loan pre-closure possible in: Year {loanClosureYear}, {getMonthName(loanClosureMonth)}
            </>
          )}
        </Typography>

        <Typography variant="body1" sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
          Production Expansion Timeline:
        </Typography>

        {expansionYear > 0 ? (
          <Typography variant="body1">
            • First expansion funds available: Year {expansionYear}, {getMonthName(expansionMonth)}
            <br />• Production capacity after first expansion: <strong>2x</strong> (4 thermoforming machines, 8
            printers, 2 sheetlines)
            {secondExpansionYear > 0 && (
              <>
                <br />
                <br />• Second expansion funds available: Year {secondExpansionYear},{' '}
                {getMonthName(secondExpansionMonth)}
                <br />• Production capacity after second expansion: <strong>3x</strong> (6 thermoforming machines, 12
                printers, 3 sheetlines)
              </>
            )}
            {thirdExpansionYear > 0 && (
              <>
                <br />
                <br />• Third expansion funds available: Year {thirdExpansionYear}, {getMonthName(thirdExpansionMonth)}
                <br />• Production capacity after third expansion: <strong>4x</strong> (8 thermoforming machines, 16
                printers, 4 sheetlines)
              </>
            )}
          </Typography>
        ) : (
          <Typography variant="body1">
            • No expansion funds available within the 10-year projection period with current parameters
          </Typography>
        )}

        <Typography variant="body1" sx={{ mt: 3 }}>
          <strong>Note:</strong> Each expansion set includes 2 thermoforming machines, 4 printers, and 1 sheetline, plus
          support equipment. Production volume increases immediately after each expansion.
        </Typography>
      </Box>
    </Box>
  );
}
