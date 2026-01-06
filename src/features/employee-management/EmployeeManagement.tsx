import { useState } from 'react';
import { Typography, Button, Card, CardContent, Alert, Tabs, Tab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import HistoryIcon from '@mui/icons-material/History';
import styles from './EmployeeManagement.module.css';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import AttendanceTracker from './components/AttendanceTracker';
import PayrollView from './components/PayrollView';
import PaymentHistory from './components/PaymentHistory';
import { EmployeeFormData } from './schema';
import { employeeApi, Employee } from '../../api/employeeApi';

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
      id={`employee-tabpanel-${index}`}
      aria-labelledby={`employee-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => setRefreshTrigger((prev) => prev + 1);

  const handleCreate = () => {
    setFormMode('create');
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setFormMode('edit');
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);

      if (formMode === 'create') {
        await employeeApi.create({
          ...data,
          joining_date: data.joining_date.toISOString().split('T')[0],
          termination_date: data.termination_date ? data.termination_date.toISOString().split('T')[0] : undefined,
        });
        setSuccess('Employee created successfully');
      } else if (selectedEmployee) {
        await employeeApi.update(selectedEmployee.id!, {
          ...data,
          joining_date: data.joining_date.toISOString().split('T')[0],
          termination_date: data.termination_date ? data.termination_date.toISOString().split('T')[0] : undefined,
        });
        setSuccess('Employee updated successfully');
      }
      setFormOpen(false);
      refreshData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleStatusUpdate = async (
    employeeId: number,
    status: 'active' | 'inactive' | 'terminated',
    reason?: string,
  ) => {
    try {
      setError(null);
      await employeeApi.updateStatus(employeeId, status, reason);
      setSuccess(`Employee status updated to ${status}`);
      refreshData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await employeeApi.delete(id);
      setSuccess('Employee deleted successfully');
      refreshData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          Employee Management
        </Typography>
        {activeTab === 0 && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            Add Employee
          </Button>
        )}
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<GroupIcon />} label="Employees" />
            <Tab icon={<EventNoteIcon />} label="Attendance" />
            <Tab icon={<PaymentIcon />} label="Payroll" />
            <Tab icon={<HistoryIcon />} label="Payment History" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <EmployeeList
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusUpdate={handleStatusUpdate}
              refresh={refreshTrigger}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <AttendanceTracker
              refresh={refreshTrigger}
              onSuccess={() => {
                setSuccess('Attendance updated successfully');
                setTimeout(() => setSuccess(null), 3000);
              }}
              onError={(msg) => setError(msg)}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <PayrollView
              refresh={refreshTrigger}
              onSuccess={(msg) => {
                setSuccess(msg);
                setTimeout(() => setSuccess(null), 3000);
              }}
              onError={(msg) => setError(msg)}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <PaymentHistory refresh={refreshTrigger} />
          </TabPanel>
        </CardContent>
      </Card>

      <EmployeeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedEmployee}
        mode={formMode}
      />
    </div>
  );
}
