import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Card, CardContent, InputAdornment, IconButton, Alert } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const { confirmPasswordReset, loading } = useAuth();
  const router = useRouter();
  const { mode } = useThemeContext();

  useEffect(() => {
    // Get token from URL query parameters
    const { token: resetToken } = router.query;
    if (resetToken && typeof resetToken === 'string') {
      setToken(resetToken);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    try {
      await confirmPasswordReset(token, password);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Failed to reset password. The link may have expired.');
      console.error('Password reset error:', err);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Head>
        <title>Reset Password | EduLift</title>
        <meta name="description" content="Reset your EduLift account password to regain access to your personalized dashboard and educational resources." />
      </Head>
      
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          py: 8,
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box className="bg-blob bg-blob-1" />
        <Box className="bg-blob bg-blob-2" />
        
        <Container maxWidth="sm">
          <Card 
            className="hover-lift" 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  Reset Password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {success 
                    ? 'Your password has been successfully reset' 
                    : 'Create a new password for your account'}
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Alert severity="success" sx={{ mb: 4 }}>
                    Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                  </Alert>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/login"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      px: 4
                    }}
                  >
                    Go to Login
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    margin="normal"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Password must be at least 6 characters"
                  />
                  
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    margin="normal"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleToggleConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || !token}
                    sx={{ 
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      variant="text"
                      color="primary"
                      component={Link}
                      href="/login"
                      startIcon={<ArrowBackIcon />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Back to Login
                    </Button>
                  </Box>
                </form>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default ResetPassword; 