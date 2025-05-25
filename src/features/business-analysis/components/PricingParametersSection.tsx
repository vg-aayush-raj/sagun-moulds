import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function PricingParametersSection() {
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
        <Typography className={styles.accordionTitle}>Pricing Parameters</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Controller
              name="pricePerCup.sudha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sudha Cup Price (₹)"
                  type="number"
                  error={!!errors.pricePerCup?.sudha}
                  helperText={errors.pricePerCup?.sudha?.message}
                  InputProps={{ inputProps: { min: 0.1, step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="pricePerCup.local"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Local Cup Price (₹)"
                  type="number"
                  error={!!errors.pricePerCup?.local}
                  helperText={errors.pricePerCup?.local?.message}
                  InputProps={{ inputProps: { min: 0.1, step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="mixRatio.sudha"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sudha Mix Ratio (0-1)"
                  type="number"
                  error={!!errors.mixRatio?.sudha}
                  helperText={errors.mixRatio?.sudha?.message}
                  InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="mixRatio.local"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Local Mix Ratio (0-1)"
                  type="number"
                  error={!!errors.mixRatio?.local}
                  helperText={errors.mixRatio?.local?.message}
                  InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
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
