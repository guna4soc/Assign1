import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import FarmersPortal from './pages/FarmersPortal';
import MilkingZone from './pages/MilkingZone'; // Updated import
import DistributionNetwork from './pages/DistributionNetwork'; // Removed due to missing file
import UnitTracker from './pages/UnitTracker'; // Updated import
import SalesGrid from './pages/SalesGrid'; // Updated import
import StockControl from './pages/StockControl'; // Removed due to missing file
import TeamManagement from './pages/TeamManagement'; // Updated import
import PayFlow from './pages/PayFlow'; // Updated import
import InsightsCenter from './pages/InsightsCenter'; // Updated import
import BuzzBox from './pages/BuzzBox'; // Updated import
import QAModule from './pages/QAModule'; // Updated import
import { ThemeContextProvider } from './types/theme/ThemeContext';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeContextProvider>
      <Box sx={{ display: 'flex', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <NavBar onBurgerClick={() => setSidebarOpen(!sidebarOpen)} />
          <Box sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
            <Routes>
  <Route path="/" element={<Navigate to="/dashboard" />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/farmers-portal" element={<FarmersPortal />} />
  <Route path="/milking-zone" element={<MilkingZone />} />
  <Route path="/distribution-network" element={<DistributionNetwork />} />
  <Route path="/unit-tracker" element={<UnitTracker />} />
  <Route path="/sales-grid" element={<SalesGrid />} />
  <Route path="/stock-control" element={<StockControl />} />
  <Route path="/team-management" element={<TeamManagement />} />
  <Route path="/payflow" element={<PayFlow />} />
  <Route path="/insights-center" element={<InsightsCenter />} />
  <Route path="/buzzbox" element={<BuzzBox />} />
  <Route path="/qa-module" element={<QAModule />} />
</Routes>

          </Box>
        </Box>
      </Box>
    </ThemeContextProvider>
  );
};

export default App;
