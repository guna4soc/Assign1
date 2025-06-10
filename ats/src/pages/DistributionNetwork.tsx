import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Container,
  CssBaseline,
  useTheme,
  alpha,
  styled,
  Tabs,
  Tab,
  MenuItem,
  Select,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import LockIcon from "@mui/icons-material/Lock";

// --- Types ---
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

// --- Data ---
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

// --- Styled ---
const HEADER_COLOR = "#1976d2";
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #1976d2 0%, #1565c0 100%)",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  color: "#fff",
  position: "static",
  minHeight: 80,
  justifyContent: "center",
}));
const Section = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));
const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  letterSpacing: 1,
  textTransform: "uppercase",
  marginBottom: theme.spacing(1),
  fontSize: "1rem",
}));
const CardValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.7rem",
  color: "#222",
}));
const InputLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#4b5563",
  marginBottom: theme.spacing(0.5),
}));

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

const LogisticsDistribution: React.FC = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  // Dashboard state
  const [trackingId, setTrackingId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryCounts, setDeliveryCounts] = useState<DeliveryCountByDay>({ ...defaultDeliveryCountByDay });
  const [deliveryDayForm, setDeliveryDayForm] = useState({ day: "", count: "" });
  const [deliveryDayError, setDeliveryDayError] = useState({ day: "", count: "" });
  const [deliveryDayEntries, setDeliveryDayEntries] = useState<{ day: string; count: number }[]>([]);
  const [delayedReasons, setDelayedReasons] = useState<DelayedDeliveryReasons>({ ...defaultDelayedReasons });
  const [delayReasonForm, setDelayReasonForm] = useState({ reason: "", count: "" });
  const [delayReasonError, setDelayReasonError] = useState({ reason: "", count: "" });
  const [delayReasonEntries, setDelayReasonEntries] = useState<{ reason: string; count: number }[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [deliverySummary] = useState<DeliverySummary>(defaultDeliverySummary);

  // Reports state
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [reportFilter, setReportFilter] = useState("All");

  // Settings state
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [profile, setProfile] = useState({ name: "John Doe", email: "john@logistics.com" });
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");

  // Colors
  const primaryColor = HEADER_COLOR;
  const cardBgColor = "#f9fafb";
  const textColor = "#374151";
  const summaryCardColors = [
    "#1976d2",
    "#009688",
    "#3949ab",
    "#ffb300",
    "#8e24aa",
    "#607d8b",
  ];
  const pieColors = ["#1976d2", "#43a047", "#ffb300", "#e53935"];

  // Validations
  const validateNonNegativeNumber = (value: string) => {
    if (!value.trim()) return "Required";
    const num = Number(value);
    if (isNaN(num) || num < 0) return "Must be a non-negative number";
    return "";
  };
  const validateDay = (value: string) => {
    if (!validDays.includes(value.trim()))
      return "Day must be a valid weekday (e.g. Monday).";
    return "";
  };
  const validateDelayReason = (value: string) => {
    if (!validReasons.includes(value.trim().toLowerCase()))
      return "Reason must be one of: traffic, vehicle issue, weather, other.";
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
      [deliveryDayForm.day]: Number(deliveryDayForm.count),
    }));
    setDeliveryDayForm({ day: "", count: "" });
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

  // Tracking form handlers (unchanged)
  const validateRequiredText = (field: string, value: string) => (!value.trim() ? "Required" : "");
  const handleTrackSubmit = () => {
    const errorsTmp = {
      trackingId: validateRequiredText("trackingId", trackingId),
      customerName: validateRequiredText("customerName", customerName),
      vehicleId: validateRequiredText("vehicleId", vehicleId),
      deliveryDate: validateRequiredText("deliveryDate", deliveryDate),
    };
    setErrors(errorsTmp);
    if (Object.values(errorsTmp).some((e) => e !== "")) return;
    alert(
      `Tracking delivery:\n- Tracking ID: ${trackingId}\n- Customer: ${customerName}\n- Vehicle: ${vehicleId}\n- Delivery Date: ${deliveryDate}`
    );
    setTrackingId("");
    setCustomerName("");
    setVehicleId("");
    setDeliveryDate("");
  };

  // Reports logic (unchanged)
  const filteredReports = reportFilter === "All" ? reports : reports.filter((r) => r.type === reportFilter);
  const handleReportDownload = (report: Report) => {
    alert(`Downloading report: ${report.title}`);
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

  return (
    <Box sx={{ minHeight: "100vh", color: textColor }}>
      <CssBaseline />
      <StyledAppBar elevation={0}>
        <Toolbar sx={{ justifyContent: "center", minHeight: 80 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: 2,
              textAlign: "center",
              width: "100%",
            }}
          >
            LogiTrack Dashboard
          </Typography>
        </Toolbar>
      </StyledAppBar>
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
        {activeTab === 0 && (
          <>
            {/* Summary Overview */}
            <Section>
              <Typography variant="h5" fontWeight={700} mb={3}>
                Summary Overview
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(deliverySummary).map(([key, value], idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={2} key={key}>
                    <Card
                      sx={{
                        p: 2,
                        backgroundColor: alpha(summaryCardColors[idx % summaryCardColors.length], 0.08),
                        borderLeft: `4px solid ${summaryCardColors[idx % summaryCardColors.length]}`,
                        borderRadius: 2,
                        boxShadow: "none",
                        height: "100%",
                      }}
                    >
                      <CardTitle>
                        {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                      </CardTitle>
                      <CardValue>
                        {typeof value === "number" && key === "driverRating" ? `${value} / 5` : value}
                        {key === "totalKm" ? " km" : ""}
                        {key === "fuelUsage" ? " L" : ""}
                        {key === "avgDeliveryTime" ? " mins" : ""}
                      </CardValue>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Section>

            {/* Deliveries by Day Input and Record Table */}
            <Section>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Deliveries by Day Entry
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      label="Day"
                      name="day"
                      value={deliveryDayForm.day}
                      onChange={handleDeliveryDayFormChange}
                      error={!!deliveryDayError.day}
                      helperText={deliveryDayError.day}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      label="Count"
                      name="count"
                      value={deliveryDayForm.count}
                      onChange={handleDeliveryDayFormChange}
                      error={!!deliveryDayError.count}
                      helperText={deliveryDayError.count}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddDeliveryDay}
                      sx={{ mt: { xs: 1, sm: 0 } }}
                    >
                      Add Entry
                    </Button>
                  </Grid>
                </Grid>
                {deliveryDayEntries.length > 0 && (
                  <TableContainer sx={{ mt: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deliveryDayEntries.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{entry.day}</TableCell>
                            <TableCell>{entry.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
              <Paper sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Deliveries by Day
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={deliveryCountsForChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke={primaryColor} />
                    <YAxis stroke={primaryColor} />
                    <ReTooltip />
                    <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Section>

            {/* Delay Reasons Input and Record Table */}
            <Section>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Delay Reasons Entry
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      label="Reason"
                      name="reason"
                      value={delayReasonForm.reason}
                      onChange={handleDelayReasonFormChange}
                      error={!!delayReasonError.reason}
                      helperText={delayReasonError.reason}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <TextField
                      label="Count"
                      name="count"
                      value={delayReasonForm.count}
                      onChange={handleDelayReasonFormChange}
                      error={!!delayReasonError.count}
                      helperText={delayReasonError.count}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddDelayReason}
                      sx={{ mt: { xs: 1, sm: 0 } }}
                    >
                      Add Entry
                    </Button>
                  </Grid>
                </Grid>
                {delayReasonEntries.length > 0 && (
                  <TableContainer sx={{ mt: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Reason</TableCell>
                          <TableCell>Count</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {delayReasonEntries.map((entry, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{entry.reason}</TableCell>
                            <TableCell>{entry.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
              <Paper sx={{ p: 3, borderRadius: 3, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Delay Reasons
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
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
                        <Cell key={entry.name} fill={pieColors[idx % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Section>

            {/* Tracking Form */}
            <Section>
              <Typography variant="h5" fontWeight={700} mb={3}>
                Track Your Delivery
              </Typography>
              <Paper sx={{ p: 4, borderRadius: 3, backgroundColor: cardBgColor }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel>Tracking ID *</InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      error={!!errors.trackingId}
                      helperText={errors.trackingId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel>Customer Name *</InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      error={!!errors.customerName}
                      helperText={errors.customerName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel>Vehicle ID *</InputLabel>
                    <TextField
                      fullWidth
                      size="small"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      error={!!errors.vehicleId}
                      helperText={errors.vehicleId}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <InputLabel>Expected Delivery Date *</InputLabel>
                    <TextField
                      type="date"
                      fullWidth
                      size="small"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      error={!!errors.deliveryDate}
                      helperText={errors.deliveryDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleTrackSubmit}
                      sx={{ minWidth: 180, fontWeight: 600, mt: 2 }}
                    >
                      Track Delivery
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Section>
          </>
        )}
        {/* REPORTS */}
        {activeTab === 1 && (
          <Section>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Reports
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Download Reports
              </Typography>
              <List>
                {filteredReports.map((report) => (
                  <ListItem key={report.id} secondaryAction={
                    <IconButton edge="end" onClick={() => handleReportDownload(report)}>
                      <DownloadIcon />
                    </IconButton>
                  }>
                    <ListItemIcon>
                      {report.status === "Completed" ? (
                        <CheckCircleOutlineIcon color="success" />
                      ) : (
                        <PendingIcon color="warning" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={`Type: ${report.type} | Date: ${report.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Section>
        )}
        {/* SETTINGS */}
        {activeTab === 2 && (
          <Section>
            <Typography variant="h5" fontWeight={700} mb={3}>
              Settings
            </Typography>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} mb={2}>
                Profile
              </Typography>
              <Box mb={2}>
                <InputLabel>Name</InputLabel>
                <TextField
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  size="small"
                  sx={{ mr: 2 }}
                />
                <InputLabel>Email</InputLabel>
                <TextField
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  size="small"
                />
              </Box>
              <Button variant="contained" onClick={() => {}}>
                Save Profile
              </Button>
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Preferences
                </Typography>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as string)}
                  size="small"
                  sx={{ mr: 2, minWidth: 120 }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Hindi">Hindi</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                </Select>
                <InputLabel>Notifications</InputLabel>
                <Switch
                  checked={notifications}
                  onChange={() => setNotifications((n) => !n)}
                  color="primary"
                />
              </Box>
              <Box mt={3}>
                <Button
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => {}}
                >
                  Change Password
                </Button>
              </Box>
            </Paper>
          </Section>
        )}
      </Container>
    </Box>
  );
};

export default LogisticsDistribution;
