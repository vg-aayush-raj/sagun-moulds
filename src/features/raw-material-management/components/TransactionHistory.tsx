import { useState, useEffect } from 'react';
import { TextField, MenuItem, Box, Alert } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { rawMaterialApi, StockTransaction } from '../../../api/rawMaterialApi';
import { useAppContext } from '../../../context/AppContext';

export default function TransactionHistory() {
  const { materialTypes } = useAppContext();
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMaterial, setFilterMaterial] = useState<number | ''>('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await rawMaterialApi.getTransactionHistory(filterMaterial || undefined);
      setTransactions(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterMaterial]);

  const columns: GridColDef[] = [
    {
      field: 'timestamp',
      headerName: 'Date & Time',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => format(new Date(params.value), 'dd MMM yyyy, hh:mm a'),
    },
    {
      field: 'material_name',
      headerName: 'Material Type',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'transaction_type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            bgcolor:
              params.value === 'purchase'
                ? 'success.lighter'
                : params.value === 'addition'
                  ? 'info.lighter'
                  : 'warning.lighter',
            color:
              params.value === 'purchase' ? 'success.dark' : params.value === 'addition' ? 'info.dark' : 'warning.dark',
            fontWeight: 'medium',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'kg_quantity',
      headerName: 'Quantity',
      width: 120,
      renderCell: (params) => `${params.value} KG`,
    },
    {
      field: 'current_balance',
      headerName: 'Balance After',
      width: 140,
      renderCell: (params) => `${params.value} KG`,
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
      <Box sx={{ mb: 3 }}>
        <TextField
          select
          label="Filter by Material Type"
          value={filterMaterial}
          onChange={(e) => setFilterMaterial(e.target.value as number | '')}
          sx={{ minWidth: 250 }}
        >
          <MenuItem value="">All Materials</MenuItem>
          {materialTypes.map((mat) => (
            <MenuItem key={mat.id} value={mat.id}>
              {mat.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={transactions}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: {
            sortModel: [{ field: 'timestamp', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </Box>
  );
}
