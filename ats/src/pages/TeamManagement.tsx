import React, { useState, useMemo, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Box, Button, IconButton, InputAdornment, TextField, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  CssBaseline, ThemeProvider, createTheme, Tooltip, Snackbar, Alert, Grid, Card, CardContent
} from '@mui/material';
import {
  Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FileDownload
} from '@mui/icons-material';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

type Farmer = {
  id: number;
  name: string;
  role: string;
  attendance: 'Present' | 'Absent' | 'On Leave';
  performance: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor';
};

const farmerRoles = ['All', 'Dairy Farmer', 'Crop Farmer', 'Poultry Farmer', 'Fisherman'];
const performanceLevels = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];
const attendanceLevels = ['Present', 'Absent', 'On Leave'];

const initialFarmers: Farmer[] = [
  { id: 1, name: 'Amir Khan', role: 'Dairy Farmer', attendance: 'Present', performance: 'Excellent' },
  { id: 2, name: 'Meena Patel', role: 'Crop Farmer', attendance: 'Absent', performance: 'Good' },
  { id: 3, name: 'Sanjay Kumar', role: 'Poultry Farmer', attendance: 'Present', performance: 'Average' },
  { id: 4, name: 'Fatima Noor', role: 'Fisherman', attendance: 'On Leave', performance: 'Good' },
];

const weeklyAttendanceTrend = [
  { date: 'Mon', present: 4 },
  { date: 'Tue', present: 5 },
  { date: 'Wed', present: 3 },
  { date: 'Thu', present: 4 },
  { date: 'Fri', present: 4 },
  { date: 'Sat', present: 2 },
  { date: 'Sun', present: 0 },
];

const monthlyAttendanceTrend = [
  { date: 'Week 1', present: 22 },
  { date: 'Week 2', present: 25 },
  { date: 'Week 3', present: 20 },
  { date: 'Week 4', present: 23 },
];

// Visualization color palettes
const ROLE_COLORS = ['#4caf50', '#43cea2', '#ff8c94', '#f9d423', '#fc913a'];
const PERFORMANCE_COLORS = ['#4caf50', '#2196f3', '#ffc107', '#ff9800', '#f44336'];

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
  const [trendView, setTrendView] = useState<'weekly' | 'monthly'>('weekly');

  // Theme with custom header color
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: { main: '#3f51b5' }, // Indigo for header and charts
          background: { default: '#fff', paper: '#fff' },
          text: { primary: '#111827', secondary: '#6b7280' },
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
    []
  );

  useEffect(() => {
    let filtered = farmers;
    if (role !== 'All') filtered = filtered.filter((f) => f.role === role);
    if (search.trim()) filtered = filtered.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredFarmers(filtered);
  }, [farmers, role, search]);

  const roleCounts = useMemo(() => {
    const counts: { [role: string]: number } = {};
    farmerRoles.slice(1).forEach(role => { counts[role] = 0; });
    farmers.forEach(f => { counts[f.role] = (counts[f.role] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [farmers]);

  const performanceCounts = useMemo(() => {
    const counts: { [perf: string]: number } = {};
    performanceLevels.forEach(level => { counts[level] = 0; });
    farmers.forEach(f => { counts[f.performance] = (counts[f.performance] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [farmers]);

  const totalFarmers = farmers.length;
  const presentToday = farmers.filter(f => f.attendance === 'Present').length;
  const attendanceRate = totalFarmers === 0 ? 0 : Math.round((presentToday / totalFarmers) * 100);
  const performanceScore = useMemo(() => {
    const map = { Excellent: 5, Good: 4, Average: 3, 'Below Average': 2, Poor: 1 };
    if (farmers.length === 0) return 0;
    const sum = farmers.reduce((acc, f) => acc + map[f.performance], 0);
    return (sum / farmers.length).toFixed(2);
  }, [farmers]);

  const attendanceTrendData = trendView === 'weekly' ? weeklyAttendanceTrend : monthlyAttendanceTrend;
  const forecastAttendance = useMemo(() => {
    if (attendanceTrendData.length === 0) return 0;
    const total = attendanceTrendData.reduce((sum, d) => sum + d.present, 0);
    return Math.round(total / attendanceTrendData.length);
  }, [attendanceTrendData]);
  const forecastPerformance = useMemo(() => {
    const freq: { [key: string]: number } = {};
    farmers.forEach(f => { freq[f.performance] = (freq[f.performance] || 0) + 1; });
    let max = 0, maxPerf = '';
    for (let k in freq) {
      if (freq[k] > max) { max = freq[k]; maxPerf = k; }
    }
    return maxPerf || 'N/A';
  }, [farmers]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Role', 'Attendance', 'Performance'];
    const rows = farmers.map(f =>
      [f.id, `"${f.name}"`, `"${f.role}"`, `"${f.attendance}"`, `"${f.performance}"`].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'farmers.csv';
    link.click();
  };

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

  const handleCloseDialog = () => setDialogOpen(false);

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

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" sx={{ background: '#e3f2fd', color: '#1a237e' }}>
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', px: 2, minHeight: 128 }}>
          <Typography variant="h3" fontWeight={900} sx={{ flexGrow: 1, userSelect: 'none', fontSize: { xs: 26, md: 34 }, letterSpacing: 1.5 }}>
            Workflow Control
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, pt: 5 }}>
        {/* Summary Cards, Forecast, and CSV Download */}
        <Grid container alignItems="stretch" spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ height: '100%', bgcolor: ROLE_COLORS[0], color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color="inherit" gutterBottom>Total Farmers</Typography>
                <Typography variant="h4" fontWeight={700} align="center">{totalFarmers}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ height: '100%', bgcolor: ROLE_COLORS[1], color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color="inherit" gutterBottom>Attendance Rate</Typography>
                <Typography variant="h4" fontWeight={700} align="center">{attendanceRate}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ height: '100%', bgcolor: ROLE_COLORS[2], color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color="inherit" gutterBottom>Avg. Performance Score</Typography>
                <Typography variant="h4" fontWeight={700} align="center">{performanceScore}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card elevation={2} sx={{ height: '100%', bgcolor: ROLE_COLORS[3], color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CardContent sx={{ width: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography color="inherit" gutterBottom>Forecast Performance</Typography>
                <Typography variant="h4" fontWeight={700} align="center">{forecastPerformance}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={2.4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="outlined"
              startIcon={<FileDownload />}
              onClick={handleExportCSV}
              sx={{ minWidth: 160 }}
            >
              Download CSV
            </Button>
          </Grid>
        </Grid>

        {/* Controls */}
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

        {/* Farmers Table */}
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="farmers table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ minWidth: 160, fontWeight: 700 }}>Name</TableCell>
                  <TableCell align="center" sx={{ minWidth: 140, fontWeight: 700 }}>Role</TableCell>
                  <TableCell align="center" sx={{ minWidth: 120, fontWeight: 700 }}>Attendance</TableCell>
                  <TableCell align="center" sx={{ minWidth: 150, fontWeight: 700 }}>Performance</TableCell>
                  <TableCell align="center" sx={{ width: 120, fontWeight: 700 }}>Actions</TableCell>
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
                      <TableCell align="center" sx={{ minWidth: 160 }}>{emp.name}</TableCell>
                      <TableCell align="center" sx={{ minWidth: 140 }}>{emp.role}</TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>{emp.attendance}</TableCell>
                      <TableCell align="center" sx={{ minWidth: 150 }}>{emp.performance}</TableCell>
                      <TableCell align="center" sx={{ width: 120 }}>
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

        {/* Attendance Trend Toggle */}
        <Box sx={{ mt: 6, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" fontWeight={700}>
            Attendance Trend ({trendView === 'weekly' ? 'Last Week' : 'Last Month'})
          </Typography>
          <Button
            variant={trendView === 'weekly' ? 'contained' : 'outlined'}
            onClick={() => setTrendView('weekly')}
            sx={{ ml: 2 }}
          >
            Weekly
          </Button>
          <Button
            variant={trendView === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setTrendView('monthly')}
          >
            Monthly
          </Button>
        </Box>
        <Box sx={{ height: 280, mb: 4 }}>
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
              <Line
                type="monotone"
                dataKey="present"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: theme.palette.primary.main }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Pie Charts */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Farmers by Role
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roleCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {roleCounts.map((entry, idx) => (
                      <Cell key={`cell-role-${idx}`} fill={ROLE_COLORS[idx % ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                Performance Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={performanceCounts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {performanceCounts.map((entry, idx) => (
                      <Cell key={`cell-perf-${idx}`} fill={PERFORMANCE_COLORS[idx % PERFORMANCE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{editingFarmer ? 'Edit Farmer' : 'Add Farmer'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
              fullWidth
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
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
                onChange={(e) => setFormData((f) => ({ ...f, attendance: e.target.value as Farmer['attendance'] }))}
              >
                {attendanceLevels.map((att) => (
                  <MenuItem key={att} value={att}>{att}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>Performance</InputLabel>
              <Select
                value={formData.performance}
                label="Performance"
                onChange={(e) => setFormData((f) => ({ ...f, performance: e.target.value as Farmer['performance'] }))}
              >
                {performanceLevels.map((perf) => (
                  <MenuItem key={perf} value={perf}>{perf}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingFarmer ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default FarmerWorkforce;
