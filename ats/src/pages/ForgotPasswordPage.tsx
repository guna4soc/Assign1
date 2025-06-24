import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  Container,
} from '@mui/material';
import {
  Email as EmailIcon,
  LockReset as LockResetIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Utility function to open URL in new tab
const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically make an API call to send password reset email
      // For demo purposes, we'll show a success message
      setSuccess(
        `Password reset instructions have been sent to ${email}. Please check your inbox and follow the instructions to reset your password.`
      );
      setEmail('');

    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    openInNewTab('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 480,
            mx: 'auto',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: 'warning.main',
              color: 'white',
              p: 4,
              textAlign: 'center',
            }}
          >
            <LockResetIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Reset Password
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Enter your email to receive reset instructions
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {!success && (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Don't worry! It happens to the best of us. Enter your email address below 
                  and we'll send you instructions on how to reset your password.
                </Typography>

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  autoFocus
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    bgcolor: 'warning.main',
                    '&:hover': {
                      bgcolor: 'warning.dark',
                    },
                  }}
                >
                  {loading ? 'Sending Instructions...' : 'Send Reset Instructions'}
                </Button>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBackToLogin}
                sx={{
                  textTransform: 'none',
                  textDecoration: 'none',
                }}
              >
                Back to Login
              </Button>
            </Box>

            {success && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Didn't receive the email? Check your spam folder or{' '}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => {
                      setSuccess('');
                      setEmail('');
                    }}
                    sx={{
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    try again
                  </Link>
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography
          variant="body2"
          color="white"
          sx={{ textAlign: 'center', mt: 3, opacity: 0.8 }}
        >
          © 2024 Your Company. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;