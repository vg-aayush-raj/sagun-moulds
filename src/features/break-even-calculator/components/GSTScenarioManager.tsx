import React from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import styles from './GSTScenarioManager.module.css';
import { Button } from '../../../components/ui/Button';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { BreakEvenFormValues } from '../schema';

// Define these outside component to prevent recreation on every render
const numberInputProps = {
  step: 'any',
  style: { MozAppearance: 'textfield' as const },
};

const hideSpinnerSx = {
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    display: 'none',
  },
};

interface GSTScenarioManagerProps {
  fields: FieldArrayWithId<BreakEvenFormValues, 'gstScenarios', 'id'>[];
  control: Control<BreakEvenFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<BreakEvenFormValues>;
}

const GSTScenarioManager: React.FC<GSTScenarioManagerProps> = ({ fields, control, onRemove, errors }) => {
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.gstCard}>
          <div className={styles.cardHeader}>
            <h3>GST Scenario #{index + 1}</h3>
            {fields.length > 1 && (
              <Button type="button" onClick={() => onRemove(index)} variant="outlined" color="error" size="small">
                Remove
              </Button>
            )}
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`gstScenarios.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label="Scenario Name"
                    placeholder="e.g., 18% GST, 9% GST"
                    error={!!errors.gstScenarios?.[index]?.name}
                    helperText={errors.gstScenarios?.[index]?.name?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`gstScenarios.${index}.gstRate`}
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <TextField
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    type="number"
                    label="GST Rate (%)"
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? 0 : Number(val));
                    }}
                    error={!!errors.gstScenarios?.[index]?.gstRate}
                    helperText={errors.gstScenarios?.[index]?.gstRate?.message || 'Enter GST percentage (0-100)'}
                    fullWidth
                    inputProps={numberInputProps}
                    sx={hideSpinnerSx}
                  />
                )}
              />
            </Grid>
          </Grid>
        </div>
      ))}

      {fields.length === 0 && (
        <div className={styles.emptyState}>
          <p>No GST scenarios added yet. Click "Add GST Scenario" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default GSTScenarioManager;
