import { useState, useEffect } from 'react';
import { Visibility as ViewIcon, Download as DownloadIcon } from '@mui/icons-material';
import { Chip, Alert, Box } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { format } from 'date-fns';
import InvoiceDetail from './InvoiceDetail';
import { invoiceApi, InvoiceListItem } from '../../../api/invoiceApi';

interface InvoiceListProps {
  refresh: number;
}

export default function InvoiceList({ refresh }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  useEffect(() => {
    loadInvoices();
  }, [refresh]);

  useEffect(() => {
    if (selectedInvoiceId) {
      loadInvoiceDetail(selectedInvoiceId);
    }
  }, [selectedInvoiceId]);

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await invoiceApi.getAllInvoices();
      setInvoices(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoiceDetail = async (invoiceId: number) => {
    try {
      const detail = await invoiceApi.getInvoice(invoiceId);
      setSelectedInvoice(detail);
    } catch (err: any) {
      setError('Failed to load invoice details');
    }
  };

  const handleDownload = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const blob = await invoiceApi.downloadInvoicePDF(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download PDF');
    }
  };

  const handleConfirm = async (invoiceId: number) => {
    try {
      await invoiceApi.confirmInvoice(invoiceId);
      loadInvoices(); // Refresh list
    } catch (err: any) {
      setError('Failed to confirm invoice');
    }
  };

  const handleDelete = async (invoiceId: number) => {
    if (!confirm('Are you sure you want to delete this draft invoice?')) return;

    try {
      await invoiceApi.deleteInvoice(invoiceId);
      loadInvoices(); // Refresh list
    } catch (err: any) {
      setError('Failed to delete invoice');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'invoice_number',
      headerName: 'Invoice Number',
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
      field: 'billing_date',
      headerName: 'Billing Date',
      width: 130,
      renderCell: (params) => format(new Date(params.value), 'dd MMM yyyy'),
    },
    {
      field: 'final_total',
      headerName: 'Total Amount',
      width: 140,
      renderCell: (params) => `₹${Number(params.value).toFixed(2)}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color={params.value === 'confirmed' ? 'success' : 'warning'} />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params: GridRowParams<InvoiceListItem>) => {
        const isDraft = params.row.status === 'DRAFT';
        const actions = [
          <GridActionsCellItem icon={<ViewIcon />} label="View" onClick={() => setSelectedInvoiceId(params.row.id)} />,
        ];

        if (isDraft) {
          actions.push(
            <GridActionsCellItem
              icon={<span>✓</span>}
              label="Confirm Invoice"
              onClick={() => handleConfirm(params.row.id)}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<span>✕</span>}
              label="Delete Draft"
              onClick={() => handleDelete(params.row.id)}
              showInMenu
            />,
          );
        } else {
          actions.push(
            <GridActionsCellItem
              icon={<DownloadIcon />}
              label="Download PDF"
              onClick={() => handleDownload(params.row.id, params.row.invoice_number)}
              showInMenu
            />,
          );
        }

        return actions;
      },
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
        rows={invoices}
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

      {selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onClose={() => {
            setSelectedInvoice(null);
            setSelectedInvoiceId(null);
          }}
        />
      )}
    </Box>
  );
}
