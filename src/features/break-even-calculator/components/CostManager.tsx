import React from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import styles from './CostManager.module.css';
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

interface CostManagerProps {
  fields: FieldArrayWithId<BreakEvenFormValues, 'costs', 'id'>[];
  control: Control<BreakEvenFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<BreakEvenFormValues>;
}

const CostManager: React.FC<CostManagerProps> = ({ fields, control, onRemove, errors }) => {
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.costCard}>
          <div className={styles.cardHeader}>
            <h3>Cost Item #{index + 1}</h3>
            {fields.length > 1 && (
              <Button type="button" onClick={() => onRemove(index)} variant="outlined" color="error" size="small">
                Remove
              </Button>
            )}
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`costs.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label="Cost Name"
                    placeholder="e.g., Rent, EMI, Electricity"
                    error={!!errors.costs?.[index]?.name}
                    helperText={errors.costs?.[index]?.name?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`costs.${index}.amount`}
                control={control}
                render={({ field: { name, value, onChange, onBlur } }) => (
                  <TextField
                    name={name}
                    value={value}
                    onBlur={onBlur}
                    type="number"
                    label="Monthly Amount (₹)"
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val === '' ? 0 : Number(val));
                    }}
                    error={!!errors.costs?.[index]?.amount}
                    helperText={errors.costs?.[index]?.amount?.message}
                    fullWidth
                    inputProps={numberInputProps}
                    sx={hideSpinnerSx}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={`costs.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    name={field.name}
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    label="Description (Optional)"
                    placeholder="Additional details about this cost"
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
          <p>No cost items added yet. Click "Add Cost Item" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CostManager;
