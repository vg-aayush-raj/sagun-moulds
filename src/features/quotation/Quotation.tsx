import { useState } from 'react';
import { Typography, Tabs, Tab, Box, Card, CardContent } from '@mui/material';
import QuotationForm from './components/QuotationForm';
import QuotationList from './components/QuotationList';
import styles from './Quotation.module.css';

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

export default function Quotation() {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab(1); // Switch to list tab
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Sales Quotation - Thermoforming Cups & Packaging
      </Typography>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Create New Quotation" />
            <Tab label="All Quotations" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <QuotationForm onSuccess={handleSuccess} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <QuotationList refresh={refreshTrigger} />
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
}
