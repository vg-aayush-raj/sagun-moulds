import { useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import { Box, Grid, TextField, Button, Card, CardContent, Typography, MenuItem, Alert } from '@mui/material';
import { rawMaterialApi, MaterialSummary } from '../../../api/rawMaterialApi';

export default function FilteredSummary() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [filterType, setFilterType] = useState<'month' | 'range'>('month');
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [summary, setSummary] = useState<MaterialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      let response: any;

      if (filterType === 'month') {
        response = await rawMaterialApi.getSummary({ month, year });
      } else {
        if (!startDate || !endDate) {
          setError('Please select both start and end dates');
          setLoading(false);
          return;
        }
        response = await rawMaterialApi.getSummary({ start_date: startDate, end_date: endDate });
      }
      // Backend returns { summary: {...}, entries: [...] }
      setSummary(response.summary || response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filter Options
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Filter Type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'month' | 'range')}
                fullWidth
              >
                <MenuItem value="month">By Month</MenuItem>
                <MenuItem value="range">By Date Range</MenuItem>
              </TextField>
            </Grid>

            {filterType === 'month' ? (
              <>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    label="Month"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    fullWidth
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    type="number"
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    fullWidth
                    inputProps={{ min: 2000, max: 2100 }}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} md={3}>
                  <TextField
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleFetchSummary}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Loading...' : 'Get Summary'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {summary && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Quantity
                </Typography>
                <Typography variant="h4">{summary.total_kg.toFixed(2)} KG</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Base Price
                </Typography>
                <Typography variant="h4">₹{summary.total_base_price.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  GST Amount
                </Typography>
                <Typography variant="h4">₹{summary.total_gst_amount.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Amount
                </Typography>
                <Typography variant="h4" color="primary">
                  ₹{summary.total_final_amount.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
