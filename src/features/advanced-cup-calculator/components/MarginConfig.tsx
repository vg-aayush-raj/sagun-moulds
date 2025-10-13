import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { AdvancedCupCalculatorFormValues } from '../schema';
import styles from './MarginConfig.module.css';

interface MarginConfigProps {
  control: Control<AdvancedCupCalculatorFormValues>;
  errors: FieldErrors<AdvancedCupCalculatorFormValues>;
}

const MarginConfig: React.FC<MarginConfigProps> = ({ control, errors }) => {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Profit Margin & Sales GST Configuration</h3>
        <p className={styles.sectionDescription}>
          Configure your desired profit margin and GST on sales to calculate the final selling price.
        </p>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="marginConfig.marginPercentage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Profit Margin (%)"
                  placeholder="10"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.marginConfig?.marginPercentage}
                  helperText={errors.marginConfig?.marginPercentage?.message || 'Percentage profit you want to keep'}
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="marginConfig.gstOnSalesPercentage"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="GST on Sales (%)"
                  placeholder="18"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={!!errors.marginConfig?.gstOnSalesPercentage}
                  helperText={errors.marginConfig?.gstOnSalesPercentage?.message || 'GST percentage on final sales'}
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>
      </div>

      <div className={styles.pricingFlow}>
        <h4>Pricing Flow:</h4>
        <div className={styles.flowSteps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <span>Raw Material Cost + Production Expenses + Freight</span>
          </div>
          <div className={styles.arrow}>↓</div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <span>Add Profit Margin (%)</span>
          </div>
          <div className={styles.arrow}>↓</div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <span>Add GST on Sales (%)</span>
          </div>
          <div className={styles.arrow}>↓</div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <span>
              <strong>Final Selling Price per Cup</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarginConfig;
