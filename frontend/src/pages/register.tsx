import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, InputAdornment, IconButton, Link as MuiLink, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';
import { authAPI } from '../utils/api';
import { logApiError } from '../utils/debug';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirmPassword: '',
    role: 'student',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { mode } = useThemeContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear field-specific error when user types
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    // Prepare data for API call
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: formData.role,
    };
    
    console.log('Registration attempt with data:', userData);
    
    try {
      setIsLoading(true);
      const response = await authAPI.register(userData);
      console.log('Registration successful:', response.data);
      setSuccess(true);
      
      // Optionally auto-login the user
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard after successful registration and login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err: any) {
      logApiError(err, 'Registration Error');
      
      // Detailed error handling
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error data:', err.response.data);
        console.error('Server error status:', err.response.status);
        console.error('Server error headers:', err.response.headers);
        
        if (err.response.status === 409) {
          // Conflict - user already exists
          if (err.response.data.message?.includes('Username')) {
            setError('This username is already taken. Please choose another one.');
          } else if (err.response.data.message?.includes('Email')) {
            setError('This email address is already registered. Please use another one or login.');
          } else {
            setError(err.response.data.message || 'Registration failed. User already exists.');
          }
        } else {
          setError(err.response.data.message || 'Registration failed. Please try again.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Server not responding. Please check your connection and try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <>
      <Head>
        <title>Register | EduLift</title>
        <meta name="description" content="Create your EduLift account to access personalized educational resources, career guidance, and skill development tools." />
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
            <Grid item xs={12} sm={10} md={6} lg={6}>
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
                      Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Join EduLift to start your educational journey
                    </Typography>
                  </Box>
                  
                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Registration successful! Redirecting...
                    </Alert>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          name="first_name"
                          variant="outlined"
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          error={!!formErrors.first_name}
                          helperText={formErrors.first_name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          name="last_name"
                          variant="outlined"
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          error={!!formErrors.last_name}
                          helperText={formErrors.last_name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Username"
                          name="username"
                          variant="outlined"
                          required
                          value={formData.username}
                          onChange={handleChange}
                          error={!!formErrors.username}
                          helperText={formErrors.username}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BadgeIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          variant="outlined"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          variant="outlined"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          error={!!formErrors.password}
                          helperText={formErrors.password}
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
                                  onClick={() => handleTogglePassword('password')}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          variant="outlined"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          error={!!formErrors.confirmPassword}
                          helperText={formErrors.confirmPassword}
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
                                  onClick={() => handleTogglePassword('confirmPassword')}
                                  edge="end"
                                >
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="role-label">Role</InputLabel>
                          <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                          >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={isLoading}
                      sx={{ 
                        mt: 3, 
                        py: 1.5,
                        fontWeight: 600,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'all 0.5s',
                        },
                        '&:hover::after': {
                          left: '100%',
                        }, 
                      }}
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" component="span">
                        Already have an account?{' '}
                        <MuiLink 
                          component={Link}
                          href="/login" 
                          underline="hover"
                          sx={{ fontWeight: 600 }}
                        >
                          Sign in
                        </MuiLink>
                      </Typography>
                    </Box>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            
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
                  height: '550px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  className="register-image-container"
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
                    @keyframes register-pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                    }
                    
                    @keyframes register-glow {
                      0% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                      50% { filter: drop-shadow(0 0 15px rgba(0, 87, 255, 0.6)); }
                      100% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                    }
                    
                    .register-image-container::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: ${mode === 'light' 
                        ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(255,255,255,0) 70%)' 
                        : 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, rgba(0,0,0,0) 70%)'};
                      animation: register-pulse 8s ease-in-out infinite;
                      z-index: -1;
                      border-radius: 50%;
                      transform: scale(1.2);
                    }
                  `}</style>
                  <Box 
                    component="img"
                    src="/images/signup.gif" 
                    alt="Create an EduLift Account"
                    sx={{ 
                      maxWidth: '95%',
                      height: 'auto',
                      filter: mode === 'light' 
                        ? 'drop-shadow(0 10px 25px rgba(0, 87, 255, 0.2))' 
                        : 'drop-shadow(0 10px 25px rgba(66, 153, 225, 0.3)) brightness(0.9)',
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Register; 