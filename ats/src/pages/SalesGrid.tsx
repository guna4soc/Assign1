import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Grid,
  MenuItem,
  useTheme,
  Tooltip,
  Toolbar,
  AppBar,
  Container,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface Sale {
  id: string;
  date: string;
  productName: string;
  quantitySold: number;
  retailerName: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'unpaid';
}

interface Retailer {
  id: string;
  retailerName: string;
  contactNumber: string;
  emailAddress: string;
  zone: string;
  dateRegistered: string;
}

const initialSalesData: Sale[] = [
  { id: '1', date: '2023-10-01', productName: 'Product A', quantitySold: 100, retailerName: 'Retailer A', totalAmount: 1000, paymentStatus: 'paid' },
  { id: '2', date: '2023-10-02', productName: 'Product B', quantitySold: 50, retailerName: 'Retailer B', totalAmount: 500, paymentStatus: 'pending' },
  { id: '3', date: '2023-10-03', productName: 'Product A', quantitySold: 70, retailerName: 'Retailer A', totalAmount: 700, paymentStatus: 'unpaid' },
];

const initialRetailerData: Retailer[] = [
  { id: '1', retailerName: 'Retailer A', contactNumber: '1234567890', emailAddress: 'retailerA@gmail.com', zone: 'Zone 1', dateRegistered: '2023-01-01' },
  { id: '2', retailerName: 'Retailer B', contactNumber: '0987654321', emailAddress: 'retailerB@gmail.com', zone: 'Zone 2', dateRegistered: '2023-02-01' },
];

const COLORS = ['#1976d2', '#00C49F', '#FFBB28', '#FF8042', '#607d8b', '#ab47bc', '#8bc34a'];

const statCardColors = [
  'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
  'linear-gradient(135deg, #43a047 0%, #81c784 100%)',
  'linear-gradient(135deg, #78909c 0%, #cfd8dc 100%)',
];

const SalesAndInventoryDashboard: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [sales, setSales] = useState<Sale[]>(initialSalesData);
  const [newSale, setNewSale] = useState<Omit<Sale, 'id'>>({
    date: '',
    productName: '',
    quantitySold: 0,
    retailerName: '',
    totalAmount: 0,
    paymentStatus: 'pending',
  });
  const [retailers, setRetailers] = useState<Retailer[]>(initialRetailerData);
  const [newRetailer, setNewRetailer] = useState<Omit<Retailer, 'id'>>({
    retailerName: '',
    contactNumber: '',
    emailAddress: '',
    zone: '',
    dateRegistered: '',
  });

  // Validation states
  const [saleErrors, setSaleErrors] = useState<{ [key: string]: string }>({});
  const [retailerErrors, setRetailerErrors] = useState<{ [key: string]: string }>({});

  // --- Sales Visualizations ---
  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const avgSaleAmount = totalSales ? totalAmount / totalSales : 0;

  // For charts
  const dateSalesMap = sales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.date] = (acc[sale.date] || 0) + sale.totalAmount;
    return acc;
  }, {});
  const salesOverTimeData = Object.entries(dateSalesMap)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const productSalesMap = sales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] || 0) + sale.totalAmount;
    return acc;
  }, {});
  const salesByProductData = Object.entries(productSalesMap).map(([name, value]) => ({ name, value }));

  const paymentStatusCount = sales.reduce<Record<string, number>>((acc, sale) => {
    acc[sale.paymentStatus] = (acc[sale.paymentStatus] || 0) + 1;
    return acc;
  }, {});
  const paymentStatusChartData = Object.entries(paymentStatusCount).map(([name, value]) => ({ name, value }));

  // --- Retailer Visualizations ---
  const zoneCountMap = retailers.reduce<Record<string, number>>((acc, r) => {
    acc[r.zone] = (acc[r.zone] || 0) + 1;
    return acc;
  }, {});
  const retailerZonePieData = Object.entries(zoneCountMap).map(([name, value]) => ({ name, value }));

  // --- Add/Delete Handlers with Validation ---
  const validateSale = () => {
    const errors: { [key: string]: string } = {};
    if (!newSale.date) errors.date = 'Date is required';
    if (!newSale.retailerName.trim()) {
      errors.retailerName = 'Retailer Name is required';
    } else if (!/^[A-Z][a-zA-Z\s]*$/.test(newSale.retailerName.trim())) {
      errors.retailerName = 'Retailer Name must start with a capital letter and contain only letters';
    }
    if (!newSale.productName.trim()) {
      errors.productName = 'Product Name is required';
    } else if (!/^[A-Z][a-zA-Z\s]*$/.test(newSale.productName.trim())) {
      errors.productName = 'Product Name must start with a capital letter and contain only letters';
    }
    if (!newSale.quantitySold || newSale.quantitySold < 1) errors.quantitySold = 'Quantity must be at least 1';
    if (!newSale.totalAmount || newSale.totalAmount < 1) errors.totalAmount = 'Amount must be at least 1';
    if (!newSale.paymentStatus) errors.paymentStatus = 'Payment Status is required';
    setSaleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addNewSale = () => {
    if (!validateSale()) return;
    const newId = (Math.max(0, ...sales.map(s => Number(s.id))) + 1).toString();
    setSales([...sales, { id: newId, ...newSale }]);
    setNewSale({ date: '', productName: '', quantitySold: 0, retailerName: '', totalAmount: 0, paymentStatus: 'pending' });
    setSaleErrors({});
  };

  const deleteSale = (id: string) => setSales(sales.filter(s => s.id !== id));

  // --- Retailer Validation ---
  const validateRetailer = () => {
    const errors: { [key: string]: string } = {};
    if (!newRetailer.retailerName.trim()) {
      errors.retailerName = 'Retailer Name is required';
    } else if (!/^[A-Z][a-zA-Z\s]*$/.test(newRetailer.retailerName.trim())) {
      errors.retailerName = 'Retailer Name must start with a capital letter and contain only letters';
    }
    if (!newRetailer.contactNumber.trim()) {
      errors.contactNumber = 'Contact Number is required';
    } else if (!/^\d{10}$/.test(newRetailer.contactNumber.trim())) {
      errors.contactNumber = 'Contact Number must be exactly 10 digits';
    }
    if (!newRetailer.emailAddress.trim()) {
      errors.emailAddress = 'Email Address is required';
    } else if (!/^([a-z0-9]+)@(gmail|outlook)\.com$/.test(newRetailer.emailAddress.trim())) {
      errors.emailAddress = 'Email must be all lowercase and end with @gmail.com or @outlook.com';
    }
    if (!newRetailer.zone.trim()) {
      errors.zone = 'Zone is required';
    } else if (!/^[A-Z][a-zA-Z\s]*$/.test(newRetailer.zone.trim())) {
      errors.zone = 'Zone must start with a capital letter and contain only letters';
    }
    if (!newRetailer.dateRegistered.trim()) {
      errors.dateRegistered = 'Date Registered is required';
    }
    setRetailerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addNewRetailer = () => {
    if (!validateRetailer()) return;
    const newId = (Math.max(0, ...retailers.map(r => Number(r.id))) + 1).toString();
    setRetailers([...retailers, { id: newId, ...newRetailer }]);
    setNewRetailer({ retailerName: '', contactNumber: '', emailAddress: '', zone: '', dateRegistered: '' });
    setRetailerErrors({});
  };

  const deleteRetailer = (id: string) => setRetailers(retailers.filter(r => r.id !== id));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        p: 0,
        m: 0,
        overflowX: 'hidden',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* HEADER (no toggle) */}
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mb: 3,
          background: 'linear-gradient(90deg, #e3fcec 0%, #b2f7ef 100%)', // light teal gradient
          color: '#00695c', // dark teal for text
          textAlign: 'center',
          boxShadow: 4,
          position: 'relative',
          minHeight: { xs: 80, md: 100 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" fontWeight="bold" letterSpacing={2} sx={{ fontSize: { xs: 22, md: 32 } }}>
          SalesSync Dashboard
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 6 } }}>
        {/* SUMMARY CARDS */}
        {activeTab === 0 && (
          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 6 }}>
            {[
              { label: 'Total Sales', value: totalSales, bg: statCardColors[0] },
              { label: 'Total Amount', value: totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }), bg: statCardColors[1] },
              { label: 'Avg/Sale', value: avgSaleAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }), bg: statCardColors[2] },
            ].map(({ label, value, bg }) => (
              <Grid key={label} item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: bg,
                    color: '#fff',
                    boxShadow: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 120,
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: 10 },
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', mb: 1, fontSize: 18 }}>
                    {label}
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: 1, fontSize: 36 }}>
                    {value}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}

        {/* TABS */}
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          centered
          sx={{
            mb: 5,
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 18,
              py: 2,
              minWidth: 160,
              color: theme.palette.text.primary,
              '&:hover': { color: theme.palette.primary.main, background: '#f0f4f8' },
              borderRadius: 2,
              mx: 1,
            },
            '& .Mui-selected': {
              color: theme.palette.primary.main,
              background: '#e3f2fd',
            },
          }}
        >
          <Tab label="Sales" />
          <Tab label="Retailers" />
        </Tabs>

        {/* SALES TAB */}
        {activeTab === 0 && (
          <>
            {/* SALES FORM */}
            <Box
              sx={{
                mb: 5,
                width: '100%',
                maxWidth: 1200,
                mx: 'auto',
                background: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: 2,
                p: { xs: 2, md: 4 },
              }}
              component="form"
              noValidate
              autoComplete="off"
            >
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                Add New Sale
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={newSale.date}
                    onChange={e => setNewSale(s => ({ ...s, date: e.target.value }))}
                    required
                    error={!!saleErrors.date}
                    helperText={saleErrors.date}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Retailer Name"
                    fullWidth
                    value={newSale.retailerName}
                    onChange={e => setNewSale(s => ({ ...s, retailerName: e.target.value }))}
                    required
                    error={!!saleErrors.retailerName}
                    helperText={saleErrors.retailerName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    value={newSale.productName}
                    onChange={e => setNewSale(s => ({ ...s, productName: e.target.value }))}
                    required
                    error={!!saleErrors.productName}
                    helperText={saleErrors.productName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Quantity Sold"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1 }}
                    value={newSale.quantitySold || ''}
                    onChange={e => setNewSale(s => ({ ...s, quantitySold: Number(e.target.value) }))}
                    required
                    error={!!saleErrors.quantitySold}
                    helperText={saleErrors.quantitySold}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Total Amount"
                    type="number"
                    fullWidth
                    inputProps={{ min: 1, step: 0.01 }}
                    value={newSale.totalAmount || ''}
                    onChange={e => setNewSale(s => ({ ...s, totalAmount: Number(e.target.value) }))}
                    required
                    error={!!saleErrors.totalAmount}
                    helperText={saleErrors.totalAmount}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Payment Status"
                    select
                    fullWidth
                    value={newSale.paymentStatus}
                    onChange={e => setNewSale(s => ({ ...s, paymentStatus: e.target.value as Sale['paymentStatus'] }))}
                    required
                    error={!!saleErrors.paymentStatus}
                    helperText={saleErrors.paymentStatus}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3} display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={addNewSale}
                    sx={{ fontWeight: 'bold', height: 56 }}
                  >
                    Add Sale
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {/* SALES TABLE */}
            <TableContainer sx={{ mb: 5, maxWidth: 1200, mx: 'auto', borderRadius: 3, boxShadow: 3, background: theme.palette.background.paper }}>
              <Table size="small" sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Date</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Retailer Name</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Product Name</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Quantity</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Amount</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Payment Status</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale, idx) => (
                    <TableRow key={sale.id} sx={{
                      backgroundColor: theme.palette.mode === 'dark'
                        ? (idx % 2 === 0 ? theme.palette.action.hover : theme.palette.background.paper)
                        : (idx % 2 === 0 ? '#f9f9f9' : theme.palette.background.paper),
                      '&:hover': { backgroundColor: theme.palette.action.selected },
                    }}>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{sale.date}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{sale.retailerName}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{sale.productName}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{sale.quantitySold}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{sale.totalAmount}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary, textTransform: 'capitalize' }}>{sale.paymentStatus}</TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Tooltip title="Edit">
                            <span>
                              <IconButton color="primary" onClick={() => {/* Add your edit handler here */}} size="small">
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton color="error" onClick={() => deleteSale(sale.id)} size="small">
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* SALES VISUALIZATIONS */}
            <Grid container spacing={4} sx={{ mb: 5 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: 370, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>Sales Over Time</Typography>
                  <ResponsiveContainer width="100%" height="85%">
                    <LineChart data={salesOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ReTooltip />
                      <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: 370, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>Sales by Product</Typography>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={salesByProductData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ReTooltip />
                      <Bar dataKey="value" fill="#43a047" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: 370, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>Payment Status</Typography>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={paymentStatusChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {paymentStatusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <ReTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        {/* RETAILERS TAB */}
        {activeTab === 1 && (
          <>
            {/* RETAILER FORM */}
            <Box
              sx={{
                mb: 5,
                width: '100%',
                maxWidth: 1200,
                mx: 'auto',
                background: theme.palette.background.paper,
                borderRadius: 3,
                boxShadow: 2,
                p: { xs: 2, md: 4 },
              }}
              component="form"
              noValidate
              autoComplete="off"
            >
              <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                Add New Retailer
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Retailer Name"
                    fullWidth
                    value={newRetailer.retailerName}
                    onChange={e => setNewRetailer(r => ({ ...r, retailerName: e.target.value }))}
                    required
                    error={!!retailerErrors.retailerName}
                    helperText={retailerErrors.retailerName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Contact Number"
                    fullWidth
                    value={newRetailer.contactNumber}
                    onChange={e => setNewRetailer(r => ({ ...r, contactNumber: e.target.value }))}
                    required
                    error={!!retailerErrors.contactNumber}
                    helperText={retailerErrors.contactNumber}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Email Address"
                    fullWidth
                    value={newRetailer.emailAddress}
                    onChange={e => setNewRetailer(r => ({ ...r, emailAddress: e.target.value }))}
                    required
                    error={!!retailerErrors.emailAddress}
                    helperText={retailerErrors.emailAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Zone"
                    fullWidth
                    value={newRetailer.zone}
                    onChange={e => setNewRetailer(r => ({ ...r, zone: e.target.value }))}
                    required
                    error={!!retailerErrors.zone}
                    helperText={retailerErrors.zone}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Date Registered"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={newRetailer.dateRegistered}
                    onChange={e => setNewRetailer(r => ({ ...r, dateRegistered: e.target.value }))}
                    required
                    error={!!retailerErrors.dateRegistered}
                    helperText={retailerErrors.dateRegistered}
                  />
                </Grid>
                <Grid item xs={12} md={3} display="flex" alignItems="center">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={addNewRetailer}
                    sx={{ fontWeight: 'bold', height: 56 }}
                  >
                    Add Retailer
                  </Button>
                </Grid>
              </Grid>
            </Box>
            {/* RETAILER TABLE */}
            <TableContainer sx={{ mb: 5, maxWidth: 1200, mx: 'auto', borderRadius: 3, boxShadow: 3, background: theme.palette.background.paper }}>
              <Table size="small" sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Retailer Name</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Contact Number</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Email</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Zone</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Date Registered</TableCell>
                    <TableCell sx={{ color: theme.palette.primary.contrastText, fontWeight: 'bold', textAlign: 'center', fontSize: 16, py: 2 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {retailers.map((r, idx) => (
                    <TableRow key={r.id} sx={{
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? idx % 2 === 0
                            ? theme.palette.action.hover
                            : theme.palette.background.paper
                          : idx % 2 === 0
                            ? '#f9f9f9'
                            : theme.palette.background.paper,
                      '&:hover': { backgroundColor: theme.palette.action.selected },
                    }}>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{r.retailerName}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{r.contactNumber}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{r.emailAddress}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{r.zone}</TableCell>
                      <TableCell align="center" sx={{ fontSize: 15, py: 1.5, color: theme.palette.text.primary }}>{r.dateRegistered}</TableCell>
                      <TableCell align="center" sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Tooltip title="Edit">
                            <span>
                              <IconButton color="primary" onClick={() => {/* Add your edit handler here */}} size="small">
                                <EditIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <span>
                              <IconButton color="error" onClick={() => deleteRetailer(r.id)} size="small">
                                <DeleteIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* RETAILER VISUALIZATION */}
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: 370, borderRadius: 3, boxShadow: 2, background: theme.palette.background.paper }}>
                  <Typography variant="subtitle1" fontWeight="bold" mb={2}>Retailers by Zone</Typography>
                  <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                      <Pie
                        data={retailerZonePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                      >
                        {retailerZonePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <ReTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default SalesAndInventoryDashboard;
