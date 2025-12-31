import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import { Download as DownloadIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAppContext } from '../../../context/AppContext';
import { invoiceApi } from '../../../api/invoiceApi';
import {
  formatCurrency,
  formatDate,
  getPatternDisplayName,
  getPaymentMethodLabel,
  getAgingBucketStyle,
  downloadBlob,
} from '../utils/invoiceHelpers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ReportsDashboard() {
  const { companies } = useAppContext();
  const [tabValue, setTabValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cash Inflow Report State
  const [cashInflowReport, setCashInflowReport] = useState<any>(null);

  // Bank Payment Report State
  const [bankPaymentReport, setBankPaymentReport] = useState<any>(null);

  // GST Report State
  const [gstReport, setGstReport] = useState<any>(null);

  // Aging Report State
  const [agingReport, setAgingReport] = useState<any>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
  };

  // Load Cash Inflow Report
  const loadCashInflowReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await invoiceApi.getCashInflowReport({ start_date: startDate, end_date: endDate });
      setCashInflowReport(report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load cash inflow report');
    } finally {
      setLoading(false);
    }
  };

  // Load Bank Payment Report
  const loadBankPaymentReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await invoiceApi.getBankPaymentReport({ start_date: startDate, end_date: endDate });
      setBankPaymentReport(report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load bank payment report');
    } finally {
      setLoading(false);
    }
  };

  // Load GST Report
  const loadGSTReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await invoiceApi.getGSTReport({ start_date: startDate, end_date: endDate });
      setGstReport(report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load GST report');
    } finally {
      setLoading(false);
    }
  };

  // Load Aging Report
  const loadAgingReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const report = await invoiceApi.getAgingReport();
      setAgingReport(report);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load aging report');
    } finally {
      setLoading(false);
    }
  };

  // Download GSTR-1 Excel
  const handleDownloadGSTR1 = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates for GSTR-1 export');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const blob = await invoiceApi.downloadGSTR1Excel({ start_date: startDate, end_date: endDate });
      downloadBlob(blob, `GSTR1_${startDate}_${endDate}.xlsx`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download GSTR-1');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Financial Reports & Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Cash Inflow" />
          <Tab label="Bank Payments" />
          <Tab label="GST Inflow/Outflow" />
          <Tab label="Aging Analysis" />
        </Tabs>

        {/* Cash Inflow Report Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={loadCashInflowReport}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                    fullWidth
                  >
                    Load Report
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {cashInflowReport && (
              <>
                {/* Summary Cards */}
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total Cash Inflow
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {formatCurrency(cashInflowReport.total_cash)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total Transactions
                      </Typography>
                      <Typography variant="h4">{cashInflowReport.transaction_count}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Period
                      </Typography>
                      <Typography variant="h6">
                        {formatDate(startDate)} - {formatDate(endDate)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Breakdown by Pattern */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Cash Breakdown by Invoice Pattern
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Pattern Type</TableCell>
                          <TableCell align="right">Cash Amount</TableCell>
                          <TableCell align="right">Transaction Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cashInflowReport.by_pattern?.map((item: any) => (
                          <TableRow key={item.pattern_type}>
                            <TableCell>
                              <Chip label={getPatternDisplayName(item.pattern_type)} />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.cash_amount)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{item.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Bank Payments Report Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={loadBankPaymentReport}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                    fullWidth
                  >
                    Load Report
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {bankPaymentReport && (
              <>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total Bank Payments
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {formatCurrency(bankPaymentReport.total_amount)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total Payments
                      </Typography>
                      <Typography variant="h4">{bankPaymentReport.payment_count}</Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Breakdown by Payment Method
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Payment Method</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bankPaymentReport.by_method?.map((item: any) => (
                          <TableRow key={item.payment_method}>
                            <TableCell>
                              <Chip label={getPaymentMethodLabel(item.payment_method)} variant="outlined" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.amount)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{item.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* GST Report Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="End Date"
                    type="date"
                    fullWidth
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={loadGSTReport}
                    disabled={loading}
                    startIcon={<RefreshIcon />}
                    fullWidth
                  >
                    Load Report
                  </Button>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    onClick={handleDownloadGSTR1}
                    disabled={loading || !startDate || !endDate}
                    startIcon={<DownloadIcon />}
                    fullWidth
                  >
                    Download GSTR-1
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {gstReport && (
              <>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total GST Credit (Inflow)
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {formatCurrency(gstReport.total_credit)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        From Sales Invoices
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Total GST Debit (Outflow)
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {formatCurrency(gstReport.total_debit)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        From Purchase Invoices
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        Net GST Payable
                      </Typography>
                      <Typography variant="h4" color={gstReport.net_gst >= 0 ? 'error.main' : 'success.main'}>
                        {formatCurrency(Math.abs(gstReport.net_gst))}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {gstReport.net_gst >= 0 ? 'To Pay' : 'Refundable'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    GST Breakdown by Pattern
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Pattern Type</TableCell>
                          <TableCell align="right">GST Amount</TableCell>
                          <TableCell align="right">Invoice Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {gstReport.by_pattern?.map((item: any) => (
                          <TableRow key={item.pattern_type}>
                            <TableCell>
                              <Chip label={getPatternDisplayName(item.pattern_type)} />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(item.gst_amount)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{item.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    Only invoices with GST component are included in this report. Cash-only invoices are excluded.
                  </Alert>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Aging Analysis Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button variant="contained" onClick={loadAgingReport} disabled={loading} startIcon={<RefreshIcon />}>
                Load Aging Report
              </Button>
            </Grid>

            {agingReport && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Receivables Aging Summary
                  </Typography>
                  <Grid container spacing={2}>
                    {agingReport.buckets?.map((bucket: any) => (
                      <Grid item xs={12} sm={6} md={2.4} key={bucket.bucket}>
                        <Card variant="outlined" sx={getAgingBucketStyle(bucket.bucket)}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary">
                              {bucket.bucket}
                            </Typography>
                            <Typography variant="h5">{formatCurrency(bucket.total_due)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {bucket.invoice_count} invoices
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Detailed Aging Report
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Invoice #</TableCell>
                          <TableCell>Company</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Billed Amount</TableCell>
                          <TableCell align="right">Amount Due</TableCell>
                          <TableCell align="right">Days Overdue</TableCell>
                          <TableCell>Aging Bucket</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {agingReport.invoices?.map((invoice: any) => (
                          <TableRow key={invoice.invoice_id}>
                            <TableCell>{invoice.invoice_number}</TableCell>
                            <TableCell>{invoice.company_name}</TableCell>
                            <TableCell>{formatDate(invoice.billing_date)}</TableCell>
                            <TableCell align="right">{formatCurrency(invoice.billed_amount)}</TableCell>
                            <TableCell align="right">{formatCurrency(invoice.amount_due)}</TableCell>
                            <TableCell align="right">{invoice.days_overdue}</TableCell>
                            <TableCell>
                              <Chip label={invoice.bucket} size="small" sx={getAgingBucketStyle(invoice.bucket)} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
}
