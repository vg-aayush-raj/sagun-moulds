import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Company } from '../../../api/companyApi';
import { companySchema, CompanyFormData } from '../schema';

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  initialData?: Company | null;
  mode: 'create' | 'edit';
}

export default function CompanyForm({ open, onClose, onSubmit, initialData, mode }: CompanyFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {},
  });

  const handleFormSubmit = async (data: CompanyFormData) => {
    setLoading(true);

    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Add New Company' : 'Edit Company'}</DialogTitle>
      <DialogContent>
        <form id="company-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="gstin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="GSTIN"
                    fullWidth
                    error={!!errors.gstin}
                    helperText={errors.gstin?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="contact_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contact Person"
                    fullWidth
                    error={!!errors.contact_name}
                    helperText={errors.contact_name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Bank Details (Optional)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="bank_details.bank_name"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Bank Name" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="bank_details.branch"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Branch" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="bank_details.account_number"
                        control={control}
                        render={({ field }) => <TextField {...field} label="Account Number" fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="bank_details.ifsc"
                        control={control}
                        render={({ field }) => <TextField {...field} label="IFSC Code" fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" form="company-form" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
