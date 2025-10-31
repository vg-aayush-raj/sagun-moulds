import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalculateIcon from '@mui/icons-material/Calculate';
import FactoryIcon from '@mui/icons-material/Factory';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Container, Paper, Typography, Tabs, Tab, Box } from '@mui/material';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';

import { calculateCupPrice, CupPriceCalculatorResult } from './calculations';
import { ExpenseManager } from './components/ExpenseManager';
import { GSTManager } from './components/GSTManager';
import { MonthlyProductionInput } from './components/MonthlyProductionInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { TabPanel } from './components/TabPanel';
import styles from './CupPriceCalculator.module.css';
import {
  cupPriceCalculatorSchema,
  defaultValues,
  CupPriceCalculatorFormValues,
  createNewExpenseEntry,
  createNewGSTRateEntry,
} from './schema';
import { Button } from '../../components/ui';

export default function CupPriceCalculator() {
  const [tabValue, setTabValue] = useState(0);
  const [results, setResults] = useState<CupPriceCalculatorResult | null>(null);

  const methods = useForm<CupPriceCalculatorFormValues>({
    resolver: zodResolver(cupPriceCalculatorSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { control, handleSubmit, watch, reset } = methods;

  const expenseFields = useFieldArray({
    control,
    name: 'expenses',
  });

  const gstRateFields = useFieldArray({
    control,
    name: 'gstRates',
  });

  // Watch all form values for auto-calculation
  const formValues = watch();

  // Auto-calculate when form values change
  useEffect(() => {
    try {
      const calculatedResults = calculateCupPrice(formValues);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
    }
  }, [formValues]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const onSubmit = (data: CupPriceCalculatorFormValues) => {
    try {
      const calculatedResults = calculateCupPrice(data);
      setResults(calculatedResults);
      setTabValue(3); // Switch to results tab
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setResults(null);
    setTabValue(0);
  };

  const addExpense = () => {
    expenseFields.append(createNewExpenseEntry());
  };

  const addGSTRate = () => {
    gstRateFields.append(createNewGSTRateEntry());
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Header */}
        <Box className={styles.header} sx={{ backgroundColor: '#f5f5f5', py: 3 }}>
          <Typography variant="h4" className={styles.headerTitle}>
            <AttachMoneyIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Cup Price Calculator
          </Typography>
          <Typography variant="body1" className={styles.headerSubtitle}>
            Calculate the price per cup based on monthly production with custom GST rates
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
              label="Production & Material"
              icon={<FactoryIcon />}
              iconPosition="start"
              id="tab-1"
              aria-controls="tabpanel-1"
            />
            <Tab
              label="GST Configuration"
              icon={<AttachMoneyIcon />}
              iconPosition="start"
              id="tab-2"
              aria-controls="tabpanel-2"
            />
            <Tab
              label="Results & Pricing"
              icon={<CalculateIcon />}
              iconPosition="start"
              id="tab-3"
              aria-controls="tabpanel-3"
              disabled={!results}
            />
          </Tabs>
        </Box>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 3 }}>
              {/* Tab Panel 0: Expenses */}
              <TabPanel value={tabValue} index={0}>
                <ExpenseManager fields={expenseFields.fields} onAdd={addExpense} onRemove={expenseFields.remove} />
              </TabPanel>

              {/* Tab Panel 1: Production & Raw Material */}
              <TabPanel value={tabValue} index={1}>
                <MonthlyProductionInput />
              </TabPanel>

              {/* Tab Panel 2: GST Configuration */}
              <TabPanel value={tabValue} index={2}>
                <GSTManager fields={gstRateFields.fields} onAdd={addGSTRate} onRemove={gstRateFields.remove} />
              </TabPanel>

              {/* Tab Panel 3: Results */}
              <TabPanel value={tabValue} index={3}>
                {results && <ResultsDisplay results={results} />}
              </TabPanel>

              {/* Action Buttons */}
              <Box className={styles.buttonContainer}>
                <Button
                  type="button"
                  buttonType="secondary"
                  onClick={handleReset}
                  startIcon={<RestartAltIcon />}
                  sx={{ minWidth: '150px' }}
                >
                  Reset
                </Button>
                <Button type="submit" buttonType="primary" startIcon={<CalculateIcon />} sx={{ minWidth: '150px' }}>
                  Calculate
                </Button>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Container>
  );
}
