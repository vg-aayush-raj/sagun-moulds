import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';

import styles from './ExpenseManager.module.css';
import { Button, TextField } from '../../../components/ui';
import { CupPriceCalculatorFormValues } from '../schema';

interface ExpenseManagerProps {
  fields: FieldArrayWithId<CupPriceCalculatorFormValues, 'expenses', 'id'>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({ fields, onAdd, onRemove }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CupPriceCalculatorFormValues>();

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Monthly Expenses
        </Typography>
        <Button
          onClick={onAdd}
          startIcon={<AddIcon />}
          variant="contained"
          size="medium"
          sx={{
            minWidth: '140px',
            fontSize: '0.9rem',
            py: 1,
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Add Expense
        </Button>
      </div>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 1 }}>
        Add your monthly fixed expenses such as Rent, Electricity, Employee Salaries, EMI, etc.
      </Typography>

      {fields.length === 0 ? (
        <Paper className={styles.emptyState}>
          <Typography variant="body1" color="textSecondary">
            No expenses added yet. Click "Add Expense" to get started.
          </Typography>
        </Paper>
      ) : (
        fields.map((field, index) => (
          <Paper key={field.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <Typography variant="subtitle1" className={styles.entryTitle}>
                Expense {index + 1}
              </Typography>
              <Tooltip title="Remove expense">
                <IconButton
                  onClick={() => onRemove(index)}
                  color="error"
                  size="small"
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.1)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <TextField
                  {...register(`expenses.${index}.name`)}
                  label="Expense Name"
                  placeholder="e.g., Rent, Electricity, Employee"
                  error={!!errors.expenses?.[index]?.name}
                  helperText={errors.expenses?.[index]?.name?.message}
                  fullWidth
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  {...register(`expenses.${index}.amount`, {
                    valueAsNumber: true,
                  })}
                  label="Monthly Amount (₹)"
                  type="number"
                  error={!!errors.expenses?.[index]?.amount}
                  helperText={errors.expenses?.[index]?.amount?.message}
                  fullWidth
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <TextField
                  {...register(`expenses.${index}.description`)}
                  label="Description (Optional)"
                  placeholder="Additional details about this expense"
                  multiline
                  rows={2}
                  fullWidth
                />
              </div>
            </div>
          </Paper>
        ))
      )}
    </div>
  );
};
