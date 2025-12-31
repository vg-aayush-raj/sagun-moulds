import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
  Autocomplete,
  Grid,
} from '@mui/material';
import { Payment as PaymentIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import { useAppContext } from '../../../context/AppContext';
import { invoiceApi, PaymentMethod, PaymentType, PaymentRecord, Invoice, PaymentStatus } from '../../../api/invoiceApi';
import {
  formatCurrency,
  formatDate,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  getPaymentStatusColor,
} from '../utils/invoiceHelpers';

interface PaymentTrackingProps {
  companyId?: number;
}

interface PaymentFormData {
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  reference_number?: string;
  notes?: string;
}

interface MultiPaymentFormData {
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
  selected_invoices: number[];
}

export default function PaymentTracking({ companyId }: PaymentTrackingProps) {
  const { companies } = useAppContext();
  const [selectedCompany, setSelectedCompany] = useState<number | null>(companyId || null);
  const [tabValue, setTabValue] = useState(0);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openMultiPaymentDialog, setOpenMultiPaymentDialog] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [duesSummary, setDuesSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    control: paymentControl,
    handleSubmit: handlePaymentSubmit,
    reset: resetPayment,
    formState: { errors: paymentErrors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: PaymentMethod.BANK_TRANSFER,
      payment_type: PaymentType.REGULAR,
    },
  });

  const {
    control: multiControl,
    handleSubmit: handleMultiSubmit,
    reset: resetMulti,
    formState: { errors: multiErrors },
  } = useForm<MultiPaymentFormData>({
    defaultValues: {
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: PaymentMethod.BANK_TRANSFER,
      selected_invoices: [],
    },
  });

  useEffect(() => {
    if (selectedCompany) {
      loadCompanyData();
    }
  }, [selectedCompany]);

  const loadCompanyData = async () => {
    if (!selectedCompany) return;

    setLoading(true);
    setError(null);

    try {
      // Load unpaid/partially paid invoices
      const response = await invoiceApi.listInvoices({
        company_id: selectedCompany,
        payment_status: [PaymentStatus.UNPAID, PaymentStatus.PARTIALLY_PAID],
      });
      setInvoices(response.invoices || []);

      // Load dues summary
      const dues = await invoiceApi.getCompanyDues(selectedCompany);
      setDuesSummary(dues);

      // Load recent payments if an invoice is selected
      if (response.invoices && response.invoices.length > 0) {
        const paymentHistory = await invoiceApi.getPaymentHistory(response.invoices[0].id);
        setPayments(paymentHistory.payments);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (data: PaymentFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await invoiceApi.recordPayment(data.invoice_id, {
        amount: data.amount,
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        payment_type: data.payment_type,
        reference_number: data.reference_number,
        notes: data.notes,
      });

      setSuccess('Payment recorded successfully');
      setOpenPaymentDialog(false);
      resetPayment();
      loadCompanyData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordMultiPayment = async (data: MultiPaymentFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await invoiceApi.recordMultiInvoicePayment({
        company_id: selectedCompany!,
        total_amount: data.amount,
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        reference_number: data.reference_number,
        notes: data.notes,
        allocations: data.selected_invoices.map((invoiceId) => ({
          invoice_id: invoiceId,
          amount: 0, // Will be calculated by FIFO in backend
        })),
      });

      setSuccess('Multi-invoice payment recorded successfully');
      setOpenMultiPaymentDialog(false);
      resetMulti();
      loadCompanyData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record multi-payment');
    } finally {
      setLoading(false);
    }
  };

  const paymentColumns: GridColDef[] = [
    { field: 'invoice_number', headerName: 'Invoice #', width: 130 },
    { field: 'payment_date', headerName: 'Date', width: 120, valueFormatter: (params) => formatDate(params) },
    { field: 'amount', headerName: 'Amount', width: 130, valueFormatter: (params) => formatCurrency(params) },
    {
      field: 'payment_method',
      headerName: 'Method',
      width: 140,
      renderCell: (params) => <Chip label={getPaymentMethodLabel(params.value)} size="small" variant="outlined" />,
    },
    {
      field: 'payment_type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'ADVANCE' ? 'info' : 'default'} />
      ),
    },
    { field: 'reference_number', headerName: 'Reference', width: 150 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
  ];

  return (
    <Box>
      {/* Company Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                value={companies.find((c) => c.id === selectedCompany) || null}
                onChange={(_, newValue) => setSelectedCompany(newValue?.id || null)}
                renderInput={(params) => (
                  <TextField {...params} label="Select Company" placeholder="Choose a company" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<PaymentIcon />}
                  onClick={() => setOpenPaymentDialog(true)}
                  disabled={!selectedCompany || invoices.length === 0}
                >
                  Record Payment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  onClick={() => setOpenMultiPaymentDialog(true)}
                  disabled={!selectedCompany || invoices.length === 0}
                >
                  Multi-Invoice Payment
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Dues Summary */}
      {duesSummary && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Invoiced
                </Typography>
                <Typography variant="h5">{formatCurrency(duesSummary.total_invoiced)}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Paid
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(duesSummary.total_paid)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Due
                </Typography>
                <Typography variant="h5" color="error.main">
                  {formatCurrency(duesSummary.total_due)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Invoices with Dues
                </Typography>
                <Typography variant="h5">{duesSummary.invoice_count}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Outstanding Invoices" />
          <Tab label="Payment History" />
        </Tabs>

        {/* Outstanding Invoices Tab */}
        {tabValue === 0 && (
          <CardContent>
            {invoices.length === 0 ? (
              <Alert severity="info">No outstanding invoices for this company.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Billed Amount</TableCell>
                      <TableCell align="right">Paid</TableCell>
                      <TableCell align="right">Due</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoice_number}</TableCell>
                        <TableCell>{formatDate(invoice.billing_date)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.billed_amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(invoice.amount_paid || 0)}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(invoice.amount_due || invoice.billed_amount)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getPaymentStatusLabel(invoice.payment_status)}
                            color={getPaymentStatusColor(invoice.payment_status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        )}

        {/* Payment History Tab */}
        {tabValue === 1 && (
          <CardContent>
            <DataGrid
              rows={payments}
              columns={paymentColumns}
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
            />
          </CardContent>
        )}
      </Card>

      {/* Single Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <form onSubmit={handlePaymentSubmit(handleRecordPayment)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="invoice_id"
                  control={paymentControl}
                  rules={{ required: 'Invoice is required' }}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      options={invoices}
                      getOptionLabel={(option) =>
                        `${option.invoice_number} - Due: ${formatCurrency(option.amount_due || option.billed_amount)}`
                      }
                      value={invoices.find((inv) => inv.id === value) || null}
                      onChange={(_, newValue) => onChange(newValue?.id || null)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Invoice"
                          required
                          error={!!paymentErrors.invoice_id}
                          helperText={paymentErrors.invoice_id?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="amount"
                  control={paymentControl}
                  rules={{
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Amount"
                      type="number"
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      error={!!paymentErrors.amount}
                      helperText={paymentErrors.amount?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="payment_date"
                  control={paymentControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Payment Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="payment_method"
                  control={paymentControl}
                  render={({ field }) => (
                    <TextField {...field} label="Payment Method" select fullWidth required>
                      {Object.values(PaymentMethod).map((method) => (
                        <MenuItem key={method} value={method}>
                          {getPaymentMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="payment_type"
                  control={paymentControl}
                  render={({ field }) => (
                    <TextField {...field} label="Payment Type" select fullWidth required>
                      <MenuItem value={PaymentType.REGULAR}>Regular</MenuItem>
                      <MenuItem value={PaymentType.ADVANCE}>Advance</MenuItem>
                      <MenuItem value={PaymentType.CREDIT}>Credit</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="reference_number"
                  control={paymentControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reference Number (Optional)"
                      fullWidth
                      placeholder="e.g., Cheque #, Transaction ID"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={paymentControl}
                  render={({ field }) => <TextField {...field} label="Notes (Optional)" fullWidth multiline rows={2} />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPaymentDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Multi-Invoice Payment Dialog */}
      <Dialog open={openMultiPaymentDialog} onClose={() => setOpenMultiPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Record Multi-Invoice Payment (FIFO)</DialogTitle>
        <form onSubmit={handleMultiSubmit(handleRecordMultiPayment)}>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              Payment will be allocated to oldest invoices first (FIFO). You can also select specific invoices.
            </Alert>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="selected_invoices"
                  control={multiControl}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      multiple
                      options={invoices}
                      getOptionLabel={(option) =>
                        `${option.invoice_number} - Due: ${formatCurrency(option.amount_due || option.billed_amount)}`
                      }
                      value={invoices.filter((inv) => value.includes(inv.id))}
                      onChange={(_, newValue) => onChange(newValue.map((inv) => inv.id))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Invoices (Optional - Leave empty for FIFO)"
                          placeholder="Choose invoices"
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="amount"
                  control={multiControl}
                  rules={{
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Total Amount"
                      type="number"
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                      error={!!multiErrors.amount}
                      helperText={multiErrors.amount?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="payment_date"
                  control={multiControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Payment Date"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="payment_method"
                  control={multiControl}
                  render={({ field }) => (
                    <TextField {...field} label="Payment Method" select fullWidth required>
                      {Object.values(PaymentMethod).map((method) => (
                        <MenuItem key={method} value={method}>
                          {getPaymentMethodLabel(method)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="reference_number"
                  control={multiControl}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Reference Number (Optional)"
                      fullWidth
                      placeholder="e.g., Transaction ID"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={multiControl}
                  render={({ field }) => <TextField {...field} label="Notes (Optional)" fullWidth multiline rows={2} />}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMultiPaymentDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
