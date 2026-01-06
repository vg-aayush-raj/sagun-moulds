import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  TextField,
  Grid,
  IconButton,
  Typography,
  Alert,
  Autocomplete,
  Paper,
  Divider,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { invoiceApi, InvoicePreviewResponse } from '../../../api/invoiceApi';
import { useAppContext } from '../../../context/AppContext';
import { invoiceSchema, InvoiceFormData } from '../schema';
import InvoicePreview from './InvoicePreview';

interface InvoiceFormProps {
  onSuccess: () => void;
}

export default function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { companies } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<InvoicePreviewResponse | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      billing_date: new Date().toISOString().split('T')[0],
      items: [{ cup_type: '', quantity: 1, base_price_per_cup: 0, gst_rate: 18, cash_per_cup: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchItems = watch('items');

  const calculateLineTotals = (index: number) => {
    const item = watchItems[index];
    if (!item) return { baseTotal: 0, gstTotal: 0, cashTotal: 0, lineTotal: 0 };

    const baseTotal = item.quantity * item.base_price_per_cup;
    const gstTotal = (baseTotal * item.gst_rate) / 100;
    const cashTotal = item.quantity * item.cash_per_cup;
    const lineTotal = baseTotal + gstTotal + cashTotal;

    return { baseTotal, gstTotal, cashTotal, lineTotal };
  };

  const calculateGrandTotals = () => {
    return watchItems.reduce(
      (acc, item, index) => {
        const totals = calculateLineTotals(index);
        return {
          baseTotal: acc.baseTotal + totals.baseTotal,
          gstTotal: acc.gstTotal + totals.gstTotal,
          cashTotal: acc.cashTotal + totals.cashTotal,
          grandTotal: acc.grandTotal + totals.lineTotal,
        };
      },
      { baseTotal: 0, gstTotal: 0, cashTotal: 0, grandTotal: 0 },
    );
  };

  const onSubmit = async (data: InvoiceFormData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await invoiceApi.createInvoice(data);
      setPreview(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;

    try {
      await invoiceApi.confirmInvoice(preview.invoice.id);
      setPreview(null);
      reset({
        billing_date: new Date().toISOString().split('T')[0],
        items: [{ cup_type: '', quantity: 1, base_price_per_cup: 0, gst_rate: 18, cash_per_cup: 0 }],
      });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to confirm invoice');
    }
  };

  const totals = calculateGrandTotals();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Controller
              name="company_id"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={companies}
                  getOptionLabel={(option) => option.name}
                  value={companies.find((c) => c.id === value) || null}
                  onChange={(_, newValue) => onChange(newValue?.id || null)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Company"
                      required
                      error={!!errors.company_id}
                      helperText={errors.company_id?.message}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="billing_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Billing Date"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.billing_date}
                  helperText={errors.billing_date?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" gutterBottom>
          Invoice Items
        </Typography>

        {fields.map((field, index) => {
          const lineTotals = calculateLineTotals(index);
          return (
            <Paper key={field.id} sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1">Item {index + 1}</Typography>
                {fields.length > 1 && (
                  <IconButton size="small" color="error" onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name={`items.${index}.cup_type`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Cup Type"
                        fullWidth
                        required
                        error={!!errors.items?.[index]?.cup_type}
                        helperText={errors.items?.[index]?.cup_type?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Quantity"
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                        error={!!errors.items?.[index]?.quantity}
                        helperText={errors.items?.[index]?.quantity?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Controller
                    name={`items.${index}.base_price_per_cup`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Base Price/Cup (₹)"
                        fullWidth
                        required
                        inputProps={{ step: '0.01', min: 0 }}
                        error={!!errors.items?.[index]?.base_price_per_cup}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Controller
                    name={`items.${index}.gst_rate`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="GST Rate (%)"
                        fullWidth
                        required
                        inputProps={{ step: '0.01', min: 0, max: 100 }}
                        error={!!errors.items?.[index]?.gst_rate}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Controller
                    name={`items.${index}.cash_per_cup`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Cash/Cup (₹)"
                        fullWidth
                        required
                        inputProps={{ step: '0.01', min: 0 }}
                        error={!!errors.items?.[index]?.cash_per_cup}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
                    <Typography variant="body2">
                      Base: <strong>₹{lineTotals.baseTotal.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      GST: <strong>₹{lineTotals.gstTotal.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2">
                      Cash: <strong>₹{lineTotals.cashTotal.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="primary">
                      Line Total: <strong>₹{lineTotals.lineTotal.toFixed(2)}</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          );
        })}

        <Button
          startIcon={<AddIcon />}
          onClick={() => append({ cup_type: '', quantity: 1, base_price_per_cup: 0, gst_rate: 18, cash_per_cup: 0 })}
          sx={{ mb: 3 }}
        >
          Add Another Item
        </Button>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Base Total:</Typography>
                  <Typography fontWeight="medium">₹{totals.baseTotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>GST Total:</Typography>
                  <Typography fontWeight="medium">₹{totals.gstTotal.toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Cash Total:</Typography>
                  <Typography fontWeight="medium">₹{totals.cashTotal.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Grand Total:</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{totals.grandTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Creating Preview...' : 'Preview Invoice'}
        </Button>
      </form>

      {preview && (
        <InvoicePreview open={!!preview} preview={preview} onClose={() => setPreview(null)} onConfirm={handleConfirm} />
      )}
    </>
  );
}
