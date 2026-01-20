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
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useAppContext } from '../../../../context/AppContext';
import { CreateInvoiceRequest, InvoicePatternType, MixedPatternInput, InvoiceFrom } from '../../../../api/invoiceApi';
import { formatCurrency } from '../../utils/invoiceHelpers';
import { UNIT_OPTIONS } from '../../schema';

interface MixedPatternFormProps {
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
  items: Array<{
    cup_type: string;
    gst_quantity: number;
    cash_quantity: number;
    unit: string;
    base_price_per_cup: number;
    gst_rate: number;
  }>;
}

export default function MixedPatternForm({ initialData, onSubmit, onCancel, loading }: MixedPatternFormProps) {
  const { companies } = useAppContext();

  const getDefaultValues = (): FormData => {
    if (initialData && initialData.pattern_input) {
      const input = initialData.pattern_input as MixedPatternInput;
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
        items: input.items || [
          { cup_type: '', gst_quantity: 0, cash_quantity: 0, unit: 'Boxes', base_price_per_cup: 0, gst_rate: 18 },
        ],
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
      items: [{ cup_type: '', gst_quantity: 0, cash_quantity: 0, unit: 'Boxes', base_price_per_cup: 0, gst_rate: 18 }],
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

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchItems = watch('items');

  const calculateTotals = () => {
    let gstBase = 0;
    let gstAmount = 0;
    let cashAmount = 0;

    watchItems.forEach((item) => {
      const gstBase_ = item.gst_quantity * item.base_price_per_cup;
      const gst = (gstBase_ * item.gst_rate) / 100;
      const cash = item.cash_quantity * item.base_price_per_cup;

      gstBase += gstBase_;
      gstAmount += gst;
      cashAmount += cash;
    });

    return {
      gstBase,
      gstAmount,
      cashAmount,
      billedAmount: gstBase + gstAmount,
      totalAmount: gstBase + gstAmount + cashAmount,
    };
  };

  const totals = calculateTotals();

  const handleFormSubmit = (data: FormData) => {
    if (!data.company_id) return;

    const patternInput: MixedPatternInput = {
      items: data.items,
    };

    onSubmit({
      company_id: data.company_id,
      from: data.from,
      billing_date: data.billing_date,
      due_date: data.due_date,
      payment_terms: data.payment_terms,
      pattern_type: InvoicePatternType.MIXED_GST_CASH,
      pattern_input: patternInput,
      notes: data.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            This pattern allows you to bill some cups with GST and others with cash (no GST). Only the GST portion will
            appear on the invoice. Cash amount is tracked separately in reports.
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
                label="Billing Date"
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
              <TextField {...field} label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} />
            )}
          />
        </Grid>

        {/* Payment Terms */}
        <Grid item xs={12} md={6}>
          <Controller
            name="payment_terms"
            control={control}
            render={({ field }) => <TextField {...field} label="Payment Terms" fullWidth placeholder="e.g., Net 30" />}
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

        {/* Items Table */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Invoice Items
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cup Type</TableCell>
                  <TableCell align="right">GST Qty</TableCell>
                  <TableCell align="right">Cash Qty</TableCell>
                  <TableCell align="center">Unit</TableCell>
                  <TableCell align="right">Base Price/Cup (₹)</TableCell>
                  <TableCell align="right">GST %</TableCell>
                  <TableCell align="right">GST Total</TableCell>
                  <TableCell align="right">Cash Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const item = watchItems[index];
                  const gstBase = item.gst_quantity * item.base_price_per_cup;
                  const gst = (gstBase * item.gst_rate) / 100;
                  const gstTotal = gstBase + gst;
                  const cashTotal = item.cash_quantity * item.base_price_per_cup;

                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <Controller
                          name={`items.${index}.cup_type`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField {...field} placeholder="e.g., 150ml Cup" size="small" fullWidth required />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.gst_quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 0 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.cash_quantity`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              size="small"
                              sx={{ width: 100 }}
                              inputProps={{ min: 0 }}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Controller
                          name={`items.${index}.unit`}
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
                          name={`items.${index}.base_price_per_cup`}
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
                          name={`items.${index}.gst_rate`}
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
                          {formatCurrency(gstTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (On Invoice)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(cashTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (Hidden)
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
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
            onClick={() =>
              append({
                cup_type: '',
                gst_quantity: 0,
                cash_quantity: 0,
                unit: 'Boxes',
                base_price_per_cup: 0,
                gst_rate: 18,
              })
            }
            sx={{ mt: 2 }}
          >
            Add Item
          </Button>
        </Grid>

        {/* Totals Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  GST Portion (Taxable)
                </Typography>
                <Typography variant="h6">{formatCurrency(totals.gstBase)}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  GST Amount
                </Typography>
                <Typography variant="h6">{formatCurrency(totals.gstAmount)}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Billed Amount (On Invoice)
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(totals.billedAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Cash Amount (Hidden)
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(totals.cashAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Total Transaction Value (Billed + Cash)
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {formatCurrency(totals.totalAmount)}
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
