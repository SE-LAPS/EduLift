import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, InputAdornment, Alert, Link as MuiLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword, loading } = useAuth();
  const { mode } = useThemeContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send password reset email. Please check your email address and try again.');
      console.error('Password reset error:', err);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password | EduLift</title>
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
                  Forgot Password
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isSubmitted 
                    ? 'Check your email for password reset instructions' 
                    : 'Enter your email address to receive a password reset link'}
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {isSubmitted ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Alert severity="success" sx={{ mb: 4 }}>
                    Password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.
                  </Alert>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    If you don't receive an email within a few minutes, please check your spam folder or try again.
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href="/login"
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      py: 1.5,
                      px: 4
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    variant="outlined"
                    margin="normal"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
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
                    disabled={loading}
                    sx={{ 
                      mt: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <MuiLink 
                      component={Link}
                      href="/login"
                      underline="hover"
                      sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        gap: 0.5,
                        fontWeight: 500
                      }}
                    >
                      <ArrowBackIcon fontSize="small" />
                      Back to Login
                    </MuiLink>
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

export default ForgotPassword; 