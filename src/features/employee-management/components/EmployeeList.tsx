import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowParams, GridActionsCellItem } from '@mui/x-data-grid';
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { employeeApi, Employee } from '../../../api/employeeApi';

interface EmployeeListProps {
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: 'active' | 'inactive' | 'terminated', reason?: string) => void;
  refresh: number;
}

export default function EmployeeList({ onEdit, onDelete, onStatusUpdate, refresh }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [newStatus, setNewStatus] = useState<'active' | 'inactive' | 'terminated'>('active');
  const [terminationReason, setTerminationReason] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeApi.list();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [refresh]);

  const handleStatusChange = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewStatus(employee.status || 'active');
    setTerminationReason('');
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedEmployee) {
      onStatusUpdate(selectedEmployee.id!, newStatus, newStatus === 'terminated' ? terminationReason : undefined);
      setStatusDialogOpen(false);
    }
  };

  const getStatusColor = (status?: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEmployeeTypeColor = (type: string): 'primary' | 'secondary' | 'default' => {
    switch (type) {
      case 'permanent':
        return 'primary';
      case 'contractual':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'employee_id',
      headerName: 'Employee ID',
      width: 120,
      pinned: 'left',
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'employee_type',
      headerName: 'Type',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getEmployeeTypeColor(params.value)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'salary_type',
      headerName: 'Salary Type',
      width: 120,
      renderCell: (params) => <span style={{ textTransform: 'capitalize' }}>{params.value.replace('_', ' ')}</span>,
    },
    {
      field: 'salary_amount',
      headerName: 'Salary',
      width: 120,
      valueFormatter: (value) => `₹${Number(value).toLocaleString('en-IN')}`,
    },
    {
      field: 'phone_number',
      headerName: 'Phone',
      width: 130,
    },
    {
      field: 'joining_date',
      headerName: 'Joining Date',
      width: 120,
      valueFormatter: (value) => (value ? new Date(value).toLocaleDateString('en-IN') : ''),
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
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams<Employee>) => [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => onEdit(params.row)} />,
        <GridActionsCellItem
          icon={<CheckCircleIcon />}
          label="Change Status"
          onClick={() => handleStatusChange(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${params.row.name}?`)) {
              onDelete(params.row.id!);
            }
          }}
          showInMenu
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <DataGrid
        rows={employees}
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

      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Employee Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as 'active' | 'inactive' | 'terminated')}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </TextField>

          {newStatus === 'terminated' && (
            <TextField
              label="Termination Reason"
              value={terminationReason}
              onChange={(e) => setTerminationReason(e.target.value)}
              fullWidth
              multiline
              rows={3}
              required
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={newStatus === 'terminated' && !terminationReason}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
