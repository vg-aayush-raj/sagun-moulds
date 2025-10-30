import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import styles from './AdvancedCupCalculator.module.css';
import { calculateAdvancedCupCalculator, AdvancedCupCalculatorResult } from './calculations';
import EnhancedCupTypeManager from './components/EnhancedCupTypeManager';
import ExpenseManager from './components/ExpenseManager';
import LogisticsConfig from './components/LogisticsConfig';
import MarginConfig from './components/MarginConfig';
import ResultsDisplay from './components/ResultsDisplay';
import TabPanel from './components/TabPanel';
import WorkingDaysConfig from './components/WorkingDaysConfig';
import {
  advancedCupCalculatorSchema,
  defaultValues,
  AdvancedCupCalculatorFormValues,
  createNewExpenseEntry,
  createNewEnhancedCupType,
} from './schema';
import { Button } from '../../components/ui/Button';

const AdvancedCupCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<AdvancedCupCalculatorResult | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AdvancedCupCalculatorFormValues>({
    resolver: zodResolver(advancedCupCalculatorSchema),
    defaultValues,
    mode: 'onChange',
  });

  const expenseFields = useFieldArray({
    control,
    name: 'expenses',
  });

  const cupTypeFields = useFieldArray({
    control,
    name: 'cupTypes',
  });

  // Watch specific fields instead of all values to prevent unnecessary re-renders
  const expenses = watch('expenses');
  const cupTypes = watch('cupTypes');
  const logisticsConfig = watch('logisticsConfig');
  const marginConfig = watch('marginConfig');
  const workingDaysConfig = watch('workingDaysConfig');

  // Auto-calculate when specific values change
  useEffect(() => {
    try {
      const formValues: AdvancedCupCalculatorFormValues = {
        expenses,
        cupTypes,
        logisticsConfig,
        marginConfig,
        workingDaysConfig,
      };
      const calculatedResults = calculateAdvancedCupCalculator(formValues);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
    }
  }, [expenses, cupTypes, logisticsConfig, marginConfig, workingDaysConfig]);

  const onSubmit = (data: AdvancedCupCalculatorFormValues) => {
    try {
      const calculatedResults = calculateAdvancedCupCalculator(data);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const addExpense = () => {
    expenseFields.append(createNewExpenseEntry());
  };

  const addCupType = () => {
    cupTypeFields.append(createNewEnhancedCupType());
  };

  const tabs = [
    { label: 'Expenses', icon: '💰' },
    { label: 'Cup Types', icon: '🥤' },
    { label: 'Logistics', icon: '🚚' },
    { label: 'Working Days', icon: '📅' },
    { label: 'Margin & GST', icon: '📊' },
    { label: 'Results', icon: '📈' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Advanced Cup Calculator</h1>
        <p className={styles.subtitle}>
          Calculate comprehensive cup manufacturing costs with GST, logistics, and profit margins
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.tab} ${activeTab === index ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(index)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          <TabPanel value={activeTab} index={0}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Monthly Expenses</h2>
                <Button type="button" onClick={addExpense} variant="outlined">
                  Add Expense
                </Button>
              </div>
              <ExpenseManager
                fields={expenseFields.fields}
                control={control}
                onRemove={expenseFields.remove}
                errors={errors}
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Cup Types & Raw Materials</h2>
                <Button type="button" onClick={addCupType} variant="outlined">
                  Add Cup Type
                </Button>
              </div>
              <EnhancedCupTypeManager
                fields={cupTypeFields.fields}
                control={control}
                onRemove={cupTypeFields.remove}
                errors={errors}
              />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <div className={styles.section}>
              <h2>Logistics & Freight Configuration</h2>
              <LogisticsConfig control={control} errors={errors} />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <div className={styles.section}>
              <h2>Working Days Configuration</h2>
              <WorkingDaysConfig control={control} errors={errors} />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <div className={styles.section}>
              <h2>Margin & GST Configuration</h2>
              <MarginConfig control={control} errors={errors} />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <div className={styles.section}>
              <h2>Calculation Results</h2>
              {results ? (
                <ResultsDisplay results={results} />
              ) : (
                <div className={styles.noResults}>
                  <p>Please fill in the required fields to see results.</p>
                </div>
              )}
            </div>
          </TabPanel>
        </div>

        <div className={styles.actions}>
          <Button type="button" onClick={() => reset(defaultValues)} variant="outlined">
            Reset to Default
          </Button>
          <Button type="submit">Calculate Results</Button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedCupCalculator;
