import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalculateIcon from '@mui/icons-material/Calculate';
import FactoryIcon from '@mui/icons-material/Factory';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Container, Paper, Typography, Tabs, Tab, Box } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';

import { calculateMinimumSalesSupportPrice, MinimumSalesSupportPriceResult } from './calculations';
import { CupTypeManager } from './components/CupTypeManager';
import { ExpenseManager } from './components/ExpenseManager';
import { ResultsDisplay } from './components/ResultsDisplay';
import { TabPanel } from './components/TabPanel';
import styles from './MinimumSalesSupportPrice.module.css';
import { minimumSalesSupportPriceSchema, defaultValues, MinimumSalesSupportPriceFormValues } from './schema';
import { Button } from '../../components/ui';

export default function MinimumSalesSupportPrice() {
  const [tabValue, setTabValue] = useState(0);
  const [results, setResults] = useState<MinimumSalesSupportPriceResult | null>(null);

  const methods = useForm<MinimumSalesSupportPriceFormValues>({
    resolver: zodResolver(minimumSalesSupportPriceSchema) as any,
    defaultValues: defaultValues as MinimumSalesSupportPriceFormValues,
    mode: 'onBlur',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: MinimumSalesSupportPriceFormValues) => {
    const calculationResults = calculateMinimumSalesSupportPrice(data);
    setResults(calculationResults);
    setTabValue(2); // Switch to results tab
  };

  const handleReset = () => {
    methods.reset(defaultValues);
    setResults(null);
    setTabValue(0);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box className={styles.header} sx={{ backgroundColor: '#f5f5f5', py: 3 }}>
          <Typography variant="h4" className={styles.headerTitle}>
            <FactoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Minimum Sales Support Price Calculator
          </Typography>
          <Typography variant="body1" className={styles.headerSubtitle}>
            Calculate cost-per-cup, profit margins, and minimum viable pricing for your thermoforming plant
          </Typography>
        </Box>

        {/* Tabs */}
        <Box className={styles.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            <Tab
              label="Expenses"
              icon={<AssessmentIcon />}
              iconPosition="start"
              id="tab-0"
              aria-controls="tabpanel-0"
            />
            <Tab
              label="Cup Types & Production"
              icon={<FactoryIcon />}
              iconPosition="start"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label="Results & Analysis"
              icon={<CalculateIcon />}
              iconPosition="start"
              id="tab-2"
              aria-controls="tabpanel-2"
              disabled={!results}
            />
          </Tabs>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* Expenses Tab */}
            <TabPanel value={tabValue} index={0}>
              <ExpenseManager />
            </TabPanel>

            {/* Cup Types Tab */}
            <TabPanel value={tabValue} index={1}>
              <CupTypeManager />
            </TabPanel>

            {/* Results Tab */}
            <TabPanel value={tabValue} index={2}>
              {results ? (
                <ResultsDisplay results={results} />
              ) : (
                <Paper className={styles.emptyState}>
                  <Typography variant="h6" color="textSecondary">
                    No results available
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Please complete the expense and cup type information, then calculate to see results.
                  </Typography>
                </Paper>
              )}
            </TabPanel>

            {/* Action Buttons */}
            <Box className={styles.actionButtons} sx={{ pb: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<CalculateIcon />}
                size="large"
                disabled={methods.formState.isSubmitting}
                sx={{
                  minWidth: '200px',
                  fontSize: '1.1rem',
                  py: 1.5,
                  background: 'linear-gradient(135deg, #2c6cb0 0%, #1d4c82 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4c82 0%, #14355c 100%)',
                  },
                }}
              >
                {methods.formState.isSubmitting ? 'Calculating...' : 'Calculate Analysis'}
              </Button>

              <Button
                type="button"
                variant="outlined"
                startIcon={<RestartAltIcon />}
                size="large"
                onClick={handleReset}
                sx={{
                  minWidth: '160px',
                  fontSize: '1.1rem',
                  py: 1.5,
                  borderColor: '#f44336',
                  color: '#f44336',
                  borderWidth: '2px',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#f44336',
                    borderColor: '#f44336',
                    color: 'white',
                    borderWidth: '2px',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Reset All Data
              </Button>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
}
