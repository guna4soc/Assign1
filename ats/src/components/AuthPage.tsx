import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Link, Fade, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './AuthPageBackground.css';
import DigitalLock from '../assets/svgs/digitalLock.svg';
import Typewriter from './Typewriter';

export interface AuthUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

type AuthView = 'login' | 'signup' | 'forgot';

interface AuthProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const validateEmail = (email: string) => {
  if (!email) return 'Email is required';
  if (!/^([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return 'Invalid email address';
  return '';
};
const validatePassword = (pw: string) => {
  if (!pw) return 'Password is required';
  if (pw.length < 6) return 'Password must be at least 6 characters';
  return '';
};

const AuthPage: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  // Signup
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  // Forgot
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  // Reset errors on view change
  const switchView = (v: AuthView) => {
    setView(v);
    setLoginError(''); setSignupError(''); setForgotMsg('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(loginEmail);
    const pwErr = validatePassword(loginPassword);
    if (emailErr || pwErr) {
      setLoginError(emailErr || pwErr);
      return;
    }
    onAuthSuccess({ email: loginEmail });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(signupEmail);
    const pwErr = validatePassword(signupPassword);
    if (emailErr || pwErr) {
      setSignupError(emailErr || pwErr);
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match');
      return;
    }
    // Prompt for first and last name (or add fields as needed)
    const firstName = signupEmail.split('@')[0];
    onAuthSuccess({ email: signupEmail, firstName });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(forgotEmail);
    if (emailErr) {
      setForgotMsg(emailErr);
      return;
    }
    setForgotMsg('Password reset link sent!');
  };

  return (
    <>
      {/* Background animation and company name */}
      <div className="auth-bg-animate">
        <div className="main-blob" />
        <div className="float-circle float-circle1" />
        <div className="float-circle float-circle2" />
        <div className="float-circle float-circle3" />
        <div className="float-circle float-circle4" />
        <div className="ats-company-block">
          <div className="ats-company-name">
            <Typewriter text="Astrolite Tech Solutions Private Limited" delay={100} />
          </div>
          <div className="ats-tagline">{/* Tagline Here */}</div>
        </div>
      </div>
      {/* Centered modern card container */}
      <div className="auth-center-container">
        <Fade in={true} timeout={800}>
          <Paper elevation={3} sx={{ p: 4, width: 350, position: 'relative', overflow: 'visible', bgcolor: 'rgba(18, 22, 34, 0.95)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', mx: 'auto' }}>
            {view === 'login' && (
              <>
                <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#1976d2' }}>Login</Typography>
                <form onSubmit={handleLogin}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showLoginPassword ? 'text' : 'password'}
                    margin="normal"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowLoginPassword((show) => !show)}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                            sx={{ color: 'white' }}
                          >
                            {showLoginPassword ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {loginError && <Typography color="error" variant="body2">{loginError}</Typography>}
                  <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Login</Button>
                </form>
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Link component="button" variant="body2" onClick={() => switchView('signup')} sx={{ mb: 1 }}>Create new account</Link>
                  <Link component="button" variant="body2" onClick={() => switchView('forgot')}>Forgot password?</Link>
                </Box>
              </>
            )}
            {view === 'signup' && (
              <>
                <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#1976d2' }}>Sign Up</Typography>
                <form onSubmit={handleSignup}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type={showSignupPassword ? 'text' : 'password'}
                    margin="normal"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowSignupPassword((show) => !show)}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                            sx={{ color: 'white' }}
                          >
                            {showSignupPassword ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showSignupConfirm ? 'text' : 'password'}
                    margin="normal"
                    value={signupConfirm}
                    onChange={e => setSignupConfirm(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowSignupConfirm((show) => !show)}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                            sx={{ color: 'white' }}
                          >
                            {showSignupConfirm ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  {signupError && <Typography color="error" variant="body2">{signupError}</Typography>}
                  <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Sign Up</Button>
                </form>
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Link component="button" variant="body2" onClick={() => switchView('login')}>Back to Login</Link>
                </Box>
              </>
            )}
            {view === 'forgot' && (
              <>
                <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: '#1976d2' }}>Forgot Password</Typography>
                <form onSubmit={handleForgot}>
                  <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    sx={{
                      '& .MuiInputLabel-root': { color: '#b0b3c6' },
                      '& .MuiOutlinedInput-root': {
                        color: '#111',
                        borderRadius: 2,
                        '& fieldset': { borderColor: '#3a3f58' },
                        '&:hover fieldset': { borderColor: '#6c63ff' },
                        '&.Mui-focused fieldset': { borderColor: '#6c63ff' }
                      }
                    }}
                  />
                  {forgotMsg && <Typography color={forgotMsg.includes('sent') ? 'success.main' : 'error'} variant="body2">{forgotMsg}</Typography>}
                  <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Send Reset Link</Button>
                </form>
                <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                  <Link component="button" variant="body2" onClick={() => switchView('login')}>Back to Login</Link>
                </Box>
              </>
            )}
          </Paper>
        </Fade>
      </div>
    </>
  );
};

export default AuthPage;
