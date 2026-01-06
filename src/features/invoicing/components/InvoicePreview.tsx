import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import { InvoicePreviewResponse } from '../../../api/invoiceApi';

interface InvoicePreviewProps {
  open: boolean;
  preview: InvoicePreviewResponse;
  onClose: () => void;
  onConfirm: () => void;
}

export default function InvoicePreview({ open, preview, onClose, onConfirm }: InvoicePreviewProps) {
  const invoice = preview.invoice;
  const baseTotal = Number(invoice.base_total || 0);
  const gstTotal = Number(invoice.gst_total || 0);
  const cashTotal = Number(invoice.cash_total || 0);
  const subtotal = baseTotal + gstTotal;
  const roundOff = Math.round(subtotal) - subtotal;
  const invoiceTotal = Math.round(subtotal);
  const grandTotal = invoiceTotal + cashTotal;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Invoice Preview</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            bgcolor: 'background.paper',
            maxHeight: '50vh',
            overflow: 'auto',
            mb: 2,
          }}
          dangerouslySetInnerHTML={{ __html: preview.preview_html }}
        />

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Summary
          </Typography>
          <Grid container spacing={1}>
            <Grid size={{ xs: 7 }}>
              <Typography>Subtotal (Taxable Amount):</Typography>
            </Grid>
            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
              <Typography fontWeight="medium">₹{baseTotal.toFixed(2)}</Typography>
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Typography>CGST + SGST ({((gstTotal / baseTotal) * 100).toFixed(0)}%):</Typography>
            </Grid>
            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
              <Typography fontWeight="medium">₹{gstTotal.toFixed(2)}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Typography variant="body2">Subtotal:</Typography>
            </Grid>
            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Typography variant="body2" color={roundOff >= 0 ? 'success.main' : 'error.main'}>
                Round Off:
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color={roundOff >= 0 ? 'success.main' : 'error.main'}>
                {roundOff >= 0 ? '+' : ''}₹{roundOff.toFixed(2)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 0.5 }} />
            </Grid>

            <Grid size={{ xs: 7 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Invoice Total:
              </Typography>
            </Grid>
            <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ₹{invoiceTotal.toFixed(2)}
              </Typography>
            </Grid>

            {cashTotal > 0 && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Internal Reference (Not shown to customer):
                  </Typography>
                </Grid>

                <Grid size={{ xs: 7 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cash Component:
                  </Typography>
                </Grid>
                <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary">
                    ₹{cashTotal.toFixed(2)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 7 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    Grand Total (with Cash):
                  </Typography>
                </Grid>
                <Grid size={{ xs: 5 }} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                    ₹{grandTotal.toFixed(2)}
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirm Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
}
