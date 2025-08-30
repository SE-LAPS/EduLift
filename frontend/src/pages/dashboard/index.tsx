import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useThemeContext } from '../../contexts/ThemeContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const { mode } = useThemeContext();
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    avgScore: 0,
    rank: 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mock data - would come from API in real implementation
  useEffect(() => {
    if (user) {
      // Simulate fetching user stats
      setStats({
        totalTests: user.role === 'student' ? 15 : user.role === 'teacher' ? 45 : 120,
        completedTests: user.role === 'student' ? 12 : user.role === 'teacher' ? 38 : 95,
        avgScore: user.role === 'student' ? 85 : user.role === 'teacher' ? 92 : 88,
        rank: user.role === 'student' ? 15 : user.role === 'teacher' ? 5 : 1
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    logout();
    router.push('/');
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

  const getRoleFeatures = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          { icon: <PeopleIcon />, text: 'User Management', link: '/admin/users' },
          { icon: <SchoolIcon />, text: 'System Analytics', link: '/admin/analytics' },
          { icon: <SettingsIcon />, text: 'System Settings', link: '/admin/settings' },
          { icon: <QuizIcon />, text: 'Content Management', link: '/admin/content' }
        ];
      case 'teacher':
        return [
          { icon: <AssignmentIcon />, text: 'Create Tests', link: '/test-management' },
          { icon: <PeopleIcon />, text: 'Student Progress', link: '/teacher/students' },
          { icon: <AnalyticsIcon />, text: 'Grade Analytics', link: '/teacher/analytics' },
          { icon: <QuizIcon />, text: 'Question Bank', link: '/teacher/questions' }
        ];
      case 'assistant':
        return [
          { icon: <AssignmentIcon />, text: 'Grade Papers', link: '/assistant/grading' },
          { icon: <PeopleIcon />, text: 'Student Support', link: '/assistant/support' },
          { icon: <QuizIcon />, text: 'Test Assistance', link: '/assistant/tests' }
        ];
      case 'supersub':
        return [
          { icon: <AssignmentIcon />, text: 'Monitor Tests', link: '/supersub/monitor' },
          { icon: <PeopleIcon />, text: 'Help Students', link: '/supersub/help' },
          { icon: <QuizIcon />, text: 'Test Reports', link: '/supersub/reports' }
        ];
      case 'student':
      default:
        return [
          { icon: <QuizIcon />, text: 'Take Tests', link: '/tests' },
          { icon: <TrendingUpIcon />, text: 'View Progress', link: '/student/progress' },
          { icon: <SchoolIcon />, text: 'Career Guidance', link: '/career-guidance' },
          { icon: <AnalyticsIcon />, text: 'Talent ID', link: '/talent-identification' }
        ];
    }
  };

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Welcome to your admin dashboard. Manage the entire EduLift platform.';
      case 'teacher':
        return 'Welcome back! Ready to create engaging tests and track student progress?';
      case 'assistant':
        return 'Welcome! Help students succeed with grading and support.';
      case 'supersub':
        return 'Welcome! Monitor tests and provide assistance when needed.';
      case 'student':
      default:
        return 'Welcome to your learning dashboard. Ready to continue your educational journey?';
    }
  };

  const recentActivities = [
    { text: 'Completed Math Test #5', time: '2 hours ago', type: 'success' },
    { text: 'Started Physics Chapter 3', time: '1 day ago', type: 'info' },
    { text: 'Received feedback on Essay', time: '2 days ago', type: 'warning' },
    { text: 'Achieved 95% in Chemistry', time: '3 days ago', type: 'success' }
  ];

  return (
    <>
      <Head>
        <title>Dashboard | EduLift</title>
        <meta name="description" content="Your personalized EduLift dashboard with progress tracking and quick access to features." />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem'
                }}
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Welcome back, {user?.first_name}!
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={user?.role?.toUpperCase()}
                    color={getRoleColor(user?.role || '')}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {getWelcomeMessage(user?.role || 'student')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Button variant="outlined" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Tests
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalTests}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.completedTests}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(stats.completedTests / stats.totalTests) * 100}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Average Score
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.avgScore}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {user?.role === 'student' ? 'Class Rank' : 'Performance'}
                  </Typography>
                  <Typography variant="h4" component="div">
                    #{stats.rank}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={8}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {getRoleFeatures(user?.role || 'student').map((feature, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                      <Card
                        component={Link}
                        href={feature.link}
                        sx={{
                          textDecoration: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 2
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                          <Box sx={{ mr: 2, color: 'primary.main' }}>
                            {feature.icon}
                          </Box>
                          <Typography variant="body1">
                            {feature.text}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <NotificationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.text}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Profile Summary */}
            <Grid item xs={12}>
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <PersonIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Full Name
                      </Typography>
                      <Typography variant="body1">
                        {user?.first_name} {user?.last_name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <DashboardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body1">
                        {user?.role?.toUpperCase()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Status
                      </Typography>
                      <Typography variant="body1">
                        {user?.is_active ? 'Active' : 'Inactive'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <AnalyticsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body1">
                        {Math.round((stats.completedTests / stats.totalTests) * 100)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    component={Link}
                    href="/profile"
                    variant="outlined"
                    startIcon={<PersonIcon />}
                  >
                    View Complete Profile
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
} 