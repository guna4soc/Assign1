import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useThemeContext } from '../types/theme/ThemeContext';

// Utility function to open URL in new tab
const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

interface NavBarProps {
  onBurgerClick: () => void;
  user: {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  } | null;
  setUser: (user: any) => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: Date;
  read: boolean;
  sent: boolean; // true = sent, false = received
}

const NavBar: React.FC<NavBarProps> = ({ onBurgerClick, user, setUser }) => {
  const { mode, toggleColorMode } = useThemeContext();
  const navigate = useNavigate();
  
  // Login Modal State
  const [openLogin, setOpenLogin] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState('English');

  // --- Email State ---
  const [emails, setEmails] = useState<Email[]>([]);
  const [emailAnchorEl, setEmailAnchorEl] = useState<null | HTMLElement>(null);
  const [emailTab, setEmailTab] = useState(0); // 0 = Inbox, 1 = Sent
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  // --- Listen for login success from other tabs ---
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_login' && e.newValue) {
        const userData = JSON.parse(e.newValue);
        setUser(userData);
        setOpenLogin(false);
        // Clear the storage item after use
        localStorage.removeItem('user_login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- Check for existing user session on component mount ---
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // --- Save user to localStorage when user state changes ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('current_user');
    }
  }, [user]);

  // --- Notification Logic ---
  /*
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
  */

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadEmailCount = emails.filter(e => !e.read && !e.sent).length;

  // --- Email Demo: Simulate incoming emails for demo purposes ---
  /*
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setEmails(prev => [
        {
          id: Date.now(),
          from: 'noreply@demo.com',
          to: user.email,
          subject: 'Demo Email',
          body: 'This is a demo email message.',
          date: new Date(),
          read: false,
          sent: false,
        },
        ...prev,
      ]);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);
  */

  // --- Email Actions ---
  const handleComposeSend = () => {
    if (!composeTo.trim() || !composeSubject.trim() || !composeBody.trim()) {
      alert('All fields required.');
      return;
    }
    setEmails(prev => [
      {
        id: Date.now(),
        from: user!.email,
        to: composeTo,
        subject: composeSubject,
        body: composeBody,
        date: new Date(),
        read: true,
        sent: true,
      },
      ...prev,
    ]);
    setComposeOpen(false);
    setComposeTo('');
    setComposeSubject('');
    setComposeBody('');
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.read && !email.sent) {
      setEmails(prev =>
        prev.map(e =>
          e.id === email.id ? { ...e, read: true } : e
        )
      );
    }
  };

  const handleDeleteEmail = (id: number) => {
    setEmails(prev => prev.filter(e => e.id !== id));
    setSelectedEmail(null);
  };

  const handleMarkRead = (id: number) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  };

  // --- Login/Logout ---
  const handleLogin = () => {
    setLoginError('');
    
    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    // Simulate login validation (replace with actual authentication logic)
    if (emailInput.includes('@') && passwordInput.length >= 6) {
      const userData = { email: emailInput.trim(), password: passwordInput };
      setUser(userData);
      setOpenLogin(false);
      setEmailInput('');
      setPasswordInput('');
      setLoginError('');
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } else {
      setLoginError('Invalid email or password. Password must be at least 6 characters.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setNotifications([]);
    setEmails([]);
    setUserMenuAnchorEl(null);
    navigate('/');
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!user) {
      // Open login in new tab instead of modal
      openInNewTab('/login');
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

  // --- Email Menu ---
  const handleEmailMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setEmailAnchorEl(event.currentTarget);
  };
  const handleEmailMenuClose = () => {
    setEmailAnchorEl(null);
    setSelectedEmail(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: 'navbar.main',
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
        <Toolbar sx={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', minHeight: '64px !important', pr: 2, pl: 0, gap: 0, px: 0 }}>
          {/* Left: Logo & Burger menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
            <img
              src={process.env.PUBLIC_URL + '/image.png'}
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

          {/* Center: Search Bar (absolutely centered) */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'action.selected',
              px: 2.5,
              py: 0.5, // reduced vertical padding
              borderRadius: 2.5,
              maxWidth: 400,
              width: 400,
              minWidth: 200,
              transition: 'background-color 0.3s',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              pointerEvents: 'auto',
              zIndex: 2,
            }}
          >
            <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 28 }} />
            <InputBase
              placeholder="Search"
              sx={{ width: '100%', color: 'text.primary', fontSize: 20 }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>

          {/* Right: Controls - all icons at the far right, no user email/name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0, flexShrink: 0, ml: 'auto' }}>
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
              <IconButton onClick={toggleColorMode} sx={{ color: (theme) => theme.palette.icon.main }}>
                {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {user && (
              <>
                <IconButton
                  sx={{ color: (theme) => theme.palette.icon.main }}
                  aria-label="email"
                  onClick={handleEmailMenuClick}
                >
                  <Badge badgeContent={unreadEmailCount} color="error">
                    <EmailIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  sx={{ color: (theme) => theme.palette.icon.main }}
                  aria-label="notifications"
                  onClick={handleNotificationsClick}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </>
            )}
            <Avatar
              sx={{ bgcolor: 'primary.main', cursor: 'pointer', ml: 1 }}
              onClick={handleUserMenuClick}
            >
              {user ? (user.firstName ? user.firstName[0].toUpperCase() : user.email[0].toUpperCase()) : undefined}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Fallback Login Dialog (for existing functionality) */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to access your account
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {loginError && (
            <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
              {loginError}
            </Typography>
          )}
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
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => openInNewTab('/forgot-password')}
              sx={{ textDecoration: 'none' }}
            >
              Forgot Password?
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => openInNewTab('/signup')}
              sx={{ textDecoration: 'none' }}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenLogin(false)} size="large">
            Cancel
          </Button>
          <Button 
            onClick={handleLogin} 
            variant="contained" 
            size="large"
            sx={{ minWidth: 100 }}
          >
            Login
          </Button>
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

      {/* Email Menu */}
      <Menu
        anchorEl={emailAnchorEl}
        open={Boolean(emailAnchorEl)}
        onClose={handleEmailMenuClose}
        PaperProps={{
          sx: {
            width: 420,
            maxHeight: 500,
            bgcolor: 'background.paper',
            p: 0,
          }
        }}
      >
        <Box sx={{ px: 2, pt: 2, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs value={emailTab} onChange={(_, v) => { setEmailTab(v); setSelectedEmail(null); }} variant="fullWidth">
            <Tab label="Inbox" />
            <Tab label="Sent" />
          </Tabs>
          <Button
            size="small"
            variant="contained"
            sx={{ ml: 2, textTransform: 'none', borderRadius: 2 }}
            startIcon={<SendIcon />}
            onClick={() => setComposeOpen(true)}
          >
            Compose
          </Button>
        </Box>
        <Divider />
        <Box sx={{ height: 320, overflowY: 'auto' }}>
          <List dense>
            {emails.filter(e => e.sent === (emailTab === 1)).length === 0 && (
              <ListItem>
                <ListItemText primary="No Emails" />
              </ListItem>
            )}
            {emails
              .filter(e => e.sent === (emailTab === 1))
              .map(email => (
                <ListItemButton
                  key={email.id}
                  selected={selectedEmail?.id === email.id}
                  onClick={() => handleEmailClick(email)}
                  sx={{
                    bgcolor: !email.read && !email.sent ? 'action.selected' : undefined,
                  }}
                >
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: email.sent ? 'secondary.main' : 'primary.main', width: 32, height: 32 }}>
                      {email.sent ? <SendIcon /> : <EmailIcon />}
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={email.subject}
                    secondary={
                      <span>
                        <b>{email.sent ? 'To: ' : 'From: '}</b>
                        {email.sent ? email.to : email.from}
                        <span style={{ marginLeft: 8, color: '#888' }}>
                          {email.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!email.read && !email.sent && (
                      <Tooltip title="Mark as Read">
                        <IconButton edge="end" onClick={() => handleMarkRead(email.id)}>
                          <MarkEmailReadIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton edge="end" onClick={() => handleDeleteEmail(email.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
          </List>
        </Box>
        {selectedEmail && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedEmail.sent ? 'To' : 'From'}: {selectedEmail.sent ? selectedEmail.to : selectedEmail.from}
              </Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>{selectedEmail.subject}</Typography>
              <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-line' }}>
                {selectedEmail.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {selectedEmail.date.toLocaleString()}
              </Typography>
            </Box>
          </>
        )}
      </Menu>

      {/* Compose Email Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Compose Email</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="To"
            type="email"
            fullWidth
            variant="outlined"
            value={composeTo}
            onChange={e => setComposeTo(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Subject"
            fullWidth
            variant="outlined"
            value={composeSubject}
            onChange={e => setComposeSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Body"
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={composeBody}
            onChange={e => setComposeBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button onClick={handleComposeSend} variant="contained" startIcon={<SendIcon />}>Send</Button>
        </DialogActions>
      </Dialog>

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
          <Typography fontWeight="bold">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}</Typography>
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