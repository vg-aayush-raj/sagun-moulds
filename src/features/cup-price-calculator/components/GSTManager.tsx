import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';

import styles from './GSTManager.module.css';
import { Button, TextField } from '../../../components/ui';
import { CupPriceCalculatorFormValues } from '../schema';

interface GSTManagerProps {
  fields: FieldArrayWithId<CupPriceCalculatorFormValues, 'gstRates', 'id'>[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const GSTManager: React.FC<GSTManagerProps> = ({ fields, onAdd, onRemove }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CupPriceCalculatorFormValues>();

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Typography variant="h6" className={styles.sectionTitle}>
          GST Rate Configuration
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
          Add GST Rate
        </Button>
      </div>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2, mt: 1 }}>
        Configure custom GST rates to calculate different pricing scenarios for your cups (e.g., 0%, 5%, 9%, 12%, 18%,
        28%)
      </Typography>

      {fields.length === 0 ? (
        <Paper className={styles.emptyState}>
          <Typography variant="body1" color="textSecondary">
            No GST rates added yet. Click "Add GST Rate" to configure pricing scenarios.
          </Typography>
        </Paper>
      ) : (
        fields.map((field, index) => (
          <Paper key={field.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <Typography variant="subtitle1" className={styles.entryTitle}>
                GST Rate {index + 1}
              </Typography>
              <Tooltip title="Remove GST rate">
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
                  {...register(`gstRates.${index}.rate`, {
                    valueAsNumber: true,
                  })}
                  label="GST Rate (%)"
                  type="number"
                  placeholder="e.g., 18"
                  error={!!errors.gstRates?.[index]?.rate}
                  helperText={errors.gstRates?.[index]?.rate?.message}
                  fullWidth
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  {...register(`gstRates.${index}.description`)}
                  label="Description (Optional)"
                  placeholder="e.g., Standard GST, Higher GST"
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
