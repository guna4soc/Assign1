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

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Farmers Portal', icon: <GroupIcon />, path: '/farmers-portal' },
  { text: 'Milking Zone', icon: <LocalShippingIcon />, path: '/milking-zone' }, // Updated name
  { text: 'Distribution Network', icon: <StoreIcon />, path: '/distribution-network' }, // Updated name
  { text: 'Unit Tracker', icon: <AssignmentTurnedInIcon />, path: '/unit-tracker' }, // Updated name
  { text: 'Sales Grid', icon: <StoreIcon />, path: '/sales-grid' }, // Updated name
  { text: 'Stock Control', icon: <InventoryIcon />, path: '/stock-control' }, // Updated name
  { text: 'Team Management', icon: <PeopleAltIcon />, path: '/team-management' }, // Updated name
  { text: 'PayFlow', icon: <PaymentIcon />, path: '/payflow' }, // Updated name
  { text: 'Insights Center', icon: <StarIcon />, path: '/insights-center' }, // Updated name
  { text: 'BuzzBox', icon: <MessageIcon />, path: '/buzzbox' }, // Updated name
  { text: 'QA Module', icon: <ScienceIcon />, path: '/qa-module' }, // Updated name
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SIDEBAR_WIDTH = 220;
const SIDEBAR_COLLAPSED = 100;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();

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
          bgcolor: '#6c63ff',
          color: '#fff',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRight: 0,
          position: 'fixed',
          top: '64px',
          height: 'calc(100% - 64px)',
          zIndex: 1199,
        },
      }}
    >
      <List sx={{ width: '100%' }}>
        {menuItems.map(({ text, icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <ListItemButton
              key={text}
              component={NavLink}
              to={path}
              sx={{
                borderRadius: 4,
                width: '100%',
                height: 48,
                bgcolor: isActive ? '#4e3ec8' : '#8576ff',
                justifyContent: isOpen ? 'flex-start' : 'center',
                mx: 'auto',
                mb: 1,
                px: isOpen ? 2 : 0,
                transition: 'all 0.2s',
                boxShadow: 1,
                '&:hover': { bgcolor: '#a393eb' },
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
              }}
              end
            >
              <ListItemIcon
                sx={{
                  color: '#fff',
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
                      color: '#fff',
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
