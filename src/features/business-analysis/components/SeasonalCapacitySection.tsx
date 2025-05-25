import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function SeasonalCapacitySection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

  // All months of the year
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  // Helper function to get error message
  const getErrorMessage = (month: string): string => {
    const error = errors.seasonalCapacity?.[month as keyof typeof errors.seasonalCapacity];
    return error && typeof error === 'object' && 'message' in error ? (error.message as string) : '';
  };

  return (
    <Accordion
      sx={{
        mb: 2,
        borderRadius: '8px',
        overflow: 'hidden',
        '&:before': {
          display: 'none',
        },
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className={styles.accordionHeader}>
        <Typography className={styles.accordionTitle}>Seasonal Capacity (%)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {months.map((month) => (
            <Grid xs={6} sm={4} md={2} key={month}>
              <Controller
                name={`seasonalCapacity.${month}` as any}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={month.charAt(0).toUpperCase() + month.slice(1)}
                    type="number"
                    error={!!errors.seasonalCapacity?.[month as keyof typeof errors.seasonalCapacity]}
                    helperText={getErrorMessage(month)}
                    InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.05 } }}
                    value={field.value * 100}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
                    sx={{ '& .MuiInputBase-input': { textAlign: 'center' } }}
                    size="small"
                  />
                )}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
