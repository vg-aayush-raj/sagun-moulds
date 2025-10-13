import React from 'react';
import { Control, Controller, FieldArrayWithId, FieldErrors } from 'react-hook-form';
import styles from './ExpenseManager.module.css';
import { Button } from '../../../components/ui/Button';
import { Grid } from '../../../components/ui/Grid';
import { TextField } from '../../../components/ui/TextField';
import { AdvancedCupCalculatorFormValues } from '../schema';

interface ExpenseManagerProps {
  fields: FieldArrayWithId<AdvancedCupCalculatorFormValues, 'expenses', 'id'>[];
  control: Control<AdvancedCupCalculatorFormValues>;
  onRemove: (index: number) => void;
  errors: FieldErrors<AdvancedCupCalculatorFormValues>;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ fields, control, onRemove, errors }) => {
  return (
    <div className={styles.container}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.expenseCard}>
          <div className={styles.cardHeader}>
            <h3>Expense #{index + 1}</h3>
            <Button type="button" onClick={() => onRemove(index)} variant="outlined" color="error" size="small">
              Remove
            </Button>
          </div>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name={`expenses.${index}.name`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expense Name"
                    placeholder="e.g., Rent, Electricity"
                    error={!!errors.expenses?.[index]?.name}
                    helperText={errors.expenses?.[index]?.name?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name={`expenses.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Monthly Amount (₹)"
                    placeholder="0"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    error={!!errors.expenses?.[index]?.amount}
                    helperText={errors.expenses?.[index]?.amount?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name={`expenses.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    placeholder="Additional details about this expense"
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
          <p>No expenses added yet. Click "Add Expense" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
