import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add as AddIcon, Delete as DeleteIcon, Business as BusinessIcon } from '@mui/icons-material';
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
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { quotationApi } from '../../../api/quotationApi';
import { useAppContext } from '../../../context/AppContext';
import { quotationSchema, QuotationFormData, DEFAULT_TERMS, UNIT_OPTIONS } from '../schema';

interface QuotationFormProps {
  onSuccess: () => void;
}

export default function QuotationForm({ onSuccess }: QuotationFormProps) {
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
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema) as any,
    defaultValues: {
      company_id: undefined as any,
      validity_days: 30,
      quotation_date: new Date().toISOString().split('T')[0],
      from: {
        company_name: 'Sagun Moldify Private Limited',
        address: 'Maujipur, Fatuha',
        contact: '9835279911',
        email: 'sagunmoldify@gmail.com',
        gstin: '10ABQCS2716M1Z5',
      },
      items: [{ sn: 1, description: '', quantity: 1, unit: 'Boxes', rate: 0, amount: 0 }],
      terms_conditions: DEFAULT_TERMS,
      gst_type: 'As Applicable',
      gst_value: undefined,
      remarks: '',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchItems = watch('items');
  const watchGstType = watch('gst_type');
  const watchGstValue = watch('gst_value');

  const calculateSubtotal = () => {
    return watchItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    if (watchGstType === 'Custom' && watchGstValue !== undefined) {
      const gstRate = watchGstValue;
      return (subtotal * gstRate) / 100;
    }
    return null;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gstAmount = calculateGST();
    return gstAmount !== null ? subtotal + gstAmount : subtotal;
  };

  const addItem = () => {
    const newSn = fields.length + 1;
    append({ sn: newSn, description: '', quantity: 1, unit: 'Boxes', rate: 0, amount: 0 });
  };

  const removeItem = (index: number) => {
    remove(index);
    // Renumber remaining items
    fields.forEach((_, idx) => {
      if (idx > index) {
        setValue(`items.${idx}.sn`, idx + 1);
      }
    });
  };

  const onSubmit = async (data: QuotationFormData) => {
    if (!data.company_id) {
      setError('Please select a company');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Ensure quotation_date is a string
      const gst = data.gst_type === 'Custom' ? data.gst_value?.toString() : 'As Applicable';
      const submitData = {
        ...data,
        gst,
        quotation_date:
          typeof data.quotation_date === 'string'
            ? data.quotation_date
            : data.quotation_date.toISOString().split('T')[0],
        items: data.items.map((item) => ({ ...item, amount: item.quantity * item.rate })),
      };

      await quotationApi.create(submitData);
      setSuccess(true);
      reset({
        company_id: undefined as any,
        validity_days: 30,
        quotation_date: new Date().toISOString().split('T')[0],
        from: {
          company_name: 'Sagun Moldify Private Limited',
          address: 'Maujipur, Fatuha',
          contact: '9835279911',
          email: 'sagunmoldify@gmail.com',
          gstin: '10ABQCS2716M1Z5',
        },
        items: [{ sn: 1, description: '', quantity: 1, unit: 'Boxes', rate: 0, amount: 0 }],
        terms_conditions: DEFAULT_TERMS,
        gst_type: 'As Applicable',
        gst_value: undefined,
        remarks: '',
      });
      onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create quotation');
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
          Quotation created successfully!
        </Alert>
      )}

      {/* From Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BusinessIcon /> Your Company Details (Seller - Thermoforming Cups Manufacturer)
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Company Name
              </Typography>
              <Controller
                name="from.company_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    fullWidth
                    required
                    error={!!errors.from?.company_name}
                    helperText={errors.from?.company_name?.message}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Address
              </Typography>
              <Controller
                name="from.address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    fullWidth
                    required
                    multiline
                    rows={2}
                    error={!!errors.from?.address}
                    helperText={errors.from?.address?.message}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Contact Number
              </Typography>
              <Controller
                name="from.contact"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="" fullWidth sx={{ bgcolor: 'white', borderRadius: 1 }} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                Email
              </Typography>
              <Controller
                name="from.email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    fullWidth
                    type="email"
                    error={!!errors.from?.email}
                    helperText={errors.from?.email?.message}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                GSTIN
              </Typography>
              <Controller
                name="from.gstin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    fullWidth
                    error={!!errors.from?.gstin}
                    helperText={errors.from?.gstin?.message}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* To Section & Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Details & Quotation Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
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
                        label="Select Customer"
                        required
                        error={!!errors.company_id}
                        helperText={
                          errors.company_id?.message || 'Choose the customer you are sending this quotation to'
                        }
                      />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="quotation_date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Quotation Date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.quotation_date}
                    helperText={errors.quotation_date?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
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
                    sx={{
                      '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                        {
                          display: 'none',
                        },
                      '& input[type=number]': {
                        MozAppearance: 'textfield',
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Products / Items (Thermoforming Cups & Packaging)</Typography>
            <Button startIcon={<AddIcon />} onClick={addItem} variant="contained" color="primary">
              Add Product
            </Button>
          </Box>

          {fields.map((field, index) => (
            <Paper key={field.id} sx={{ p: 2, mb: 2, bgcolor: '#f5f5f5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  Product #{index + 1}
                </Typography>
                {fields.length > 1 && (
                  <IconButton onClick={() => removeItem(index)} color="error" size="small">
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
                        label="Product Description"
                        fullWidth
                        required
                        multiline
                        rows={2}
                        placeholder="e.g., 200ml Dahi Cup, Premium Quality with Lid"
                        error={!!errors.items?.[index]?.description}
                        helperText={
                          errors.items?.[index]?.description?.message ||
                          'Describe the thermoforming cup or packaging item'
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
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
                        inputProps={{ min: 0.01, step: 0.01 }}
                        error={!!errors.items?.[index]?.quantity}
                        helperText={errors.items?.[index]?.quantity?.message}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        sx={{
                          '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                            {
                              display: 'none',
                            },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <Controller
                    name={`items.${index}.unit`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Unit"
                        fullWidth
                        required
                        error={!!errors.items?.[index]?.unit}
                        helperText={errors.items?.[index]?.unit?.message}
                      >
                        {UNIT_OPTIONS.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
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
                        inputProps={{ min: 0, step: 0.01 }}
                        error={!!errors.items?.[index]?.rate}
                        helperText={errors.items?.[index]?.rate?.message}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        sx={{
                          '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                            {
                              display: 'none',
                            },
                          '& input[type=number]': {
                            MozAppearance: 'textfield',
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    label="Amount (₹)"
                    fullWidth
                    value={((watchItems[index]?.quantity || 0) * (watchItems[index]?.rate || 0)).toFixed(2)}
                    InputProps={{ readOnly: true }}
                    sx={{ bgcolor: '#e3f2fd' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </CardContent>
      </Card>

      {/* Totals & GST Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            GST & Totals
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Controller
                name="gst_type"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="GST Type" fullWidth>
                    <MenuItem value="As Applicable">As Applicable</MenuItem>
                    <MenuItem value="Custom">GST Percentage</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            {watchGstType === 'Custom' && (
              <Grid size={{ xs: 12, md: 4 }}>
                <Controller
                  name="gst_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="GST (%)"
                      fullWidth
                      inputProps={{ min: 0, max: 100, step: 0.01 }}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                      sx={{
                        '& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button':
                          {
                            display: 'none',
                          },
                        '& input[type=number]': {
                          MozAppearance: 'textfield',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid size={{ xs: 12, md: watchGstType === 'Custom' ? 4 : 8 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹ {calculateSubtotal().toFixed(2)}
                  </Typography>
                </Box>
                {calculateGST() !== null && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#f57c00' }}>
                    <Typography variant="body1">GST ({watchGstValue}%):</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ₹ {calculateGST()?.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                {watchGstType === 'As Applicable' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#1976d2' }}>
                    <Typography variant="body2" fontStyle="italic">
                      GST: As Applicable
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" color="primary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹ {calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Terms & Conditions
          </Typography>
          <Controller
            name="terms_conditions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Terms & Conditions"
                fullWidth
                required
                multiline
                rows={8}
                error={!!errors.terms_conditions}
                helperText={errors.terms_conditions?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Remarks */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Remarks (Optional)
          </Typography>
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Remarks"
                fullWidth
                multiline
                rows={3}
                placeholder="Any additional notes or remarks..."
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !watch('company_id') || (watchGstType === 'Custom' && watchGstValue === undefined)}
          sx={{ minWidth: 200 }}
        >
          {loading ? 'Creating...' : 'Create Quotation'}
        </Button>
      </Box>
    </form>
  );
}
