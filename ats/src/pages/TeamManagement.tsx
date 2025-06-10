import React, { useState, useMemo, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';

// Define the Farmer type
type Farmer = {
  id: number;
  name: string;
  role: string;
  attendance: 'Present' | 'Absent' | 'On Leave';
  performance: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor';
};

// Define the roles available for farmers
const farmerRoles = ['All', 'Dairy Farmer', 'Crop Farmer', 'Poultry Farmer', 'Fisherman'];

// Initial farmers data
const initialFarmers: Farmer[] = [
  { id: 1, name: 'Amir Khan', role: 'Dairy Farmer', attendance: 'Present', performance: 'Excellent' },
  { id: 2, name: 'Meena Patel', role: 'Crop Farmer', attendance: 'Absent', performance: 'Good' },
  { id: 3, name: 'Sanjay Kumar', role: 'Poultry Farmer', attendance: 'Present', performance: 'Average' },
  { id: 4, name: 'Fatima Noor', role: 'Fisherman', attendance: 'On Leave', performance: 'Good' },
];

// Sample attendance trend data for visualization
const attendanceTrendData = [
  { date: 'Mon', present: 4 },
  { date: 'Tue', present: 5 },
  { date: 'Wed', present: 3 },
  { date: 'Thu', present: 4 },
  { date: 'Fri', present: 4 },
  { date: 'Sat', present: 2 },
  { date: 'Sun', present: 0 },
];

const FarmerWorkforce: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>(initialFarmers);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>(initialFarmers);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    attendance: 'Present' as Farmer['attendance'],
    performance: 'Good' as Farmer['performance'],
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#4CAF50' }, // Header color
          background: {
            default: '#fff',
            paper: '#fff',
          },
          text: {
            primary: '#111827',
            secondary: '#6b7280',
          },
        },
        typography: {
          fontFamily: `'Inter', 'Helvetica Neue', Arial, sans-serif`,
          h1: { fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1 },
          h2: { fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '1rem' },
          body1: { fontSize: 16, color: '#4b5563' },
          button: { fontWeight: 700, textTransform: 'none' },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  useEffect(() => {
    let filtered = farmers;
    if (role !== 'All') filtered = filtered.filter((f) => f.role === role);
    if (search.trim()) filtered = filtered.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredFarmers(filtered);
  }, [farmers, role, search]);

  const handleOpenAdd = () => {
    setEditingFarmer(null);
    setFormData({ name: '', role: '', attendance: 'Present', performance: 'Good' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFormData({
      name: farmer.name,
      role: farmer.role,
      attendance: farmer.attendance,
      performance: farmer.performance,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.performance) {
      alert('Please complete all fields.');
      return;
    }
    if (editingFarmer) {
      setFarmers((prev) =>
        prev.map((emp) => (emp.id === editingFarmer.id ? { ...emp, ...formData } : emp))
      );
      setSnackbarMessage('Farmer updated successfully!');
    } else {
      const newId = farmers.length > 0 ? Math.max(...farmers.map((e) => e.id)) + 1 : 1;
      setFarmers((prev) => [...prev, { id: newId, ...formData }]);
      setSnackbarMessage('Farmer added successfully!');
    }
    setSnackbarOpen(true);
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      setFarmers((prev) => prev.filter((emp) => emp.id !== id));
      setSnackbarMessage('Farmer deleted successfully!');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="primary" elevation={1}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
          <Typography variant="h3" fontWeight={700} sx={{ flexGrow: 1, userSelect: 'none' }}>
            Workflow Control
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, pt: 5 }}>
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search farmer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 240 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="inherit" />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              {farmerRoles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Add Farmer
          </Button>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="farmers table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell align="center" sx={{ width: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      No farmers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFarmers.map((emp) => (
                    <TableRow hover key={emp.id}>
                      <TableCell>{emp.name}</TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.attendance}</TableCell>
                      <TableCell>{emp.performance}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit" arrow>
                          <IconButton onClick={() => handleOpenEdit(emp)} aria-label={`Edit ${emp.name}`} size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton onClick={() => handleDelete(emp.id)} aria-label={`Delete ${emp.name}`} size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Typography variant="h4" fontWeight={700} sx={{ mt: 6, mb: 3 }}>
          Attendance Trend (last week)
        </Typography>
        <Box sx={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrendData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'light' ? '#e0e0e0' : '#444'} />
              <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} allowDecimals={false} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                  boxShadow: theme.shadows[4],
                }}
                itemStyle={{ color: theme.palette.text.primary }}
              />
              <Line type="monotone" dataKey="present" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth aria-labelledby="farmer-dialog-title">
        <DialogTitle id="farmer-dialog-title" fontWeight={700}>
          {editingFarmer ? 'Edit Farmer' : 'Add New Farmer'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }} noValidate>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              autoFocus
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
              >
                {farmerRoles.slice(1).map((role) => (
                  <MenuItem key={role} value={role}>{role}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Attendance</InputLabel>
              <Select
                value={formData.attendance}
                label="Attendance"
                onChange={(e) => setFormData((prev) => ({ ...prev, attendance: e.target.value as Farmer['attendance'] }))}
              >
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="On Leave">On Leave</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Performance</InputLabel>
              <Select
                value={formData.performance}
                label="Performance"
                onChange={(e) => setFormData((prev) => ({ ...prev, performance: e.target.value as Farmer['performance'] }))}
              >
                <MenuItem value="Excellent">Excellent</MenuItem>
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Average">Average</MenuItem>
                <MenuItem value="Below Average">Below Average</MenuItem>
                <MenuItem value="Poor">Poor</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default FarmerWorkforce;
