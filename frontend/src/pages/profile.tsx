import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../utils/api';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface ProfileData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mode } = useThemeContext();
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    email: '',
    first_name: '',
    last_name: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
    });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await userAPI.updateProfile(profileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'teacher': return 'primary';
      case 'assistant': return 'secondary';
      case 'supersub': return 'warning';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
      });
  };

  if (!isAuthenticated && !isLoading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h6">Please log in to view your profile.</Typography>
        </Box>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
    }

  return (
    <>
      <Head>
        <title>Profile | EduLift</title>
        <meta name="description" content="Manage your EduLift profile and account settings." />
      </Head>
      
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
        sx={{ 
                width: 80,
                height: 80,
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2rem'
        }}
      >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {user?.first_name} {user?.last_name}
          </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={user?.role?.toUpperCase()}
                  color={getRoleColor(user?.role || '')}
                  size="small"
                />
                <Chip
                  label={user?.is_active ? 'Active' : 'Inactive'}
                  color={user?.is_active ? 'success' : 'error'}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Box>
                  </Box>
                  
          {message.text && (
            <Alert severity={message.type as any} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
                  )}

          <Grid container spacing={3}>
            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Profile Information</Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(true)}
                      >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button 
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={isSaving}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="contained" 
                        onClick={handleSave}
                        disabled={isSaving}
                            >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                    </Box>
                        )}
                      </Box>
                      
                        <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                      label="First Name"
                      value={profileData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!isEditing}
                              InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                      label="Last Name"
                      value={profileData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                              />
                            </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                      label="Username"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      disabled={!isEditing}
                              InputProps={{
                        startAdornment: <BadgeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                            />
                          </Grid>
                        </Grid>
              </Paper>
            </Grid>

            {/* Account Details */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Account Details</Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Account ID
                      </Typography>
                  <Typography variant="body1">#{user?.id}</Typography>
                </Box>
                      
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Role
                      </Typography>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color={getRoleColor(user?.role || '')}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Account Status
                  </Typography>
                  <Chip
                    label={user?.is_active ? 'Active' : 'Inactive'}
                    color={user?.is_active ? 'success' : 'error'}
                    size="small"
                    variant="outlined"
                            />
                </Box>
                          
                {user?.created_at && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      Member Since
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.created_at)}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Quick Actions */}
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" size="small" fullWidth>
                      Change Password
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
                      Download Data
                    </Button>
                    <Button variant="outlined" size="small" fullWidth color="error">
                      Delete Account
                            </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        </Container>
    </>
  );
};

export default Profile; 