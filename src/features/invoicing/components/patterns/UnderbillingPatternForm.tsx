import { useState, useEffect } from 'react';
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
  AlertTitle,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useAppContext } from '../../../../context/AppContext';
import {
  CreateInvoiceRequest,
  InvoicePatternType,
  UnderbillingPatternInput,
  InvoiceFrom,
} from '../../../../api/invoiceApi';
import { formatCurrency } from '../../utils/invoiceHelpers';
import { UNIT_OPTIONS, DEFAULT_INVOICE_TERMS } from '../../schema';

interface UnderbillingPatternFormProps {
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
  terms_conditions?: string;
  include_vehicle?: boolean;
  vehicle_type?: string;
  vehicle_number?: string;
  destination?: string;
  items: Array<{
    cup_type: string;
    quantity: number;
    unit: string;
    agreed_price_per_cup: number;
    billed_price_per_cup: number;
    gst_rate: number;
  }>;
}

export default function UnderbillingPatternForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: UnderbillingPatternFormProps) {
  const { companies } = useAppContext();
  const [warnings, setWarnings] = useState<string[]>([]);

  const getDefaultValues = (): FormData => {
    if (initialData && initialData.pattern_input) {
      const input = initialData.pattern_input as UnderbillingPatternInput;
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
        terms_conditions: initialData.terms_conditions || DEFAULT_INVOICE_TERMS,
        include_vehicle: initialData.include_vehicle || false,
        vehicle_type: initialData.vehicle_type || '',
        vehicle_number: initialData.vehicle_number || '',
        destination: initialData.destination || '',
        items: input.items || [
          {
            cup_type: '',
            quantity: 1000,
            unit: 'Boxes',
            agreed_price_per_cup: 0,
            billed_price_per_cup: 0,
            gst_rate: 18,
          },
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
      terms_conditions: DEFAULT_INVOICE_TERMS,
      include_vehicle: false,
      vehicle_type: '',
      vehicle_number: '',
      destination: '',
      items: [
        { cup_type: '', quantity: 1000, unit: 'Boxes', agreed_price_per_cup: 0, billed_price_per_cup: 0, gst_rate: 18 },
      ],
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
  const watchIncludeVehicle = watch('include_vehicle');

  // Calculate warnings in useEffect to avoid infinite loop
  useEffect(() => {
    const itemWarnings: string[] = [];

    watchItems.forEach((item, index) => {
      const agreed = item.quantity * item.agreed_price_per_cup;
      const billedBase = item.quantity * item.billed_price_per_cup;
      const gst = (billedBase * item.gst_rate) / 100;

      if (agreed > 0) {
        const underbillingPct = ((agreed - (billedBase + gst)) / agreed) * 100;
        if (underbillingPct > 30) {
          itemWarnings.push(
            `${item.cup_type || `Item ${index + 1}`}: ${underbillingPct.toFixed(1)}% underbilling (>${30}% threshold)`,
          );
        }
      }
    });

    setWarnings(itemWarnings);
  }, [watchItems]);

  const calculateTotals = () => {
    let agreedTotal = 0;
    let billedBase = 0;
    let gstAmount = 0;
    let cashAmount = 0;

    watchItems.forEach((item) => {
      const agreed = item.quantity * item.agreed_price_per_cup;
      const billedBase_ = item.quantity * item.billed_price_per_cup;
      const gst = (billedBase_ * item.gst_rate) / 100;
      const cash = agreed - (billedBase_ + gst);

      agreedTotal += agreed;
      billedBase += billedBase_;
      gstAmount += gst;
      cashAmount += cash;
    });

    return {
      agreedTotal,
      billedBase,
      gstAmount,
      billedAmount: billedBase + gstAmount,
      cashAmount,
    };
  };

  const totals = calculateTotals();

  const handleFormSubmit = (data: FormData) => {
    if (!data.company_id) return;

    const patternInput: UnderbillingPatternInput = {
      items: data.items,
    };

    onSubmit({
      company_id: data.company_id,
      from: data.from,
      billing_date: data.billing_date,
      due_date: data.due_date,
      payment_terms: data.payment_terms,
      pattern_type: InvoicePatternType.UNDERBILLING,
      pattern_input: patternInput,
      notes: data.notes,
      terms_conditions: data.terms_conditions,
      include_vehicle: data.include_vehicle,
      vehicle_type: data.vehicle_type,
      vehicle_number: data.vehicle_number,
      destination: data.destination,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Alert severity="info">
            <AlertTitle>Underbilling Pattern</AlertTitle>
            Bill a lower price + GST on the invoice. The remaining amount is treated as cash (hidden).
            <br />
            <strong>Example:</strong> Agreed price ₹0.34/cup → Bill ₹0.22 + GST, Cash ₹0.08
          </Alert>
        </Grid>

        {warnings.length > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning" icon={<WarningIcon />}>
              <AlertTitle>Underbilling Warnings</AlertTitle>
              {warnings.map((warning, index) => (
                <Typography key={index} variant="body2">
                  • {warning}
                </Typography>
              ))}
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                You can proceed, but this may trigger tax audits. Ensure this is intentional.
              </Typography>
            </Alert>
          </Grid>
        )}

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
                    render={({ field }) => <TextField {...field} label="Address" fullWidth />}
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

        {/* Terms & Conditions */}
        <Grid item xs={12}>
          <Card variant="outlined">
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
                    multiline
                    rows={6}
                    helperText="These terms will appear on the invoice"
                  />
                )}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Transport Details */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Controller
                name="include_vehicle"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Include Vehicle Details in Invoice"
                  />
                )}
              />
              {watchIncludeVehicle && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="vehicle_type"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Vehicle Type" fullWidth placeholder="e.g., Truck, Van, Tempo" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="vehicle_number"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Vehicle Number" fullWidth placeholder="e.g., BR01AB1234" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="destination"
                      control={control}
                      render={({ field }) => (
                        <TextField {...field} label="Destination" fullWidth placeholder="e.g., Patna, Bihar" />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
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
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="center">Unit</TableCell>
                  <TableCell align="right">Agreed Price/Cup (₹)</TableCell>
                  <TableCell align="right">Billed Price/Cup (₹)</TableCell>
                  <TableCell align="right">GST %</TableCell>
                  <TableCell align="right">Underbill %</TableCell>
                  <TableCell align="right">Billed Total</TableCell>
                  <TableCell align="right">Cash Diff</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const item = watchItems[index];
                  const agreed = item.quantity * item.agreed_price_per_cup;
                  const billedBase = item.quantity * item.billed_price_per_cup;
                  const gst = (billedBase * item.gst_rate) / 100;
                  const billedTotal = billedBase + gst;
                  const cashDiff = agreed - billedTotal;
                  const underbillPct = agreed > 0 ? (cashDiff / agreed) * 100 : 0;

                  return (
                    <TableRow key={field.id} sx={{ bgcolor: underbillPct > 30 ? 'warning.lighter' : 'inherit' }}>
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
                          name={`items.${index}.quantity`}
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
                          name={`items.${index}.agreed_price_per_cup`}
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
                          name={`items.${index}.billed_price_per_cup`}
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
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color={underbillPct > 30 ? 'error' : 'text.primary'}
                        >
                          {underbillPct.toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium" color="primary">
                          {formatCurrency(billedTotal)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          (On Invoice)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(cashDiff)}
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
                quantity: 1000,
                unit: 'Boxes',
                agreed_price_per_cup: 0,
                billed_price_per_cup: 0,
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
                  Agreed Total
                </Typography>
                <Typography variant="h6">{formatCurrency(totals.agreedTotal)}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Billed (Taxable + GST)
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(totals.billedAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Cash Difference (Hidden)
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(totals.cashAmount)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Overall Underbilling %
                </Typography>
                <Typography
                  variant="h6"
                  color={
                    totals.agreedTotal > 0 && (totals.cashAmount / totals.agreedTotal) * 100 > 30
                      ? 'error'
                      : 'text.primary'
                  }
                >
                  {totals.agreedTotal > 0 ? ((totals.cashAmount / totals.agreedTotal) * 100).toFixed(1) : 0}%
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
