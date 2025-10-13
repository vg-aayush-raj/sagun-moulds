import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { AdvancedCupCalculatorFormValues } from '../schema';
import styles from './WorkingDaysConfig.module.css';

interface WorkingDaysConfigProps {
  control: Control<AdvancedCupCalculatorFormValues>;
  errors: FieldErrors<AdvancedCupCalculatorFormValues>;
}

const WorkingDaysConfig: React.FC<WorkingDaysConfigProps> = ({ control, errors }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Factory Working Days Configuration</h3>
        <p className={styles.sectionDescription}>
          Configure how many days your factory operates per month. This affects the daily expense calculation.
        </p>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="workingDaysConfig.workingDaysPerMonth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Working Days per Month"
                  placeholder="26"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.workingDaysConfig?.workingDaysPerMonth}
                  helperText={errors.workingDaysConfig?.workingDaysPerMonth?.message || 'Typical range: 20-26 days'}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </div>

      <div className={styles.calculationExample}>
        <h4>Impact on Calculations:</h4>
        <ul>
          <li>
            <strong>Daily Expenses</strong> = Monthly Expenses ÷ Working Days
          </li>
          <li>
            <strong>Production Cost per Cup</strong> = Daily Expenses ÷ Daily Production
          </li>
          <li>More working days = Lower daily expenses per day</li>
          <li>Fewer working days = Higher daily expenses per day</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkingDaysConfig;
