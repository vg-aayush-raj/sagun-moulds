import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useAppContext } from '../../../../context/AppContext';
import {
  CreateInvoiceRequest,
  InvoicePatternType,
  MostlyCashPatternInput,
  InvoiceFrom,
} from '../../../../api/invoiceApi';
import { formatCurrency } from '../../utils/invoiceHelpers';
import { UNIT_OPTIONS } from '../../schema';

interface MostlyCashPatternFormProps {
  initialData?: Partial<CreateInvoiceRequest> | null;
  onSubmit: (data: Partial<CreateInvoiceRequest>) => void;
  onCancel: () => void;
  loading: boolean;
}

interface FormData {
  company_id: number | null;
  from: InvoiceFrom;
  billing_date: string;
  due_date?: string;
  payment_terms?: string;
  notes?: string;
  cash_items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    price_per_cup: number;
  }>;
  gst_items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    base_price_per_cup: number;
    gst_rate: number;
  }>;
}

export default function MostlyCashPatternForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: MostlyCashPatternFormProps) {
  const { companies } = useAppContext();

  const getDefaultValues = (): FormData => {
    if (initialData && initialData.pattern_input) {
      const input = initialData.pattern_input as MostlyCashPatternInput;
      return {
        company_id: initialData.company_id || null,
        from: initialData.from || {
          company_name: 'Sagun Moldify Private Limited',
          address: 'Maujipur, Fatuha',
          contact: '9835279911',
          email: 'sagunmoldify@gmail.com',
          gstin: '10ABQCS2716M1Z5',
        },
        billing_date: initialData.billing_date || new Date().toISOString().split('T')[0],
        due_date: initialData.due_date,
        payment_terms: initialData.payment_terms || 'Net 30',
        notes: initialData.notes,
        cash_items: input.cash_items || [{ cup_type: '', quantity: 1000, unit: 'Boxes', price_per_cup: 0 }],
        gst_items: input.gst_items || [],
      };
    }
    return {
      company_id: null,
      from: {
        company_name: 'Sagun Moldify Private Limited',
        address: 'Maujipur, Fatuha',
        contact: '9835279911',
        email: 'sagunmoldify@gmail.com',
        gstin: '10ABQCS2716M1Z5',
      },
      billing_date: new Date().toISOString().split('T')[0],
      payment_terms: 'Net 30',
      cash_items: [{ cup_type: '', quantity: 1000, unit: 'Boxes', price_per_cup: 0 }],
      gst_items: [],
    };
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: getDefaultValues(),
  });

  const { fields: cashFields, append: appendCash, remove: removeCash } = useFieldArray({ control, name: 'cash_items' });
  const { fields: gstFields, append: appendGst, remove: removeGst } = useFieldArray({ control, name: 'gst_items' });

  const watchCashItems = watch('cash_items');
  const watchGstItems = watch('gst_items');

  const calculateTotals = () => {
    let cashTotal = 0;
    watchCashItems.forEach((item) => {
      cashTotal += item.quantity * item.price_per_cup;
    });

    let gstBase = 0;
    let gstAmount = 0;
    watchGstItems.forEach((item) => {
      const base = item.quantity * item.base_price_per_cup;
      const gst = (base * item.gst_rate) / 100;
      gstBase += base;
      gstAmount += gst;
    });

    return {
      cashTotal,
      gstBase,
      gstAmount,
      gstTotal: gstBase + gstAmount,
      grandTotal: cashTotal + gstBase + gstAmount,
    };
  };

  const totals = calculateTotals();

  const handleFormSubmit = (data: FormData) => {
    if (!data.company_id) return;

    const patternInput: MostlyCashPatternInput = {
      cash_items: data.cash_items,
      gst_items: data.gst_items.length > 0 ? data.gst_items : undefined,
    };

    onSubmit({
      company_id: data.company_id,
      from: data.from,
      billing_date: data.billing_date,
      due_date: data.due_date,
      payment_terms: data.payment_terms,
      pattern_type: InvoicePatternType.MOSTLY_CASH,
      pattern_input: patternInput,
      notes: data.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            Most transactions are cash-only (no invoice). Occasionally, you may add GST items for formal invoicing. Cash
            items are tracked separately in reports but not shown on GST invoices.
          </Alert>
        </Grid>

        {/* Company Selection */}
        <Grid item xs={12} md={6}>
          <Controller
            name="company_id"
            control={control}
            rules={{ required: 'Company is required' }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                value={companies.find((c) => c.id === value) || null}
                onChange={(_, newValue) => onChange(newValue?.id || null)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Company"
                    required
                    error={!!errors.company_id}
                    helperText={errors.company_id?.message}
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* From Company Information Section */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Your Company Information</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="from.company_name"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Company Name" fullWidth required />}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="from.address"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Address" fullWidth required />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="from.contact"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Contact" fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="from.email"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Email" fullWidth type="email" />}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name="from.gstin"
                    control={control}
                    render={({ field }) => <TextField {...field} label="GSTIN" fullWidth />}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Billing Date */}
        <Grid item xs={12} md={3}>
          <Controller
            name="billing_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Transaction Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        {/* Due Date */}
        <Grid item xs={12} md={3}>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Due Date (for GST portion)"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        {/* Payment Terms */}
        <Grid item xs={12} md={6}>
          <Controller
            name="payment_terms"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Payment Terms" fullWidth placeholder="e.g., Cash on Delivery" />
            )}
          />
        </Grid>

        {/* Notes */}
        <Grid item xs={12} md={6}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <TextField {...field} label="Notes (Internal)" fullWidth multiline rows={1} />}
          />
        </Grid>

        {/* Cash Items Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Cash Items (No GST - Hidden from Invoice)
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cup Type</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="center">Unit</TableCell>
                  <TableCell align="right">Price/Cup (₹)</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cashFields.map((field, index) => {
                  const item = watchCashItems[index];
                  const total = item.quantity * item.price_per_cup;

                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`cash_items.${index}.cup_type`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField {...field} placeholder="e.g., 150ml Cup" size="small" fullWidth required />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`cash_items.${index}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 1 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`cash_items.${index}.unit`}
                          control={control}
                          render={({ field }) => (
                            <TextField {...field} select size="small" sx={{ width: 100 }}>
                              {UNIT_OPTIONS.map((unit) => (
                                <MenuItem key={unit} value={unit}>
                                  {unit}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`cash_items.${index}.price_per_cup`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              sx={{ width: 120 }}
                              inputProps={{ min: 0, step: 0.0001 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(total)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => removeCash(index)}
                          disabled={cashFields.length === 1}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            startIcon={<AddIcon />}
            onClick={() => appendCash({ cup_type: '', quantity: 1000, unit: 'Boxes', price_per_cup: 0 })}
            sx={{ mt: 2 }}
          >
            Add Cash Item
          </Button>
        </Grid>

        {/* Divider */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* GST Items Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            GST Items (Optional - Shown on Invoice)
          </Typography>
          {gstFields.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              No GST items added. This transaction will be cash-only with no formal invoice.
            </Alert>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cup Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="center">Unit</TableCell>
                    <TableCell align="right">Base Price/Cup (₹)</TableCell>
                    <TableCell align="right">GST %</TableCell>
                    <TableCell align="right">Total with GST</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gstFields.map((field, index) => {
                    const item = watchGstItems[index];
                    const base = item.quantity * item.base_price_per_cup;
                    const gst = (base * item.gst_rate) / 100;
                    const total = base + gst;

                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`gst_items.${index}.cup_type`}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                              <TextField {...field} placeholder="e.g., 150ml Cup" size="small" fullWidth required />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`gst_items.${index}.quantity`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 100 }}
                                inputProps={{ min: 1 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`gst_items.${index}.unit`}
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} select size="small" sx={{ width: 100 }}>
                                {UNIT_OPTIONS.map((unit) => (
                                  <MenuItem key={unit} value={unit}>
                                    {unit}
                                  </MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`gst_items.${index}.base_price_per_cup`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 120 }}
                                inputProps={{ min: 0, step: 0.0001 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`gst_items.${index}.gst_rate`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                size="small"
                                sx={{ width: 80 }}
                                inputProps={{ min: 0, max: 100 }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium" color="primary">
                            {formatCurrency(total)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => removeGst(index)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Button
            startIcon={<AddIcon />}
            onClick={() =>
              appendGst({ cup_type: '', quantity: 1000, unit: 'Boxes', base_price_per_cup: 0, gst_rate: 18 })
            }
            sx={{ mt: 2 }}
          >
            Add GST Item
          </Button>
        </Grid>

        {/* Totals Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Cash Total (Hidden)
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(totals.cashTotal)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  GST Portion (On Invoice)
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(totals.gstTotal)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Taxable: {formatCurrency(totals.gstBase)} + GST: {formatCurrency(totals.gstAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Grand Total
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatCurrency(totals.grandTotal)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Creating...' : 'Create & Preview Invoice'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
}
