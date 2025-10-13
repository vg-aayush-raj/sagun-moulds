import React from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import styles from './EnhancedCupTypeManager.module.css';
import { Button } from '../../../components/ui/Button';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { AdvancedCupCalculatorFormValues } from '../schema';

interface EnhancedCupTypeManagerProps {
  fields: FieldArrayWithId<AdvancedCupCalculatorFormValues, 'cupTypes', 'id'>[];
  control: Control<AdvancedCupCalculatorFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<AdvancedCupCalculatorFormValues>;
}

const EnhancedCupTypeManager: React.FC<EnhancedCupTypeManagerProps> = ({ fields, control, onRemove, errors }) => {
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.cupCard}>
          <div className={styles.cardHeader}>
            <h3>Cup Type #{index + 1}</h3>
            <Button type="button" onClick={() => onRemove(index)} variant="outlined" color="error" size="small">
              Remove
            </Button>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cup Name"
                    placeholder="e.g., Delicious 35ml"
                    error={!!errors.cupTypes?.[index]?.name}
                    helperText={errors.cupTypes?.[index]?.name?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.cupWeightInGrams`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Cup Weight (Grams)"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.cupTypes?.[index]?.cupWeightInGrams}
                    helperText={errors.cupTypes?.[index]?.cupWeightInGrams?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.dailyProduction`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Daily Production (Cups)"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.cupTypes?.[index]?.dailyProduction}
                    helperText={errors.cupTypes?.[index]?.dailyProduction?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.rawMaterialBasePricePerKg`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Raw Material Base Price (₹/Kg)"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.cupTypes?.[index]?.rawMaterialBasePricePerKg}
                    helperText={errors.cupTypes?.[index]?.rawMaterialBasePricePerKg?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.gstPercentage`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="GST Percentage (%)"
                    placeholder="18"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.cupTypes?.[index]?.gstPercentage}
                    helperText={errors.cupTypes?.[index]?.gstPercentage?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`cupTypes.${index}.logisticsChargePerKg`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Logistics Charge (₹/Kg)"
                    placeholder="10"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.cupTypes?.[index]?.logisticsChargePerKg}
                    helperText={errors.cupTypes?.[index]?.logisticsChargePerKg?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={`cupTypes.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    placeholder="Additional details about this cup type"
                    multiline
                    rows={2}
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>
      ))}

      {fields.length === 0 && (
        <div className={styles.emptyState}>
          <p>No cup types added yet. Click "Add Cup Type" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedCupTypeManager;
