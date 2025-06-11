import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const { currentUser, updateUserProfile, updateUserPassword, loading } = useAuth();
  const router = useRouter();
  const { mode } = useThemeContext();
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    role: '',
    school: '',
    grade: '',
    avatar: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Populate form with user data
    setProfileForm({
      fullName: currentUser.displayName || '',
      email: currentUser.email || '',
      role: currentUser.role || 'student',
      school: currentUser.school || '',
      grade: currentUser.grade || '',
      avatar: currentUser.photoURL || '',
    });
  }, [currentUser, router]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSuccess('');
    setError('');
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name as string]: value,
    });
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await updateUserProfile({
        displayName: profileForm.fullName,
        photoURL: profileForm.avatar,
        role: profileForm.role,
        school: profileForm.school,
        grade: profileForm.grade,
      });
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Validate passwords
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await updateUserPassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError('Failed to update password. Please check your current password and try again.');
      console.error('Password update error:', err);
    }
  };

  return (
    <>
      <Head>
        <title>My Profile | EduLift</title>
        <meta name="description" content="Manage your EduLift profile settings and account information." />
      </Head>
      
      <Box 
        sx={{ 
          minHeight: 'calc(100vh - 64px)',
          py: 6,
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your account settings and preferences
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Card className="hover-lift" sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Avatar
                    src={profileForm.avatar || '/images/avatar-placeholder.jpg'}
                    alt={profileForm.fullName}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto',
                      mb: 2,
                      border: 3,
                      borderColor: 'primary.main'
                    }}
                  />
                  
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {profileForm.fullName}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {profileForm.email}
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'inline-block', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    textTransform: 'capitalize',
                    mt: 1
                  }}>
                    {profileForm.role}
                  </Box>
                  
                  {profileForm.school && (
                    <Typography variant="body2" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SchoolIcon sx={{ mr: 1, fontSize: 18 }} />
                      {profileForm.school}
                      {profileForm.grade && ` • Grade ${profileForm.grade}`}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Card className="hover-lift" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange} 
                      aria-label="profile tabs"
                      sx={{
                        '& .MuiTab-root': {
                          py: 2,
                          px: 3,
                          textTransform: 'none',
                          fontWeight: 500
                        }
                      }}
                    >
                      <Tab label="Personal Information" />
                      <Tab label="Security" />
                    </Tabs>
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    {(success || error) && (
                      <Alert 
                        severity={success ? "success" : "error"} 
                        sx={{ mb: 3 }}
                        onClose={() => success ? setSuccess('') : setError('')}
                      >
                        {success || error}
                      </Alert>
                    )}
                    
                    <TabPanel value={tabValue} index={0}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        {editMode ? (
                          <>
                            <Button 
                              startIcon={<CancelIcon />} 
                              onClick={() => setEditMode(false)}
                              sx={{ mr: 1 }}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              startIcon={<SaveIcon />}
                              onClick={handleProfileSubmit}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outlined" 
                            startIcon={<EditIcon />} 
                            onClick={() => setEditMode(true)}
                          >
                            Edit Profile
                          </Button>
                        )}
                      </Box>
                      
                      <form onSubmit={handleProfileSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Full Name"
                              name="fullName"
                              value={profileForm.fullName}
                              onChange={handleProfileFormChange}
                              disabled={!editMode}
                              required
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
                              value={profileForm.email}
                              disabled
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                              helperText="Email cannot be changed"
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={!editMode}>
                              <InputLabel id="role-label">Role</InputLabel>
                              <Select
                                labelId="role-label"
                                name="role"
                                value={profileForm.role}
                                onChange={handleProfileFormChange}
                                label="Role"
                              >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                                <MenuItem value="admin">Administrator</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          {profileForm.role === 'student' && (
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Grade"
                                name="grade"
                                value={profileForm.grade}
                                onChange={handleProfileFormChange}
                                disabled={!editMode}
                              />
                            </Grid>
                          )}
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="School"
                              name="school"
                              value={profileForm.school}
                              onChange={handleProfileFormChange}
                              disabled={!editMode}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SchoolIcon color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Avatar URL"
                              name="avatar"
                              value={profileForm.avatar}
                              onChange={handleProfileFormChange}
                              disabled={!editMode}
                              helperText="Enter a URL for your profile image"
                            />
                          </Grid>
                        </Grid>
                      </form>
                    </TabPanel>
                    
                    <TabPanel value={tabValue} index={1}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        Change Password
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Ensure your account is using a strong password to keep your account secure.
                      </Typography>
                      
                      <Divider sx={{ my: 3 }} />
                      
                      <form onSubmit={handlePasswordSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Current Password"
                              name="currentPassword"
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordForm.currentPassword}
                              onChange={handlePasswordFormChange}
                              required
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon color="primary" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle current password visibility"
                                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                      edge="end"
                                    >
                                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="New Password"
                              name="newPassword"
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordForm.newPassword}
                              onChange={handlePasswordFormChange}
                              required
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon color="primary" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle new password visibility"
                                      onClick={() => setShowNewPassword(!showNewPassword)}
                                      edge="end"
                                    >
                                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              helperText="Password must be at least 6 characters"
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Confirm New Password"
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordForm.confirmPassword}
                              onChange={handlePasswordFormChange}
                              required
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
                                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              disabled={loading}
                              sx={{ 
                                py: 1.5, 
                                px: 4, 
                                borderRadius: 2,
                                textTransform: 'none'
                              }}
                            >
                              {loading ? (
                                <>
                                  <CircularProgress size={24} sx={{ mr: 1 }} />
                                  Updating...
                                </>
                              ) : (
                                'Update Password'
                              )}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    </TabPanel>
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

export default Profile; 