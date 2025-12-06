import { useState, useEffect } from 'react';
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
import { proformaApi } from '../../../api/proformaApi';
import { useAppContext } from '../../../context/AppContext';
import { proformaSchema, ProformaFormData } from '../schema';

interface ProformaFormProps {
  onSuccess: () => void;
}

export default function ProformaForm({ onSuccess }: ProformaFormProps) {
  const { companies } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProformaFormData>({
    resolver: zodResolver(proformaSchema),
    defaultValues: {
      validity_days: 30,
      items: [{ description: '', quantity: 1, rate: 1, amount: 1 }],
      terms_conditions: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchItems = watch('items');

  // Auto-calculate amount for each item using useEffect
  useEffect(() => {
    watchItems.forEach((item, index) => {
      const amount = item.quantity * item.rate;

      if (item.amount !== amount) {
        setValue(`items.${index}.amount`, amount, { shouldValidate: false });
      }
    });
  }, [watchItems, setValue]);

  const calculateTotal = () => {
    return watchItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const onSubmit = async (data: ProformaFormData) => {
    setLoading(true);
    setError(null);

    try {
      await proformaApi.create(data);
      setSuccess(true);
      reset({
        validity_days: 30,
        items: [{ description: '', quantity: 1, rate: 1, amount: 1 }],
        terms_conditions: '',
      });
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create proforma');
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
          Proforma created successfully!
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="validity_days"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Validity (Days)"
                fullWidth
                required
                inputProps={{ min: 1 }}
                error={!!errors.validity_days}
                helperText={errors.validity_days?.message}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
              />
            )}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>
        Items
      </Typography>

      {fields.map((field, index) => (
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
            <Grid size={{ xs: 12 }}>
              <Controller
                name={`items.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!errors.items?.[index]?.description}
                    helperText={errors.items?.[index]?.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
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

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name={`items.${index}.rate`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Rate (₹)"
                    fullWidth
                    required
                    inputProps={{ step: '0.01', min: 0 }}
                    error={!!errors.items?.[index]?.rate}
                    helperText={errors.items?.[index]?.rate?.message}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name={`items.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Amount (₹)"
                    fullWidth
                    required
                    inputProps={{ step: '0.01', min: 0 }}
                    error={!!errors.items?.[index]?.amount}
                    helperText={errors.items?.[index]?.amount?.message || 'Auto-calculated from Quantity × Rate'}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    sx={{ bgcolor: 'grey.50' }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => append({ description: '', quantity: 1, rate: 0, amount: 0 })}
        sx={{ mb: 3 }}
      >
        Add Another Item
      </Button>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Controller
            name="terms_conditions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Terms & Conditions (Optional)"
                fullWidth
                multiline
                rows={4}
                placeholder="Enter terms and conditions..."
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, bgcolor: 'primary.lighter' }}>
            <Typography variant="body2" color="text.secondary">
              Total Amount
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ₹{calculateTotal().toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Creating...' : 'Create Proforma'}
        </Button>
      </Box>
    </form>
  );
}
