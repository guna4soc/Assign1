import React, { useState, useEffect } from 'react';
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
import MenuItem from '@mui/material/MenuItem';

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
  farmerId?: string;
  lastRestockDate?: string;
  lastStockOutDate?: string;
}

// Add categoryManual to InventoryItem type for local use in edit dialog
interface InventoryItemWithManual extends InventoryItem {
  categoryManual?: string;
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
    farmerId: 'ABCD123',
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
    farmerId: 'EFGH234',
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
    farmerId: 'IJKL345',
    lastRestockDate: '2024-04-12',
  },
];

// Color palettes
const CARD_COLORS = ['#1976d2', '#00bcd4', '#43a047'];
const PIE_COLORS = ['#1976d2', '#00bcd4', '#43a047', '#00bfae', '#1de9b6', '#00e5ff'];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #b3e5fc 0%, #e1f5fe 100%)',
  color: '#1a237e', // deep blue for official, readable header text
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  borderBottomLeftRadius: 18,
  borderBottomRightRadius: 18,
  minHeight: 80,
  boxShadow: '0 2px 12px rgba(30,60,114,0.13)',
  borderBottom: '3px solid #4fc3f7',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: 38,
  textAlign: 'center',
  color: '#1a237e', // deep blue for official, readable header text
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
  background: bgcolor || '#f8fafc', // Use bgcolor if provided, else fallback
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'transform 0.3s',
  border: '1.5px solid #1976d2',
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

// LocalStorage key
const LOCAL_STORAGE_KEY = 'inventory_dashboard_data';

// Place this inside InventoryDashboard component, before useEffect and return
const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  Cheese: 'Dairy',
  Butter: 'Dairy',
  Milk: 'Dairy',
  Panneer: 'Dairy',
  Bread: 'Bakery',
};

const InventoryDashboard: React.FC = () => {
  const theme = useTheme();

  // Persistent inventory state
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : initialInventory;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'> & { categoryManual?: string }>({
    productName: '',
    category: '',
    stockQuantity: 0,
    damagedStock: 0,
    supplier: '',
    reorderLevel: 10,
    location: '',
    expirationDate: '',
    farmerId: '',
    categoryManual: '',
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [editItem, setEditItem] = useState<InventoryItemWithManual | null>(null);
  const [alert, setAlert] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // --- Action Buttons Color Styling ---
  const ActionIconButton = styled(IconButton)(({ theme }) => ({
    color: '#fff',
    background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
    margin: '0 2px',
    '&:hover': {
      background: 'linear-gradient(90deg, #00bcd4 0%, #1976d2 100%)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
    },
    borderRadius: 8,
    padding: 4,
  }));

  // Validation helpers
  function validateCapitalizedField(val: string, label: string, maxLength: number) {
    if (!val.trim()) return `${label} is required`;
    if (val.length > maxLength) return `${label} max length is ${maxLength}`;
    if (!/^[A-Z][a-zA-Z\s]*$/.test(val)) return `${label} must start with a capital letter and contain only letters and spaces`;
    return '';
  }
  function validateFarmerId(val: string) {
    if (!val.trim()) return 'Farmer ID is required';
    if (!/^FARM\d{3}$/.test(val)) return 'Farmer ID must be in format FARM001 (4 capital letters FARM and 3 digits)';
    if (val.length !== 7) return 'Farmer ID must be exactly 7 characters (e.g. FARM001)';
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
    e.farmerId = validateFarmerId(item.farmerId || '');
    e.stockQuantity = validateNumber(item.stockQuantity, 'Stock Quantity');
    e.damagedStock = validateNumber(item.damagedStock, 'Damaged Stock');
    e.reorderLevel = validateNumber(item.reorderLevel, 'Reorder Level');
    return e;
  }

  // Add Item
  const handleAddItem = () => {
    const itemToAdd = { ...newItem, category: newItem.category === 'Other' ? newItem.categoryManual || '' : newItem.category };
    const fieldErrors = validateAllFields(itemToAdd);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(msg => msg)) {
      setAlert({ open: true, message: 'Please fix errors before adding item.', severity: 'error' });
      return;
    }
    const newId = (Date.now() + Math.random()).toString();
    setInventory([
      ...inventory,
      { id: newId, ...itemToAdd, lastRestockDate: new Date().toISOString() },
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
      farmerId: '',
      categoryManual: '',
    });
    setErrors({});
    setAlert({ open: true, message: 'Item added successfully!', severity: 'success' });
  };

  // Edit Item
  const openEditModal = (item: InventoryItem) => {
    setEditItem({
      ...item,
      categoryManual: item.category === 'Other' ? item.category : undefined,
    });
  };
  const handleEditChange = (field: keyof InventoryItemWithManual, value: string | number) => {
    if (!editItem) return;
    if (field === 'category' && value === 'Other') {
      setEditItem({ ...editItem, category: value as string, categoryManual: '' });
    } else if (field === 'categoryManual') {
      setEditItem({ ...editItem, categoryManual: value as string });
    } else {
      setEditItem({ ...editItem, [field]: value });
    }
  };
  const handleSaveEdit = () => {
    if (!editItem) return;
    const itemToSave = {
      ...editItem,
      category: editItem.category === 'Other' ? editItem.categoryManual || '' : editItem.category,
    };
    const fieldErrors = validateAllFields(itemToSave);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(msg => msg)) {
      setAlert({ open: true, message: 'Please fix errors before saving.', severity: 'error' });
      return;
    }
    setInventory((prev) => prev.map((item) => (item.id === editItem.id ? { ...itemToSave } : item)));
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

  // When productName changes, auto-set category if mapped
  useEffect(() => {
    if (PRODUCT_CATEGORY_MAP[newItem.productName]) {
      setNewItem(prev => ({ ...prev, category: PRODUCT_CATEGORY_MAP[newItem.productName] }));
    }
  }, [newItem.productName]);

  // --- Improved Stock Trends Visualization ---
  const stockTrendsData = (() => {
    const trends: Record<string, Record<string, number>> = {};
    inventory.forEach(item => {
      if (item.lastRestockDate) {
        const month = getMonthString(item.lastRestockDate);
        if (!trends[month]) trends[month] = {};
        trends[month][item.productName] = (trends[month][item.productName] || 0) + item.stockQuantity;
      }
    });
    return Object.entries(trends).map(([month, products]) => ({ month, ...products }));
  })();

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
        <Grid container spacing={3} mb={4} justifyContent="center" alignItems="stretch" sx={{
          [theme.breakpoints.down('sm')]: { flexDirection: 'column' }
        }}>
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
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 6px 15px rgba(0,191,174,0.13)', border: '1.5px solid #1976d2', background: '#f8fafc' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2', letterSpacing: 1 }}>Add New Inventory Item</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Product Name</InputLabel>
              <TextField
                select
                fullWidth
                value={newItem.productName}
                onChange={e => setNewItem({ ...newItem, productName: e.target.value })}
                error={!!errors.productName}
                helperText={errors.productName}
              >
                <MenuItem value="">Select Product</MenuItem>
                <MenuItem value="Cheese">Cheese</MenuItem>
                <MenuItem value="Butter">Butter</MenuItem>
                <MenuItem value="Milk">Milk</MenuItem>
                <MenuItem value="Panneer">Panneer</MenuItem>
                <MenuItem value="Bread">Bread</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Category</InputLabel>
              <TextField
                select
                fullWidth
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                error={!!errors.category}
                helperText={errors.category}
                disabled={!!PRODUCT_CATEGORY_MAP[newItem.productName]}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
                <MenuItem value="Bakery">Bakery</MenuItem>
                <MenuItem value="Grocery">Grocery</MenuItem>
                <MenuItem value="Beverages">Beverages</MenuItem>
                <MenuItem value="Other">Other (Manual Entry)</MenuItem>
              </TextField>
              {newItem.category === 'Other' && (
                <TextField
                  fullWidth
                  sx={{ mt: 1 }}
                  label="Enter Category"
                  value={newItem.categoryManual || ''}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value, categoryManual: e.target.value })}
                  error={!!errors.category}
                  helperText={errors.category}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Stock Quantity</InputLabel>
              <TextField
                fullWidth
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
                type="number"
                value={newItem.damagedStock}
                onChange={e => setNewItem({ ...newItem, damagedStock: Number(e.target.value) })}
                error={!!errors.damagedStock}
                helperText={errors.damagedStock}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <InputLabel>Reorder Level</InputLabel>
              <TextField
                fullWidth
                type="number"
                value={newItem.reorderLevel}
                onChange={e => setNewItem({ ...newItem, reorderLevel: Number(e.target.value) })}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Supplier</InputLabel>
              <TextField
                fullWidth
                value={newItem.supplier}
                onChange={e => setNewItem({ ...newItem, supplier: e.target.value })}
                error={!!errors.supplier}
                helperText={errors.supplier}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Location</InputLabel>
              <TextField
                fullWidth
                value={newItem.location}
                onChange={e => setNewItem({ ...newItem, location: e.target.value })}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Expiration Date</InputLabel>
              <TextField
                fullWidth
                type="date"
                value={newItem.expirationDate}
                onChange={e => setNewItem({ ...newItem, expirationDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <InputLabel>Farmer ID</InputLabel>
              <TextField
                fullWidth
                value={newItem.farmerId}
                onChange={e => setNewItem({ ...newItem, farmerId: e.target.value })}
                error={!!errors.farmerId}
                helperText={errors.farmerId}
              />
            </Grid>
            <Grid item xs={12}>
              <CTAButton onClick={handleAddItem}>Add Item</CTAButton>
            </Grid>
          </Grid>
        </Paper>

        {/* Divider */}
        <Box sx={{ my: 5, borderBottom: '2px solid #e3e3e3', width: '100%' }} />

        {/* Inventory Table */}
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Inventory List</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Product Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Category</TableCell>
                  <TableCell align="center" sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Stock</TableCell>
                  <TableCell align="center" sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Damaged</TableCell>
                  <TableCell align="center" sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Reorder Level</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Supplier</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Location</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Expiration</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700, borderRight: '2px solid #e3e3e3' }}>Farmer ID</TableCell>
                  <TableCell align="center" sx={{ color: '#fff', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id} sx={{ '&:hover': { background: '#f1f8ff' } }}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="center">{item.stockQuantity}</TableCell>
                    <TableCell align="center">{item.damagedStock}</TableCell>
                    <TableCell align="center">{item.reorderLevel}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.expirationDate}</TableCell>
                    <TableCell>{item.farmerId}</TableCell>
                    <TableCell align="center">
                      <ActionStack>
                        <Tooltip title="Edit">
                          <ActionIconButton size="small" onClick={() => openEditModal(item)}>
                            <EditIcon />
                          </ActionIconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <ActionIconButton size="small" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                          </ActionIconButton>
                        </Tooltip>
                      </ActionStack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Visualization Section */}
        <Grid container spacing={3} mb={4} mt={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, height: 320 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">Stock by Product</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={inventory.map(item => ({ name: item.productName, Stock: item.stockQuantity }))}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontWeight: 600, fontSize: 13 }} />
                  <YAxis tick={{ fontWeight: 600, fontSize: 13 }} allowDecimals={false} />
                  <ReTooltip cursor={{ fill: '#e3f2fd' }} />
                  <Bar dataKey="Stock" fill="#1976d2" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#1976d2', fontWeight: 700 }}>
                    {inventory.map((entry, idx) => (
                      <Cell key={`cell-bar-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 3, height: 320 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">Product Distribution</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryStockData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
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
            <Paper sx={{ p: 2, borderRadius: 3, height: 320 }}>
              <Typography variant="subtitle1" gutterBottom color="primary">Stock Trends by Product</Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stockTrendsData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ReTooltip />
                  <Legend />
                  {['Cheese', 'Butter', 'Milk', 'Panneer', 'Bread'].map((prod, idx) => (
                    <Line key={prod} type="monotone" dataKey={prod} stroke={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Edit Dialog */}
        <Dialog open={!!editItem} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogContent>
            {editItem && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Product Name</InputLabel>
                  <TextField
                    fullWidth
                    value={editItem.productName}
                    onChange={e => handleEditChange('productName', e.target.value)}
                    error={!!errors.productName}
                    helperText={errors.productName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Category</InputLabel>
                  <TextField
                    select
                    fullWidth
                    value={editItem.category}
                    onChange={e => handleEditChange('category', e.target.value)}
                    error={!!errors.category}
                    helperText={errors.category}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Dairy">Dairy</MenuItem>
                    <MenuItem value="Bakery">Bakery</MenuItem>
                    <MenuItem value="Grocery">Grocery</MenuItem>
                    <MenuItem value="Beverages">Beverages</MenuItem>
                    <MenuItem value="Other">Other (Manual Entry)</MenuItem>
                  </TextField>
                  {editItem.category === 'Other' && (
                    <TextField
                      fullWidth
                      sx={{ mt: 1 }}
                      label="Enter Category"
                      value={editItem.categoryManual || ''}
                      onChange={e => handleEditChange('categoryManual', e.target.value)}
                      error={!!errors.category}
                      helperText={errors.category}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Stock Quantity</InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    value={editItem.stockQuantity}
                    onChange={e => handleEditChange('stockQuantity', Number(e.target.value))}
                    error={!!errors.stockQuantity}
                    helperText={errors.stockQuantity}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Damaged Stock</InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    value={editItem.damagedStock}
                    onChange={e => handleEditChange('damagedStock', Number(e.target.value))}
                    error={!!errors.damagedStock}
                    helperText={errors.damagedStock}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Reorder Level</InputLabel>
                  <TextField
                    fullWidth
                    type="number"
                    value={editItem.reorderLevel}
                    onChange={e => handleEditChange('reorderLevel', Number(e.target.value))}
                    error={!!errors.reorderLevel}
                    helperText={errors.reorderLevel}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Supplier</InputLabel>
                  <TextField
                    fullWidth
                    value={editItem.supplier}
                    onChange={e => handleEditChange('supplier', e.target.value)}
                    error={!!errors.supplier}
                    helperText={errors.supplier}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Location</InputLabel>
                  <TextField
                    fullWidth
                    value={editItem.location}
                    onChange={e => handleEditChange('location', e.target.value)}
                    error={!!errors.location}
                    helperText={errors.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Expiration Date</InputLabel>
                  <TextField
                    fullWidth
                    type="date"
                    value={editItem.expirationDate}
                    onChange={e => handleEditChange('expirationDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Farmer ID</InputLabel>
                  <TextField
                    fullWidth
                    value={editItem.farmerId}
                    onChange={e => handleEditChange('farmerId', e.target.value)}
                    error={!!errors.farmerId}
                    helperText={errors.farmerId}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <CTAButton onClick={handleSaveEdit}>Save</CTAButton>
          </DialogActions>
        </Dialog>

        {/* Snackbar Alerts */}
        <Snackbar open={alert.open} autoHideDuration={2500} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default InventoryDashboard;
