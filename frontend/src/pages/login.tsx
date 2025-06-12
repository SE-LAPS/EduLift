import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, InputAdornment, IconButton, Link as MuiLink, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();
  const { mode } = useThemeContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Head>
        <title>Sign In | EduLift</title>
        <meta name="description" content="Sign in to your EduLift account to access your personalized dashboard, courses, and resources." />
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
        
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: { xs: 'none', md: 'block' },
                textAlign: 'center'
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  height: '450px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  className="login-image-container"
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <style jsx global>{`
                    @keyframes signin-pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                    }
                    
                    @keyframes signin-glow {
                      0% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                      50% { filter: drop-shadow(0 0 15px rgba(0, 87, 255, 0.6)); }
                      100% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                    }
                    
                    .login-image-container::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: ${mode === 'light' 
                        ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(255,255,255,0) 70%)' 
                        : 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, rgba(0,0,0,0) 70%)'};
                      animation: signin-pulse 8s ease-in-out infinite;
                      z-index: -1;
                      border-radius: 50%;
                      transform: scale(1.2);
                    }
                    
                    .login-image-container img {
                      animation: signin-glow 4s ease-in-out infinite;
                      filter: ${mode === 'light' 
                        ? 'drop-shadow(0 0 10px rgba(0, 87, 255, 0.4))' 
                        : 'drop-shadow(0 0 10px rgba(66, 153, 225, 0.5))'};
                      max-width: 100%;
                      height: auto;
                      border-radius: 12px;
                      transform: scale(0.9);
                      transition: all 0.5s ease;
                    }
                    
                    .login-image-container:hover img {
                      transform: scale(0.95);
                    }
                    
                    @keyframes spread {
                      0% { transform: scale(0.9); filter: blur(0px); }
                      50% { transform: scale(1.05); filter: blur(1px); }
                      100% { transform: scale(0.9); filter: blur(0px); }
                    }
                  `}</style>
                  <Box 
                    component="img"
                    src="/images/signin.gif" 
                    alt="Login to EduLift"
                    sx={{ 
                      maxWidth: '90%',
                      height: 'auto',
                      animation: 'spread 10s ease-in-out infinite',
                      filter: mode === 'light' 
                        ? 'drop-shadow(0 10px 25px rgba(0, 87, 255, 0.2))' 
                        : 'drop-shadow(0 10px 25px rgba(66, 153, 225, 0.3)) brightness(0.9)',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={10} md={6} lg={5}>
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
                      Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Sign in to continue to your account
                    </Typography>
                  </Box>
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  
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
                    
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      variant="outlined"
                      margin="normal"
                      required
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
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                      <MuiLink 
                        component={Link}
                        href="/forgot-password"
                        underline="hover"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        Forgot password?
                      </MuiLink>
                    </Box>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </form>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <MuiLink 
                        component={Link}
                        href="/register"
                        underline="hover"
                        sx={{ fontWeight: 600 }}
                      >
                        Sign Up
                      </MuiLink>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ textAlign: 'center' }}>
                      Test Accounts
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Button 
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEmail('admin@edulift.lk');
                            setPassword('admin123');
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Admin
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button 
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEmail('teacher@edulift.lk');
                            setPassword('teacher123');
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Teacher
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button 
                          fullWidth
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setEmail('student@edulift.lk');
                            setPassword('student123');
                          }}
                          sx={{ textTransform: 'none' }}
                        >
                          Student
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Login; 