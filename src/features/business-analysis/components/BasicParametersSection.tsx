import { ChangeEvent } from 'react';
import { Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import { BusinessAnalysisFormValues } from '../schema';

export function BasicParametersSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

  return (
    <Grid xs={12} className="formSection">
      <Typography variant="h6" className="sectionTitle">
        Basic Parameters
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Controller
            name="initialInvestment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Initial Investment (Crores)"
                type="number"
                error={!!errors.initialInvestment}
                helperText={errors.initialInvestment?.message}
                InputProps={{ inputProps: { step: 0.01 } }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Controller
            name="rawMaterialCostPercent"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Raw Material Cost (%)"
                type="number"
                error={!!errors.rawMaterialCostPercent}
                helperText={errors.rawMaterialCostPercent?.message}
                InputProps={{ inputProps: { min: 0.01, max: 0.99, step: 0.01 } }}
                value={field.value * 100}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
              />
            )}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Controller
            name="rentIncreaseRate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Annual Rent Increase (%)"
                type="number"
                error={!!errors.rentIncreaseRate}
                helperText={errors.rentIncreaseRate?.message}
                InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                value={field.value * 100}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
