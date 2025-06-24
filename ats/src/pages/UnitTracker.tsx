import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CssBaseline,
  Tooltip,
  Theme,
  useTheme,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

type ProductType = 'Milk' | 'Curd' | 'Paneer' | 'Butter' | 'Ghee';

type ProcessingUnit = {
  id: number;
  name: string;
  status: 'Active' | 'Pending' | 'Inactive';
  info: string;
  records: number;
  uptimeHours: number;
  milkIntake: number;
  processingCapacity: number;
  mainProduct: ProductType;
  inventory: number;
  dispatched: number;
};

const initialProcessingUnits: ProcessingUnit[] = [
  {
    id: 1,
    name: 'Pasteurization Unit',
    status: 'Active',
    info: 'Handles raw milk pasteurization',
    records: 220,
    uptimeHours: 1400,
    milkIntake: 5000,
    processingCapacity: 6000,
    mainProduct: 'Milk',
    inventory: 5000,
    dispatched: 1200,
  },
  {
    id: 2,
    name: 'Curd Production',
    status: 'Active',
    info: 'Fermentation and packaging',
    records: 170,
    uptimeHours: 1100,
    milkIntake: 2000,
    processingCapacity: 2500,
    mainProduct: 'Curd',
    inventory: 2000,
    dispatched: 400,
  },
  {
    id: 3,
    name: 'Paneer Section',
    status: 'Pending',
    info: 'Awaiting equipment installation',
    records: 0,
    uptimeHours: 0,
    milkIntake: 0,
    processingCapacity: 0,
    mainProduct: 'Paneer',
    inventory: 0,
    dispatched: 0,
  },
  {
    id: 4,
    name: 'Butter & Ghee Plant',
    status: 'Inactive',
    info: 'Maintenance ongoing',
    records: 60,
    uptimeHours: 500,
    milkIntake: 800,
    processingCapacity: 1000,
    mainProduct: 'Butter',
    inventory: 800,
    dispatched: 200,
  },
];

const getSummaryData = (units: ProcessingUnit[]) => {
  const total = units.length;
  const active = units.filter((u) => u.status === 'Active').length;
  const pending = units.filter((u) => u.status === 'Pending').length;
  const totalRecords = units.reduce((acc, u) => acc + u.records, 0);
  const avgUptime = units.length ? Math.round(units.reduce((acc, u) => acc + u.uptimeHours, 0) / units.length) : 0;
  const totalMilk = units.reduce((acc, u) => acc + (u.milkIntake || 0), 0);
  const totalCapacity = units.reduce((acc, u) => acc + (u.processingCapacity || 0), 0);
  return [
    { label: 'Total Units', value: total, icon: <StorageIcon /> },
    { label: 'Active Units', value: active, icon: <CheckCircleOutlineIcon /> },
    { label: 'Pending Units', value: pending, icon: <TimerIcon /> },
    { label: 'Avg Uptime (hrs)', value: avgUptime, icon: <AssessmentIcon /> },
    { label: 'Total Records', value: totalRecords, icon: <AssessmentIcon /> },
    { label: 'Total Milk Intake (L)', value: totalMilk, icon: <StorageIcon /> },
    { label: 'Total Capacity (L/day)', value: totalCapacity, icon: <StorageIcon /> },
  ];
};

const getPieData = (units: ProcessingUnit[]) => [
  { name: 'Active', value: units.filter((u) => u.status === 'Active').length, color: '#10b981' },
  { name: 'Pending', value: units.filter((u) => u.status === 'Pending').length, color: '#f59e0b' },
  { name: 'Inactive', value: units.filter((u) => u.status === 'Inactive').length, color: '#6b7280' },
];

const getProductDistribution = (units: ProcessingUnit[]) => {
  const productTypes: ProductType[] = ['Milk', 'Curd', 'Paneer', 'Butter', 'Ghee'];
  return productTypes.map((product) => ({
    product,
    dispatched: units
      .filter((u) => u.mainProduct === product)
      .reduce((sum, u) => sum + (u.dispatched || 0), 0),
  }));
};

const lineChartData = [
  { date: 'Mon', Pasteurization: 35, Curd: 28, Butter: 12 },
  { date: 'Tue', Pasteurization: 38, Curd: 30, Butter: 14 },
  { date: 'Wed', Pasteurization: 34, Curd: 27, Butter: 13 },
  { date: 'Thu', Pasteurization: 40, Curd: 32, Butter: 16 },
  { date: 'Fri', Pasteurization: 44, Curd: 35, Butter: 18 },
  { date: 'Sat', Pasteurization: 50, Curd: 38, Butter: 19 },
  { date: 'Sun', Pasteurization: 46, Curd: 33, Butter: 17 },
];

type SummaryLabel =
  | 'Total Units'
  | 'Active Units'
  | 'Pending Units'
  | 'Avg Uptime (hrs)'
  | 'Total Records'
  | 'Total Milk Intake (L)'
  | 'Total Capacity (L/day)';

// Add modern, official, and cool bright background colors for all summary cards
const summaryCardBgColors = (theme: Theme): Record<SummaryLabel, string> => ({
  'Total Units': theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.main,
  'Active Units': theme.palette.mode === 'dark' ? theme.palette.success.dark : theme.palette.success.main,
  'Pending Units': theme.palette.mode === 'dark' ? theme.palette.warning.dark : theme.palette.warning.main,
  'Avg Uptime (hrs)': '#26a69a', // Teal for Avg Uptime (hrs)
  'Total Records': theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.main,
  'Total Milk Intake (L)': theme.palette.mode === 'dark' ? theme.palette.secondary.dark : theme.palette.secondary.main,
  'Total Capacity (L/day)': theme.palette.mode === 'dark' ? theme.palette.warning.light : theme.palette.warning.light,
});

const ProcessingUnits: React.FC = () => {
  const [units, setUnits] = useState<ProcessingUnit[]>(initialProcessingUnits);
  const theme = useTheme();
  const summaryData = getSummaryData(units);
  const pieData = getPieData(units);
  const productDistribution = getProductDistribution(units);

  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogUnit, setEditDialogUnit] = useState<ProcessingUnit | null>(null);
  const [dispatchDialogUnit, setDispatchDialogUnit] = useState<ProcessingUnit | null>(null);
  const [dispatchQty, setDispatchQty] = useState<number>(0);

  // Form fields for add/edit
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [formInfo, setFormInfo] = useState('');
  const [formRecords, setFormRecords] = useState<number>(0);
  const [formUptime, setFormUptime] = useState<number>(0);
  const [formMilkIntake, setFormMilkIntake] = useState<number>(0);
  const [formCapacity, setFormCapacity] = useState<number>(0);
  const [formMainProduct, setFormMainProduct] = useState<ProductType>('Milk');
  const [formInventory, setFormInventory] = useState<number>(0);

  // Add/Edit logic
  const resetFormFields = () => {
    setFormName('');
    setFormStatus('Active');
    setFormInfo('');
    setFormRecords(0);
    setFormUptime(0);
    setFormMilkIntake(0);
    setFormCapacity(0);
    setFormMainProduct('Milk');
    setFormInventory(0);
  };

  const handleOpenAddDialog = () => {
    resetFormFields();
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    resetFormFields();
  };

  const handleAddUnit = () => {
    const newUnit: ProcessingUnit = {
      id: units.length > 0 ? Math.max(...units.map((u) => u.id)) + 1 : 1,
      name: formName.trim(),
      status: formStatus,
      info: formInfo.trim(),
      records: formRecords,
      uptimeHours: formUptime,
      milkIntake: formMilkIntake,
      processingCapacity: formCapacity,
      mainProduct: formMainProduct,
      inventory: formInventory,
      dispatched: 0,
    };
    setUnits([newUnit, ...units]);
    handleCloseAddDialog();
  };

  const handleOpenEditDialog = (unit: ProcessingUnit) => {
    setEditDialogUnit(unit);
    setFormName(unit.name);
    setFormStatus(unit.status);
    setFormInfo(unit.info);
    setFormRecords(unit.records);
    setFormUptime(unit.uptimeHours);
    setFormMilkIntake(unit.milkIntake);
    setFormCapacity(unit.processingCapacity);
    setFormMainProduct(unit.mainProduct);
    setFormInventory(unit.inventory);
  };

  const handleCloseEditDialog = () => {
    setEditDialogUnit(null);
    resetFormFields();
  };

  const handleUpdateUnit = () => {
    if (!editDialogUnit) return;
    setUnits(
      units.map((u) =>
        u.id === editDialogUnit.id
          ? {
              ...u,
              name: formName.trim(),
              status: formStatus,
              info: formInfo.trim(),
              records: formRecords,
              uptimeHours: formUptime,
              milkIntake: formMilkIntake,
              processingCapacity: formCapacity,
              mainProduct: formMainProduct,
              inventory: formInventory,
            }
          : u
      )
    );
    handleCloseEditDialog();
  };

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  // Dispatch logic
  const handleOpenDispatchDialog = (unit: ProcessingUnit) => {
    setDispatchDialogUnit(unit);
    setDispatchQty(0);
  };

  const handleCloseDispatchDialog = () => {
    setDispatchDialogUnit(null);
    setDispatchQty(0);
  };

  const handleDispatchProduct = () => {
    if (!dispatchDialogUnit || dispatchQty <= 0 || dispatchQty > dispatchDialogUnit.inventory) return;
    setUnits(units.map((u) => {
      if (u.id !== dispatchDialogUnit.id) return u;
      return {
        ...u,
        inventory: u.inventory - dispatchQty,
        dispatched: u.dispatched + dispatchQty,
      };
    }));
    handleCloseDispatchDialog();
  };

  const filteredUnits = filterStatus === 'All' ? units : units.filter((u) => u.status === filterStatus);

  // Split summary cards into rows of 3
  const summaryRows = [];
  for (let i = 0; i < summaryData.length; i += 3) {
    summaryRows.push(summaryData.slice(i, i + 3));
  }

  return (
    <>
      <CssBaseline />
      {/* Header */}
      <Box
        component="header"
        sx={{
          width: '100%',
          height: 72,
          background: 'linear-gradient(90deg, #fff3e0 0%, #ffe0b2 100%)', // light orange gradient
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#3e2723', // deep brown for a professional, official look
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 1,
          boxShadow: theme.shadows[4],
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      >
        Processing Units
      </Box>

      <Box sx={{
        maxWidth: 1280,
        mx: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        pt: 6,
        pb: 6,
        background: theme.palette.background.default,
        minHeight: '100vh',
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        mt: 4
      }}>
        {/* Summary Cards: 3 per row */}
        {summaryRows.map((row, idx) => (
          <Grid container spacing={4} sx={{ mb: 3 }} key={idx}>
            {row.map(({ label, value, icon }) => {
              const summaryLabel = label as SummaryLabel;
              const bg = summaryCardBgColors(theme)[summaryLabel];
              const contrast = theme.palette.getContrastText(bg);
              return (
                <Grid item xs={12} sm={4} key={label}>
                  <Card
                    sx={{
                      minHeight: 130,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: theme.shadows[4],
                      border: 'none',
                      borderRadius: 2,
                      background: bg,
                      transition: 'box-shadow 0.3s, transform 0.3s',
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                        transform: 'translateY(-2px) scale(1.03)',
                      },
                    }}
                  >
                    <Box sx={{ color: contrast, mb: 1 }}>{React.cloneElement(icon, { sx: { fontSize: 28, color: contrast } })}</Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: contrast }}>
                      {value}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: contrast, mt: 0.5 }}>
                      {label}
                    </Typography>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ))}

        {/* Controls */}
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="filter-status-label">Filter by Status</InputLabel>
            <Select
              labelId="filter-status-label"
              id="filter-status"
              value={filterStatus}
              label="Filter by Status"
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddDialog}
            sx={{ fontWeight: 700, borderRadius: 2 }}
          >
            + Add New Unit
          </Button>
        </Box>

        {/* Units List */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {filteredUnits.map((unit) => (
            <Grid item xs={12} sm={6} md={4} key={unit.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  border: `2px solid ${
                    unit.status === 'Active'
                      ? theme.palette.success.main
                      : unit.status === 'Pending'
                      ? theme.palette.warning.main
                      : unit.status === 'Inactive'
                      ? theme.palette.grey[500]
                      : theme.palette.divider
                  }`,
                  p: 3,
                  background: theme.palette.background.paper,
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                  '&:hover': { boxShadow: theme.shadows[4] },
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
                    {unit.name}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        unit.status === 'Active'
                          ? theme.palette.success.main
                          : unit.status === 'Pending'
                          ? theme.palette.warning.main
                          : unit.status === 'Inactive'
                          ? theme.palette.grey[500]
                          : theme.palette.text.secondary,
                      fontWeight: 600,
                      mb: 1,
                      fontSize: '1rem',
                      userSelect: 'none',
                    }}
                  >
                    {unit.status}
                  </Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                    {unit.info}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Records: {unit.records}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Milk Intake: {unit.milkIntake} L
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Capacity: {unit.processingCapacity} L/day
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Inventory: {unit.inventory}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    Dispatched: {unit.dispatched}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Tooltip title="Dispatch Vehicle">
                    <IconButton size="small" color="primary" onClick={() => handleOpenDispatchDialog(unit)}>
                      <LocalShippingIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(unit)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="secondary" onClick={() => handleDeleteUnit(unit.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Visualizations */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, background: theme.palette.background.paper, boxShadow: theme.shadows[2], borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Unit Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, background: theme.palette.background.paper, boxShadow: theme.shadows[2], borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Product Dispatches
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={productDistribution}>
                  <XAxis dataKey="product" stroke={theme.palette.text.primary} />
                  <YAxis stroke={theme.palette.text.primary} />
                  <Bar dataKey="dispatched" fill={theme.palette.primary.main} />
                  <RechartsTooltip />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3, background: theme.palette.background.paper, boxShadow: theme.shadows[2], borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
                Daily Records Trend
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lineChartData}>
                  <XAxis dataKey="date" stroke={theme.palette.text.primary} />
                  <YAxis stroke={theme.palette.text.primary} />
                  <Line type="monotone" dataKey="Pasteurization" stroke={theme.palette.primary.main} />
                  <Line type="monotone" dataKey="Curd" stroke={theme.palette.success.main} />
                  <Line type="monotone" dataKey="Butter" stroke={theme.palette.warning.main} />
                  <RechartsTooltip />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Processing Unit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Unit Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formStatus}
                label="Status"
                onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Info"
              value={formInfo}
              onChange={(e) => setFormInfo(e.target.value)}
              fullWidth
            />
            <TextField
              label="Records"
              type="number"
              value={formRecords}
              onChange={(e) => setFormRecords(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Uptime (hrs)"
              type="number"
              value={formUptime}
              onChange={(e) => setFormUptime(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Milk Intake (L)"
              type="number"
              value={formMilkIntake}
              onChange={(e) => setFormMilkIntake(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Processing Capacity (L/day)"
              type="number"
              value={formCapacity}
              onChange={(e) => setFormCapacity(Number(e.target.value))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Main Product</InputLabel>
              <Select
                value={formMainProduct}
                label="Main Product"
                onChange={(e) => setFormMainProduct(e.target.value as ProductType)}
              >
                <MenuItem value="Milk">Milk</MenuItem>
                <MenuItem value="Curd">Curd</MenuItem>
                <MenuItem value="Paneer">Paneer</MenuItem>
                <MenuItem value="Butter">Butter</MenuItem>
                <MenuItem value="Ghee">Ghee</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Inventory"
              type="number"
              value={formInventory}
              onChange={(e) => setFormInventory(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUnit} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialogUnit} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Processing Unit</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Unit Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formStatus}
                label="Status"
                onChange={(e) => setFormStatus(e.target.value as typeof formStatus)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Info"
              value={formInfo}
              onChange={(e) => setFormInfo(e.target.value)}
              fullWidth
            />
            <TextField
              label="Records"
              type="number"
              value={formRecords}
              onChange={(e) => setFormRecords(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Uptime (hrs)"
              type="number"
              value={formUptime}
              onChange={(e) => setFormUptime(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Milk Intake (L)"
              type="number"
              value={formMilkIntake}
              onChange={(e) => setFormMilkIntake(Number(e.target.value))}
              fullWidth
            />
            <TextField
              label="Processing Capacity (L/day)"
              type="number"
              value={formCapacity}
              onChange={(e) => setFormCapacity(Number(e.target.value))}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Main Product</InputLabel>
              <Select
                value={formMainProduct}
                label="Main Product"
                onChange={(e) => setFormMainProduct(e.target.value as ProductType)}
              >
                <MenuItem value="Milk">Milk</MenuItem>
                <MenuItem value="Curd">Curd</MenuItem>
                <MenuItem value="Paneer">Paneer</MenuItem>
                <MenuItem value="Butter">Butter</MenuItem>
                <MenuItem value="Ghee">Ghee</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Inventory"
              type="number"
              value={formInventory}
              onChange={(e) => setFormInventory(Number(e.target.value))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateUnit} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dispatch Dialog */}
      <Dialog open={!!dispatchDialogUnit} onClose={handleCloseDispatchDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Dispatch Vehicle</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            {dispatchDialogUnit
              ? `Dispatch from "${dispatchDialogUnit.name}" (Inventory: ${dispatchDialogUnit.inventory})`
              : ''}
          </Typography>
          <TextField
            label="Dispatch Quantity"
            type="number"
            value={dispatchQty}
            onChange={e => setDispatchQty(Number(e.target.value))}
            fullWidth
            inputProps={{
              min: 1,
              max: dispatchDialogUnit ? dispatchDialogUnit.inventory : undefined,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDispatchDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDispatchProduct}
            color="primary"
            variant="contained"
            disabled={
              !dispatchDialogUnit ||
              dispatchQty <= 0 ||
              dispatchQty > (dispatchDialogUnit ? dispatchDialogUnit.inventory : 0)
            }
          >
            Dispatch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProcessingUnits;