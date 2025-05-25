import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function FixedCostsSection() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

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
        <Typography className={styles.accordionTitle}>Fixed Costs (Monthly)</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Controller
              name="fixedCostsMonthly.rent"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Rent (₹)"
                  type="number"
                  error={!!errors.fixedCostsMonthly?.rent}
                  helperText={errors.fixedCostsMonthly?.rent?.message}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="fixedCostsMonthly.electricity"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Electricity (₹)"
                  type="number"
                  error={!!errors.fixedCostsMonthly?.electricity}
                  helperText={errors.fixedCostsMonthly?.electricity?.message}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="fixedCostsMonthly.maintenance"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Maintenance (₹)"
                  type="number"
                  error={!!errors.fixedCostsMonthly?.maintenance}
                  helperText={errors.fixedCostsMonthly?.maintenance?.message}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="fixedCostsMonthly.manpower"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Manpower (₹)"
                  type="number"
                  error={!!errors.fixedCostsMonthly?.manpower}
                  helperText={errors.fixedCostsMonthly?.manpower?.message}
                  InputProps={{ inputProps: { min: 0, step: 1000 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
