import React, { useState, useMemo } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  alpha,
  styled,
  useTheme,
  Grid,
  IconButton,
  Tooltip,
  Box,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Inventory item interface
interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  stockQuantity: number;
  damagedStock: number;
  supplier?: string;
  reorderLevel: number;
  location?: string;
  expirationDate?: string;
  batchNumber?: string;
  lastRestockDate?: string;
  lastStockOutDate?: string;
}

// Initial inventory data
const initialInventory: InventoryItem[] = [
  {
    id: '1',
    productName: 'Milk',
    category: 'Dairy',
    stockQuantity: 100,
    damagedStock: 5,
    supplier: 'Local Farm Co.',
    reorderLevel: 20,
    location: 'Warehouse A',
    expirationDate: '2024-11-30',
    batchNumber: 'ABCD123',
    lastRestockDate: '2024-04-15',
  },
  {
    id: '2',
    productName: 'Cheese',
    category: 'Dairy',
    stockQuantity: 50,
    damagedStock: 2,
    supplier: 'Cheese Makers Ltd.',
    reorderLevel: 15,
    location: 'Warehouse A',
    expirationDate: '2024-12-15',
    batchNumber: 'EFGH234',
    lastStockOutDate: '2024-04-14',
  },
  {
    id: '3',
    productName: 'Bread',
    category: 'Bakery',
    stockQuantity: 2,
    damagedStock: 1,
    supplier: 'Bakery Inc.',
    reorderLevel: 10,
    location: 'Warehouse B',
    expirationDate: '2024-10-05',
    batchNumber: 'IJKL345',
    lastRestockDate: '2024-04-12',
  },
];

// Cool color palette for cards and charts
const CARD_COLORS = ['#1976d2', '#00bcd4', '#43a047'];
const PIE_COLORS = ['#1976d2', '#00bcd4', '#43a047', '#00bfae', '#1de9b6', '#00e5ff'];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
  color: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  borderBottomLeftRadius: 18,
  borderBottomRightRadius: 18,
  minHeight: 80,
  boxShadow: '0 2px 12px rgba(30,60,114,0.07)',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 38,
  textAlign: 'center',
  color: '#fff',
  letterSpacing: 1.5,
  userSelect: 'none',
  lineHeight: 1.1,
  marginBottom: 0,
  [theme.breakpoints.down('sm')]: {
    fontSize: 24,
  },
}));

const InputLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: 14,
  color: '#1976d2',
  marginBottom: theme.spacing(1),
  userSelect: 'none',
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #00bcd4 0%, #1976d2 100%)',
  color: '#fff',
  textTransform: 'uppercase',
  fontWeight: 700,
  padding: theme.spacing(1.2, 4),
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  '&:hover': {
    background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const SummaryCard = styled(Paper)<{ bgcolor?: string }>(({ bgcolor }) => ({
  padding: 18,
  borderRadius: 14,
  boxShadow: '0 4px 12px rgba(0,191,174,0.10)',
  textAlign: 'center',
  userSelect: 'none',
  minHeight: 70,
  background: bgcolor || '#fff',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.01)',
    boxShadow: '0 8px 24px rgba(0,191,174,0.13)',
  },
}));

const StockAlertItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.2),
  borderRadius: 10,
  backgroundColor: alpha('#00bcd4', 0.12),
  border: `1px solid ${alpha('#00bcd4', 0.35)}`,
  marginBottom: theme.spacing(1),
  fontWeight: 600,
  fontSize: 15,
  color: '#1976d2',
}));

const ActivityLogItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.2),
  borderRadius: 10,
  backgroundColor: alpha('#1976d2', 0.10),
  border: `1px solid ${alpha('#1976d2', 0.25)}`,
  marginBottom: theme.spacing(1),
  fontSize: 14,
  color: '#1976d2',
}));

const ActionStack = styled(Stack)({
  flexDirection: 'row',
  gap: 4,
  alignItems: 'center',
  justifyContent: 'center',
});

const InventoryDashboard: React.FC = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    productName: '',
    category: '',
    stockQuantity: 0,
    damagedStock: 0,
    supplier: '',
    reorderLevel: 10,
    location: '',
    expirationDate: '',
    batchNumber: '',
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Validation helpers
  function validateCapitalizedField(val: string, label: string, maxLength: number) {
    if (!val.trim()) return `${label} is required`;
    if (val.length > maxLength) return `${label} max length is ${maxLength}`;
    if (!/^[A-Z][a-zA-Z\s]*$/.test(val)) return `${label} must start with a capital letter and contain only letters and spaces`;
    return '';
  }
  function validateBatch(val: string) {
    if (!val.trim()) return 'Batch Number is required';
    if (!/^[A-Z]{4}\d{3}$/.test(val)) return 'Batch Number must be 4 capital letters and 3 digits (e.g. ABCD123)';
    return '';
  }
  function validateNumber(val: number, label: string) {
    if (isNaN(val) || val < 0) return `${label} must be non-negative`;
    return '';
  }
  function validateAllFields(item: typeof newItem) {
    const e: { [k: string]: string } = {};
    e.productName = validateCapitalizedField(item.productName, 'Product Name', 50);
    e.category = validateCapitalizedField(item.category, 'Category', 40);
    e.supplier = validateCapitalizedField(item.supplier || '', 'Supplier', 30);
    e.location = validateCapitalizedField(item.location || '', 'Location', 30);
    e.batchNumber = validateBatch(item.batchNumber || '');
    e.stockQuantity = validateNumber(item.stockQuantity, 'Stock Quantity');
    e.damagedStock = validateNumber(item.damagedStock, 'Damaged Stock');
    e.reorderLevel = validateNumber(item.reorderLevel, 'Reorder Level');
    return e;
  }

  // Add Item
  const handleAddItem = () => {
    const fieldErrors = validateAllFields(newItem);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(msg => msg)) {
      setAlert({ open: true, message: 'Please fix errors before adding item.', severity: 'error' });
      return;
    }
    const newId = (inventory.length + 1).toString();
    setInventory([
      ...inventory,
      { id: newId, ...newItem, lastRestockDate: new Date().toISOString() },
    ]);
    setNewItem({
      productName: '',
      category: '',
      stockQuantity: 0,
      damagedStock: 0,
      supplier: '',
      reorderLevel: 10,
      location: '',
      expirationDate: '',
      batchNumber: '',
    });
    setErrors({});
    setAlert({ open: true, message: 'Item added successfully!', severity: 'success' });
  };

  // Edit Item
  const openEditModal = (item: InventoryItem) => setEditItem({ ...item });
  const handleEditChange = (field: keyof InventoryItem, value: string | number) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };
  const handleSaveEdit = () => {
    if (!editItem) return;
    const fieldErrors = validateAllFields(editItem);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(msg => msg)) {
      setAlert({ open: true, message: 'Please fix errors before saving.', severity: 'error' });
      return;
    }
    setInventory((prev) => prev.map((item) => (item.id === editItem.id ? { ...editItem } : item)));
    setEditItem(null);
    setErrors({});
    setAlert({ open: true, message: 'Item updated successfully!', severity: 'success' });
  };
  const handleDelete = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    setAlert({ open: true, message: 'Item deleted successfully.', severity: 'success' });
  };
  const handleCloseEdit = () => setEditItem(null);
  const handleCloseAlert = () => setAlert(prev => ({ ...prev, open: false }));

  // Summary calculations
  const totalStockItems = inventory.length;
  const outOfStockItems = inventory.filter(item => item.stockQuantity === 0).length;
  const lowStockItems = inventory.filter(item => item.stockQuantity > 0 && item.stockQuantity <= item.reorderLevel).length;
  const stockAlerts = inventory.filter(item => item.stockQuantity <= item.reorderLevel);

  // Recent Activity Log
  type Activity = {
    id: string;
    type: 'Restock' | 'Stock Out' | 'Supplier Delivery';
    productName: string;
    date: string;
    quantity: number;
    supplier?: string;
  };
  const recentActivities: Activity[] = [];
  inventory.forEach(item => {
    if (item.lastRestockDate && item.stockQuantity > 0) {
      recentActivities.push({
        id: `${item.id}-restock`,
        type: 'Restock',
        productName: item.productName,
        date: item.lastRestockDate!,
        quantity: item.stockQuantity,
        supplier: item.supplier
      });
    }
    if (item.lastStockOutDate && item.damagedStock > 0) {
      recentActivities.push({
        id: `${item.id}-stockout`,
        type: 'Stock Out',
        productName: item.productName,
        date: item.lastStockOutDate!,
        quantity: item.damagedStock,
        supplier: item.supplier
      });
    }
    if (item.supplier) {
      recentActivities.push({
        id: `${item.id}-supplier-delivery`,
        type: 'Supplier Delivery',
        productName: item.productName,
        date: item.lastRestockDate || new Date().toISOString(),
        quantity: item.stockQuantity,
        supplier: item.supplier,
      });
    }
  });
  const sortedActivities = recentActivities.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // Pie Chart: Category-wise stock summary
  const categoryStockMap = inventory.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.stockQuantity;
    return acc;
  }, {});
  const categoryStockData = Object.entries(categoryStockMap).map(([category, qty]) => ({ name: category, value: qty }));

  // Bar Chart: Monthly stock movement (mocked)
  const getMonthString = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('default', { month: 'short', year: 'numeric' });
  };
  const monthSet = new Set<string>();
  inventory.forEach(item => {
    if (item.lastRestockDate) monthSet.add(getMonthString(item.lastRestockDate));
  });
  const months = Array.from(monthSet).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
  const monthlyStockData = months.map(month => {
    const total = inventory.reduce((acc, item) => {
      if (item.lastRestockDate && getMonthString(item.lastRestockDate) === month) {
        return acc + item.stockQuantity;
      }
      return acc;
    }, 0);
    return { month, stock: total };
  });

  // Line Chart: Restocking trends (by product)
  const restockTrendsData = inventory.map(item => ({
    productName: item.productName,
    restockCount: item.lastRestockDate ? 1 : 0,
  }));

  return (
    <>
      <CssBaseline />
      <StyledAppBar elevation={0}>
        <Toolbar sx={{ justifyContent: 'center', minHeight: 80 }}>
          <Title variant="h1">Inventory Hub Dashboard</Title>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="lg" sx={{ pt: 5, pb: 8 }}>
        {/* Summary Cards */}
        <Grid container spacing={3} mb={4} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard bgcolor={CARD_COLORS[0]}>
              <Typography variant="subtitle1" gutterBottom>
                Total Stock Items
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff' }} fontWeight={700}>
                {totalStockItems}
              </Typography>
            </SummaryCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard bgcolor={CARD_COLORS[1]}>
              <Typography variant="subtitle1" gutterBottom>
                Out of Stock
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff' }} fontWeight={700}>
                {outOfStockItems}
              </Typography>
            </SummaryCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <SummaryCard bgcolor={CARD_COLORS[2]}>
              <Typography variant="subtitle1" gutterBottom>
                Low Stock Alerts
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff' }} fontWeight={700}>
                {lowStockItems}
              </Typography>
            </SummaryCard>
          </Grid>
        </Grid>

        {/* Stock Alerts & Recent Activity */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5, borderRadius: 3, minHeight: 130, background: '#e0f7fa' }}>
              <Typography variant="subtitle1" gutterBottom color="primary">Stock Alerts</Typography>
              {stockAlerts.length === 0 ? (
                <Typography color="text.secondary">No stock alerts.</Typography>
              ) : (
                stockAlerts.map(alert => (
                  <StockAlertItem key={alert.id}>
                    {alert.productName} ({alert.category}) — {alert.stockQuantity} left (Reorder Level: {alert.reorderLevel})
                  </StockAlertItem>
                ))
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2.5, borderRadius: 3, minHeight: 130, background: '#e3f2fd' }}>
              <Typography variant="subtitle1" gutterBottom color="primary">Recent Activity</Typography>
              {sortedActivities.length === 0 ? (
                <Typography color="text.secondary">No recent activity.</Typography>
              ) : (
                sortedActivities.map(activity => (
                  <ActivityLogItem key={activity.id}>
                    <b>{activity.type}</b>: {activity.productName} ({activity.quantity}) — {new Date(activity.date).toLocaleDateString()}
                    {activity.supplier && <span> | <i>{activity.supplier}</i></span>}
                  </ActivityLogItem>
                ))
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Add Inventory Form */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 6px 15px rgba(0,191,174,0.13)' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Add New Inventory Item</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Product Name *</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={newItem.productName}
                onChange={e => setNewItem({ ...newItem, productName: e.target.value })}
                error={!!errors.productName}
                helperText={errors.productName}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Category *</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                error={!!errors.category}
                helperText={errors.category}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Stock Quantity *</InputLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={newItem.stockQuantity}
                onChange={e => setNewItem({ ...newItem, stockQuantity: Number(e.target.value) })}
                error={!!errors.stockQuantity}
                helperText={errors.stockQuantity}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Damaged Stock</InputLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={newItem.damagedStock}
                onChange={e => setNewItem({ ...newItem, damagedStock: Number(e.target.value) })}
                error={!!errors.damagedStock}
                helperText={errors.damagedStock}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Reorder Level *</InputLabel>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={newItem.reorderLevel}
                onChange={e => setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Supplier *</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={newItem.supplier}
                onChange={e => setNewItem({ ...newItem, supplier: e.target.value })}
                error={!!errors.supplier}
                helperText={errors.supplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Location *</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={newItem.location}
                onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Batch Number *</InputLabel>
              <TextField
                fullWidth
                size="small"
                value={newItem.batchNumber}
                onChange={e => setNewItem({ ...newItem, batchNumber: e.target.value })}
                error={!!errors.batchNumber}
                helperText={errors.batchNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Expiration Date</InputLabel>
              <TextField
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newItem.expirationDate}
                onChange={e => setNewItem({ ...newItem, expirationDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={2} alignSelf="flex-end">
              <CTAButton fullWidth onClick={handleAddItem}>Add Item</CTAButton>
            </Grid>
          </Grid>
        </Paper>

        {/* Inventory Table */}
        <Paper sx={{ p: 2, mb: 5, borderRadius: 3, boxShadow: '0 4px 10px rgba(0,191,174,0.12)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>Inventory</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Damaged</TableCell>
                  <TableCell>Reorder Level</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Expiration</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.stockQuantity}</TableCell>
                    <TableCell>{item.damagedStock}</TableCell>
                    <TableCell>{item.reorderLevel}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.batchNumber}</TableCell>
                    <TableCell>{item.expirationDate}</TableCell>
                    <TableCell align="center">
                      <ActionStack>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEditModal(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ActionStack>
                    </TableCell>
                  </TableRow>
                ))}
                {inventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} align="center" sx={{ color: 'text.secondary' }}>
                      No inventory records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Visualizations */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, background: '#e0f7fa' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Stock by Category</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={categoryStockData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {categoryStockData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, background: '#e3f2fd' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Monthly Stock Movement</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyStockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="stock" fill="#00bcd4" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, background: '#e0f7fa' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Restocking Trends</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={restockTrendsData}>
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <ReTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="restockCount" stroke="#1976d2" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Inventory Item</DialogTitle>
        <DialogContent>
          {editItem && (
            <Stack spacing={2}>
              <TextField
                label="Product Name"
                value={editItem.productName}
                onChange={e => handleEditChange('productName', e.target.value)}
                fullWidth
                error={!!errors.productName}
                helperText={errors.productName}
              />
              <TextField
                label="Category"
                value={editItem.category}
                onChange={e => handleEditChange('category', e.target.value)}
                fullWidth
                error={!!errors.category}
                helperText={errors.category}
              />
              <TextField
                label="Stock Quantity"
                type="number"
                value={editItem.stockQuantity}
                onChange={e => handleEditChange('stockQuantity', Number(e.target.value))}
                fullWidth
                error={!!errors.stockQuantity}
                helperText={errors.stockQuantity}
              />
              <TextField
                label="Damaged Stock"
                type="number"
                value={editItem.damagedStock}
                onChange={e => handleEditChange('damagedStock', Number(e.target.value))}
                fullWidth
                error={!!errors.damagedStock}
                helperText={errors.damagedStock}
              />
              <TextField
                label="Reorder Level"
                type="number"
                value={editItem.reorderLevel}
                onChange={e => handleEditChange('reorderLevel', Number(e.target.value))}
                fullWidth
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
              />
              <TextField
                label="Supplier"
                value={editItem.supplier}
                onChange={e => handleEditChange('supplier', e.target.value)}
                fullWidth
                error={!!errors.supplier}
                helperText={errors.supplier}
              />
              <TextField
                label="Location"
                value={editItem.location}
                onChange={e => handleEditChange('location', e.target.value)}
                fullWidth
                error={!!errors.location}
                helperText={errors.location}
              />
              <TextField
                label="Batch Number"
                value={editItem.batchNumber}
                onChange={e => handleEditChange('batchNumber', e.target.value)}
                fullWidth
                error={!!errors.batchNumber}
                helperText={errors.batchNumber}
              />
              <TextField
                label="Expiration Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={editItem.expirationDate}
                onChange={e => handleEditChange('expirationDate', e.target.value)}
                fullWidth
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar open={alert.open} autoHideDuration={3500} onClose={handleCloseAlert}>
        <Alert severity={alert.severity} onClose={handleCloseAlert} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InventoryDashboard;
