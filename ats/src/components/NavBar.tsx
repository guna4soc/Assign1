import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  Badge,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tooltip,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeContext } from '../types/theme/ThemeContext';

// --- Typewriter Component ---
const Typewriter: React.FC<{ text: string; delay?: number }> = ({ text, delay = 80 }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);
  return (
    <span>
      {displayed}
      <span style={{ color: '#1976d2', fontWeight: 'bold' }}>|</span>
    </span>
  );
};

// --- Waving Hand Animation CSS ---
const waveStyle: React.CSSProperties = {
  display: 'inline-block',
  animation: 'wave-animation 2s infinite',
  transformOrigin: '70% 70%',
  fontSize: '1.7em',
  marginRight: 8,
};

const waveKeyframes = `
@keyframes wave-animation {
  0% { transform: rotate(0.0deg); }
  10% { transform: rotate(14.0deg); }
  20% { transform: rotate(-8.0deg); }
  30% { transform: rotate(14.0deg); }
  40% { transform: rotate(-4.0deg); }
  50% { transform: rotate(10.0deg); }
  60% { transform: rotate(0.0deg); }
  100% { transform: rotate(0.0deg); }
}
`;

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('wave-keyframes')) {
  const style = document.createElement('style');
  style.id = 'wave-keyframes';
  style.innerHTML = waveKeyframes;
  document.head.appendChild(style);
}

interface NavBarProps {
  onBurgerClick: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NavBar: React.FC<NavBarProps> = ({ onBurgerClick }) => {
  const { mode, toggleColorMode } = useThemeContext();
  const [openLogin, setOpenLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [user, setUser] = useState<{ email: string; password: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setNotifications(prev => [
        {
          id: Date.now(),
          title: 'New Notification',
          message: 'You have a new notification.',
          isRead: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogin = () => {
    if (emailInput.trim() && passwordInput.trim()) {
      setUser({ email: emailInput.trim(), password: passwordInput });
      setOpenLogin(false);
      setEmailInput('');
      setPasswordInput('');
    } else {
      alert('Please enter both email and password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setNotifications([]);
    setUserMenuAnchorEl(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      setOpenLogin(true);
    } else {
      setUserMenuAnchorEl(event.currentTarget);
    }
  };

  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationsClose = () => setNotificationsAnchorEl(null);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          color: 'text.primary',
          px: 2,
          zIndex: (theme) => theme.zIndex.drawer + 10,
          height: '64px',
          justifyContent: 'center',
          boxShadow: 'none',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px !important' }}>
          {/* Left: Logo & Burger menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img
              src="./image.png"
              alt="ATSLogo"
              style={{ height: 56, borderRadius: 4, objectFit: 'contain', marginRight: 16 }}
            />
            <IconButton
              onClick={onBurgerClick}
              edge="start"
              color="inherit"
              aria-label="menu toggle"
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center: Welcome Typing Animation with Wave (only after login) */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {user && (
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: 'primary.main',
                  minWidth: '260px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <span style={waveStyle} role="img" aria-label="wave">
                  👋
                </span>
                <Typewriter text="Welcome to Dashboard" delay={80} />
              </Typography>
            )}
          </Box>

          {/* Right: Search Bar & Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'action.selected',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                maxWidth: 400,
                mx: 2,
                transition: 'background-color 0.3s',
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <InputBase
                placeholder="Search…"
                sx={{ width: '100%', color: 'text.primary' }}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Box>

            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none', borderRadius: 2 }}
              startIcon={<LanguageIcon />}
              onClick={() => setLanguage((l: string) => l === 'English' ? 'Spanish' : 'English')}
            >
              {language}
            </Button>

            <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
              <IconButton onClick={toggleColorMode} color="inherit">
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {user && (
              <IconButton
                color="inherit"
                aria-label="notifications"
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Avatar
                sx={{ bgcolor: 'primary.main', cursor: 'pointer' }}
                onClick={handleUserMenuClick}
              >
                {user ? user.email[0].toUpperCase() : undefined}
              </Avatar>
              {user && (
                <Typography
                  sx={{
                    ml: 1,
                    fontWeight: 500,
                    maxWidth: '140px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer'
                  }}
                  onClick={handleUserMenuClick}
                >
                  {user.email}
                </Typography>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogin(false)}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            overflowY: 'auto',
            bgcolor: 'background.paper',
          }
        }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary" textAlign="center" width="100%">
              No new notifications
            </Typography>
          </MenuItem>
        )}
        {notifications.map(notification => (
          <Box key={notification.id} sx={{ bgcolor: notification.isRead ? 'transparent' : 'action.hover' }}>
            <MenuItem sx={{ whiteSpace: 'normal' }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>N</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight={notification.isRead ? 400 : 'bold'}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Typography component="span" variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                }
              />
              <Typography variant="caption" color="text.secondary" ml={1}>
                {notification.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </MenuItem>
            <Divider />
          </Box>
        ))}
      </Menu>

      {/* User Menu (Logout) */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
          }
        }}
      >
        <MenuItem disabled>
          <Typography fontWeight="bold">{user?.email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default NavBar;
