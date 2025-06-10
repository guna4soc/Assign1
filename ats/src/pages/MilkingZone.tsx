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
  useTheme,
  LinearProgress,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);

interface MilkEntry {
  farmerId: string;
  date: string;
  quantity: string;
  shift: 'Morning' | 'Evening';
}

const shifts = ['Morning', 'Evening'] as const;
const DAILY_TARGET = 1000;

const highlightColor = '#fffde7';
const tableHeaderColor = '#1565c0';
const tableRowAltColor = '#f5fafd';

const MilkCollectionDashboard: React.FC = () => {
  const theme = useTheme();

  // Initial sample data
  const [milkEntries, setMilkEntries] = useState<MilkEntry[]>([
    { farmerId: 'FARM001', date: '2024-06-10', quantity: '30', shift: 'Morning' },
    { farmerId: 'FARM001', date: '2024-06-10', quantity: '25', shift: 'Evening' },
    { farmerId: 'FARM002', date: '2024-06-10', quantity: '15', shift: 'Morning' },
    { farmerId: 'FARM003', date: '2024-06-11', quantity: '22', shift: 'Evening' },
    { farmerId: 'FARM004', date: '2024-06-11', quantity: '18', shift: 'Morning' },
  ]);

  const [milkForm, setMilkForm] = useState<MilkEntry>({
    farmerId: '',
    date: '',
    quantity: '',
    shift: 'Morning',
  });

  const [editIdx, setEditIdx] = useState<number | null>(null);

  const [errors, setErrors] = useState<{ farmerId: string; date: string; quantity: string }>({
    farmerId: '',
    date: '',
    quantity: '',
  });

  const validateFarmerId = (value: string): boolean =>
    /^[A-Z]{4}\d{3}$/.test(value) && value.length === 7;
  const validateDate = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const validateQuantity = (value: string): boolean =>
    /^\d+(\.\d+)?$/.test(value) && parseFloat(value) > 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ): void => {
    const name = e.target.name as keyof MilkEntry;
    const value = e.target.value as string;
    let error = '';

    if (name === 'farmerId') {
      error = !validateFarmerId(value)
        ? 'Format: 4 uppercase letters + 3 digits, e.g., FARM001'
        : '';
    } else if (name === 'date') {
      error = !validateDate(value) ? 'Date required' : '';
    } else if (name === 'quantity') {
      error = !validateQuantity(value) ? 'Positive number required' : '';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    setMilkForm((prev) => ({ ...prev, [name]: value }));
  };

  const canSubmit = (): boolean =>
    milkForm.farmerId.trim() !== '' &&
    milkForm.date.trim() !== '' &&
    milkForm.quantity.trim() !== '' &&
    !errors.farmerId &&
    !errors.date &&
    !errors.quantity;

  const handleAdd = (e: React.FormEvent): void => {
    e.preventDefault();
    if (canSubmit()) {
      setMilkEntries((prev) => [...prev, milkForm]);
      setMilkForm({ farmerId: '', date: '', quantity: '', shift: 'Morning' });
      setErrors({ farmerId: '', date: '', quantity: '' });
    }
  };

  const handleDelete = (idx: number): void => {
    setMilkEntries((prev) => prev.filter((_, i) => i !== idx));
    if (editIdx === idx) setEditIdx(null);
  };

  const handleEdit = (idx: number): void => {
    setEditIdx(idx);
    setMilkForm(milkEntries[idx]);
    setErrors({ farmerId: '', date: '', quantity: '' });
  };

  const handleSaveEdit = (): void => {
    if (editIdx !== null && canSubmit()) {
      const updated = [...milkEntries];
      updated[editIdx] = milkForm;
      setMilkEntries(updated);
      setEditIdx(null);
      setMilkForm({ farmerId: '', date: '', quantity: '', shift: 'Morning' });
      setErrors({ farmerId: '', date: '', quantity: '' });
    }
  };

  // For charts and stats
  const totalMilk = 110; // Static as per your request
  const avgMilkPerEntry = 22; // Static as per your request

  // Chart data (not static, but you can adjust as needed)
  const lineChartData = useMemo(() => {
    const dateMap: Record<string, number> = {};
    milkEntries.forEach(({ date, quantity }) => {
      if (dateMap[date]) dateMap[date] += parseFloat(quantity) || 0;
      else dateMap[date] = parseFloat(quantity) || 0;
    });
    const datesSorted = Object.keys(dateMap).sort();
    return {
      labels: datesSorted,
      datasets: [
        {
          label: 'Total Milk Quantity (liters)',
          data: datesSorted.map((d) => dateMap[d]),
          fill: true,
          backgroundColor: 'rgba(33,150,243,0.12)',
          borderColor: '#1976d2',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [milkEntries]);

  const pieChartData = useMemo(() => {
    const shiftMap: Record<'Morning' | 'Evening', number> = { Morning: 0, Evening: 0 };
    milkEntries.forEach(({ shift, quantity }) => {
      shiftMap[shift] += parseFloat(quantity) || 0;
    });
    return {
      labels: ['Morning', 'Evening'],
      datasets: [
        {
          label: 'Milk Quantity by Shift',
          data: [shiftMap.Morning, shiftMap.Evening],
          backgroundColor: ['#1976d2', '#607d8b'],
          borderColor: 'white',
          borderWidth: 2,
        },
      ],
    };
  }, [milkEntries]);

  const chartOptionsBase = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { weight: 'bold' as const } },
      },
      title: {
        display: true,
        font: { size: 18, weight: 'bold' as const },
        color: theme.palette.text.primary,
        text: '',
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: {
          display: true,
          text: '',
          color: theme.palette.text.primary,
          font: { size: 14, weight: 'bold' as const },
        },
      },
      y: {
        ticks: { color: theme.palette.text.primary },
        grid: { color: 'rgba(0,0,0,0.1)' },
        beginAtZero: true,
        title: {
          display: true,
          text: '',
          color: theme.palette.text.primary,
          font: { size: 14, weight: 'bold' as const },
        },
      },
    },
  };

  const progressPercent = Math.min((totalMilk / DAILY_TARGET) * 100, 100);

  return (
    <Box
      sx={{
        maxWidth: 1100,
        margin: 'auto',
        p: { xs: 1, sm: 2 },
        background: 'white',
        borderRadius: 3,
        minHeight: '100vh',
      }}
    >
      {/* HEADER SECTION */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          boxShadow: 4,
          background: 'linear-gradient(90deg, teal 0%, #1565c0 100%)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{
            color: 'white',
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: '22px',
          }}
        >
          Dairy Collection Monitor
        </Typography>
      </Paper>

      {/* SUMMARY CARDS */}
      <Grid container spacing={3} sx={{ mb: 4, px: 1, justifyContent: 'center' }}>
        {/* Total Entries */}
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              height: 90,
              width: '100%',
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#F4D03F',
              color: '#000',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}
              >
                Total Entries
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, fontSize: 32, lineHeight: 1 }}
              >
                5
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Total Milk Collected */}
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              height: 90,
              width: '100%',
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#D8DCDC',
              color: '#000',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}
              >
                Total Milk Collected (liters)
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, fontSize: 32, lineHeight: 1 }}
              >
                110
              </Typography>
            </Box>
          </Paper>
        </Grid>
        {/* Average Milk per Entry */}
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              height: 90,
              width: '100%',
              minWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#27AE60',
              color: '#fff',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, fontSize: 16, mb: 0.5 }}
              >
                Average Milk per Entry (liters)
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, fontSize: 32, lineHeight: 1 }}
              >
                22
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* INPUT FIELDS SECTION */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 2,
          background: 'white',
          border: '1px solid #e0e0e0',
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          fontWeight="bold"
          sx={{
            color: '#1976d2',
            letterSpacing: 1,
          }}
        >
          {editIdx === null ? 'Add Milk Collection Entry' : 'Edit Milk Collection Entry'}
        </Typography>
        <Box
          component="form"
          onSubmit={editIdx === null ? handleAdd : (e) => { e.preventDefault(); handleSaveEdit(); }}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Farmer ID"
            name="farmerId"
            value={milkForm.farmerId}
            onChange={handleChange}
            required
            error={!!errors.farmerId}
            helperText={errors.farmerId}
            inputProps={{ maxLength: 7 }}
            autoComplete="off"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
              },
            }}
          />

          <TextField
            label="Date"
            name="date"
            value={milkForm.date}
            onChange={handleChange}
            required
            type="date"
            error={!!errors.date}
            helperText={errors.date}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
              },
            }}
          />

          <TextField
            label="Quantity (liters)"
            name="quantity"
            value={milkForm.quantity}
            onChange={handleChange}
            required
            error={!!errors.quantity}
            helperText={errors.quantity}
            inputProps={{ inputMode: 'decimal' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
              },
            }}
          />

          <TextField
            label="Shift"
            name="shift"
            value={milkForm.shift}
            onChange={handleChange}
            select
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
              '& .MuiInputLabel-root': {
                fontSize: '14px',
              },
              '& .MuiInputBase-input': {
                fontSize: '14px',
              },
            }}
          >
            {shifts.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editIdx !== null && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEditIdx(null);
                  setMilkForm({ farmerId: '', date: '', quantity: '', shift: 'Morning' });
                  setErrors({ farmerId: '', date: '', quantity: '' });
                }}
              >
                Cancel
              </Button>
            )}
            <Button variant="contained" color="primary" disabled={!canSubmit()} type="submit">
              {editIdx === null ? 'Add Entry' : 'Save Entry'}
            </Button>
          </Box>

          {/* Progress Bar Toward Daily Target */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', fontWeight: 'medium' }}>
              Daily Milk Collection Progress (Target: {DAILY_TARGET} Liters)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{ height: 10, borderRadius: 5, bgcolor: '#e3f2fd', '& .MuiLinearProgress-bar': { bgcolor: '#1976d2' } }}
            />
            <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
              {progressPercent.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* RECORD ENTRIES TABLE */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          background: 'white',
          border: '2px solid #1565c0',
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          fontWeight="bold"
          sx={{
            color: '#1976d2',
            letterSpacing: 1,
          }}
        >
          Record Entries
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: tableHeaderColor }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Farmer ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity (liters)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Shift</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milkEntries.map((entry, idx) => (
                <TableRow
                  key={idx}
                  sx={{
                    background: idx % 2 === 0 ? 'white' : tableRowAltColor,
                    '&:hover': { background: highlightColor },
                  }}
                >
                  <TableCell>{entry.farmerId}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.quantity}</TableCell>
                  <TableCell>{entry.shift}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(idx)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(idx)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* CHARTS SECTION */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'white', boxShadow: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold" color="primary">
              Milk Collection by Date
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={lineChartData}
                options={{
                  ...chartOptionsBase,
                  plugins: {
                    ...chartOptionsBase.plugins,
                    title: { ...chartOptionsBase.plugins.title, text: 'Milk Collection by Date' },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'white', boxShadow: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold" color="primary">
              Milk Collection by Shift
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie
                data={pieChartData}
                options={{
                  ...chartOptionsBase,
                  plugins: {
                    ...chartOptionsBase.plugins,
                    title: { ...chartOptionsBase.plugins.title, text: 'Milk Collection by Shift' },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MilkCollectionDashboard;
