import React from 'react';
import { Drawer,Box ,List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentIcon from '@mui/icons-material/Payment';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'Farmers & Suppliers', icon: <GroupIcon /> },
  { text: 'Milk Collection', icon: <LocalShippingIcon /> },
  { text: 'Processing Units', icon: <StoreIcon /> },
  { text: 'Inventory', icon: <InventoryIcon /> },
  { text: 'Payments & Bills', icon: <PaymentIcon /> },
  { text: 'Message', icon: <MessageIcon /> },
  { text: 'My Profile', icon: <AccountCircleIcon /> },
];

const Sidebar: React.FC = () => (
  <Drawer
    variant="permanent"
    sx={{
      width: 220,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box', bgcolor: '#3f51b5', color: '#fff' },
    }}
  >
    <Toolbar />
    <List>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src="C:\Users\DELL E5490\Downloads\ATS (1) (1)\ATS\ats\src\assets\Logo ATS.png" alt="ATS Logo" style={{ height: 40, marginRight: 8 }} />
      </Box>
      {menuItems.map((item) => (
        <ListItem component="button"  button key={item.text}>
          <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  </Drawer>
);

export default Sidebar;
