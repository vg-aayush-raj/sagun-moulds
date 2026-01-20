import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { invoiceApi, InvoicePatternType, CreateInvoiceRequest, InvoicePreviewResponse } from '../../../api/invoiceApi';
import { getPatternDisplayName, getPatternDescription } from '../utils/invoiceHelpers';
import InvoicePreview from './InvoicePreview';
import NormalPatternForm from './patterns/NormalPatternForm';
import MixedPatternForm from './patterns/MixedPatternForm';
import UnderbillingPatternForm from './patterns/UnderbillingPatternForm';
import MostlyCashPatternForm from './patterns/MostlyCashPatternForm';

interface InvoiceFormProps {
  onSuccess: () => void;
}

export default function InvoiceFormRevamped({ onSuccess }: InvoiceFormProps) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<InvoicePatternType>(InvoicePatternType.NORMAL_WITH_GST);
  const [invoiceData, setInvoiceData] = useState<Partial<CreateInvoiceRequest> | null>(null);
  const [preview, setPreview] = useState<InvoicePreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const steps = ['Select Pattern', 'Invoice Details', 'Preview & Confirm'];

  const handlePatternSelect = (pattern: InvoicePatternType) => {
    setSelectedPattern(pattern);
    setError(null);
    setWarning(null);
  };

  const handlePatternFormSubmit = async (data: Partial<CreateInvoiceRequest>) => {
    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const requestData: CreateInvoiceRequest = {
        ...data,
        pattern_type: selectedPattern,
      } as CreateInvoiceRequest;

      const result = await invoiceApi.createInvoice(requestData);

      if (result.warning) {
        setWarning(result.warning);
      }

      setInvoiceData(requestData);
      setPreview(result);
      setActiveStep(2); // Move to preview step
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview) return;

    try {
      setLoading(true);
      await invoiceApi.confirmInvoice(preview.invoice.id);

      // Reset form
      setActiveStep(0);
      setSelectedPattern(InvoicePatternType.NORMAL_WITH_GST);
      setInvoiceData(null);
      setPreview(null);
      setError(null);
      setWarning(null);

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to confirm invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    // Delete the draft invoice before going back to edit
    if (preview?.invoice?.id) {
      try {
        await invoiceApi.deleteInvoice(preview.invoice.id);
      } catch (err) {
        console.error('Failed to delete draft invoice:', err);
      }
    }
    setPreview(null);
    setActiveStep(1); // Go back to form with preserved data
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedPattern(InvoicePatternType.NORMAL_WITH_GST);
    setInvoiceData(null);
    setPreview(null);
    setError(null);
    setWarning(null);
  };

  const renderPatternForm = () => {
    const commonProps = {
      onSubmit: handlePatternFormSubmit,
      onCancel: handleReset,
      loading,
      initialData: invoiceData, // Pass the saved data for editing
    };

    switch (selectedPattern) {
      case InvoicePatternType.NORMAL_WITH_GST:
        return <NormalPatternForm {...commonProps} />;
      case InvoicePatternType.MIXED_GST_CASH:
        return <MixedPatternForm {...commonProps} />;
      case InvoicePatternType.UNDERBILLING:
        return <UnderbillingPatternForm {...commonProps} />;
      case InvoicePatternType.MOSTLY_CASH:
        return <MostlyCashPatternForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {warning && (
        <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      )}

      {/* Step 1: Pattern Selection */}
      {activeStep === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Select Invoice Pattern
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the billing pattern that matches your agreement with the customer
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={selectedPattern}
                onChange={(e) => handlePatternSelect(e.target.value as InvoicePatternType)}
              >
                {Object.values(InvoicePatternType).map((pattern) => (
                  <Box key={pattern} sx={{ mb: 2 }}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: selectedPattern === pattern ? 2 : 1,
                        borderColor: selectedPattern === pattern ? 'primary.main' : 'divider',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.light',
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => handlePatternSelect(pattern)}
                    >
                      <CardContent>
                        <FormControlLabel
                          value={pattern}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {getPatternDisplayName(pattern)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {getPatternDescription(pattern)}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0 }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!selectedPattern}>
                Continue to Invoice Details
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Invoice Form */}
      {activeStep === 1 && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Invoice Details - {getPatternDisplayName(selectedPattern)}</Typography>
              <Button size="small" onClick={handleReset}>
                Change Pattern
              </Button>
            </Box>
            <Divider sx={{ mb: 3 }} />
            {renderPatternForm()}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview & Confirm */}
      {activeStep === 2 && preview && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Preview & Confirm Invoice
            </Typography>

            {warning && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {warning}
              </Alert>
            )}

            {/* Invoice Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Invoice Details
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Invoice Number
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {preview.invoice.invoice_number}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pattern Type
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {getPatternDisplayName(preview.invoice.pattern_type)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Company
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {preview.invoice.company}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Billing Date
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {new Date(preview.invoice.billing_date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* HTML Preview */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 3,
                bgcolor: 'background.paper',
                maxHeight: '500px',
                overflow: 'auto',
                mb: 3,
              }}
              dangerouslySetInnerHTML={{ __html: preview.preview_html }}
            />

            {/* Totals Summary */}
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Invoice Totals
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Base Total (Taxable):</Typography>
                <Typography variant="body2" fontWeight="medium">
                  ₹{Number(preview.invoice.base_total).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">GST Total:</Typography>
                <Typography variant="body2" fontWeight="medium">
                  ₹{Number(preview.invoice.gst_total).toFixed(2)}
                </Typography>
              </Box>
              {preview.invoice.cash_total > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cash Amount (Hidden):
                  </Typography>
                  <Typography variant="body2" fontWeight="medium" color="text.secondary">
                    ₹{Number(preview.invoice.cash_total).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  Billed Amount (On Invoice):
                </Typography>
                <Typography variant="body1" fontWeight="bold" color="primary">
                  ₹{Number(preview.invoice.billed_amount).toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total Transaction Value:</Typography>
                <Typography variant="h6" color="success.main">
                  ₹{Number(preview.invoice.final_total).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel} disabled={loading}>
                Edit Invoice
              </Button>
              <Button variant="contained" onClick={handleConfirm} disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm & Generate Invoice'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
