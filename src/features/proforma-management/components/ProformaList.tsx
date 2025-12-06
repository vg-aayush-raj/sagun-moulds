import { useState, useEffect } from 'react';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { proformaApi, ProformaInvoice } from '../../../api/proformaApi';

interface ProformaListProps {
  refresh: number;
}

export default function ProformaList({ refresh }: ProformaListProps) {
  const [proformas, setProformas] = useState<ProformaInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProformas();
  }, [refresh]);

  const loadProformas = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await proformaApi.getAll();
      setProformas(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load proformas');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (proformaId: number, proformaNumber: string) => {
    try {
      const blob = await proformaApi.downloadPDF(proformaId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${proformaNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download PDF');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'proforma_number',
      headerName: 'Proforma Number',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'company_name',
      headerName: 'Company',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'items_count',
      headerName: 'Items',
      width: 100,
      renderCell: (params) => `${params.value} item(s)`,
    },
    {
      field: 'total_amount',
      headerName: 'Total Amount',
      width: 140,
      renderCell: (params) => `₹${params.value.toFixed(2)}`,
    },
    {
      field: 'validity_date',
      headerName: 'Valid Until',
      width: 130,
      renderCell: (params) => format(new Date(params.value), 'dd MMM yyyy'),
    },
    {
      field: 'created_at',
      headerName: 'Created On',
      width: 130,
      renderCell: (params) => format(new Date(params.value), 'dd MMM yyyy'),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params: GridRowParams<ProformaInvoice>) => [
        <GridActionsCellItem
          icon={<DownloadIcon />}
          label="Download PDF"
          onClick={() => handleDownload(params.row.id, params.row.proforma_number)}
        />,
      ],
    },
  ];

  return (
    <Box>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <DataGrid
        rows={proformas}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
          sorting: {
            sortModel: [{ field: 'created_at', sort: 'desc' }],
          },
        }}
        pageSizeOptions={[25, 50, 100]}
      />
    </Box>
  );
}
