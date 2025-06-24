import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentIcon from '@mui/icons-material/Payment';
import MessageIcon from '@mui/icons-material/Message';
import StarIcon from '@mui/icons-material/Star';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ScienceIcon from '@mui/icons-material/Science'; // Use ScienceIcon for QA Module
import { useTheme } from '@mui/material/styles';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Farmers Portal', icon: <GroupIcon />, path: '/farmers-portal' },
  { text: 'Milking Zone', icon: <LocalShippingIcon />, path: '/milking-zone' },
  { text: 'Distribution Network', icon: <StoreIcon />, path: '/distribution-network' },
  { text: 'Unit Tracker', icon: <AssignmentTurnedInIcon />, path: '/unit-tracker' },
  { text: 'Sales Grid', icon: <StoreIcon />, path: '/sales-grid' },
  { text: 'Stock Control', icon: <InventoryIcon />, path: '/stock-control' },
  { text: 'Team Management', icon: <PeopleAltIcon />, path: '/team-management' },
  { text: 'PayFlow', icon: <PaymentIcon />, path: '/payflow' },
  { text: 'Insights Center', icon: <StarIcon />, path: '/insights-center' },
  { text: 'BuzzBox', icon: <MessageIcon />, path: '/buzzbox' },
  { text: 'QA Module', icon: <ScienceIcon />, path: '/qa-module' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 100;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const theme = useTheme();

  // Elegant single color for sidebar, looks good in both dark and light mode
  const sidebarBg = theme.palette.mode === 'dark' ? '#22336b' : '#e3eefd';
  const sidebarBgFallback = sidebarBg;
  const sidebarText = theme.palette.mode === 'dark' ? '#fff' : '#22336b';
  const sidebarIcon = theme.palette.mode === 'dark' ? '#90caf9' : '#22336b';
  // Distinct highlight for active item
  const activeBg = theme.palette.mode === 'dark' ? '#2d437e' : '#d0e2fd';
  const activeText = theme.palette.mode === 'dark' ? '#fff' : '#22336b';
  const activeBorder = theme.palette.mode === 'dark' ? '2px solid #90caf9' : '2px solid #22336b';
  const activeShadow = theme.palette.mode === 'dark' ? '0 0 16px 2px #90caf9' : '0 0 16px 2px #22336b';
  const hoverBg = theme.palette.mode === 'dark' ? '#2d437e' : '#d0e2fd';

  const iconColors: Record<string, string> = {
    Dashboard: sidebarIcon,
    'Farmers Portal': sidebarIcon,
    'Milking Zone': sidebarIcon,
    'Distribution Network': sidebarIcon,
    'Unit Tracker': sidebarIcon,
    'Sales Grid': sidebarIcon,
    'Stock Control': sidebarIcon,
    'Team Management': sidebarIcon,
    PayFlow: sidebarIcon,
    'Insights Center': sidebarIcon,
    BuzzBox: sidebarIcon,
    'QA Module': sidebarIcon,
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED,
          boxSizing: 'border-box',
          bgcolor: sidebarBgFallback,
          background: sidebarBg,
          color: sidebarText,
          borderRight: `1.5px solid ${theme.palette.divider}`,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          overflowY: 'auto',
          position: 'fixed',
          top: '64px',
          height: 'calc(100% - 64px)',
          zIndex: 1199,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        },
      }}
    >
      <List sx={{ width: '100%' }}>
        {menuItems.map(({ text, icon, path }) => {
          const isActive = location.pathname === path;
          const iconColor = iconColors[text] || (isActive ? activeText : sidebarIcon);
          return (
            <ListItemButton
              key={text}
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 4,
                width: '100%',
                height: 48,
                bgcolor: isActive ? activeBg : 'transparent',
                border: isActive ? activeBorder : '2px solid transparent',
                boxShadow: isActive ? activeShadow : 0,
                justifyContent: isOpen ? 'flex-start' : 'center',
                mx: 'auto',
                mb: 1,
                px: isOpen ? 2 : 0,
                transition: 'all 0.2s',
                '&:hover': { bgcolor: hoverBg },
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                backdropFilter: isActive ? 'blur(6px)' : undefined,
              }}
              end
            >
              <ListItemIcon
                sx={{
                  color: iconColor,
                  minWidth: 0,
                  mr: isOpen ? 2 : 0,
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText
                  primary={text}
                  sx={{
                    opacity: 1,
                    transition: 'opacity 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 600,
                    fontSize: 15,
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      fontSize: 15,
                      color: isActive ? activeText : sidebarText,
                    },
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
