import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Tooltip,
  useTheme,
  Grid,
  InputAdornment,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventIcon from '@mui/icons-material/Event';
import WaterIcon from '@mui/icons-material/Water';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import ScienceIcon from '@mui/icons-material/Science';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  Title as ChartTitle,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTooltip,
  Legend,
  ChartTitle,
);

interface QualityEntry {
  farmerId: string;
  date: string;
  pH: string;
  moistureContent: string;
  contaminants: string;
  lacometer: string;
  fat: string;
  snf: string;
}

const CARD_GRADIENTS = [
  'linear-gradient(90deg,rgb(15, 63, 111) 0%,rgb(78, 82, 82) 100%)',
  'linear-gradient(90deg,rgb(119, 117, 126) 0%,rgb(109, 122, 109) 100%)',
  'linear-gradient(90deg,rgb(15, 122, 15) 0%,rgb(2, 101, 94) 100%)',
  'linear-gradient(90deg,rgb(231, 95, 11) 0%,rgb(219, 97, 10) 100%)',
  'linear-gradient(90deg, #f06292 0%, #9575cd 100%)',
];

const QualityTest: React.FC = () => {
  const theme = useTheme();

  const [qualityEntries, setQualityEntries] = useState<QualityEntry[]>([
    {
      farmerId: 'FARM001',
      date: '2024-06-10',
      pH: '6.5',
      moistureContent: '12.0',
      contaminants: 'None',
      lacometer: '14',
      fat: '3.5',
      snf: '8.5',
    },
    {
      farmerId: 'FARM002',
      date: '2024-06-10',
      pH: '6.8',
      moistureContent: '11.5',
      contaminants: 'Low',
      lacometer: '15',
      fat: '3.8',
      snf: '8.7',
    },
    {
      farmerId: 'FARM003',
      date: '2024-06-11',
      pH: '7.1',
      moistureContent: '13.2',
      contaminants: 'Moderate',
      lacometer: '13',
      fat: '3.4',
      snf: '8.4',
    },
  ]);

  const [qualityForm, setQualityForm] = useState<QualityEntry>({
    farmerId: '',
    date: '',
    pH: '',
    moistureContent: '',
    contaminants: 'None',
    lacometer: '',
    fat: '',
    snf: '',
  });

  const [editIdx, setEditIdx] = useState<number | null>(null);

  const [errors, setErrors] = useState<Record<keyof QualityEntry, string>>({
    farmerId: '',
    date: '',
    pH: '',
    moistureContent: '',
    contaminants: '',
    lacometer: '',
    fat: '',
    snf: '',
  });

  // Validation helpers
  const validateFarmerId = (val: string) => /^[A-Z]{4}\d{3}$/.test(val);
  const validateDate = (val: string) => /^\d{4}-\d{2}-\d{2}$/.test(val);
  const validatePH = (val: string) => /^\d+(\.\d+)?$/.test(val) && +val >= 0 && +val <= 14;
  const validateMoisture = (val: string) => /^\d+(\.\d+)?$/.test(val) && +val >= 0 && +val <= 100;
  const validateLacometer = (val: string) => /^\d+(\.\d+)?$/.test(val) && +val >= 0 && +val <= 30;
  const validateFatOrSnf = (val: string) => /^\d+(\.\d+)?$/.test(val) && +val >= 0 && +val <= 20;
  const validateContaminants = (val: string) => ['None', 'Low', 'Moderate', 'High'].includes(val);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >,
  ) => {
    const name = e.target.name as keyof QualityEntry;
    const value = e.target.value as string;

    let error = '';
    if (name === 'farmerId') error = validateFarmerId(value) ? '' : 'Format: 4 uppercase letters + 3 digits, e.g. FARM001';
    else if (name === 'date') error = validateDate(value) ? '' : 'Invalid Date';
    else if (name === 'pH') error = validatePH(value) ? '' : 'pH must be between 0 and 14';
    else if (name === 'moistureContent') error = validateMoisture(value) ? '' : 'Moisture must be 0-100%';
    else if (name === 'lacometer') error = validateLacometer(value) ? '' : 'Lacometer must be 0-30%';
    else if (name === 'fat') error = validateFatOrSnf(value) ? '' : 'Fat % must be 0-20%';
    else if (name === 'snf') error = validateFatOrSnf(value) ? '' : 'SNF % must be 0-20%';
    else if (name === 'contaminants') error = validateContaminants(value) ? '' : 'Invalid contaminants level';

    setErrors(prev => ({ ...prev, [name]: error }));
    setQualityForm(prev => ({ ...prev, [name]: value }));
  };

  const canSubmit = () => {
    return (
      qualityForm.farmerId.trim() !== '' &&
      qualityForm.date.trim() !== '' &&
      qualityForm.pH.trim() !== '' &&
      qualityForm.moistureContent.trim() !== '' &&
      qualityForm.lacometer.trim() !== '' &&
      qualityForm.fat.trim() !== '' &&
      qualityForm.snf.trim() !== '' &&
      !errors.farmerId &&
      !errors.date &&
      !errors.pH &&
      !errors.moistureContent &&
      !errors.lacometer &&
      !errors.fat &&
      !errors.snf &&
      !errors.contaminants
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;
    setQualityEntries(prev => [...prev, qualityForm]);
    setQualityForm({
      farmerId: '',
      date: '',
      pH: '',
      moistureContent: '',
      contaminants: 'None',
      lacometer: '',
      fat: '',
      snf: '',
    });
    setErrors({
      farmerId: '',
      date: '',
      pH: '',
      moistureContent: '',
      contaminants: '',
      lacometer: '',
      fat: '',
      snf: '',
    });
  };

  const handleDelete = (idx: number) => {
    setQualityEntries(prev => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setQualityForm(qualityEntries[idx]);
    setErrors({
      farmerId: '',
      date: '',
      pH: '',
      moistureContent: '',
      contaminants: '',
      lacometer: '',
      fat: '',
      snf: '',
    });
  };

  const handleSaveEdit = () => {
    if (editIdx === null || !canSubmit()) return;
    const updated = [...qualityEntries];
    updated[editIdx] = qualityForm;
    setQualityEntries(updated);
    setEditIdx(null);
    setQualityForm({
      farmerId: '',
      date: '',
      pH: '',
      moistureContent: '',
      contaminants: 'None',
      lacometer: '',
      fat: '',
      snf: '',
    });
    setErrors({
      farmerId: '',
      date: '',
      pH: '',
      moistureContent: '',
      contaminants: '',
      lacometer: '',
      fat: '',
      snf: '',
    });
  };

  // Summary stats
  const totalEntries = qualityEntries.length;
  const averageMoisture = totalEntries > 0 ? (qualityEntries.reduce((acc, e) => acc + +e.moistureContent, 0) / totalEntries).toFixed(2) : 'N/A';
  const averageLacometer = totalEntries > 0 ? (qualityEntries.reduce((acc, e) => acc + +e.lacometer, 0) / totalEntries).toFixed(2) : 'N/A';
  const averageFat = totalEntries > 0 ? (qualityEntries.reduce((acc, e) => acc + +e.fat, 0) / totalEntries).toFixed(2) : 'N/A';
  const averageSnf = totalEntries > 0 ? (qualityEntries.reduce((acc, e) => acc + +e.snf, 0) / totalEntries).toFixed(2) : 'N/A';

  // Pie chart data: contaminants distribution
  const pieChartData = useMemo(() => {
    const counts: Record<string, number> = { None: 0, Low: 0, Moderate: 0, High: 0 };
    qualityEntries.forEach(({ contaminants }) => {
      if (counts[contaminants] !== undefined) counts[contaminants]++;
    });
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Contaminants Level',
          data: Object.values(counts),
          backgroundColor: ['#4caf50', '#ffb300', '#1976d2', '#d32f2f'],
          borderColor: '#eee',
          borderWidth: 2,
        },
      ],
    };
  }, [qualityEntries]);

  // Line chart data for Fat & SNF avg
  const fatSnfLineChartData = useMemo(() => {
    const dateMap: Record<string, { fat: number[]; snf: number[] }> = {};
    qualityEntries.forEach(({ date, fat, snf }) => {
      if (!dateMap[date]) dateMap[date] = { fat: [], snf: [] };
      dateMap[date].fat.push(+fat);
      dateMap[date].snf.push(+snf);
    });
    const dates = Object.keys(dateMap).sort();
    const fatAvg = dates.map(date => {
      const vals = dateMap[date].fat;
      return vals.reduce((s, v) => s + v, 0) / vals.length;
    });
    const snfAvg = dates.map(date => {
      const vals = dateMap[date].snf;
      return vals.reduce((s, v) => s + v, 0) / vals.length;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Average Fat %',
          data: fatAvg,
          fill: false,
          borderColor: '#f06292',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Average SNF %',
          data: snfAvg,
          fill: false,
          borderColor: '#9575cd',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [qualityEntries]);

  // Line chart data for average Lacometer
  const lacometerLineChartData = useMemo(() => {
    const dateMap: Record<string, number[]> = {};
    qualityEntries.forEach(({ date, lacometer }) => {
      if (!dateMap[date]) dateMap[date] = [];
      dateMap[date].push(+lacometer);
    });
    const dates = Object.keys(dateMap).sort();
    const averages = dates.map(date => {
      const vals = dateMap[date];
      return vals.reduce((sum, v) => sum + v, 0) / vals.length;
    });

    return {
      labels: dates,
      datasets: [
        {
          label: 'Average Lacometer %',
          data: averages,
          fill: true,
          backgroundColor: 'rgba(255, 183, 77, 0.2)',
          borderColor: '#ffb74d',
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: '#f57c00',
        },
      ],
    };
  }, [qualityEntries]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, md: 5 },
          background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
          borderRadius: 3,
          color: 'white',
          boxShadow: '0 6px 18px rgba(25,118,210,0.13)',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: 1.5 }}>
          Quality Test Dashboard
        </Typography>
      </Paper>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4} justifyContent="center" alignItems="stretch">
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            background: CARD_GRADIENTS[0],
            color: '#fff',
            textAlign: 'center',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(25,118,210,0.13)',
          }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Total Entries</Typography>
            <Typography variant="h4" fontWeight={700}>{totalEntries}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            background: CARD_GRADIENTS[1],
            color: '#fff',
            textAlign: 'center',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(0,188,212,0.13)',
          }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Avg Moisture %</Typography>
            <Typography variant="h4" fontWeight={700}>{averageMoisture}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            background: CARD_GRADIENTS[2],
            color: '#fff',
            textAlign: 'center',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(67,160,71,0.13)',
          }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Avg Lacometer %</Typography>
            <Typography variant="h4" fontWeight={700}>{averageLacometer}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            background: CARD_GRADIENTS[3],
            color: '#fff',
            textAlign: 'center',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(29,233,182,0.13)',
          }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Avg Fat %</Typography>
            <Typography variant="h4" fontWeight={700}>{averageFat}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{
            p: 2,
            borderRadius: 3,
            background: CARD_GRADIENTS[4],
            color: '#fff',
            textAlign: 'center',
            minHeight: 90,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(149,117,205,0.13)',
          }}>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Avg SNF %</Typography>
            <Typography variant="h4" fontWeight={700}>{averageSnf}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Form and Table */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: '0 6px 15px rgba(0,191,174,0.13)' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
          {editIdx === null ? 'Add New Test Entry' : 'Edit Test Entry'}
        </Typography>
        <form onSubmit={editIdx === null ? handleAdd : (e) => { e.preventDefault(); handleSaveEdit(); }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Farmer ID"
                name="farmerId"
                value={qualityForm.farmerId}
                onChange={handleChange}
                required
                error={!!errors.farmerId}
                helperText={errors.farmerId || 'Format: 4 uppercase letters + 3 digits, e.g. FARM001'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon color={errors.farmerId ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={qualityForm.date}
                onChange={handleChange}
                required
                error={!!errors.date}
                helperText={errors.date || 'Sample collection date'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon color={errors.date ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="pH Level"
                name="pH"
                value={qualityForm.pH}
                onChange={handleChange}
                required
                error={!!errors.pH}
                helperText={errors.pH || '0-14'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScienceIcon color={errors.pH ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Moisture %"
                name="moistureContent"
                value={qualityForm.moistureContent}
                onChange={handleChange}
                required
                error={!!errors.moistureContent}
                helperText={errors.moistureContent || '0-100'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WaterIcon color={errors.moistureContent ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Lacometer %"
                name="lacometer"
                value={qualityForm.lacometer}
                onChange={handleChange}
                required
                error={!!errors.lacometer}
                helperText={errors.lacometer || '0-30'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SpeedIcon color={errors.lacometer ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Fat %"
                name="fat"
                value={qualityForm.fat}
                onChange={handleChange}
                required
                error={!!errors.fat}
                helperText={errors.fat || '0-20'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalDrinkIcon color={errors.fat ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="SNF %"
                name="snf"
                value={qualityForm.snf}
                onChange={handleChange}
                required
                error={!!errors.snf}
                helperText={errors.snf || '0-20'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalDrinkIcon color={errors.snf ? 'error' : 'primary'} />
                    </InputAdornment>
                  ),
                }}
                fullWidth
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                label="Contaminants"
                name="contaminants"
                value={qualityForm.contaminants}
                onChange={handleChange}
                required
                error={!!errors.contaminants}
                helperText={errors.contaminants || ''}
                fullWidth
              >
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!canSubmit()}
            >
              {editIdx === null ? 'Add Entry' : 'Save'}
            </Button>
            {editIdx !== null && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditIdx(null);
                  setQualityForm({
                    farmerId: '',
                    date: '',
                    pH: '',
                    moistureContent: '',
                    contaminants: 'None',
                    lacometer: '',
                    fat: '',
                    snf: '',
                  });
                }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {/* Table */}
      <Paper sx={{ p: 2, mb: 5, borderRadius: 3, boxShadow: '0 4px 10px rgba(0,191,174,0.12)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>Entries</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Farmer ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>pH</TableCell>
                <TableCell>Moisture %</TableCell>
                <TableCell>Lacometer %</TableCell>
                <TableCell>Fat %</TableCell>
                <TableCell>SNF %</TableCell>
                <TableCell>Contaminants</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qualityEntries.map((entry, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{entry.farmerId}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.pH}</TableCell>
                  <TableCell>{entry.moistureContent}</TableCell>
                  <TableCell>{entry.lacometer}</TableCell>
                  <TableCell>{entry.fat}</TableCell>
                  <TableCell>{entry.snf}</TableCell>
                  <TableCell>{entry.contaminants}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(idx)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {qualityEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ color: 'text.secondary' }}>
                    No entries found.
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
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Contaminants Distribution</Typography>
            <div style={{ height: 200 }}>
              <Pie data={pieChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 3, background: '#e3f2fd' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Fat & SNF Trends</Typography>
            <div style={{ height: 200 }}>
              <Line data={fatSnfLineChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 3, background: '#e0f7fa' }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>Lacometer Trend</Typography>
            <div style={{ height: 200 }}>
              <Line data={lacometerLineChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QualityTest;
