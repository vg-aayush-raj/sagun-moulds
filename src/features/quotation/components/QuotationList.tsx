import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { Delete as DeleteIcon, Download as DownloadIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { quotationApi, QuotationListItem } from '../../../api/quotationApi';

interface QuotationListProps {
  refresh: number;
}

export default function QuotationList({ refresh }: QuotationListProps) {
  const [quotations, setQuotations] = useState<QuotationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalQuotations, setTotalQuotations] = useState(0);

  useEffect(() => {
    fetchQuotations();
  }, [refresh, page, rowsPerPage]);

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await quotationApi.list(page + 1, rowsPerPage);
      setQuotations(response.quotations);
      setTotalQuotations(response.pagination.total);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch quotations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) return;

    try {
      await quotationApi.delete(id);
      fetchQuotations();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete quotation');
    }
  };

  const handleViewPDF = async (id: number) => {
    try {
      const blob = await quotationApi.viewPDF(id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err: any) {
      setError('Failed to view PDF');
    }
  };

  const handleDownloadPDF = async (id: number, quotationNumber: string) => {
    try {
      const blob = await quotationApi.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${quotationNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download PDF');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" onClose={() => setError(null)}>
        {error}
      </Alert>
    );
  }

  if (quotations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="textSecondary">
          No quotations found
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Create your first quotation using the form above
        </Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quotation No.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
                Total Amount
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Items
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map((quotation) => (
              <TableRow key={quotation.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {quotation.quotation_number}
                  </Typography>
                </TableCell>
                <TableCell>{quotation.company}</TableCell>
                <TableCell>{new Date(quotation.quotation_date).toLocaleDateString('en-IN')}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    ₹{' '}
                    {parseFloat(quotation.total_amount.toString()).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip label={quotation.items_count} size="small" color="info" />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <Tooltip title="View PDF">
                      <IconButton size="small" color="primary" onClick={() => handleViewPDF(quotation.id)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleDownloadPDF(quotation.id, quotation.quotation_number)}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => handleDelete(quotation.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalQuotations}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
