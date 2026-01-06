import { useState } from 'react';
import { Download as DownloadIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { InvoiceDetail as InvoiceDetailType, invoiceApi } from '../../../api/invoiceApi';

interface InvoiceDetailProps {
  invoice: InvoiceDetailType;
  open: boolean;
  onClose: () => void;
}

export default function InvoiceDetail({ invoice, open, onClose }: InvoiceDetailProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const blob = await invoiceApi.downloadInvoicePDF(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to download PDF');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Details - {invoice.invoice_number}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Company
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {invoice.company_name}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Billing Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {format(new Date(invoice.billing_date), 'dd MMM yyyy')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Typography variant="body1" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
              {invoice.status}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {format(new Date(invoice.created_at), 'dd MMM yyyy, hh:mm a')}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Invoice Items
        </Typography>

        {invoice.items?.map((item: any, index: number) => (
          <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              {item.cup_type}
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">
                  Base Price/Cup: ₹{Number(item.base_price_per_cup || 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">GST Rate: {Number(item.gst_rate || 0)}%</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">GST Amount: ₹{Number(item.gst_amount || 0).toFixed(2)}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2">
                  Price with GST/Cup: ₹
                  {(
                    Number(item.base_price_per_cup || 0) +
                    (Number(item.base_price_per_cup || 0) * Number(item.gst_rate || 0)) / 100
                  ).toFixed(2)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  Cash/Cup (Internal): ₹{Number(item.cash_per_cup || 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" fontWeight="medium" color="primary">
                  Line Total: ₹{Number(item.line_total || 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 1 }}>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Typography>Base Total:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography fontWeight="medium">₹{Number(invoice.base_total || 0).toFixed(2)}</Typography>
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography>GST Total:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography fontWeight="medium">₹{Number(invoice.gst_total || 0).toFixed(2)}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Typography variant="h6">Invoice Total:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ₹{Number(invoice.final_total || 0).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, border: 1, borderColor: 'grey.300' }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Internal Reference (Not shown in invoice):
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">Cash Component Total:</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="medium">
                ₹{Number(invoice.cash_total || 0).toFixed(2)}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2">Grand Total (with Cash):</Typography>
            </Grid>
            <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" fontWeight="bold">
                ₹
                {(
                  Number(invoice.base_total || 0) +
                  Number(invoice.gst_total || 0) +
                  Number(invoice.cash_total || 0)
                ).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleDownload} variant="contained" startIcon={<DownloadIcon />} disabled={downloading}>
          {downloading ? 'Downloading...' : 'Download PDF'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
