import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import CalculateIcon from '@mui/icons-material/Calculate';
import FactoryIcon from '@mui/icons-material/Factory';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Box, Container, Paper, Tabs, Tab, Typography } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';

import styles from './BusinessAnalysis.module.css';
import { calculateAnalysisResults, AnalysisResult } from './calculations';

// Import modular components
import { BusinessInsights } from './components/BusinessInsights';
import { ExpansionInsights } from './components/ExpansionInsights';
import { FinalInsights } from './components/FinalInsights';
import { FinancingDetailsSection } from './components/FinancingDetailsSection';
import { FixedCostsSection } from './components/FixedCostsSection';
import { GrowthRatesSection } from './components/GrowthRatesSection';
import { MachineryDetailsSection } from './components/MachineryDetailsSection';
import { MonthlyDataTable } from './components/MonthlyDataTable';
import { PricingParametersSection } from './components/PricingParametersSection';
import { ProductionSetupSection } from './components/ProductionSetupSection';
import { ResultsSummary } from './components/ResultsSummary';
import { SeasonalCapacitySection } from './components/SeasonalCapacitySection';
import { TabPanel } from './components/TabPanel';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { businessAnalysisSchema, defaultValues, BusinessAnalysisFormValues } from './schema';
import { Grid, Button } from '../../components/ui';

export default function BusinessAnalysis() {
  const [tabValue, setTabValue] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  const methods = useForm<BusinessAnalysisFormValues>({
    resolver: zodResolver(businessAnalysisSchema) as any, // Explicit cast to avoid type mismatch
    defaultValues: defaultValues as BusinessAnalysisFormValues, // Explicit cast for safety
    mode: 'onBlur',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: BusinessAnalysisFormValues) => {
    const results = calculateAnalysisResults(data);
    setAnalysisResults(results);
    setTabValue(1); // Switch to results tab after calculation
  };

  const handleReset = () => {
    methods.reset(defaultValues);
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
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {' '}
              {/* Form sections */}
              <FinancingDetailsSection />
              <ProductionSetupSection />
              {/* Advanced Settings */}
              <Grid xs={12} sx={{ mt: 2 }}>
                <MachineryDetailsSection />
                <PricingParametersSection />
                <FixedCostsSection />
                <SeasonalCapacitySection />
                <GrowthRatesSection />
              </Grid>
              {/* Action buttons */}
              <Grid xs={12} className={styles.buttonContainer}>
                <Button type="submit" size="large" startIcon={<CalculateIcon />} buttonType="primary">
                  Calculate Projection
                </Button>
                <Button
                  type="button"
                  size="large"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  buttonType="secondary"
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
                </Typography>{' '}
                {/* Results sections */}
                <ResultsSummary results={analysisResults} />
                <BusinessInsights />
                <ExpansionInsights
                  expansionYear={analysisResults.expansionYear}
                  expansionMonth={analysisResults.expansionMonth}
                  secondExpansionYear={analysisResults.secondExpansionYear}
                  secondExpansionMonth={analysisResults.secondExpansionMonth}
                  thirdExpansionYear={analysisResults.thirdExpansionYear}
                  thirdExpansionMonth={analysisResults.thirdExpansionMonth}
                  loanClosureYear={analysisResults.loanClosureYear}
                  loanClosureMonth={analysisResults.loanClosureMonth}
                  monthlyEMI={analysisResults.monthlyEMI}
                />
                <YearlyProjectionsTable results={analysisResults} />
                <MonthlyDataTable results={analysisResults} />
                <FinalInsights paybackPeriod={analysisResults.paybackPeriod} />
                <div className={styles.buttonContainer}>
                  <Button type="button" size="large" onClick={() => setTabValue(0)} buttonType="primary">
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
