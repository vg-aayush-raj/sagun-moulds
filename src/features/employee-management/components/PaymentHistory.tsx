import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, TextField, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { payrollApi, PaymentRecord } from '../../../api/payrollApi';

interface PaymentHistoryProps {
  refresh: number;
}

export default function PaymentHistory({ refresh }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    fetchPayments();
  }, [refresh, startDate, endDate]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) {
        params.start_date = startDate.format('YYYY-MM-DD');
      }
      if (endDate) {
        params.end_date = endDate.format('YYYY-MM-DD');
      }

      const data = await payrollApi.listPayments(params);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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
      headerName: 'Employee Name',
      flex: 1,
      minWidth: 180,
      valueGetter: (value, row) => row.employee?.name || '-',
    },
    {
      field: 'payment_date',
      headerName: 'Payment Date',
      width: 130,
      valueFormatter: (value) => (value ? new Date(value).toLocaleDateString('en-IN') : ''),
    },
    {
      field: 'amount_paid',
      headerName: 'Amount Paid',
      width: 140,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      field: 'payment_method',
      headerName: 'Payment Method',
      width: 150,
      renderCell: (params) => <span style={{ textTransform: 'capitalize' }}>{params.value?.replace('_', ' ')}</span>,
    },
    {
      field: 'transaction_reference',
      headerName: 'Reference',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'notes',
      headerName: 'Notes',
      flex: 1,
      minWidth: 200,
    },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            slotProps={{ textField: { fullWidth: true } }}
          />
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
              Payment History
            </Typography>
            <DataGrid
              rows={payments}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              disableRowSelectionOnClick
              autoHeight
            />
            {payments.length > 0 && (
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Typography variant="h6">
                  Total Paid: ₹{payments.reduce((sum, p) => sum + Number(p.amount_paid), 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
