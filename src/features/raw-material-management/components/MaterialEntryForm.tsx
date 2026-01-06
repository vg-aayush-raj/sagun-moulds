import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Grid, MenuItem, Alert, Typography, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { rawMaterialApi } from '../../../api/rawMaterialApi';
import { useAppContext } from '../../../context/AppContext';
import { rawMaterialEntrySchema, RawMaterialEntryFormData } from '../schema';

interface MaterialEntryFormProps {
  onSuccess: () => void;
}

export default function MaterialEntryForm({ onSuccess }: MaterialEntryFormProps) {
  const { materialTypes } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [calculatedGST, setCalculatedGST] = useState(0);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RawMaterialEntryFormData>({
    resolver: zodResolver(rawMaterialEntrySchema),
    defaultValues: {
      entry_date: new Date().toISOString().split('T')[0],
      gst_rate: 18,
    },
  });

  const basePrice = watch('base_price');
  const gstRate = watch('gst_rate');
  const kgQuantity = watch('kg_quantity');

  // Auto-calculate GST and final amount for display
  useEffect(() => {
    if (basePrice && gstRate !== undefined && kgQuantity) {
      const totalBasePrice = basePrice * kgQuantity;
      const gstAmount = (totalBasePrice * gstRate) / 100;
      const finalAmount = totalBasePrice + gstAmount;
      setCalculatedGST(parseFloat(gstAmount.toFixed(2)));
      setCalculatedTotal(parseFloat(finalAmount.toFixed(2)));
    } else {
      setCalculatedGST(0);
      setCalculatedTotal(0);
    }
  }, [basePrice, gstRate, kgQuantity]);

  const onSubmit = async (data: RawMaterialEntryFormData) => {
    setLoading(true);
    setError(null);

    try {
      const totalBasePrice = data.base_price * data.kg_quantity;
      const gstAmount = (totalBasePrice * data.gst_rate) / 100;
      const finalAmount = totalBasePrice + gstAmount;

      await rawMaterialApi.createEntry({
        ...data,
        gst_amount: parseFloat(gstAmount.toFixed(2)),
        final_amount: parseFloat(finalAmount.toFixed(2)),
      });

      setSuccess(true);
      reset({ entry_date: new Date().toISOString().split('T')[0], gst_rate: 18 });
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Material entry created successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="material_type_id"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Material Type"
                fullWidth
                required
                error={!!errors.material_type_id}
                helperText={errors.material_type_id?.message}
              >
                {materialTypes.map((mat) => (
                  <MenuItem key={mat.id} value={mat.id}>
                    {mat.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="kg_quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Quantity (KG)"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                error={!!errors.kg_quantity}
                helperText={errors.kg_quantity?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="base_price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Base Price (₹)"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0' }}
                error={!!errors.base_price}
                helperText={errors.base_price?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="gst_rate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="GST Rate (%)"
                fullWidth
                required
                inputProps={{ step: '0.01', min: '0', max: '100' }}
                error={!!errors.gst_rate}
                helperText={errors.gst_rate?.message}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="entry_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Entry Date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.entry_date}
                helperText={errors.entry_date?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="supplier_name"
            control={control}
            render={({ field }) => <TextField {...field} label="Supplier Name (Optional)" fullWidth />}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => <TextField {...field} label="Notes (Optional)" fullWidth multiline rows={1} />}
          />
        </Grid>

        {/* Calculated Values Display */}
        {calculatedTotal > 0 && (
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Calculated Summary:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total Base Price:
                  </Typography>
                  <Typography variant="h6">₹{((basePrice || 0) * (kgQuantity || 0)).toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    GST Amount ({gstRate}%):
                  </Typography>
                  <Typography variant="h6">₹{calculatedGST.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Final Amount:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{calculatedTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Saving...' : 'Create Entry'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
