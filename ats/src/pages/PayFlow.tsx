import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface Payment {
  id: number;
  transactionId: string;
  date: string;
  amount: number;
  method: string;
  status: 'Completed' | 'Pending' | 'Failed';
  invoiceUrl?: string;
  accountNumber?: string;
  farmerId?: string;
}

const PAYMENT_METHODS = ['Credit Card', 'Bank Transfer', 'Mobile Payment', 'Cash'];
const NEW_PAYMENT_STORAGE_KEY = 'farmer-portal-new-payment';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      transactionId: 'TXN123456789',
      date: '2024-06-01',
      amount: 150.0,
      method: 'Credit Card',
      status: 'Completed',
      invoiceUrl: '/invoices/TXN123456789.pdf',
      accountNumber: '1234567890',
      farmerId: 'FARMER001',
    },
    {
      id: 2,
      transactionId: 'TXN987654321',
      date: '2024-06-05',
      amount: 200.0,
      method: 'Mobile Payment',
      status: 'Pending',
    },
    {
      id: 3,
      transactionId: 'TXN555666777',
      date: '2024-06-10',
      amount: 100.0,
      method: 'Bank Transfer',
      status: 'Completed',
      invoiceUrl: '/invoices/TXN555666777.pdf',
      accountNumber: '0987654321',
      farmerId: 'FARMER002',
    },
  ]);
  const [walletBalance, setWalletBalance] = useState(850.0);

  const [newPayment, setNewPayment] = useState({
    amount: '' as string,
    method: PAYMENT_METHODS[0],
    accountNumber: '',
    farmerId: '',
  });
  const [errors, setErrors] = useState({
    amount: '',
    accountNumber: '',
    farmerId: '',
  });

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // --- Persist and restore new payment form ---
  useEffect(() => {
    const saved = localStorage.getItem(NEW_PAYMENT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNewPayment({
          amount: parsed.amount || '',
          method: PAYMENT_METHODS.includes(parsed.method) ? parsed.method : PAYMENT_METHODS[0],
          accountNumber: parsed.accountNumber || '',
          farmerId: parsed.farmerId || '',
        });
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem(NEW_PAYMENT_STORAGE_KEY, JSON.stringify(newPayment));
  }, [newPayment]);

  // Validation functions
  const validateAmount = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return 'Amount must be a positive number';
    return '';
  };

  const validateAccountNumber = (value: string) => {
    if (!/^\d{8,12}/.test(value)) return 'Account number must be 8-12 digits';
    return '';
  };

  const validateFarmerId = (value: string) => {
    if (!/^[A-Z]{4}\d{3}/.test(value)) return 'Farmer ID must be 4 uppercase letters followed by 3 digits (e.g. FARM001)';
    return '';
  };

  const handleInputChange = (field: keyof typeof newPayment, value: string) => {
    setNewPayment(prev => ({ ...prev, [field]: value }));
    // Validate immediately
    let error = '';
    if (field === 'amount') error = validateAmount(value);
    else if (field === 'accountNumber') error = validateAccountNumber(value);
    else if (field === 'farmerId') error = validateFarmerId(value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const canSubmit = () => {
    return (
      newPayment.amount.trim() !== '' &&
      newPayment.accountNumber.trim() !== '' &&
      newPayment.farmerId.trim() !== '' &&
      !errors.amount &&
      !errors.accountNumber &&
      !errors.farmerId
    );
  };

  const handleAddPayment = () => {
    // Final validation
    const amountError = validateAmount(newPayment.amount);
    const accountError = validateAccountNumber(newPayment.accountNumber);
    const fidError = validateFarmerId(newPayment.farmerId);
    setErrors({ amount: amountError, accountNumber: accountError, farmerId: fidError });
    if (amountError || accountError || fidError) {
      setSnackbar({ open: true, message: 'Please fix the errors in the form', severity: 'error' });
      return;
    }
    const newPay: Payment = {
      id: Date.now(),
      transactionId: 'TXN' + Math.floor(Math.random() * 900000000 + 100000000).toString(),
      date: new Date().toLocaleDateString(),
      amount: parseFloat(newPayment.amount),
      method: newPayment.method,
      status: 'Pending',
      accountNumber: newPayment.accountNumber,
      farmerId: newPayment.farmerId,
      invoiceUrl: undefined,
    };
    setPayments(prev => [...prev, newPay]);
    setWalletBalance(prev => prev + newPay.amount);
    setNewPayment({ amount: '', method: PAYMENT_METHODS[0], accountNumber: '', farmerId: '' });
    setSnackbar({ open: true, message: 'Payment added successfully! Wallet balance updated.', severity: 'success' });
    // Clear localStorage for new payment
    localStorage.removeItem(NEW_PAYMENT_STORAGE_KEY);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: { xs: 2, md: 4 }, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <Box
        sx={{
          mb: 4,
          py: 3,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #e8f5e9 0%, #b2f7cc 100%)', // light green gradient
          color: '#1b5e20', // deep green for text
          textAlign: 'center',
          boxShadow: '0px 6px 20px rgba(100, 200, 123, 0.4)',
          userSelect: 'none',
        }}
      >
        <Typography variant="h4" fontWeight="bold" letterSpacing={1}>
          Farmer Wallet & Payments Center
        </Typography>
        <Typography variant="subtitle1" mt={1} fontWeight={500}>
          Manage your wallet, view payment history, submit payments, and track your bills securely.
        </Typography>
      </Box>

      {/* Key Features */}
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="700" mb={2} color="primary">
          Key Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="success" fontSize="large" />
              <Typography>Secure payments with encrypted transactions</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminPanelSettingsIcon color="info" fontSize="large" />
              <Typography>Admin panel to monitor payments and statuses</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DownloadIcon color="warning" fontSize="large" />
              <Typography>Download detailed payment invoices anytime</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={5}>
        {/* Wallet and New Payment */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Wallet Balance
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 1, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
              ₹{walletBalance.toFixed(2)}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Your available funds for transactions
            </Typography>

            <Typography variant="h6" gutterBottom>
              Process New Payment
            </Typography>
            <TextField
              label="Payment Amount"
              type="number"
              value={newPayment.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0.01, step: '0.01' }}
              error={!!errors.amount}
              helperText={errors.amount}
              required
            />
            <TextField
              label="Payment Method"
              select
              fullWidth
              sx={{ mb: 2 }}
              value={newPayment.method}
              onChange={(e) => handleInputChange('method', e.target.value)}
            >
              {PAYMENT_METHODS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Account Number"
              value={newPayment.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.accountNumber}
              helperText={errors.accountNumber}
              required
              inputProps={{ maxLength: 12 }}
            />
            <TextField
              label="Farmer ID"
              value={newPayment.farmerId}
              onChange={(e) => handleInputChange('farmerId', e.target.value.toUpperCase())}
              fullWidth
              sx={{ mb: 2 }}
              error={!!errors.farmerId}
              helperText={errors.farmerId}
              required
              inputProps={{ maxLength: 9 }}
            />
            <Button variant="contained" color="primary" fullWidth onClick={handleAddPayment} size="large">
              Add Payment
            </Button>
          </Paper>
        </Grid>

        {/* Payment History */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="700" gutterBottom>
              Payment History
            </Typography>
            <TableContainer sx={{ maxHeight: 450 }}>
              <Table stickyHeader size="small" aria-label="Payment history table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Transaction ID</strong></TableCell>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell align="right"><strong>Amount (₹)</strong></TableCell>
                    <TableCell><strong>Method</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Invoice</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ fontStyle: 'italic', color: '#777' }}>
                        No payment records available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map(({ id, transactionId, date, amount, method, status, invoiceUrl }) => (
                      <TableRow key={id} hover>
                        <TableCell sx={{ fontFamily: 'monospace' }}>{transactionId}</TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell align="right">₹{amount.toFixed(2)}</TableCell>
                        <TableCell>{method}</TableCell>
                        <TableCell sx={{ color: status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red' }}>
                          {status}
                        </TableCell>
                        <TableCell align="center" sx={{ minWidth: 72 }}>
                          {invoiceUrl ? (
                            <Tooltip title="Download Invoice">
                              <IconButton onClick={() => window.open(invoiceUrl, '_blank')} aria-label={`Download invoice for ${transactionId}`}>
                                <DownloadIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" color="text.secondary" aria-label="Invoice not available">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Security Measures and Admin Panel Info */}
      <Paper sx={{ p: 3, mt: 5, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="700" gutterBottom color="primary">
          Security & Administration
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon color="success" fontSize="large" />
            <Typography>
              Secure payment processing with encrypted transactions to protect your data and ensure safe transfers.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AdminPanelSettingsIcon color="info" fontSize="large" />
            <Typography>
              Dedicated admin panel to monitor, approve, and manage payments efficiently and transparently.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DownloadIcon color="warning" fontSize="large" />
            <Typography>
              Every payment has a downloadable invoice for your records and easy bookkeeping.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Payments;
