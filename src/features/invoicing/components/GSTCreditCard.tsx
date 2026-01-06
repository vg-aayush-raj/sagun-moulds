import { CreditCard as CreditIcon } from '@mui/icons-material';
import { Card, CardContent, Typography, Grid, Box, Chip } from '@mui/material';
import { useAppContext } from '../../../context/AppContext';

export default function GSTCreditCard() {
  const { gstBalance } = useAppContext();

  if (!gstBalance) {
    return (
      <Card sx={{ mb: 3, bgcolor: 'grey.100' }}>
        <CardContent>
          <Typography>Loading GST balance...</Typography>
        </CardContent>
      </Card>
    );
  }

  const available = gstBalance.available_balance;

  return (
    <Card sx={{ mb: 3, bgcolor: 'primary.lighter' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CreditIcon sx={{ mr: 1 }} />
          <Typography variant="h6">GST Credit Status</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography color="text.secondary" variant="body2">
              Total Credit
            </Typography>
            <Typography variant="h5" color="success.main">
              ₹{gstBalance.total_credit.toFixed(2)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography color="text.secondary" variant="body2">
              Total Debit
            </Typography>
            <Typography variant="h5" color="error.main">
              ₹{gstBalance.total_debit.toFixed(2)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography color="text.secondary" variant="body2">
              Available Balance
            </Typography>
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              ₹{available.toFixed(2)}
            </Typography>
            {available < 0 && <Chip label="Credit Exhausted" size="small" color="warning" sx={{ mt: 1 }} />}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
