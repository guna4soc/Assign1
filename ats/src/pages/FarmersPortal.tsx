// FarmerManagementDashboard.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Typography, Paper, TextField, Button, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, MenuItem, Grid, Card, CardContent, Switch, FormControlLabel, Rating, Chip, Tooltip, Stack
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
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        maxWidth: '100vw',
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
        margin: 'auto',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f8fafc',
        borderRadius: 3,
        boxShadow: 4,
        minHeight: '100vh',
        transition: 'background 0.3s',
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 3 },
          mb: 3,
          background: (theme) => theme.palette.mode === 'dark' ? '#232946' : 'linear-gradient(90deg, #b2f7ef 0%, #e0f7fa 100%)',
          color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#00897b',
          textAlign: 'center',
          boxShadow: 3,
          transition: 'background 0.3s',
        }}
      >
        <Typography variant="h5" fontWeight="bold" letterSpacing={1} sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.08)', fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.7rem' } }}>
          Farmer Management Dashboard
        </Typography>
      </Box>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{
            height: 120,
            background: (theme) => theme.palette.mode === 'dark' ? '#2d3250' : '#ffe082',
            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 4,
            borderRadius: 3,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #3f51b5' : 'none',
            transition: 'background 0.3s',
          }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.15rem">Total Farmers</Typography>
              <Typography variant="h4" fontWeight="bold">{totalFarmers}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{
            height: 120,
            background: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#b2bec3',
            color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#222',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 4,
            borderRadius: 3,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #00b894' : 'none',
            transition: 'background 0.3s',
          }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.15rem">Avg. Farm Size</Typography>
              <Typography variant="h4" fontWeight="bold">{averageFarmSize}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{
            height: 120,
            background: (theme) => theme.palette.mode === 'dark' ? '#00b894' : '#00b894',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 4,
            borderRadius: 3,
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid #fff' : 'none',
            transition: 'background 0.3s',
          }}>
            <CardContent sx={{ p: 1, textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="1.15rem">Top Location</Typography>
              <Typography variant="h4" fontWeight="bold">{locationWithMostFarmers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FARMER FORM */}
      <Paper sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff',
        transition: 'background 0.3s',
      }}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary.main">Farmers Database</Typography>
        <form onSubmit={handleAddFarmer} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farmer ID" name="id" value={farmerForm.id} onChange={handleFarmerChange} required error={!!farmerIdError} helperText={farmerIdError} inputProps={{ maxLength: 7 }} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farmer Name" name="name" value={farmerForm.name} onChange={handleFarmerChange} required error={!!farmerNameError} helperText={farmerNameError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farm Name" name="farmName" value={farmerForm.farmName} onChange={handleFarmerChange} required error={!!farmNameError} helperText={farmNameError} inputProps={{ maxLength: 15 }} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Location" name="location" value={farmerForm.location} onChange={handleFarmerChange} required error={!!locationError} helperText={locationError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farm Size (acres)" name="size" value={farmerForm.size} onChange={handleFarmerChange} required error={!!sizeError} helperText={sizeError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField select fullWidth label="Farm Type" name="farmType" value={farmerForm.farmType} onChange={handleFarmerChange} required error={!!farmTypeError} helperText={farmTypeError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }}>
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
                label="Organic"
                sx={{ ml: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                name="satisfaction"
                value={farmerForm.satisfaction}
                onChange={handleSatisfactionChange}
                max={5}
                sx={{ verticalAlign: 'middle', mr: 1 }}
              />
              <Typography component="span">Satisfaction</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField select fullWidth label="Produce Season" name="produceSeason" value={farmerForm.produceSeason} onChange={handleFarmerChange} required error={!!produceSeasonError} helperText={produceSeasonError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }}>
                <MenuItem value="">Select season</MenuItem>
                {seasons.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField fullWidth label="Farm Color" name="farmColor" value={farmerForm.farmColor} onChange={handleFarmerChange} required error={!!farmColorError} helperText={farmColorError} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#181a20' : '#f4f6fa', borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', background: farmerForm.farmColor, border: '2px solid #bbb', ml: 1, boxShadow: 1 }} />
            </Grid>
            <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: 2 }}>
              {editFarmerIdx === null ? (
                <Button type="submit" variant="contained" color="primary" disabled={!canSubmitFarmer()} sx={{ px: 4, py: 1.2, fontWeight: 'bold', borderRadius: 2, boxShadow: 2 }}>
                  Add Farmer
                </Button>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="primary" onClick={handleSaveEditFarmer} disabled={!canSubmitFarmer()} sx={{ px: 4, py: 1.2, fontWeight: 'bold', borderRadius: 2, boxShadow: 2 }}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleCloseDialog} sx={{ px: 4, py: 1.2, fontWeight: 'bold', borderRadius: 2 }}>
                    Cancel
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* FARMERS TABLE */}
      <Paper sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff',
        transition: 'background 0.3s',
      }}>
        <Typography variant="h5" fontWeight="bold" mb={2} color="primary.main">All Farmers</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Farm Name</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Location</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Size</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Type</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Organic</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Satisfaction</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Season</TableCell>
                <TableCell sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold', textAlign: 'center' }}>Color</TableCell>
                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', color: '#01579b', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {farmers.map((f, idx) => (
                <TableRow key={f.id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#f1f8e9' } }}>
                  <TableCell align="center">{f.id}</TableCell>
                  <TableCell align="center">{f.name}</TableCell>
                  <TableCell align="center">{f.farmName}</TableCell>
                  <TableCell align="center">{f.location}</TableCell>
                  <TableCell align="center">{f.size}</TableCell>
                  <TableCell align="center">{f.farmType}</TableCell>
                  <TableCell align="center">
                    {f.isOrganic ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" color="default" size="small" />}
                  </TableCell>
                  <TableCell align="center">
                    <Rating value={f.satisfaction} readOnly max={5} size="small" />
                  </TableCell>
                  <TableCell align="center">{f.produceSeason}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', background: f.farmColor, border: '1px solid #ddd', mx: 'auto', boxShadow: 1 }} />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditFarmer(idx)} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#e3f2fd', '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? '#3f51b5' : '#bbdefb' } }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteFarmer(idx)} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#ffebee', '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? '#d63031' : '#ffcdd2' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* CHARTS */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 370, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 4, borderRadius: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff', transition: 'background 0.3s' }}>
            <CardContent sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontWeight="bold" mb={1} color="primary.main">Distribution by Farm Type</Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <Pie data={pieData} options={{ ...baseChartOptions, plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farm Types' } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 370, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 4, borderRadius: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff', transition: 'background 0.3s' }}>
            <CardContent sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontWeight="bold" mb={1} color="primary.main">Farmers by Location</Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <Bar data={barDataLocationCounts} options={{ ...baseChartOptions, plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farmers by Location' } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 370, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 4, borderRadius: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff', transition: 'background 0.3s' }}>
            <CardContent sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontWeight="bold" mb={1} color="primary.main">Average Farm Size by Location</Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <Bar data={barDataAvgSize} options={{ ...baseChartOptions, plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Average Farm Size by Location' } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 370, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 4, borderRadius: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#232946' : '#fff', transition: 'background 0.3s' }}>
            <CardContent sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Typography fontWeight="bold" mb={1} color="primary.main">Farm Size Frequency</Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <Scatter data={scatterData} options={{ ...baseChartOptions, plugins: { ...baseChartOptions.plugins, title: { ...baseChartOptions.plugins.title, text: 'Farm Size Frequency' } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmerManagementDashboard;
