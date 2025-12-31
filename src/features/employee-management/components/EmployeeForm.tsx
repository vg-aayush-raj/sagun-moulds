import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Employee } from '../../../api/employeeApi';
import { employeeSchema, EmployeeFormData } from '../schema';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  initialData?: Employee | null;
  mode: 'create' | 'edit';
}

export default function EmployeeForm({ open, onClose, onSubmit, initialData, mode }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          joining_date: dayjs(initialData.joining_date),
          termination_date: initialData.termination_date ? dayjs(initialData.termination_date) : undefined,
        }
      : {
          employee_type: 'permanent',
          salary_type: 'monthly',
          status: 'active',
          standard_work_hours: 12,
        },
  });

  const salaryType = watch('salary_type');

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        joining_date: dayjs(initialData.joining_date),
        termination_date: initialData.termination_date ? dayjs(initialData.termination_date) : undefined,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: EmployeeFormData) => {
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
      <DialogTitle>{mode === 'create' ? 'Add New Employee' : 'Edit Employee'}</DialogTitle>
      <DialogContent>
        <form id="employee-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Basic Information */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="employee_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee ID"
                    fullWidth
                    required
                    error={!!errors.employee_id}
                    helperText={errors.employee_id?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full Name"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Employee Type and Designation */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="employee_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Employee Type"
                    select
                    fullWidth
                    required
                    error={!!errors.employee_type}
                    helperText={errors.employee_type?.message}
                  >
                    <MenuItem value="permanent">Permanent</MenuItem>
                    <MenuItem value="temporary">Temporary</MenuItem>
                    <MenuItem value="contractual">Contractual</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="designation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Designation"
                    fullWidth
                    error={!!errors.designation}
                    helperText={errors.designation?.message}
                  />
                )}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="phone_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Phone Number"
                    fullWidth
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="government_id_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID Type (Aadhaar/PAN/etc)"
                    fullWidth
                    error={!!errors.government_id_type}
                    helperText={errors.government_id_type?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="government_id_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ID Number"
                    fullWidth
                    error={!!errors.government_id_number}
                    helperText={errors.government_id_number?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            {/* Salary Information */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Salary Type"
                    select
                    fullWidth
                    required
                    error={!!errors.salary_type}
                    helperText={errors.salary_type?.message}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="piece_rate">Piece Rate</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="salary_amount"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    label={
                      salaryType === 'monthly'
                        ? 'Monthly Salary (₹)'
                        : salaryType === 'daily'
                          ? 'Daily Rate (₹)'
                          : salaryType === 'hourly'
                            ? 'Hourly Rate (₹)'
                            : 'Piece Rate (₹)'
                    }
                    fullWidth
                    required
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    error={!!errors.salary_amount}
                    helperText={errors.salary_amount?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="salary_notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Salary Notes (e.g., ₹8 per 1000 cups)"
                    fullWidth
                    multiline
                    rows={2}
                    error={!!errors.salary_notes}
                    helperText={errors.salary_notes?.message}
                  />
                )}
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="joining_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Joining Date"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !!errors.joining_date,
                        helperText: errors.joining_date?.message as string,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="standard_work_hours"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    label="Standard Work Hours/Day"
                    fullWidth
                    type="number"
                    value={value || 12}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    error={!!errors.standard_work_hours}
                    helperText={errors.standard_work_hours?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" form="employee-form" variant="contained" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
