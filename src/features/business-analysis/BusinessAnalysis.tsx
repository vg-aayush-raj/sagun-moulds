import { useState } from 'react';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FactoryIcon from '@mui/icons-material/Factory';
import { businessAnalysisSchema, defaultValues, BusinessAnalysisFormValues } from './schema';
import { calculateAnalysisResults, AnalysisResult } from './calculations';
import styles from './BusinessAnalysis.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-analysis-tabpanel-${index}`}
      aria-labelledby={`business-analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BusinessAnalysis() {
  const [tabValue, setTabValue] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const methods = useForm<BusinessAnalysisFormValues>({
    resolver: zodResolver(businessAnalysisSchema) as any, // Explicit cast to avoid type mismatch
    defaultValues: defaultValues as BusinessAnalysisFormValues, // Explicit cast for safety
    mode: 'onBlur',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: BusinessAnalysisFormValues) => {
    const results = calculateAnalysisResults(data);
    setAnalysisResults(results);
    setTabValue(1); // Switch to results tab after calculation
  };

  const handleReset = () => {
    reset(defaultValues);
    setAnalysisResults(null);
  };

  return (
    <Container className={styles.container}>
      <Paper elevation={3} className={styles.headerBanner}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={1}>
          <FactoryIcon fontSize="large" />
          <Typography variant="h4" component="h1" className={styles.headerTitle}>
            Thermoforming Plant - 10 Year Business Projection
          </Typography>
        </Box>
        <Typography variant="body1" className={styles.headerSubtitle}>
          Configure production parameters and analyze long-term business performance
        </Typography>
      </Paper>

      <Box className={styles.tabsContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="business analysis tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
            },
            '& .Mui-selected': {
              color: 'var(--primary-main) !important',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--primary-main)',
            },
          }}
        >
          <Tab label="Configure Parameters" />
          <Tab label="View Results" disabled={!analysisResults} />
        </Tabs>
      </Box>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Basic Parameters */}
              <Grid xs={12} className={styles.formSection}>
                <Typography variant="h6" className={styles.sectionTitle}>
                  Basic Parameters
                </Typography>

                <Grid container spacing={3}>
                  <Grid xs={12} md={4}>
                    <Controller
                      name="initialInvestment"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Initial Investment (Crores)"
                          type="number"
                          fullWidth
                          error={!!errors.initialInvestment}
                          helperText={errors.initialInvestment?.message}
                          InputProps={{ inputProps: { step: 0.01 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <Controller
                      name="rawMaterialCostPercent"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Raw Material Cost (%)"
                          type="number"
                          fullWidth
                          error={!!errors.rawMaterialCostPercent}
                          helperText={errors.rawMaterialCostPercent?.message}
                          InputProps={{ inputProps: { min: 0.01, max: 0.99, step: 0.01 } }}
                          value={field.value * 100}
                          onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                          variant="outlined"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <Controller
                      name="rentIncreaseRate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Annual Rent Increase (%)"
                          type="number"
                          fullWidth
                          error={!!errors.rentIncreaseRate}
                          helperText={errors.rentIncreaseRate?.message}
                          InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                          value={field.value * 100}
                          onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                          variant="outlined"
                          size="medium"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Production Setup */}
              <Grid xs={12} className={styles.formSection}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" className={styles.sectionTitle}>
                  Production Setup
                </Typography>

                <Grid container spacing={3}>
                  <Grid xs={12} md={4}>
                    <Controller
                      name="productionSetup.thermoformingMachines"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Thermoforming Machines"
                          type="number"
                          fullWidth
                          error={!!errors.productionSetup?.thermoformingMachines}
                          helperText={errors.productionSetup?.thermoformingMachines?.message}
                          InputProps={{ inputProps: { min: 1, step: 1 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <Controller
                      name="productionSetup.printers"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Printers"
                          type="number"
                          fullWidth
                          error={!!errors.productionSetup?.printers}
                          helperText={errors.productionSetup?.printers?.message}
                          InputProps={{ inputProps: { min: 1, step: 1 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={12} md={4}>
                    <Controller
                      name="productionSetup.sheetlines"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Sheetlines"
                          type="number"
                          fullWidth
                          error={!!errors.productionSetup?.sheetlines}
                          helperText={errors.productionSetup?.sheetlines?.message}
                          InputProps={{ inputProps: { min: 1, step: 1 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Production Capacity */}
                  <Grid xs={12} md={6}>
                    <Controller
                      name="cupsPerDay.thermoforming"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Thermoforming Capacity (Cups/Day/Machine)"
                          type="number"
                          fullWidth
                          error={!!errors.cupsPerDay?.thermoforming}
                          helperText={errors.cupsPerDay?.thermoforming?.message}
                          InputProps={{ inputProps: { min: 1000, step: 1000 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid xs={12} md={6}>
                    <Controller
                      name="cupsPerDay.printing"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Printing Capacity (Cups/Day/Printer)"
                          type="number"
                          fullWidth
                          error={!!errors.cupsPerDay?.printing}
                          helperText={errors.cupsPerDay?.printing?.message}
                          InputProps={{ inputProps: { min: 1000, step: 1000 } }}
                          variant="outlined"
                          size="medium"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-main)',
                              },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                              color: 'var(--primary-main)',
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Advanced Settings */}
              <Grid xs={12} sx={{ mt: 2 }}>
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
                              fullWidth
                              error={!!errors.pricePerCup?.sudha}
                              helperText={errors.pricePerCup?.sudha?.message}
                              InputProps={{ inputProps: { min: 0.1, step: 0.01 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.pricePerCup?.local}
                              helperText={errors.pricePerCup?.local?.message}
                              InputProps={{ inputProps: { min: 0.1, step: 0.01 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.mixRatio?.sudha}
                              helperText={errors.mixRatio?.sudha?.message}
                              InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.mixRatio?.local}
                              helperText={errors.mixRatio?.local?.message}
                              InputProps={{ inputProps: { min: 0, max: 1, step: 0.1 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

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
                              fullWidth
                              error={!!errors.fixedCostsMonthly?.rent}
                              helperText={errors.fixedCostsMonthly?.rent?.message}
                              InputProps={{ inputProps: { min: 0, step: 1000 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.fixedCostsMonthly?.electricity}
                              helperText={errors.fixedCostsMonthly?.electricity?.message}
                              InputProps={{ inputProps: { min: 0, step: 1000 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.fixedCostsMonthly?.maintenance}
                              helperText={errors.fixedCostsMonthly?.maintenance?.message}
                              InputProps={{ inputProps: { min: 0, step: 1000 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.fixedCostsMonthly?.manpower}
                              helperText={errors.fixedCostsMonthly?.manpower?.message}
                              InputProps={{ inputProps: { min: 0, step: 1000 } }}
                              variant="outlined"
                              size="medium"
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

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
                      {Object.keys(defaultValues.seasonalCapacity).map((month) => (
                        <Grid xs={6} sm={4} md={2} key={month}>
                          <Controller
                            name={`seasonalCapacity.${month}` as any}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={month.charAt(0).toUpperCase() + month.slice(1)}
                                type="number"
                                fullWidth
                                error={!!errors.seasonalCapacity?.[month as keyof typeof errors.seasonalCapacity]}
                                helperText={
                                  errors.seasonalCapacity?.[month as keyof typeof errors.seasonalCapacity]?.message
                                }
                                InputProps={{ inputProps: { min: 0.1, max: 1, step: 0.05 } }}
                                value={field.value * 100}
                                onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                                variant="outlined"
                                size="medium"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'var(--primary-main)',
                                    },
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--primary-main)',
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

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
                              fullWidth
                              error={!!errors.growthRates?.price}
                              helperText={errors.growthRates?.price?.message}
                              InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                              value={field.value * 100}
                              onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                              variant="outlined"
                              size="medium"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.growthRates?.rawMaterial}
                              helperText={errors.growthRates?.rawMaterial?.message}
                              InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                              value={field.value * 100}
                              onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                              variant="outlined"
                              size="medium"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                              fullWidth
                              error={!!errors.growthRates?.fixedCosts}
                              helperText={errors.growthRates?.fixedCosts?.message}
                              InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                              value={field.value * 100}
                              onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                              variant="outlined"
                              size="medium"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px',
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'var(--primary-main)',
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                  color: 'var(--primary-main)',
                                },
                              }}
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
                                fullWidth
                                value={field.value * 100}
                                onChange={(e) => field.onChange(Number(e.target.value) / 100)}
                                InputProps={{ inputProps: { min: 0, max: 50, step: 0.1 } }}
                                variant="outlined"
                                size="small"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'var(--primary-main)',
                                    },
                                  },
                                  '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--primary-main)',
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid xs={12} className={styles.buttonContainer}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<CalculateIcon />}
                  className={styles.primaryButton}
                  sx={{
                    backgroundColor: 'var(--primary-main)',
                    '&:hover': {
                      backgroundColor: 'var(--primary-dark)',
                    },
                  }}
                >
                  Calculate Projection
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size="large"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  className={styles.secondaryButton}
                  sx={{
                    color: 'var(--primary-main)',
                    borderColor: 'var(--primary-main)',
                    '&:hover': {
                      backgroundColor: 'var(--primary-lighter)',
                      borderColor: 'var(--primary-main)',
                    },
                  }}
                >
                  Reset Values
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {analysisResults && (
              <>
                <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Business Projection Summary
                </Typography>

                <div className={styles.resultsSummary}>
                  <div className={styles.summaryCard}>
                    <Typography className={styles.cardLabel}>Total 10-Year Revenue</Typography>
                    <Typography className={styles.cardValue}>₹{analysisResults.totalRevenue}Cr</Typography>
                  </div>

                  <div className={styles.summaryCard}>
                    <Typography className={styles.cardLabel}>Total 10-Year Profit</Typography>
                    <Typography className={styles.cardValue}>₹{analysisResults.totalProfit}Cr</Typography>
                  </div>

                  <div className={styles.summaryCard}>
                    <Typography className={styles.cardLabel}>Average Annual ROI</Typography>
                    <Typography className={styles.cardValue}>{analysisResults.avgROI}%</Typography>
                  </div>

                  <div className={styles.summaryCard}>
                    <Typography className={styles.cardLabel}>Payback Period</Typography>
                    <Typography className={styles.cardValue}>{analysisResults.paybackPeriod} Years</Typography>
                  </div>
                </div>

                {/* Key Assumptions */}
                <div className={styles.keyInsightsPanel}>
                  <Typography variant="h6" className={styles.insightTitle}>
                    🔍 Key Business Assumptions
                  </Typography>
                  <div className={styles.insightGrid}>
                    <div>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Production Setup:
                      </Typography>
                      <Typography variant="body2">
                        • Thermoforming Machines: {methods.getValues().productionSetup.thermoformingMachines}
                        <br />• Printers: {methods.getValues().productionSetup.printers}
                        <br />• Sheetlines: {methods.getValues().productionSetup.sheetlines}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Seasonal Variations:
                      </Typography>
                      <Typography variant="body2">
                        • Aug, Sep, Nov: {methods.getValues().seasonalCapacity.aug * 100}% capacity
                        <br />
                        • Other months: 85% capacity
                        <br />• Peak months (Apr-Jun): {methods.getValues().seasonalCapacity.apr * 100}% capacity
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Cost Escalations:
                      </Typography>
                      <Typography variant="body2">
                        • Rent: {methods.getValues().rentIncreaseRate * 100}% annually from October
                        <br />• Raw materials: {methods.getValues().growthRates.rawMaterial * 100}% annually
                        <br />• Labor: {methods.getValues().growthRates.fixedCosts * 100}% annually
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Revenue Growth:
                      </Typography>
                      <Typography variant="body2">
                        • Price increase: {methods.getValues().growthRates.price * 100}% annually
                        <br />• Market expansion: {methods.getValues().growthRates.volume[1] * 100}% Y2-Y5
                        <br />• Mature growth: {methods.getValues().growthRates.volume[5] * 100}% Y6-Y10
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Yearly Projections */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  📊 10-Year Revenue & Profit Projection
                </Typography>

                <div className={styles.tableContainer}>
                  <Table size="small">
                    <TableHead className={styles.tableHeader}>
                      <TableRow>
                        <TableCell className={styles.tableHeaderCell}>Year</TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Monthly Avg Cups
                          <br />
                          (Thousands)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Annual Revenue
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Raw Material Cost
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Fixed Costs
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Total Costs
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Gross Profit
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Net Profit
                          <br />
                          (₹ Crores)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Profit Margin
                          <br />
                          (%)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Cumulative Profit
                          <br />
                          (₹ Crores)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysisResults.yearlyProjections.map((projection) => (
                        <TableRow
                          key={projection.year}
                          hover
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: 'var(--bg-light-gray)' } }}
                        >
                          <TableCell component="th" scope="row" className={styles.yearColumn}>
                            Year {projection.year}
                          </TableCell>
                          <TableCell align="right">{projection.monthlyAvgCups.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                            ₹{projection.annualRevenue}
                          </TableCell>
                          <TableCell align="right">₹{projection.rawMaterialCost}</TableCell>
                          <TableCell align="right">₹{projection.fixedCosts}</TableCell>
                          <TableCell align="right">₹{projection.totalCosts}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                            ₹{projection.grossProfit}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={
                              parseFloat(projection.netProfit) >= 0 ? styles.positiveValue : styles.negativeValue
                            }
                          >
                            ₹{projection.netProfit}
                          </TableCell>
                          <TableCell align="right">{projection.profitMargin}%</TableCell>
                          <TableCell
                            align="right"
                            className={
                              parseFloat(projection.cumulativeProfit) >= 0 ? styles.positiveValue : styles.negativeValue
                            }
                          >
                            ₹{projection.cumulativeProfit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Monthly Breakdown */}
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  📈 Monthly Breakdown - Year 1
                </Typography>

                <div className={styles.tableContainer}>
                  <Table size="small">
                    <TableHead className={styles.tableHeader}>
                      <TableRow>
                        <TableCell className={styles.tableHeaderCell}>Month</TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Capacity %
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Cups Produced
                          <br />
                          (Thousands)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Revenue
                          <br />
                          (₹ Lakhs)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Costs
                          <br />
                          (₹ Lakhs)
                        </TableCell>
                        <TableCell align="right" className={styles.tableHeaderCell}>
                          Net Profit
                          <br />
                          (₹ Lakhs)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysisResults.monthlyData.map((month) => (
                        <TableRow
                          key={month.month}
                          hover
                          sx={{ '&:nth-of-type(odd)': { backgroundColor: 'var(--bg-light-gray)' } }}
                        >
                          <TableCell component="th" scope="row" className={styles.yearColumn}>
                            {month.month}
                          </TableCell>
                          <TableCell align="right">{month.capacity}%</TableCell>
                          <TableCell align="right">{month.cupsProduced.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500, color: 'var(--success)' }}>
                            ₹{month.revenue}
                          </TableCell>
                          <TableCell align="right">₹{month.costs}</TableCell>
                          <TableCell
                            align="right"
                            className={parseFloat(month.netProfit) >= 0 ? styles.positiveValue : styles.negativeValue}
                          >
                            ₹{month.netProfit}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Calculation Methodology */}
                <div className={styles.methodologyCard}>
                  <Typography variant="h6" className={styles.methodologyTitle}>
                    🧮 Calculation Methodology
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body1">
                      <strong>Revenue Calculation:</strong> Monthly Cups × Average Selling Price (₹
                      {methods.getValues().pricePerCup.sudha} Sudha + ₹{methods.getValues().pricePerCup.local} Local)
                    </Typography>
                    <Typography variant="body1">
                      <strong>Seasonal Adjustments:</strong> August, September, November at 70% | Peak Summer (Apr-Jun)
                      at 95% | Others at 85%
                    </Typography>
                    <Typography variant="body1">
                      <strong>Cost Structure:</strong> Raw Materials ({methods.getValues().rawMaterialCostPercent * 100}
                      % of revenue) + Fixed Costs (Rent, Utilities, Labor, Maintenance)
                    </Typography>
                    <Typography variant="body1">
                      <strong>Growth Assumptions:</strong> Conservative market expansion with realistic seasonal
                      fluctuations
                    </Typography>
                  </Stack>
                </div>

                {/* Key Insights */}
                <div className={styles.finalInsights}>
                  <Typography variant="h6" className={styles.finalInsightsTitle}>
                    💡 Key Insights:
                  </Typography>
                  <Typography variant="body1">
                    • Break-even expected in Month 8-10 of operations
                    <br />
                    • Peak profitability during summer months (ice cream season)
                    <br />
                    • Dahi cups provide steady base demand throughout the year
                    <br />• Equipment investment recovers within {analysisResults.paybackPeriod} years
                    <br />• Strong cash flow generation post Year 2
                  </Typography>
                </div>

                <div className={styles.buttonContainer}>
                  <Button
                    type="button"
                    variant="contained"
                    size="large"
                    onClick={() => setTabValue(0)}
                    className={styles.primaryButton}
                    sx={{
                      backgroundColor: 'var(--primary-main)',
                      '&:hover': {
                        backgroundColor: 'var(--primary-dark)',
                      },
                    }}
                  >
                    Edit Parameters
                  </Button>
                </div>
              </>
            )}
          </TabPanel>
        </Box>
      </FormProvider>
    </Container>
  );
}
