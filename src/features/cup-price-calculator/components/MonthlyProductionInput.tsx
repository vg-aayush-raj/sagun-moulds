import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from './MonthlyProductionInput.module.css';
import { TextField, Grid } from '../../../components/ui';
import { CupPriceCalculatorFormValues } from '../schema';

export const MonthlyProductionInput: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CupPriceCalculatorFormValues>();

  return (
    <div className={styles.section}>
      {/* Monthly Production */}
      <Paper className={styles.card}>
        <Typography variant="h6" className={styles.cardTitle}>
          Monthly Production
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Enter the total number of cups produced each month
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              {...register('monthlyProduction.production', {
                valueAsNumber: true,
              })}
              label="Monthly Production (cups)"
              type="number"
              placeholder="e.g., 2600000"
              error={!!errors.monthlyProduction?.production}
              helperText={errors.monthlyProduction?.production?.message}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Raw Material Configuration */}
      <Paper className={styles.card}>
        <Typography variant="h6" className={styles.cardTitle}>
          Raw Material Configuration
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Configure the raw material pricing and cup specifications
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('rawMaterialConfig.pricePerKg', {
                valueAsNumber: true,
              })}
              label="Raw Material Price (₹/kg)"
              type="number"
              placeholder="e.g., 131"
              error={!!errors.rawMaterialConfig?.pricePerKg}
              helperText={errors.rawMaterialConfig?.pricePerKg?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              {...register('rawMaterialConfig.cupWeightInGrams', {
                valueAsNumber: true,
              })}
              label="Cup Weight (grams)"
              type="number"
              placeholder="e.g., 1.0"
              error={!!errors.rawMaterialConfig?.cupWeightInGrams}
              helperText={errors.rawMaterialConfig?.cupWeightInGrams?.message}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
