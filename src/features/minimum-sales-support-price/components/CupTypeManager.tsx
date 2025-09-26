import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button, TextField } from '../../../components/ui';
import styles from '../MinimumSalesSupportPrice.module.css';
import { MinimumSalesSupportPriceFormValues, createNewCupType } from '../schema';

export const CupTypeManager: React.FC = () => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<MinimumSalesSupportPriceFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'cupTypes',
  });

  const watchedCupTypes = watch('cupTypes');

  const handleAddCupType = () => {
    append(createNewCupType());
  };

  const handleRemoveCupType = (index: number) => {
    remove(index);
  };

  const calculateRawMaterialRequired = (index: number) => {
    const cupType = watchedCupTypes?.[index];
    if (!cupType) return 0;

    return (cupType.cupWeightInGrams * cupType.monthlyProduction) / 1000; // Convert to kg
  };

  const calculateMonthlyCost = (index: number) => {
    const cupType = watchedCupTypes?.[index];
    if (!cupType) return 0;

    const rawMaterialKg = calculateRawMaterialRequired(index);
    return rawMaterialKg * cupType.rawMaterialPricePerKg;
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Typography variant="h6" className={styles.sectionTitle}>
          Cup Types & Production
        </Typography>
        <Button
          onClick={handleAddCupType}
          startIcon={<AddIcon />}
          variant="contained"
          size="medium"
          sx={{
            minWidth: '150px',
            fontSize: '0.9rem',
            py: 1,
            background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
            color: 'white',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(255, 152, 0, 0.3)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Add Cup Type
        </Button>
      </div>

      {fields.length === 0 ? (
        <Paper className={styles.emptyState}>
          <Typography variant="body1" color="textSecondary">
            No cup types added yet. Click "Add Cup Type" to get started.
          </Typography>
        </Paper>
      ) : (
        fields.map((field, index) => (
          <Paper key={field.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <Typography variant="subtitle1" className={styles.entryTitle}>
                Cup Type {index + 1}
              </Typography>
              <Tooltip title="Remove cup type">
                <IconButton
                  onClick={() => handleRemoveCupType(index)}
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
                  {...register(`cupTypes.${index}.name`)}
                  label="Cup Name"
                  placeholder="e.g., 150ml Tea Cup, 250ml Coffee Cup"
                  error={!!errors.cupTypes?.[index]?.name}
                  helperText={errors.cupTypes?.[index]?.name?.message}
                  fullWidth
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  {...register(`cupTypes.${index}.monthlyProduction`, {
                    valueAsNumber: true,
                  })}
                  label="Monthly Production (pieces)"
                  type="number"
                  error={!!errors.cupTypes?.[index]?.monthlyProduction}
                  helperText={errors.cupTypes?.[index]?.monthlyProduction?.message}
                  fullWidth
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <TextField
                  {...register(`cupTypes.${index}.cupWeightInGrams`, {
                    valueAsNumber: true,
                  })}
                  label="Cup Weight (grams)"
                  error={!!errors.cupTypes?.[index]?.cupWeightInGrams}
                  helperText={errors.cupTypes?.[index]?.cupWeightInGrams?.message}
                  fullWidth
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  {...register(`cupTypes.${index}.rawMaterialPricePerKg`, {
                    valueAsNumber: true,
                  })}
                  label="Raw Material Price (₹/kg)"
                  type="number"
                  error={!!errors.cupTypes?.[index]?.rawMaterialPricePerKg}
                  helperText={errors.cupTypes?.[index]?.rawMaterialPricePerKg?.message}
                  fullWidth
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <TextField
                  {...register(`cupTypes.${index}.sellingPricePerCup`, {
                    valueAsNumber: true,
                  })}
                  label="Selling Price per Cup"
                  placeholder="e.g., 0.34, 0.48, 1.25"
                  error={!!errors.cupTypes?.[index]?.sellingPricePerCup}
                  helperText={
                    errors.cupTypes?.[index]?.sellingPricePerCup?.message || 'Enter price in any unit (₹, paise, etc.)'
                  }
                  fullWidth
                />
              </div>

              <div className={styles.formField}>
                <TextField
                  {...register(`cupTypes.${index}.description`)}
                  label="Description (Optional)"
                  placeholder="Additional details about this cup type"
                  fullWidth
                />
              </div>
            </div>

            {/* Calculated values display */}
            <div className={styles.formRow}>
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', width: '100%' }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Calculated Values:</strong>
                </Typography>
                <Typography variant="body2">
                  Raw Material Required: <strong>{calculateRawMaterialRequired(index).toFixed(2)} kg/month</strong>
                </Typography>
                <Typography variant="body2">
                  Monthly Raw Material Cost: <strong>{calculateMonthlyCost(index).toFixed(4)}</strong>
                </Typography>
              </Paper>
            </div>
          </Paper>
        ))
      )}
    </div>
  );
};
