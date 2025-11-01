import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import styles from './BreakEvenCalculator.module.css';
import { calculateBreakEven, type BreakEvenResults } from './calculations';
import CostManager from './components/CostManager';
import GSTScenarioManager from './components/GSTScenarioManager';
import ResultsDisplay from './components/ResultsDisplay';
import TargetPriceManager from './components/TargetPriceManager';
import {
  breakEvenSchema,
  defaultValues,
  type BreakEvenFormValues,
  createNewCostEntry,
  createNewGSTScenario,
  createNewTargetPriceScenario,
} from './schema';
import { Grid, TextField, Button } from '../../components/ui';

// Define these outside component to prevent recreation on every render
const numberInputProps = {
  step: 'any',
  style: { MozAppearance: 'textfield' as const },
};

const hideSpinnerSx = {
  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
    display: 'none',
  },
};

const BreakEvenCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [results, setResults] = useState<BreakEvenResults | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BreakEvenFormValues>({
    resolver: zodResolver(breakEvenSchema),
    defaultValues,
    mode: 'onChange',
  });

  const costFields = useFieldArray({
    control,
    name: 'costs',
  });

  const gstScenarioFields = useFieldArray({
    control,
    name: 'gstScenarios',
  });

  const targetPriceFields = useFieldArray({
    control,
    name: 'targetPriceScenarios',
  });

  // Watch specific fields instead of all values to prevent unnecessary re-renders
  const materialCostPerKg = watch('materialCostPerKg');
  const cupWeightGrams = watch('cupWeightGrams');
  const costs = watch('costs');
  const gstScenarios = watch('gstScenarios');
  const targetPriceScenarios = watch('targetPriceScenarios');

  // Auto-calculate when specific values change
  useEffect(() => {
    try {
      const formValues: BreakEvenFormValues = {
        materialCostPerKg,
        cupWeightGrams,
        costs,
        gstScenarios,
        targetPriceScenarios,
      };
      const calculatedResults = calculateBreakEven(formValues);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Calculation error:', error);
      setResults(null);
    }
  }, [materialCostPerKg, cupWeightGrams, costs, gstScenarios, targetPriceScenarios]);

  const onSubmit = (data: BreakEvenFormValues) => {
    try {
      const calculatedResults = calculateBreakEven(data);
      setResults(calculatedResults);
      setActiveTab(4); // Switch to results tab
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setResults(null);
  };

  const addCost = () => {
    costFields.append(createNewCostEntry());
  };

  const addGSTScenario = () => {
    gstScenarioFields.append(createNewGSTScenario());
  };

  const addTargetPrice = () => {
    targetPriceFields.append(createNewTargetPriceScenario());
  };

  const tabs = [
    { label: 'Basic Parameters', icon: '⚙️' },
    { label: 'Cost Items', icon: '💰' },
    { label: 'GST Scenarios', icon: '📊' },
    { label: 'Target Prices', icon: '🎯' },
    { label: 'Results', icon: '📈' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Break-Even Calculator with GST</h1>
        <p className={styles.subtitle}>
          Calculate break-even selling prices and quantities with dynamic cost items and GST scenarios
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
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {/* Basic Parameters Tab */}
          {activeTab === 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Basic Parameters</h2>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="materialCostPerKg"
                    control={control}
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <TextField
                        name={name}
                        value={value}
                        onBlur={onBlur}
                        label="Material Cost (₹/kg)"
                        type="number"
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                        }}
                        error={!!errors.materialCostPerKg}
                        helperText={errors.materialCostPerKg?.message || 'Raw material cost per kilogram'}
                        fullWidth
                        inputProps={numberInputProps}
                        sx={hideSpinnerSx}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="cupWeightGrams"
                    control={control}
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <TextField
                        name={name}
                        value={value}
                        onBlur={onBlur}
                        label="Cup Weight (grams)"
                        type="number"
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === '' ? 0 : Number(val));
                        }}
                        error={!!errors.cupWeightGrams}
                        helperText={errors.cupWeightGrams?.message || 'Weight of a single cup in grams'}
                        fullWidth
                        inputProps={numberInputProps}
                        sx={hideSpinnerSx}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </div>
          )}

          {/* Cost Items Tab */}
          {activeTab === 1 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Infrastructure Cost Items</h2>
                <Button type="button" onClick={addCost} variant="contained" size="small">
                  + Add Cost Item
                </Button>
              </div>
              <p className={styles.sectionDescription}>
                Add all your infrastructure costs (Rent, EMI, Employee salaries, Electricity, etc.)
              </p>
              <CostManager fields={costFields.fields} control={control} onRemove={costFields.remove} errors={errors} />
            </div>
          )}

          {/* GST Scenarios Tab */}
          {activeTab === 2 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>GST Rate Scenarios</h2>
                <Button type="button" onClick={addGSTScenario} variant="contained" size="small">
                  + Add GST Scenario
                </Button>
              </div>
              <p className={styles.sectionDescription}>Define different GST rates to compare (e.g., 18%, 9%, 0%)</p>
              <GSTScenarioManager
                fields={gstScenarioFields.fields}
                control={control}
                onRemove={gstScenarioFields.remove}
                errors={errors}
              />
            </div>
          )}

          {/* Target Prices Tab */}
          {activeTab === 3 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Target Selling Prices</h2>
                <Button type="button" onClick={addTargetPrice} variant="contained" size="small">
                  + Add Target Price
                </Button>
              </div>
              <p className={styles.sectionDescription}>
                Set different target selling prices to analyze (e.g., ₹340/kg, ₹280/kg)
              </p>
              <TargetPriceManager
                fields={targetPriceFields.fields}
                control={control}
                onRemove={targetPriceFields.remove}
                errors={errors}
              />
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 4 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Break-Even Analysis Results</h2>
              {results ? (
                <ResultsDisplay results={results} />
              ) : (
                <div className={styles.noResults}>
                  <p>No results available. Please ensure all fields are filled correctly.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.actionBar}>
          <Button type="button" onClick={handleReset} variant="outlined">
            Reset to Defaults
          </Button>
          <Button type="submit" variant="contained">
            Recalculate
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BreakEvenCalculator;
