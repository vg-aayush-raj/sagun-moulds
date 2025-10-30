import React from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import styles from './TargetPriceManager.module.css';
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
  '& .MuiInputBase-input': {
    color: '#000',
  },
};

const textFieldSx = {
  '& .MuiInputBase-input': {
    color: '#000',
  },
};

interface TargetPriceManagerProps {
  fields: FieldArrayWithId<BreakEvenFormValues, 'targetPriceScenarios', 'id'>[];
  control: Control<BreakEvenFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<BreakEvenFormValues>;
}

const TargetPriceManager: React.FC<TargetPriceManagerProps> = ({ fields, control, onRemove, errors }) => {
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.priceCard}>
          <div className={styles.cardHeader}>
            <h3>Target Price #{index + 1}</h3>
            {fields.length > 1 && (
              <Button type="button" onClick={() => onRemove(index)} variant="outlined" color="error" size="small">
                Remove
              </Button>
            )}
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`targetPriceScenarios.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label="Scenario Name"
                    placeholder="e.g., Target Price 1"
                    error={!!errors.targetPriceScenarios?.[index]?.name}
                    helperText={errors.targetPriceScenarios?.[index]?.name?.message}
                    fullWidth
                    sx={textFieldSx}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`targetPriceScenarios.${index}.sellingPrice`}
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <TextField
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    type="number"
                    label="Selling Price (₹/kg)"
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? 0 : Number(val));
                    }}
                    error={!!errors.targetPriceScenarios?.[index]?.sellingPrice}
                    helperText={
                      errors.targetPriceScenarios?.[index]?.sellingPrice?.message || 'Target selling price per kg'
                    }
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
          <p>No target prices added yet. Click "Add Target Price" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TargetPriceManager;
