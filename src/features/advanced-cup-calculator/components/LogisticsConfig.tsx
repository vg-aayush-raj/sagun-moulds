import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { AdvancedCupCalculatorFormValues } from '../schema';
import styles from './LogisticsConfig.module.css';

interface LogisticsConfigProps {
  control: Control<AdvancedCupCalculatorFormValues>;
  errors: FieldErrors<AdvancedCupCalculatorFormValues>;
}

const LogisticsConfig: React.FC<LogisticsConfigProps> = ({ control, errors }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Freight Calculation Configuration</h3>
        <p className={styles.sectionDescription}>
          Configure freight costs for delivery of manufactured goods. This will be used to calculate freight cost per
          cup.
        </p>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Controller
              name="logisticsConfig.totalBoxes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Total Boxes"
                  placeholder="20"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.logisticsConfig?.totalBoxes}
                  helperText={errors.logisticsConfig?.totalBoxes?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="logisticsConfig.cupsPerBox"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Cups per Box"
                  placeholder="12000"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.logisticsConfig?.cupsPerBox}
                  helperText={errors.logisticsConfig?.cupsPerBox?.message}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="logisticsConfig.freightCostTotal"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Total Freight Cost (₹)"
                  placeholder="1800"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.logisticsConfig?.freightCostTotal}
                  helperText={errors.logisticsConfig?.freightCostTotal?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </div>

      <div className={styles.calculationExample}>
        <h4>Example Calculation:</h4>
        <p>
          If you have <strong>20 boxes</strong> with <strong>12,000 cups each</strong> and the total freight cost is{' '}
          <strong>₹1,800</strong>:
        </p>
        <ul>
          <li>Total cups = 20 × 12,000 = 240,000 cups</li>
          <li>Freight per cup = ₹1,800 ÷ 240,000 = ₹0.0075 per cup</li>
        </ul>
      </div>
    </div>
  );
};

export default LogisticsConfig;
