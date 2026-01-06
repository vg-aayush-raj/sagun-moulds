import { useState } from 'react';
import { Typography, Tabs, Tab, Box, Card, CardContent } from '@mui/material';
import GSTCreditCard from './components/GSTCreditCard';
import InvoiceFormRevamped from './components/InvoiceFormRevamped';
import InvoiceList from './components/InvoiceList';
import PaymentTracking from './components/PaymentTracking';
import ReportsDashboard from './components/ReportsDashboard';
import styles from './Invoicing.module.css';

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

export default function Invoicing() {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab(1); // Switch to list tab
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Invoicing & Billing Management
      </Typography>

      <GSTCreditCard />

      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Create Invoice" />
            <Tab label="Invoice List" />
            <Tab label="Payment Tracking" />
            <Tab label="Reports & Analytics" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <InvoiceFormRevamped onSuccess={handleSuccess} />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <InvoiceList refresh={refreshTrigger} />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <PaymentTracking />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <ReportsDashboard />
          </TabPanel>
        </CardContent>
      </Card>
    </div>
  );
}
