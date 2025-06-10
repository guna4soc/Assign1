// FarmerManagementDashboard.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, TextField, Button, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Grid, Card, CardContent, CardHeader, Switch, FormControlLabel, Rating, Chip, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Pie, Bar, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale,
  LinearScale, BarElement, Title, PointElement
} from 'chart.js';

ChartJS.register(
  ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement
);

interface Farmer {
  id: string;
  name: string;
  farmName: string;
  location: string;
  size: string;
  farmType: string;
  isOrganic: boolean;
  satisfaction: number;
  produceSeason: string;
  farmColor: string;
}

const farmTypes = ['Dairy', 'Poultry', 'Crop', 'Mixed'];
const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];

const FarmerManagementDashboard: React.FC = () => {
  // Farmer state and form
  const [farmers, setFarmers] = useState<Farmer[]>([
    { id: 'FARM001', name: 'Anita', farmName: 'Green Pastures', location: 'Springfield', size: '12', farmType: 'Dairy', isOrganic: true, satisfaction: 4, produceSeason: 'Spring', farmColor: '#a5d6a7' },
    { id: 'FARM002', name: 'Bhavesh', farmName: 'Sunny Acres', location: 'Riverside', size: '8.5', farmType: 'Crop', isOrganic: false, satisfaction: 3, produceSeason: 'Summer', farmColor: '#ffe082' },
    { id: 'FARM003', name: 'Carlos', farmName: 'Happy Hills', location: 'Springfield', size: '15', farmType: 'Mixed', isOrganic: true, satisfaction: 5, produceSeason: 'Autumn', farmColor: '#90caf9' },
  ]);
  const [farmerForm, setFarmerForm] = useState<Farmer>({
    id: '',
    name: '',
    farmName: '',
    location: '',
    size: '',
    farmType: '',
    isOrganic: false,
    satisfaction: 3,
    produceSeason: '',
    farmColor: '#a5d6a7',
  });
  const [editFarmerIdx, setEditFarmerIdx] = useState<number | null>(null);

  // Error state
  const [farmerIdError, setFarmerIdError] = useState('');
  const [farmerNameError, setFarmerNameError] = useState('');
  const [farmNameError, setFarmNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [farmTypeError, setFarmTypeError] = useState('');
  const [produceSeasonError, setProduceSeasonError] = useState('');
  const [farmColorError, setFarmColorError] = useState('');

  // Validation Helpers
  const validateFarmerId = (value: string) => /^[A-Z]{4}\d{3}$/.test(value) && value.length === 7;
  const validateFarmName = (value: string) => value.length <= 15;
  const validateCapitalLetter = (value: string) => /^[A-Z][a-zA-Z ]*$/.test(value);
  const validateNonEmpty = (value: string) => value.trim().length > 0;
  const validatePositiveNumber = (value: string) => /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0 && parseFloat(value) < 999;
  const validateColor = (value: string) => /^#[0-9A-Fa-f]{6}$/.test(value);

  // Handle form input changes
  const handleFarmerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let err = '';
    let val: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    switch (name) {
      case 'id':
        err = !validateFarmerId(val) ? 'Format: 4 uppercase letters + 3 digits (e.g., FARM001)' : '';
        setFarmerIdError(err);
        break;
      case 'name':
        err = !validateCapitalLetter(val) ? 'Start with capital letter; alphabets/spaces only' : '';
        setFarmerNameError(err);
        break;
      case 'farmName':
        err = !validateFarmName(val) ? 'Max 15 characters' : '';
        setFarmNameError(err);
        break;
      case 'location':
        err = !validateCapitalLetter(val) ? 'Start with capital letter; alphabets/spaces only' : '';
        setLocationError(err);
        break;
      case 'size':
        err = !validatePositiveNumber(val) ? 'Positive number less than 100' : '';
        setSizeError(err);
        break;
      case 'farmType':
        err = !validateNonEmpty(val) ? 'Please select farm type' : '';
        setFarmTypeError(err);
        break;
      case 'produceSeason':
        err = !validateNonEmpty(val) ? 'Please select produce season' : '';
        setProduceSeasonError(err);
        break;
      case 'farmColor':
        err = !validateColor(val) ? 'Enter a valid hex color (e.g., #aabbcc)' : '';
        setFarmColorError(err);
        break;
    }
    setFarmerForm((prev) => ({ ...prev, [name]: val }));
  };

  // Handle satisfaction rating
  const handleSatisfactionChange = (_: any, value: number | null) => {
    setFarmerForm((prev) => ({ ...prev, satisfaction: value || 1 }));
  };

  // Check if form can be submitted
  const canSubmitFarmer = () =>
    farmerForm.id.trim() !== '' &&
    farmerForm.name.trim() !== '' &&
    farmerForm.farmName.trim() !== '' &&
    farmerForm.location.trim() !== '' &&
    farmerForm.size.trim() !== '' &&
    farmerForm.farmType.trim() !== '' &&
    farmerForm.produceSeason.trim() !== '' &&
    farmerForm.farmColor.trim() !== '' &&
    !farmerIdError &&
    !farmerNameError &&
    !farmNameError &&
    !locationError &&
    !sizeError &&
    !farmTypeError &&
    !produceSeasonError &&
    !farmColorError;

  // Add new farmer
  const handleAddFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmitFarmer()) {
      setFarmers([...farmers, farmerForm]);
      setFarmerForm({
        id: '',
        name: '',
        farmName: '',
        location: '',
        size: '',
        farmType: '',
        isOrganic: false,
        satisfaction: 3,
        produceSeason: '',
        farmColor: '#a5d6a7',
      });
      resetErrors();
    }
  };

  // Delete farmer by index
  const handleDeleteFarmer = (idx: number) => {
    setFarmers(farmers.filter((_, i) => i !== idx));
  };

  // Edit farmer by index
  const handleEditFarmer = (idx: number) => {
    setEditFarmerIdx(idx);
    setFarmerForm(farmers[idx]);
    resetErrors();
  };

  // Save edited farmer
  const handleSaveEditFarmer = () => {
    if (editFarmerIdx !== null && canSubmitFarmer()) {
      const updated = [...farmers];
      updated[editFarmerIdx] = farmerForm;
      setFarmers(updated);
      setEditFarmerIdx(null);
      setFarmerForm({
        id: '',
        name: '',
        farmName: '',
        location: '',
        size: '',
        farmType: '',
        isOrganic: false,
        satisfaction: 3,
        produceSeason: '',
        farmColor: '#a5d6a7',
      });
      resetErrors();
    }
  };

  // Reset all errors
  const resetErrors = () => {
    setFarmerIdError('');
    setFarmerNameError('');
    setFarmNameError('');
    setLocationError('');
    setSizeError('');
    setFarmTypeError('');
    setProduceSeasonError('');
    setFarmColorError('');
  };

  // Aggregate data for charts
  const farmTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    farmTypes.forEach((ft) => (counts[ft] = 0));
    farmers.forEach((f) => {
      if (counts[f.farmType] !== undefined) counts[f.farmType]++;
    });
    return counts;
  }, [farmers]);

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    farmers.forEach((f) => {
      const loc = f.location.trim();
      counts[loc] = (counts[loc] || 0) + 1;
    });
    return counts;
  }, [farmers]);

  const avgSizeByLocation = useMemo(() => {
    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};
    farmers.forEach((f) => {
      const loc = f.location.trim();
      const size = parseFloat(f.size) || 0;
      sums[loc] = (sums[loc] || 0) + size;
      counts[loc] = (counts[loc] || 0) + 1;
    });
    const averages: Record<string, number> = {};
    Object.keys(sums).forEach((loc) => {
      averages[loc] = sums[loc] / counts[loc];
    });
    return averages;
  }, [farmers]);

  const farmSizeFrequency = useMemo(() => {
    const freqMap: Record<number, number> = {};
    farmers.forEach((f) => {
      const size = Math.round(parseFloat(f.size));
      if (size > 0) freqMap[size] = (freqMap[size] || 0) + 1;
    });
    return Object.entries(freqMap).map(([size, freq]) => ({
      x: Number(size),
      y: freq,
    }));
  }, [farmers]);

  // Quick stats
  const totalFarmers = farmers.length;
  const averageFarmSize = totalFarmers
    ? (farmers.reduce((sum, f) => sum + parseFloat(f.size || '0'), 0) / totalFarmers).toFixed(2)
    : '0';
  const locationWithMostFarmers = useMemo(() => {
    let maxLoc = '';
    let maxCount = 0;
    for (const loc in locationCounts) {
      if (locationCounts[loc] > maxCount) {
        maxLoc = loc;
        maxCount = locationCounts[loc];
      }
    }
    return maxLoc;
  }, [locationCounts]);

  // Chart data definitions
  const pieData = {
    labels: farmTypes,
    datasets: [
      {
        label: 'Farm Types',
        data: farmTypes.map((ft) => farmTypeCounts[ft] || 0),
        backgroundColor: ['#00b894', '#fdcb6e', '#0984e3', '#d63031'],
        borderColor: 'white',
        borderWidth: 2,
      },
    ],
  };
  const barDataLocationCounts = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: 'Number of Farmers',
        data: Object.values(locationCounts),
        backgroundColor: '#0984e3',
      },
    ],
  };
  const barDataAvgSize = {
    labels: Object.keys(avgSizeByLocation),
    datasets: [
      {
        label: 'Avg Farm Size (acres)',
        data: Object.values(avgSizeByLocation).map((v) => parseFloat(v.toFixed(2))),
        backgroundColor: '#00b894',
      },
    ],
  };
  const scatterData = {
    datasets: [
      {
        label: 'Farm Size Frequency Distribution',
        data: farmSizeFrequency,
        backgroundColor: '#fdcb6e',
      },
    ],
  };
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { weight: 'bold' as const } },
      },
      title: {
        display: true,
        font: { size: 16, weight: 'bold' as const },
        text: '',
      },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  // Edit dialog
  const handleCloseDialog = () => {
    setEditFarmerIdx(null);
    setFarmerForm({
      id: '',
      name: '',
      farmName: '',
      location: '',
      size: '',
      farmType: '',
      isOrganic: false,
      satisfaction: 3,
      produceSeason: '',
      farmColor: '#a5d6a7',
    });
    resetErrors();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 1100, margin: 'auto', background: '#f8fafc', borderRadius: 2 }}>
      {/* HEADER */}
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          mb: 2,
          background: 'linear-gradient(90deg, #00b894 0%, #0984e3 100%)',
          color: '#fff',
          textAlign: 'center',
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Farmer Management Dashboard
        </Typography>
      </Box>

      {/* SUMMARY CARDS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 80, background: '#ffe082', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 2 }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.1rem">Total Farmers</Typography>
              <Typography variant="h5" fontWeight="bold">{totalFarmers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 80, background: '#b2bec3', color: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 2 }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.1rem">Avg. Farm Size</Typography>
              <Typography variant="h5" fontWeight="bold">{averageFarmSize}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ height: 80, background: '#00b894', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 2 }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.1rem">Top Location</Typography>
              <Typography variant="h5" fontWeight="bold">{locationWithMostFarmers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FARMER FORM */}
      <Paper sx={{ p: 2, mb: 2, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={1}>Farmers Database</Typography>
        <form onSubmit={handleAddFarmer} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farmer ID" name="id" value={farmerForm.id} onChange={handleFarmerChange} required error={!!farmerIdError} helperText={farmerIdError} inputProps={{ maxLength: 7 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farmer Name" name="name" value={farmerForm.name} onChange={handleFarmerChange} required error={!!farmerNameError} helperText={farmerNameError} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farm Name" name="farmName" value={farmerForm.farmName} onChange={handleFarmerChange} required error={!!farmNameError} helperText={farmNameError} inputProps={{ maxLength: 15 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Location" name="location" value={farmerForm.location} onChange={handleFarmerChange} required error={!!locationError} helperText={locationError} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farm Size (acres)" name="size" value={farmerForm.size} onChange={handleFarmerChange} required error={!!sizeError} helperText={sizeError} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField select fullWidth label="Farm Type" name="farmType" value={farmerForm.farmType} onChange={handleFarmerChange} required error={!!farmTypeError} helperText={farmTypeError}>
                <MenuItem value="">Select farm type</MenuItem>
                {farmTypes.map((ft) => <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
              </TextField>
            </Grid>
            {/* CREATIVE FIELDS */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={farmerForm.isOrganic}
                    onChange={e => setFarmerForm(f => ({ ...f, isOrganic: e.target.checked }))}
                    name="isOrganic"
                    color="success"
                  />
                }
                label="Certified Organic?"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Tooltip title="Farmer Satisfaction (1-5)">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>Satisfaction:</Typography>
                  <Rating
                    name="satisfaction"
                    value={farmerForm.satisfaction}
                    onChange={handleSatisfactionChange}
                  />
                </Box>
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Produce Season"
                name="produceSeason"
                value={farmerForm.produceSeason}
                onChange={handleFarmerChange}
                required
                error={!!produceSeasonError}
                helperText={produceSeasonError}
              >
                <MenuItem value="">Select season</MenuItem>
                {seasons.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Farm Color (hex)"
                name="farmColor"
                value={farmerForm.farmColor}
                onChange={handleFarmerChange}
                required
                error={!!farmColorError}
                helperText={farmColorError || 'e.g., #aabbcc'}
                inputProps={{ maxLength: 7 }}
                type="color"
                sx={{ width: 80, height: 40, p: 0 }}
              />
              <Chip label={farmerForm.farmColor} sx={{ ml: 2, background: farmerForm.farmColor, color: '#fff' }} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="success" disabled={!canSubmitFarmer()} sx={{ mt: 2 }}>
            Add Farmer
          </Button>
        </form>
      </Paper>

      {/* TABLE */}
      {/* FARMERS TABLE */}
<TableContainer component={Paper} sx={{ mt: 3, mb: 4, boxShadow: 3 }}>
  <Table>
    <TableHead sx={{ background: '#e3f2fd' }}>
      <TableRow>
        <TableCell>Farmer ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Farm Name</TableCell>
        <TableCell>Location</TableCell>
        <TableCell>Size (acres)</TableCell>
        <TableCell>Farm Type</TableCell>
        <TableCell>Organic</TableCell>
        <TableCell>Satisfaction</TableCell>
        <TableCell>Produce Season</TableCell>
        <TableCell>Farm Color</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {farmers.map((farmer, idx) => (
        <TableRow key={farmer.id}>
          <TableCell>{farmer.id}</TableCell>
          <TableCell>{farmer.name}</TableCell>
          <TableCell>{farmer.farmName}</TableCell>
          <TableCell>{farmer.location}</TableCell>
          <TableCell>{farmer.size}</TableCell>
          <TableCell>{farmer.farmType}</TableCell>
          <TableCell>
            {farmer.isOrganic ? (
              <Chip label="Yes" color="success" size="small" />
            ) : (
              <Chip label="No" color="default" size="small" />
            )}
          </TableCell>
          <TableCell>
            <Rating value={farmer.satisfaction} readOnly size="small" />
          </TableCell>
          <TableCell>{farmer.produceSeason}</TableCell>
          <TableCell>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                width: 20, height: 20, borderRadius: '50%',
                background: farmer.farmColor, border: '1px solid #ccc', mr: 1
              }} />
              <Typography variant="caption">{farmer.farmColor}</Typography>
            </Box>
          </TableCell>
          <TableCell align="center">
            {/* Actions: Edit and Delete horizontally */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={() => handleEditFarmer(idx)}
                  size="small"
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleDeleteFarmer(idx)}
                  size="small"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      {/* CHARTS */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Farm Types Distribution
            </Typography>
            <Box sx={{ height: 230 }}>
              <Pie
                data={pieData}
                options={{
                  ...baseChartOptions,
                  plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farm Types' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Farmers by Location
            </Typography>
            <Box sx={{ height: 230 }}>
              <Bar
                data={barDataLocationCounts}
                options={{
                  ...baseChartOptions,
                  plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farmers by Location' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Avg. Farm Size by Location
            </Typography>
            <Box sx={{ height: 230 }}>
              <Bar
                data={barDataAvgSize}
                options={{
                  ...baseChartOptions,
                  plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Avg. Farm Size by Location' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, boxShadow: 2, background: '#fff' }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Farm Size Frequency
            </Typography>
            <Box sx={{ height: 230 }}>
              <Scatter
                data={scatterData}
                options={{
                  ...baseChartOptions,
                  plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farm Size Frequency' } },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editFarmerIdx !== null} onClose={handleCloseDialog}>
        <DialogTitle>Edit Farmer</DialogTitle>
        <DialogContent>
          <form noValidate>
            <TextField fullWidth label="Farmer ID" name="id" value={farmerForm.id} onChange={handleFarmerChange} margin="normal" required error={!!farmerIdError} helperText={farmerIdError} inputProps={{ maxLength: 7 }} />
            <TextField fullWidth label="Farmer Name" name="name" value={farmerForm.name} onChange={handleFarmerChange} margin="normal" required error={!!farmerNameError} helperText={farmerNameError} />
            <TextField fullWidth label="Farm Name" name="farmName" value={farmerForm.farmName} onChange={handleFarmerChange} margin="normal" required error={!!farmNameError} helperText={farmNameError} inputProps={{ maxLength: 15 }} />
            <TextField fullWidth label="Location" name="location" value={farmerForm.location} onChange={handleFarmerChange} margin="normal" required error={!!locationError} helperText={locationError} />
            <TextField fullWidth label="Farm Size (acres)" name="size" value={farmerForm.size} onChange={handleFarmerChange} margin="normal" required error={!!sizeError} helperText={sizeError} />
            <TextField select fullWidth label="Farm Type" name="farmType" value={farmerForm.farmType} onChange={handleFarmerChange} margin="normal" required error={!!farmTypeError} helperText={farmTypeError}>
              <MenuItem value="">Select farm type</MenuItem>
              {farmTypes.map((ft) => <MenuItem key={ft} value={ft}>{ft}</MenuItem>)}
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={farmerForm.isOrganic}
                  onChange={e => setFarmerForm(f => ({ ...f, isOrganic: e.target.checked }))}
                  name="isOrganic"
                  color="success"
                />
              }
              label="Certified Organic?"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography>Satisfaction:</Typography>
              <Rating name="satisfaction" value={farmerForm.satisfaction} onChange={handleSatisfactionChange} />
            </Box>
            <TextField select fullWidth label="Produce Season" name="produceSeason" value={farmerForm.produceSeason} onChange={handleFarmerChange} margin="normal" required error={!!produceSeasonError} helperText={produceSeasonError}>
              <MenuItem value="">Select season</MenuItem>
              {seasons.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Farm Color (hex)" name="farmColor" value={farmerForm.farmColor} onChange={handleFarmerChange} margin="normal" required error={!!farmColorError} helperText={farmColorError || 'e.g., #aabbcc'} inputProps={{ maxLength: 7 }} type="color" sx={{ width: 80, height: 40, p: 0 }} />
            <Chip label={farmerForm.farmColor} sx={{ ml: 2, background: farmerForm.farmColor, color: '#fff' }} />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveEditFarmer} color="success" disabled={!canSubmitFarmer()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmerManagementDashboard;
