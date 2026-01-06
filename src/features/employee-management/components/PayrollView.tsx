import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CalculateIcon from '@mui/icons-material/Calculate';
import { payrollApi, Payroll } from '../../../api/payrollApi';

interface PayrollViewProps {
  refresh: number;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export default function PayrollView({ refresh, onSuccess, onError }: PayrollViewProps) {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pendingPayments, setPendingPayments] = useState<Payroll[]>([]);
  const [shouldNotify, setShouldNotify] = useState(false);

  useEffect(() => {
    fetchPayrolls();
    fetchPendingPayments();
  }, [refresh, selectedMonth, selectedYear]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const data = await payrollApi.list({
        month: selectedMonth,
        year: selectedYear,
      });
      setPayrolls(data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const data = await payrollApi.getPendingPayments();
      setPendingPayments(data.pending_payments);
      setShouldNotify(data.should_notify);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
    }
  };

  const handleCalculatePayroll = async () => {
    try {
      setCalculating(true);
      const result = await payrollApi.calculatePayrollForAll(selectedMonth, selectedYear);
      onSuccess(`Payroll calculated for ${result.count} employees`);
      fetchPayrolls();
      fetchPendingPayments();
    } catch (error: any) {
      onError(error.response?.data?.error || 'Error calculating payroll');
    } finally {
      setCalculating(false);
    }
  };

  const getStatusColor = (status: string): 'default' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'calculated':
        return 'info';
      case 'approved':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'employee.employee_id',
      headerName: 'Employee ID',
      width: 120,
      valueGetter: (value, row) => row.employee?.employee_id || '-',
    },
    {
      field: 'employee.name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.employee?.name || '-',
    },
    {
      field: 'base_salary',
      headerName: 'Base Salary',
      width: 120,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      field: 'days_present',
      headerName: 'Days Present',
      width: 120,
    },
    {
      field: 'days_absent',
      headerName: 'Days Absent',
      width: 120,
    },
    {
      field: 'total_hours_worked',
      headerName: 'Hours Worked',
      width: 130,
      valueFormatter: (value) => Number(value).toFixed(2),
    },
    {
      field: 'gross_salary',
      headerName: 'Gross Salary',
      width: 130,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      field: 'deductions',
      headerName: 'Deductions',
      width: 120,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      field: 'net_salary',
      headerName: 'Net Salary',
      width: 130,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
      cellClassName: 'font-bold',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
  ];

  return (
    <Box>
      {shouldNotify && pendingPayments.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Payment Reminder: {pendingPayments.length} pending payment(s) for this month (5th-10th payment window)
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            fullWidth
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', {
                  month: 'long',
                })}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            fullWidth
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={handleCalculatePayroll}
            disabled={calculating}
            fullWidth
            sx={{ height: 56 }}
          >
            {calculating ? 'Calculating...' : 'Calculate Payroll'}
          </Button>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payroll for {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })}{' '}
              {selectedYear}
            </Typography>
            <DataGrid
              rows={payrolls}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              autoHeight
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
