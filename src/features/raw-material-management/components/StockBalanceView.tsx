import { useState } from 'react';
import { Edit as EditIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { rawMaterialApi, StockBalance } from '../../../api/rawMaterialApi';

interface StockBalanceViewProps {
  stockBalances: StockBalance[];
  onRefresh: () => void;
}

export default function StockBalanceView({ stockBalances, onRefresh }: StockBalanceViewProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StockBalance | null>(null);
  const [threshold, setThreshold] = useState<number>(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditThreshold = (material: StockBalance) => {
    setSelectedMaterial(material);
    setThreshold(material.min_threshold);
    setEditOpen(true);
  };

  const handleSaveThreshold = async () => {
    if (!selectedMaterial) return;

    setLoading(true);
    setError(null);

    try {
      await rawMaterialApi.updateThreshold({
        material_type_id: selectedMaterial.material_type_id,
        min_threshold: threshold,
      });
      setEditOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update threshold');
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'material_name',
      headerName: 'Material Type',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'current_balance',
      headerName: 'Current Balance',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: params.row.is_low_stock ? 'bold' : 'normal',
            color: params.row.is_low_stock ? 'error.main' : 'inherit',
          }}
        >
          {params.value} {params.row.unit}
        </Typography>
      ),
    },
    {
      field: 'min_threshold',
      headerName: 'Minimum Threshold',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => `${params.value} ${params.row.unit}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params: GridRowParams<StockBalance>) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit Threshold"
          onClick={() => handleEditThreshold(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box>
      {stockBalances.some((sb) => sb.is_low_stock) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Warning: Some materials are below minimum threshold!
        </Alert>
      )}

      <DataGrid
        rows={stockBalances}
        columns={columns}
        getRowId={(row) => row.material_type_id}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
        getRowClassName={(params) => (params.row.is_low_stock ? 'low-stock-row' : '')}
        sx={{
          '& .low-stock-row': {
            bgcolor: 'error.lighter',
            '&:hover': {
              bgcolor: 'error.light',
            },
          },
        }}
      />

      <Dialog open={editOpen} onClose={() => !loading && setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Minimum Threshold</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" sx={{ mb: 2 }}>
            Material: <strong>{selectedMaterial?.material_name}</strong>
          </Typography>

          <TextField
            type="number"
            label="Minimum Threshold (KG)"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            fullWidth
            required
            inputProps={{ step: '0.01', min: '0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSaveThreshold} variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
