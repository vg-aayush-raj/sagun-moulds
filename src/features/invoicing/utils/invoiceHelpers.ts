import { InvoicePatternType, PaymentStatus, PaymentMethod } from '../../../api/invoiceApi';

/**
 * Get display name for invoice pattern type
 */
export const getPatternDisplayName = (pattern: InvoicePatternType): string => {
  const names: Record<InvoicePatternType, string> = {
    [InvoicePatternType.NORMAL_WITH_GST]: 'Normal with Base Price + GST',
    [InvoicePatternType.MIXED_GST_CASH]: 'Mixed (GST + Cash)',
    [InvoicePatternType.UNDERBILLING]: 'Underbilling',
    [InvoicePatternType.MOSTLY_CASH]: 'Mostly Cash',
  };
  return names[pattern] || pattern;
};

/**
 * Get color for payment status badge
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const colors: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: '#d32f2f', // Red
    [PaymentStatus.PARTIALLY_PAID]: '#f57c00', // Orange
    [PaymentStatus.PAID]: '#388e3c', // Green
    [PaymentStatus.OVERPAID]: '#1976d2', // Blue
  };
  return colors[status] || '#757575';
};

/**
 * Get display name for payment status
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const labels: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: 'Unpaid',
    [PaymentStatus.PARTIALLY_PAID]: 'Partially Paid',
    [PaymentStatus.PAID]: 'Paid',
    [PaymentStatus.OVERPAID]: 'Overpaid',
  };
  return labels[status] || status;
};

/**
 * Get display name for payment method
 */
export const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
    [PaymentMethod.CHEQUE]: 'Cheque',
    [PaymentMethod.UPI]: 'UPI',
    [PaymentMethod.CARD]: 'Card',
    [PaymentMethod.NEFT_RTGS]: 'NEFT/RTGS',
    [PaymentMethod.OTHER]: 'Other',
  };
  return labels[method] || method;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate days overdue
 */
export const calculateDaysOverdue = (dueDate: string | null): number => {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Get pattern description/help text
 */
export const getPatternDescription = (pattern: InvoicePatternType): string => {
  const descriptions: Record<InvoicePatternType, string> = {
    [InvoicePatternType.NORMAL_WITH_GST]:
      'Standard invoice with base price and GST calculated on the base price. Full GST invoice will be generated.',
    [InvoicePatternType.MIXED_GST_CASH]:
      'Invoice where some cups are billed with GST and some are paid in cash. Only the GST portion will be shown on the formal invoice.',
    [InvoicePatternType.UNDERBILLING]:
      'Bill at a lower price with GST, collect the remaining amount as cash. Example: Agreed ₹0.34, Bill ₹0.22 + GST, Cash difference ₹0.08.',
    [InvoicePatternType.MOSTLY_CASH]:
      'Most transactions are cash-based. Occasionally issue formal GST invoices when customer requests.',
  };
  return descriptions[pattern] || '';
};

/**
 * Download file from blob
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Get aging bucket label and color
 */
export const getAgingBucketStyle = (daysOverdue: number): { label: string; color: string } => {
  if (daysOverdue < 0) {
    return { label: 'Not Due', color: '#4caf50' };
  } else if (daysOverdue <= 30) {
    return { label: '1-30 Days', color: '#ff9800' };
  } else if (daysOverdue <= 60) {
    return { label: '31-60 Days', color: '#f57c00' };
  } else if (daysOverdue <= 90) {
    return { label: '61-90 Days', color: '#e64a19' };
  } else {
    return { label: '90+ Days', color: '#d32f2f' };
  }
};
