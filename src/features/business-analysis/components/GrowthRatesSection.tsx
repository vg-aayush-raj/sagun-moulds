import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function GrowthRatesSection() {
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
        <Typography className={styles.accordionTitle}>Growth Rates</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Controller
              name="growthRates.price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Annual Price Increase (%)"
                  type="number"
                  error={!!errors.growthRates?.price}
                  helperText={errors.growthRates?.price?.message}
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                  value={field.value * 100}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="growthRates.rawMaterial"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Annual Raw Material Cost Increase (%)"
                  type="number"
                  error={!!errors.growthRates?.rawMaterial}
                  helperText={errors.growthRates?.rawMaterial?.message}
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                  value={field.value * 100}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="growthRates.fixedCosts"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Annual Fixed Costs Increase (%)"
                  type="number"
                  error={!!errors.growthRates?.fixedCosts}
                  helperText={errors.growthRates?.fixedCosts?.message}
                  InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                  value={field.value * 100}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
          Year-by-Year Volume Growth Rates (%)
        </Typography>

        <Grid container spacing={2}>
          {[...Array(10)].map((_, index) => (
            <Grid xs={6} sm={4} md={2} lg={1} key={index}>
              <Controller
                name={`growthRates.volume[${index}]` as any}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`Y${index + 1}`}
                    type="number"
                    error={!!errors.growthRates?.volume?.[index]}
                    helperText={errors.growthRates?.volume?.[index]?.message}
                    value={field.value * 100}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value) / 100)}
                    InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                    size="small"
                    sx={{ '& .MuiInputBase-input': { textAlign: 'center' } }}
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
