import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  Tabs,
  Tab,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import LockIcon from "@mui/icons-material/Lock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Use a light, professional pink gradient for the header
const HEADER_COLOR = "#b71c5a"; // Deep rose for text (official, not too bright)
const HEADER_BG_GRADIENT = "linear-gradient(90deg, #fce4ec 0%, #f8bbd0 100%)"; // Light pink gradient

const summaryCardColors = [
  "#1976d2", // blue
  "#43a047", // green
  "#ffb300", // amber
  "#ffd600", // gold for Driver Rating
  "#8e24aa", // purple
  "#f4511e", // orange
];
const pieColors = ["#1976d2", "#43a047", "#ffb300", "#e53935"];
const validDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const validReasons = ["traffic", "vehicle issue", "weather", "other"];

interface DeliverySummary {
  totalKm: number;
  fuelUsage: number;
  itemsDelivered: number;
  driverRating: number;
  avgDeliveryTime: number;
  scheduledDeliveries: number;
}
interface DelayedDeliveryReasons {
  traffic: number;
  vehicleIssue: number;
  weather: number;
  other: number;
}
interface DeliveryCountByDay {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
}
interface Report {
  id: number;
  title: string;
  date: string;
  status: string;
  type: string;
}
type DeliveryDayEntry = { day: string; count: number };
type DelayReasonEntry = { reason: string; count: number };

const defaultDeliverySummary: DeliverySummary = {
  totalKm: 1250.5,
  fuelUsage: 350.7,
  itemsDelivered: 1500,
  driverRating: 4.5,
  avgDeliveryTime: 45,
  scheduledDeliveries: 300,
};
const defaultDelayedReasons: DelayedDeliveryReasons = {
  traffic: 4,
  vehicleIssue: 3,
  weather: 2,
  other: 1,
};
const defaultDeliveryCountByDay: DeliveryCountByDay = {
  Monday: 20,
  Tuesday: 18,
  Wednesday: 22,
  Thursday: 19,
  Friday: 25,
  Saturday: 15,
  Sunday: 10,
};
const initialReports: Report[] = [
  { id: 1, title: "Monthly Delivery Report", date: "2025-06-01", status: "Completed", type: "Monthly" },
  { id: 2, title: "Driver Performance", date: "2025-05-15", status: "Pending", type: "Performance" },
  { id: 3, title: "Fuel Efficiency Analysis", date: "2025-04-10", status: "Completed", type: "Efficiency" },
];

const STORAGE_KEYS = {
  deliveryDayEntries: "deliveryDayEntries",
  delayReasonEntries: "delayReasonEntries",
  deliveryCounts: "deliveryCounts",
  delayedReasons: "delayedReasons",
  profile: "profile",
  settings: "settings",
};

const DistributionNetwork: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Dashboard state
  const [deliveryCounts, setDeliveryCounts] = useState<DeliveryCountByDay>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.deliveryCounts);
    return saved ? JSON.parse(saved) : { ...defaultDeliveryCountByDay };
  });
  const [deliveryDayForm, setDeliveryDayForm] = useState<{ day: string; count: string }>({ day: "", count: "" });
  const [deliveryDayError, setDeliveryDayError] = useState<{ day: string; count: string }>({ day: "", count: "" });
  const [deliveryDayEntries, setDeliveryDayEntries] = useState<DeliveryDayEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.deliveryDayEntries);
    return saved ? JSON.parse(saved) : [];
  });
  const [editingDeliveryIndex, setEditingDeliveryIndex] = useState<number | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<DeliveryDayEntry>({ day: "", count: 0 });

  const [delayedReasons, setDelayedReasons] = useState<DelayedDeliveryReasons>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.delayedReasons);
    return saved ? JSON.parse(saved) : { ...defaultDelayedReasons };
  });
  const [delayReasonForm, setDelayReasonForm] = useState<{ reason: string; count: string }>({ reason: "", count: "" });
  const [delayReasonError, setDelayReasonError] = useState<{ reason: string; count: string }>({ reason: "", count: "" });
  const [delayReasonEntries, setDelayReasonEntries] = useState<DelayReasonEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.delayReasonEntries);
    return saved ? JSON.parse(saved) : [];
  });
  const [editingDelayIndex, setEditingDelayIndex] = useState<number | null>(null);
  const [editingDelay, setEditingDelay] = useState<DelayReasonEntry>({ reason: "", count: 0 });

  const [deliverySummary] = useState<DeliverySummary>(defaultDeliverySummary);

  // Reports state
  const [reports] = useState<Report[]>(initialReports);
  const [reportFilter, setReportFilter] = useState<string>("All");

  // Settings state
  const [profile, setProfile] = useState<{ name: string; email: string }>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    return saved ? JSON.parse(saved) : { name: "John Doe", email: "john@logistics.com" };
  });
  const [profileEdit, setProfileEdit] = useState<{ name: string; email: string }>({ name: profile.name, email: profile.email });
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);
  const [profileSaved, setProfileSaved] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<{ name?: string; email?: string }>({});
  const [language, setLanguage] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.settings);
    return saved ? JSON.parse(saved).language : "English";
  });
  const [notifications, setNotifications] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.settings);
    return saved ? JSON.parse(saved).notifications : true;
  });
  const [password, setPassword] = useState<{ old: string; new: string; confirm: string }>({ old: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  // Persist dashboard data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.deliveryDayEntries, JSON.stringify(deliveryDayEntries));
  }, [deliveryDayEntries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.delayReasonEntries, JSON.stringify(delayReasonEntries));
  }, [delayReasonEntries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.deliveryCounts, JSON.stringify(deliveryCounts));
  }, [deliveryCounts]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.delayedReasons, JSON.stringify(delayedReasons));
  }, [delayedReasons]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ language, notifications }));
  }, [language, notifications]);

  // --- Validations ---
  const validateNonNegativeNumber = (value: string): string => {
    if (!value.trim()) return "Required";
    const num = Number(value);
    if (isNaN(num) || num < 0) return "Must be a non-negative number";
    return "";
  };
  const validateDay = (value: string): string => {
    if (!validDays.includes(value.trim())) return "Day must be a valid weekday (e.g. Monday).";
    return "";
  };
  const validateDelayReason = (value: string): string => {
    if (!validReasons.includes(value.trim().toLowerCase()))
      return "Reason must be one of: traffic, vehicle issue, weather, other.";
    return "";
  };
  const validateEmail = (email: string): string => {
    if (!/^[a-z0-9._%+-]+@(gmail|outlook)\.com$/.test(email))
      return "Email must be all lowercase and end with @gmail.com or @outlook.com";
    return "";
  };
  const validateName = (name: string): string => {
    if (!/^[A-Z][a-zA-Z\s]*$/.test(name))
      return "Name must start with a capital letter and contain only letters/spaces";
    return "";
  };

  // Delivery by Day form handlers
  const handleDeliveryDayFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryDayForm((prev) => ({ ...prev, [name]: value }));
    setDeliveryDayError((prev) => ({ ...prev, [name]: "" }));
  };
  const handleAddDeliveryDay = () => {
    const dayErr = validateDay(deliveryDayForm.day);
    const countErr = validateNonNegativeNumber(deliveryDayForm.count);
    setDeliveryDayError({ day: dayErr, count: countErr });
    if (dayErr || countErr) return;
    setDeliveryDayEntries((prev) => [
      ...prev,
      { day: deliveryDayForm.day, count: Number(deliveryDayForm.count) },
    ]);
    setDeliveryCounts((prev) => ({
      ...prev,
      [deliveryDayForm.day as keyof DeliveryCountByDay]: Number(deliveryDayForm.count),
    }));
    setDeliveryDayForm({ day: "", count: "" });
  };
  // Edit/Save/Delete for DeliveryDayEntry
  const handleEditDelivery = (idx: number) => {
    setEditingDeliveryIndex(idx);
    setEditingDelivery({ ...deliveryDayEntries[idx] });
  };
  const handleSaveDelivery = (idx: number) => {
    if (!editingDelivery.day || isNaN(Number(editingDelivery.count))) return;
    const entries = [...deliveryDayEntries];
    entries[idx] = { ...editingDelivery };
    setDeliveryDayEntries(entries);
    setDeliveryCounts((prev) => ({
      ...prev,
      [editingDelivery.day as keyof DeliveryCountByDay]: Number(editingDelivery.count),
    }));
    setEditingDeliveryIndex(null);
  };
  const handleDeleteDelivery = (idx: number) => {
    const entries = [...deliveryDayEntries];
    entries.splice(idx, 1);
    setDeliveryDayEntries(entries);
    setEditingDeliveryIndex(null);
  };

  // Delay Reason form handlers
  const handleDelayReasonFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDelayReasonForm((prev) => ({ ...prev, [name]: value }));
    setDelayReasonError((prev) => ({ ...prev, [name]: "" }));
  };
  const handleAddDelayReason = () => {
    const reasonErr = validateDelayReason(delayReasonForm.reason);
    const countErr = validateNonNegativeNumber(delayReasonForm.count);
    setDelayReasonError({ reason: reasonErr, count: countErr });
    if (reasonErr || countErr) return;
    setDelayReasonEntries((prev) => [
      ...prev,
      { reason: delayReasonForm.reason, count: Number(delayReasonForm.count) },
    ]);
    setDelayedReasons((prev) => ({
      ...prev,
      [delayReasonForm.reason as keyof DelayedDeliveryReasons]: Number(delayReasonForm.count),
    }));
    setDelayReasonForm({ reason: "", count: "" });
  };
  // Edit/Save/Delete for DelayReasonEntry
  const handleEditDelay = (idx: number) => {
    setEditingDelayIndex(idx);
    setEditingDelay({ ...delayReasonEntries[idx] });
  };
  const handleSaveDelay = (idx: number) => {
    if (!editingDelay.reason || isNaN(Number(editingDelay.count))) return;
    const entries = [...delayReasonEntries];
    entries[idx] = { ...editingDelay };
    setDelayReasonEntries(entries);
    setDelayedReasons((prev) => ({
      ...prev,
      [editingDelay.reason as keyof DelayedDeliveryReasons]: Number(editingDelay.count),
    }));
    setEditingDelayIndex(null);
  };
  const handleDeleteDelay = (idx: number) => {
    const entries = [...delayReasonEntries];
    entries.splice(idx, 1);
    setDelayReasonEntries(entries);
    setEditingDelayIndex(null);
  };

  // Reports
  const filteredReports = reportFilter === "All" ? reports : reports.filter((r) => r.type === reportFilter);
  const handleReportDownload = (report: Report) => {
    const csv = `Title,Date,Status,Type\n${report.title},${report.date},${report.status},${report.type}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s/g, "_")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Settings
  const handleProfileEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileEdit((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setProfileError((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "name") setProfileError((prev) => ({ ...prev, name: validateName(value) }));
  };
  const handleProfileSave = () => {
    const nameErr = validateName(profileEdit.name);
    const emailErr = validateEmail(profileEdit.email);
    setProfileError({ name: nameErr, email: emailErr });
    if (nameErr || emailErr) return;
    setProfile(profileEdit);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 1500);
    setProfileDialogOpen(false);
  };

  const handlePasswordSave = () => {
    if (!password.old || !password.new || !password.confirm) {
      setPasswordError("All fields required");
      return;
    }
    if (password.new !== password.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordError("");
    setPassword({ old: "", new: "", confirm: "" });
    setPasswordDialogOpen(false);
    alert("Password changed successfully!");
  };

  // Charts data
  const deliveryCountsForChart = Object.keys(deliveryCounts).map((day) => ({
    day,
    value: deliveryCounts[day as keyof DeliveryCountByDay],
  }));
  const delayedReasonsForChart = [
    { name: "Traffic", value: delayedReasons.traffic },
    { name: "Vehicle Issue", value: delayedReasons.vehicleIssue },
    { name: "Weather", value: delayedReasons.weather },
    { name: "Other", value: delayedReasons.other },
  ];

  // --- UI ---
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar position="static" sx={{
        background: 'linear-gradient(90deg, #fce4ec 0%, #f8bbd0 100%)', // light pink gradient
        minHeight: 80,
        boxShadow: '0 2px 8px 0 rgba(216,27,96,0.08)',
      }}>
        <Toolbar sx={{ justifyContent: "center", minHeight: 80 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#b71c5a", // deep rose for professional look
              letterSpacing: 2,
              textAlign: "center",
              width: "100%",
            }}
          >
            LogiTrack Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{
              ".MuiTab-root": {
                fontWeight: 600,
                letterSpacing: 1,
                fontSize: "1rem",
                color: "#444",
              },
              ".Mui-selected": {
                color: HEADER_COLOR + " !important",
              },
            }}
          >
            <Tab label="Dashboard" />
            <Tab label="Reports" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        {activeTab === 0 && (
          <Box>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 2, alignItems: "stretch" }}>
              {[
                { label: "Total KM", value: deliverySummary.totalKm, icon: <CheckCircleOutlineIcon />, color: summaryCardColors[0] },
                { label: "Fuel Usage (L)", value: deliverySummary.fuelUsage, icon: <PendingIcon />, color: summaryCardColors[1] },
                { label: "Items Delivered", value: deliverySummary.itemsDelivered, icon: <CheckCircleOutlineIcon />, color: summaryCardColors[2] },
                { label: "Driver Rating", value: deliverySummary.driverRating, icon: <CheckCircleOutlineIcon />, color: summaryCardColors[3] },
                { label: "Avg Delivery Time (min)", value: deliverySummary.avgDeliveryTime, icon: <PendingIcon />, color: summaryCardColors[4] },
                { label: "Scheduled Deliveries", value: deliverySummary.scheduledDeliveries, icon: <CheckCircleOutlineIcon />, color: summaryCardColors[5] },
              ].map((card, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      height: 140,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: card.color,
                      color: "#fff",
                      borderRadius: 3,
                      boxShadow: 2,
                    }}
                  >
                    <Box sx={{ fontSize: 34, mb: 1 }}>{card.icon}</Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, opacity: 0.95 }}>
                      {card.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                      {card.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Editable Tables */}
            <Grid container spacing={3} alignItems="flex-start">
              {/* Delivery Day Entry Table */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: HEADER_COLOR, mb: 1 }}>
                    Add/Edit Deliveries by Day
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Day"
                      name="day"
                      select
                      value={deliveryDayForm.day}
                      onChange={handleDeliveryDayFormChange}
                      error={!!deliveryDayError.day}
                      helperText={deliveryDayError.day}
                      size="small"
                      sx={{ width: 120 }}
                    >
                      {validDays.map((d) => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Count"
                      name="count"
                      value={deliveryDayForm.count}
                      onChange={handleDeliveryDayFormChange}
                      error={!!deliveryDayError.count}
                      helperText={deliveryDayError.count}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddDeliveryDay} sx={{ minWidth: 90 }}>
                      Add
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Day</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Count</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deliveryDayEntries.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {editingDeliveryIndex === idx ? (
                                <TextField
                                  name="day"
                                  select
                                  value={editingDelivery.day}
                                  onChange={(e) => setEditingDelivery((prev) => ({ ...prev, day: e.target.value }))}
                                  size="small"
                                  sx={{ width: 100 }}
                                >
                                  {validDays.map((d) => (
                                    <MenuItem key={d} value={d}>{d}</MenuItem>
                                  ))}
                                </TextField>
                              ) : (
                                entry.day
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDeliveryIndex === idx ? (
                                <TextField
                                  name="count"
                                  value={editingDelivery.count}
                                  onChange={(e) => setEditingDelivery((prev) => ({ ...prev, count: Number(e.target.value) }))}
                                  size="small"
                                  sx={{ width: 80 }}
                                />
                              ) : (
                                entry.count
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {editingDeliveryIndex === idx ? (
                                <>
                                  <IconButton color="success" onClick={() => handleSaveDelivery(idx)}><SaveIcon /></IconButton>
                                  <IconButton color="error" onClick={() => setEditingDeliveryIndex(null)}><CloseIcon /></IconButton>
                                </>
                              ) : (
                                <>
                                  <IconButton color="primary" onClick={() => handleEditDelivery(idx)}><EditIcon /></IconButton>
                                  <IconButton color="error" onClick={() => handleDeleteDelivery(idx)}><DeleteIcon /></IconButton>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              {/* Delay Reasons Table */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: HEADER_COLOR, mb: 1 }}>
                    Add/Edit Delay Reasons
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Reason"
                      name="reason"
                      select
                      value={delayReasonForm.reason}
                      onChange={handleDelayReasonFormChange}
                      error={!!delayReasonError.reason}
                      helperText={delayReasonError.reason}
                      size="small"
                      sx={{ width: 140 }}
                    >
                      {validReasons.map((r) => (
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Count"
                      name="count"
                      value={delayReasonForm.count}
                      onChange={handleDelayReasonFormChange}
                      error={!!delayReasonError.count}
                      helperText={delayReasonError.count}
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddDelayReason} sx={{ minWidth: 90 }}>
                      Add
                    </Button>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Reason</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Count</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {delayReasonEntries.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {editingDelayIndex === idx ? (
                                <TextField
                                  name="reason"
                                  select
                                  value={editingDelay.reason}
                                  onChange={(e) => setEditingDelay((prev) => ({ ...prev, reason: e.target.value }))}
                                  size="small"
                                  sx={{ width: 120 }}
                                >
                                  {validReasons.map((r) => (
                                    <MenuItem key={r} value={r}>{r}</MenuItem>
                                  ))}
                                </TextField>
                              ) : (
                                entry.reason
                              )}
                            </TableCell>
                            <TableCell>
                              {editingDelayIndex === idx ? (
                                <TextField
                                  name="count"
                                  value={editingDelay.count}
                                  onChange={(e) => setEditingDelay((prev) => ({ ...prev, count: Number(e.target.value) }))}
                                  size="small"
                                  sx={{ width: 80 }}
                                />
                              ) : (
                                entry.count
                              )}
                            </TableCell>
                            <TableCell align="right">
                              {editingDelayIndex === idx ? (
                                <>
                                  <IconButton color="success" onClick={() => handleSaveDelay(idx)}><SaveIcon /></IconButton>
                                  <IconButton color="error" onClick={() => setEditingDelayIndex(null)}><CloseIcon /></IconButton>
                                </>
                              ) : (
                                <>
                                  <IconButton color="primary" onClick={() => handleEditDelay(idx)}><EditIcon /></IconButton>
                                  <IconButton color="error" onClick={() => handleDeleteDelay(idx)}><DeleteIcon /></IconButton>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>

            {/* Charts BELOW the tables/forms */}
            <Grid container spacing={3} sx={{ mt: 2 }} alignItems="stretch">
              {/* Bar Chart */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: HEADER_COLOR }}>
                    Deliveries by Day
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={deliveryCountsForChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ReTooltip />
                      <Bar dataKey="value" fill={HEADER_COLOR} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              {/* Pie Chart */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: HEADER_COLOR }}>
                    Delayed Deliveries Reasons
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={delayedReasonsForChart}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {delayedReasonsForChart.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <ReTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reports Tab */}
        {activeTab === 1 && (
          <Box>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: HEADER_COLOR, flex: 1 }}>
                  Reports
                </Typography>
                <Select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 140, background: "transparent", borderRadius: 2 }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Performance">Performance</MenuItem>
                  <MenuItem value="Efficiency">Efficiency</MenuItem>
                </Select>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd', width: 220, textAlign: 'center', verticalAlign: 'middle' }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd', width: 120, textAlign: 'center', verticalAlign: 'middle' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd', width: 120, textAlign: 'center', verticalAlign: 'middle' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd', width: 120, textAlign: 'center', verticalAlign: 'middle' }}>Type</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: HEADER_COLOR, background: '#e3f2fd', width: 120, verticalAlign: 'middle' }}>
                        <span>Actions</span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} hover sx={{ transition: "background 0.2s", "&:hover": { background: "#e3f2fd" } }}>
                        <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle', py: 1 }}>{report.title}</TableCell>
                        <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle', py: 1 }}>{report.date}</TableCell>
                        <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle', py: 1 }}>
                          {report.status === "Completed" ? (
                            <Box sx={{ display: "flex", alignItems: "center", color: "#43a047", justifyContent: 'center' }}>
                              <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Completed
                            </Box>
                          ) : (
                            <Box sx={{ display: "flex", alignItems: "center", color: "#ffb300", justifyContent: 'center' }}>
                              <PendingIcon fontSize="small" sx={{ mr: 0.5 }} /> Pending
                            </Box>
                          )}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', verticalAlign: 'middle', py: 1 }}>{report.type}</TableCell>
                        <TableCell align="center" sx={{ verticalAlign: 'middle', py: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0, px: 1, mx: 'auto' }}
                            onClick={() => handleReportDownload(report)}
                          >
                            <DownloadIcon color="primary" sx={{ mb: 0.5 }} />
                            <span style={{ fontSize: 12 }}>Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 2 && (
          <Box>
            {/* Profile Section */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: HEADER_COLOR, mb: 2 }}>
                Profile
              </Typography>
              <Typography>Name: {profile.name}</Typography>
              <Typography>Email: {profile.email}</Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2, mr: 2 }}
                onClick={() => setProfileDialogOpen(true)}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="warning"
                startIcon={<LockIcon />}
                sx={{ mt: 2 }}
                onClick={() => setPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </Paper>
            {/* Settings Section */}
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: HEADER_COLOR, mb: 2 }}>
                Preferences
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#666" }}>Language</Typography>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    size="small"
                    sx={{ minWidth: 120, background: "transparent", borderRadius: 2 }}
                  >
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                  </Select>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#666" }}>Notifications</Typography>
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Profile Edit Dialog */}
        <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              name="name"
              value={profileEdit.name}
              onChange={handleProfileEditChange}
              error={!!profileError.name}
              helperText={profileError.name}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={profileEdit.email}
              onChange={handleProfileEditChange}
              error={!!profileError.email}
              helperText={profileError.email}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleProfileSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Old Password"
              type="password"
              value={password.old}
              onChange={(e) => setPassword((prev) => ({ ...prev, old: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              value={password.new}
              onChange={(e) => setPassword((prev) => ({ ...prev, new: e.target.value }))}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={password.confirm}
              onChange={(e) => setPassword((prev) => ({ ...prev, confirm: e.target.value }))}
              fullWidth
              error={!!passwordError}
              helperText={passwordError}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePasswordSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Profile Saved Snackbar */}
        <Snackbar open={profileSaved} autoHideDuration={1200}>
          <Alert severity="success" variant="filled">Profile updated!</Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DistributionNetwork;
