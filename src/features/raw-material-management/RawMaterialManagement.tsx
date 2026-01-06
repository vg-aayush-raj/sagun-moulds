import { useState, useEffect } from 'react';
import { Typography, Tabs, Tab, Box, Card, CardContent } from '@mui/material';
import FilteredSummary from './components/FilteredSummary';
import MaterialEntryForm from './components/MaterialEntryForm';
import StockBalanceView from './components/StockBalanceView';
import StockManager from './components/StockManager';
import TransactionHistory from './components/TransactionHistory';
import styles from './RawMaterialManagement.module.css';
import { rawMaterialApi, StockBalance } from '../../api/rawMaterialApi';
import { useAppContext } from '../../context/AppContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function RawMaterialManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    loadStockBalances();
  }, [refreshTrigger]);

  const loadStockBalances = async () => {
    try {
      const balances = await rawMaterialApi.getStockBalance();
      setStockBalances(balances);
    } catch (error) {
      console.error('Failed to load stock balances:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Raw Material Management
      </Typography>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Material Entry" />
            <Tab label="Stock Operations" />
            <Tab label="Stock Balance" />
            <Tab label="Transaction History" />
            <Tab label="Summary & Reports" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <MaterialEntryForm onSuccess={refreshData} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <StockManager onSuccess={refreshData} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <StockBalanceView stockBalances={stockBalances} onRefresh={refreshData} />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <TransactionHistory />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <FilteredSummary />
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
}
