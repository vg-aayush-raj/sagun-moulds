import { ChangeEvent } from 'react';
import { Typography, Divider } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { calculateEMI } from '../calculations';
import { BusinessAnalysisFormValues } from '../schema';

export function FinancingDetailsSection() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

  const loanAmount = watch('financingDetails.loanAmount');
  const interestRate = watch('financingDetails.loanInterestRate');
  const loanPeriodYears = watch('financingDetails.loanPeriodYears');

  // Calculate EMI
  const monthlyEMI = calculateEMI(loanAmount, interestRate, loanPeriodYears);

  return (
    <Grid xs={12} className={styles.formSection}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Financing Details
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Controller
            name="financingDetails.totalInvestment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Total Investment (Crores)"
                type="number"
                error={!!errors.financingDetails?.totalInvestment}
                helperText={errors.financingDetails?.totalInvestment?.message}
                InputProps={{ inputProps: { step: 0.01 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Controller
            name="financingDetails.ownInvestment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Own Investment (Crores)"
                type="number"
                error={!!errors.financingDetails?.ownInvestment}
                helperText={errors.financingDetails?.ownInvestment?.message}
                InputProps={{ inputProps: { step: 0.01 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Controller
            name="financingDetails.loanAmount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Loan Amount (Crores)"
                type="number"
                error={!!errors.financingDetails?.loanAmount}
                helperText={errors.financingDetails?.loanAmount?.message}
                InputProps={{ inputProps: { step: 0.01 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Controller
            name="financingDetails.loanInterestRate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Loan Interest Rate (%)"
                type="number"
                error={!!errors.financingDetails?.loanInterestRate}
                helperText={errors.financingDetails?.loanInterestRate?.message}
                InputProps={{ inputProps: { step: 0.1, min: 1, max: 40 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Controller
            name="financingDetails.loanPeriodYears"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Loan Period (Years)"
                type="number"
                error={!!errors.financingDetails?.loanPeriodYears}
                helperText={errors.financingDetails?.loanPeriodYears?.message}
                InputProps={{ inputProps: { step: 1, min: 1, max: 30 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <TextField
            label="Monthly EMI (₹)"
            type="text"
            value={`₹ ${monthlyEMI.toLocaleString()}`}
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
