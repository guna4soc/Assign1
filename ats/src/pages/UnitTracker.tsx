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
  ThemeProvider,
  createTheme,
  Tooltip,
  Paper,
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
} from 'recharts';

type ProcessingUnit = {
  id: number;
  name: string;
  status: 'Active' | 'Pending' | 'Inactive';
  info: string;
  records: number;
  uptimeHours: number;
};

const initialProcessingUnits: ProcessingUnit[] = [
  { id: 1, name: 'Unit A', status: 'Active', info: 'Running smoothly', records: 120, uptimeHours: 1024 },
  { id: 2, name: 'Unit B', status: 'Active', info: 'Maintaining performance', records: 85, uptimeHours: 890 },
  { id: 3, name: 'Unit C', status: 'Pending', info: 'Waiting for approval', records: 0, uptimeHours: 0 },
  { id: 4, name: 'Unit D', status: 'Inactive', info: 'Currently offline', records: 45, uptimeHours: 430 },
];

const getSummaryData = (units: ProcessingUnit[]) => {
  const total = units.length;
  const active = units.filter((u) => u.status === 'Active').length;
  const pending = units.filter((u) => u.status === 'Pending').length;
  const totalRecords = units.reduce((acc, u) => acc + u.records, 0);
  const avgUptime = units.length ? Math.round(units.reduce((acc, u) => acc + u.uptimeHours, 0) / units.length) : 0;
  return [
    { label: 'Total Units', value: total, icon: <StorageIcon fontSize="medium" color="primary" /> },
    { label: 'Active Units', value: active, icon: <CheckCircleOutlineIcon fontSize="medium" color="success" /> },
    { label: 'Pending Units', value: pending, icon: <TimerIcon fontSize="medium" color="warning" /> },
    { label: 'Avg Uptime (hrs)', value: avgUptime, icon: <AssessmentIcon fontSize="medium" color="info" /> },
    { label: 'Total Records', value: totalRecords, icon: <AssessmentIcon fontSize="medium" color="info" /> },
  ];
};

const lineChartData = [
  { date: 'Mon', UnitA: 15, UnitB: 12, UnitD: 8 },
  { date: 'Tue', UnitA: 17, UnitB: 14, UnitD: 11 },
  { date: 'Wed', UnitA: 14, UnitB: 10, UnitD: 9 },
  { date: 'Thu', UnitA: 19, UnitB: 13, UnitD: 12 },
  { date: 'Fri', UnitA: 21, UnitB: 16, UnitD: 15 },
  { date: 'Sat', UnitA: 25, UnitB: 18, UnitD: 16 },
  { date: 'Sun', UnitA: 22, UnitB: 15, UnitD: 14 },
];

const pieData = [
  { name: 'Active', value: 2, color: '#10b981' },
  { name: 'Pending', value: 1, color: '#f59e0b' },
  { name: 'Inactive', value: 1, color: '#6b7280' },
];

const ProcessingUnits: React.FC = () => {
  const [units, setUnits] = useState<ProcessingUnit[]>(initialProcessingUnits);
  const summaryData = getSummaryData(units);

  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Pending' | 'Inactive'>('All');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogUnit, setEditDialogUnit] = useState<ProcessingUnit | null>(null);
  const [deleteConfirmUnit, setDeleteConfirmUnit] = useState<ProcessingUnit | null>(null);

  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [formInfo, setFormInfo] = useState('');
  const [formRecords, setFormRecords] = useState<number>(0);
  const [formUptime, setFormUptime] = useState<number>(0);

  const resetFormFields = () => {
    setFormName('');
    setFormStatus('Active');
    setFormInfo('');
    setFormRecords(0);
    setFormUptime(0);
  };

  const handleOpenAddDialog = () => {
    resetFormFields();
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    resetFormFields();
  };

  const handleOpenEditDialog = (unit: ProcessingUnit) => {
    setEditDialogUnit(unit);
    setFormName(unit.name);
    setFormStatus(unit.status);
    setFormInfo(unit.info);
    setFormRecords(unit.records);
    setFormUptime(unit.uptimeHours);
  };

  const handleCloseEditDialog = () => {
    setEditDialogUnit(null);
    resetFormFields();
  };

  const handleOpenDeleteConfirm = (unit: ProcessingUnit) => {
    setDeleteConfirmUnit(unit);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmUnit(null);
  };

  const isFormValid = () => {
    return formName.trim() !== '' && formInfo.trim() !== '' && formRecords >= 0 && formUptime >= 0;
  };

  const handleAddUnit = () => {
    if (!isFormValid()) return;
    const newUnit: ProcessingUnit = {
      id: units.length > 0 ? Math.max(...units.map((u) => u.id)) + 1 : 1,
      name: formName.trim(),
      status: formStatus,
      info: formInfo.trim(),
      records: formRecords,
      uptimeHours: formUptime,
    };
    setUnits([newUnit, ...units]);
    handleCloseAddDialog();
  };

  const handleUpdateUnit = () => {
    if (!isFormValid() || !editDialogUnit) return;
    setUnits(
      units.map((u) =>
        u.id === editDialogUnit.id
          ? { ...u, name: formName.trim(), status: formStatus, info: formInfo.trim(), records: formRecords, uptimeHours: formUptime }
          : u
      )
    );
    handleCloseEditDialog();
  };

  const handleDeleteUnit = () => {
    if (!deleteConfirmUnit) return;
    setUnits(units.filter((u) => u.id !== deleteConfirmUnit.id));
    handleCloseDeleteConfirm();
  };

  const filteredUnits = filterStatus === 'All' ? units : units.filter((u) => u.status === filterStatus);

  const outerTheme = useMemo(() =>
    createTheme({
      palette: {
        mode: 'light',
        primary: { main: '#111827' },
        secondary: { main: '#6b7280' },
        background: { default: '#ffffff', paper: '#ffffff' },
        text: { primary: '#111827', secondary: '#6b7280' },
      },
      typography: {
        fontFamily: "'Inter', Arial, sans-serif",
        h1: { fontWeight: 700, fontSize: 48, lineHeight: 1.2 },
        h3: { fontWeight: 700, fontSize: 32, lineHeight: 1.3 },
        h4: { fontWeight: 700, fontSize: 24 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        body1: { fontSize: 16, color: '#6b7280' },
        button: { fontWeight: 700, textTransform: 'none' },
      },
      shape: { borderRadius: 12 },
      components: {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: '0 3px 6px rgba(0,0,0,0.05)',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                transform: 'translateY(-3px)',
              },
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              paddingLeft: 20,
              paddingRight: 20,
              fontWeight: 700,
              fontSize: 14,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                transform: 'scale(1.04)',
              },
              '&:focus-visible': {
                outline: '2px solid #2563eb',
                outlineOffset: 2,
              },
            },
            containedPrimary: {
              backgroundColor: '#111827',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#1e293b',
              },
            },
          },
        },
      },
    }),
  []);

  return (
    <ThemeProvider theme={outerTheme}>
      <CssBaseline />
      {/* Header with cool blue/teal gradient */}
      <Box
        component="header"
        sx={{
          width: '100%',
          height: 64,
          background: 'linear-gradient(90deg, #2dd4bf 0%, #60a5fa 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          userSelect: 'none',
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.02em',
          boxShadow: '0 2px 8px 0 rgba(34,197,94,0.07)',
          border: 0,
          position: 'relative',
          zIndex: 10,
        }}
        aria-label="Processing Units header"
      >
        Processing Units
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, pt: 8, pb: 20 }}>
        {/* Summary Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {summaryData.map(({ label, value, icon }) => (
            <Grid item xs={12} sm={6} md={2.4} key={label}>
              <Card
                sx={{
                  minHeight: 150,
                  textAlign: 'center',
                  py: 3,
                  px: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                role="region"
                aria-label={`${label} summary card`}
                elevation={0}
                variant="outlined"
              >
                <Box sx={{ color: 'primary.main', mb: 2, mx: 'auto' }}>{icon}</Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {value}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary', mt: 0.75 }}>
                  {label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Controls */}
        <Box sx={{ mb: 8, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 160 }} size="small">
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
          <Button variant="contained" color="primary" onClick={handleOpenAddDialog} size="medium" sx={{ whiteSpace: 'nowrap' }}>
            + Add New Unit
          </Button>
        </Box>

        {/* Units List */}
        {filteredUnits.length === 0 ? (
          <Typography sx={{ color: 'text.secondary', fontSize: 16, mb: 12 }}>
            No processing units match the selected filter.
          </Typography>
        ) : (
          <Grid container spacing={4} sx={{ mb: 12 }}>
            {filteredUnits.map(unit => (
              <Grid item xs={12} sm={6} md={4} key={unit.id}>
                <Card
                  role="article"
                  tabIndex={0}
                  aria-label={`Processing unit: ${unit.name}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 180,
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    '&:hover, &:focus-within': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 20px rgb(0 0 0 / 0.1)',
                      outline: 'none',
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom noWrap>
                      {unit.name}
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          unit.status === 'Active'
                            ? '#10b981'
                            : unit.status === 'Pending'
                            ? '#f59e0b'
                            : 'text.secondary',
                        fontWeight: 600,
                        mb: 1,
                        fontSize: '0.875rem',
                        userSelect: 'none',
                      }}
                    >
                      {unit.status}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {unit.info}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Records Processed: {unit.records}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 1 }}>
                      Uptime (hrs): {unit.uptimeHours}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Unit" arrow>
                        <IconButton
                          aria-label={`Edit ${unit.name}`}
                          size="small"
                          onClick={() => handleOpenEditDialog(unit)}
                          sx={{ p: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Unit" arrow>
                        <IconButton
                          aria-label={`Delete ${unit.name}`}
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(unit)}
                          sx={{ p: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Visualizations */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                height: 320,
                boxShadow: 'none',
                userSelect: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
              role="figure"
              aria-label="Daily processing records by unit line chart"
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'text.secondary' }}>
                Daily Processing Records
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={lineChartData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="UnitA" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="UnitB" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="UnitD" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                p: 3,
                height: 320,
                boxShadow: 'none',
                userSelect: 'none',
                border: '1px solid',
                borderColor: 'divider',
              }}
              role="figure"
              aria-label="Unit status distribution pie chart"
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'text.secondary' }}>
                Unit Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Add Unit Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Processing Unit</DialogTitle>
        <DialogContent>
          <TextField
            label="Unit Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formStatus}
              label="Status"
              onChange={e => setFormStatus(e.target.value as typeof formStatus)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Information"
            value={formInfo}
            onChange={e => setFormInfo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Records Processed"
            type="number"
            value={formRecords}
            onChange={e => setFormRecords(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Uptime (hrs)"
            type="number"
            value={formUptime}
            onChange={e => setFormUptime(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddUnit} disabled={!isFormValid()} variant="contained" color="primary">
            Add Unit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Unit Dialog */}
      <Dialog open={!!editDialogUnit} onClose={handleCloseEditDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Processing Unit</DialogTitle>
        <DialogContent>
          <TextField
            label="Unit Name"
            value={formName}
            onChange={e => setFormName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formStatus}
              label="Status"
              onChange={e => setFormStatus(e.target.value as typeof formStatus)}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Information"
            value={formInfo}
            onChange={e => setFormInfo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Records Processed"
            type="number"
            value={formRecords}
            onChange={e => setFormRecords(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Uptime (hrs)"
            type="number"
            value={formUptime}
            onChange={e => setFormUptime(Number(e.target.value))}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleUpdateUnit} disabled={!isFormValid()} variant="contained" color="primary">
            Update Unit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmUnit} onClose={handleCloseDeleteConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Processing Unit</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{' '}
            <strong>{deleteConfirmUnit?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteUnit} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default ProcessingUnits;
