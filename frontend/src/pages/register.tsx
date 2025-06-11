import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent, InputAdornment, IconButton, Link as MuiLink, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    school: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const { register, loading } = useAuth();
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
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
    
    if (formData.role === 'student' && !formData.grade) {
      errors.grade = 'Grade is required for students';
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    
    try {
      await register(formData);
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
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
                component="img"
                src="/images/login-illustration.svg" 
                alt="Register for EduLift"
                sx={{ 
                  maxWidth: '80%',
                  height: 'auto',
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))'
                }}
              />
            </Grid>
            
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
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          variant="outlined"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
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
                      
                      <Grid item xs={12} sm={6}>
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
                      
                      <Grid item xs={12} sm={6}>
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
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="role-label">Role</InputLabel>
                          <Select
                            labelId="role-label"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Role"
                            startAdornment={
                              <InputAdornment position="start">
                                <PersonIcon color="primary" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="student">Student</MenuItem>
                            <MenuItem value="teacher">Teacher</MenuItem>
                            <MenuItem value="parent">Parent</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      {formData.role === 'student' && (
                        <Grid item xs={12} sm={6}>
                          <FormControl 
                            fullWidth 
                            variant="outlined"
                            error={!!formErrors.grade}
                          >
                            <InputLabel id="grade-label">Grade</InputLabel>
                            <Select
                              labelId="grade-label"
                              name="grade"
                              value={formData.grade}
                              onChange={handleChange}
                              label="Grade"
                              startAdornment={
                                <InputAdornment position="start">
                                  <SchoolIcon color="primary" />
                                </InputAdornment>
                              }
                            >
                              {[...Array(13)].map((_, i) => (
                                <MenuItem key={i + 1} value={`Grade ${i + 1}`}>
                                  Grade {i + 1}
                                </MenuItem>
                              ))}
                              <MenuItem value="O/L Completed">O/L Completed</MenuItem>
                              <MenuItem value="A/L Completed">A/L Completed</MenuItem>
                            </Select>
                            {formErrors.grade && (
                              <FormHelperText>{formErrors.grade}</FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      )}
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="School"
                          name="school"
                          variant="outlined"
                          value={formData.school}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SchoolIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    
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
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <MuiLink 
                        component={Link}
                        href="/login"
                        underline="hover"
                        sx={{ fontWeight: 600 }}
                      >
                        Sign In
                      </MuiLink>
                    </Typography>
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

export default Register; 