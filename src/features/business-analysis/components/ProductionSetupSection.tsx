import { ChangeEvent } from 'react';
import { Divider, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function ProductionSetupSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

  return (
    <Grid xs={12} className={styles.formSection}>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Production Setup
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Controller
            name="productionSetup.thermoformingMachines"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Thermoforming Machines"
                type="number"
                error={!!errors.productionSetup?.thermoformingMachines}
                helperText={errors.productionSetup?.thermoformingMachines?.message}
                inputProps={{ min: 1, step: 1 }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Controller
            name="productionSetup.printers"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Printers"
                type="number"
                error={!!errors.productionSetup?.printers}
                helperText={errors.productionSetup?.printers?.message}
                inputProps={{ min: 1, step: 1 }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Controller
            name="productionSetup.sheetlines"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Sheetlines"
                type="number"
                error={!!errors.productionSetup?.sheetlines}
                helperText={errors.productionSetup?.sheetlines?.message}
                inputProps={{ min: 1, step: 1 }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        {/* Production Capacity */}
        <Grid xs={12} md={6}>
          <Controller
            name="cupsPerDay.thermoforming"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Thermoforming Capacity (Cups/Day/Machine)"
                type="number"
                error={!!errors.cupsPerDay?.thermoforming}
                helperText={errors.cupsPerDay?.thermoforming?.message}
                inputProps={{ min: 1000, step: 1000 }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <Controller
            name="cupsPerDay.printing"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Printing Capacity (Cups/Day/Printer)"
                type="number"
                error={!!errors.cupsPerDay?.printing}
                helperText={errors.cupsPerDay?.printing?.message}
                inputProps={{ min: 1000, step: 1000 }}
                value={field.value ?? ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
