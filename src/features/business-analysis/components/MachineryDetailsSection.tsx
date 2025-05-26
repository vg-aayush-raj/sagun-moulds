import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { Grid, TextField } from '../../../components/ui';
import styles from '../BusinessAnalysis.module.css';
import { BusinessAnalysisFormValues } from '../schema';

export function MachineryDetailsSection() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<BusinessAnalysisFormValues>();

  // Calculate subtotal machinery cost
  const machineryDetails = watch('machineryDetails');
  const subtotal = machineryDetails
    ? Object.entries(machineryDetails).reduce((total, [key, value]) => {
        if (key !== 'gstRate') return total + value;
        return total;
      }, 0)
    : 0;

  const gstRate = watch('machineryDetails.gstRate') || 18;
  const gstAmount = (subtotal * gstRate) / 100;
  const totalCost = subtotal + gstAmount;

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
        <Typography className={styles.accordionTitle}>Machinery & Equipment Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.sheetExtrusionLine"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Sheet Extrusion Line Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.sheetExtrusionLine}
                  helperText={errors.machineryDetails?.sheetExtrusionLine?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.hopperLoaderMixer"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hopper Loader & Mixer Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.hopperLoaderMixer}
                  helperText={errors.machineryDetails?.hopperLoaderMixer?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.grinderBlower"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Grinder & Blower Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.grinderBlower}
                  helperText={errors.machineryDetails?.grinderBlower?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.formingMachine"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Forming Machine Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.formingMachine}
                  helperText={errors.machineryDetails?.formingMachine?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.moulds"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Moulds Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.moulds}
                  helperText={errors.machineryDetails?.moulds?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.dryOffsetPrinter"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dry Offset Printer Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.dryOffsetPrinter}
                  helperText={errors.machineryDetails?.dryOffsetPrinter?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.waterChiller"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Water Chiller Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.waterChiller}
                  helperText={errors.machineryDetails?.waterChiller?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.airCompressor"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Air Compressor Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.airCompressor}
                  helperText={errors.machineryDetails?.airCompressor?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.coolingTower"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cooling Tower Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.coolingTower}
                  helperText={errors.machineryDetails?.coolingTower?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.freightLogistics"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Freight/Logistics Cost (₹ Lakhs)"
                  type="number"
                  error={!!errors.machineryDetails?.freightLogistics}
                  helperText={errors.machineryDetails?.freightLogistics?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>
          <Grid xs={12} md={6}>
            <Controller
              name="machineryDetails.gstRate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="GST Rate (%)"
                  type="number"
                  error={!!errors.machineryDetails?.gstRate}
                  helperText={errors.machineryDetails?.gstRate?.message}
                  InputProps={{ inputProps: { step: 0.01 } }}
                  value={field.value ?? ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </Grid>

          <Grid xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
              Summary:
            </Typography>
            <Typography variant="body1">Subtotal: ₹ {subtotal.toFixed(2)} Lakhs</Typography>
            <Typography variant="body1">
              GST ({gstRate}%): ₹ {gstAmount.toFixed(2)} Lakhs
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Total Equipment Cost: ₹ {totalCost.toFixed(2)} Lakhs
            </Typography>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
