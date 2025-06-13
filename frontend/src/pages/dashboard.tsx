import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, Chip, LinearProgress, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Head from 'next/head';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
  const { mode } = useThemeContext();
  const { user } = useAuth();
  const router = useRouter();
  
  // Mock data for dashboard
  const courses = [
    {
      id: 1,
      title: 'Career Guidance Fundamentals',
      progress: 75,
      instructor: 'Dr. Amara Silva',
      dueDate: '15 July 2023',
      image: '/images/course1.jpg'
    },
    {
      id: 2,
      title: 'Academic Planning Workshop',
      progress: 40,
      instructor: 'Rajiv Perera',
      dueDate: '22 July 2023',
      image: '/images/course2.jpg'
    },
    {
      id: 3,
      title: 'Digital Skills for Students',
      progress: 90,
      instructor: 'Nisha Jayawardena',
      dueDate: '30 July 2023',
      image: '/images/course3.jpg'
    }
  ];
  
  const upcomingEvents = [
    {
      id: 1,
      title: 'University Fair 2023',
      date: '20 July 2023',
      time: '9:00 AM - 4:00 PM',
      location: 'Colombo Exhibition Center'
    },
    {
      id: 2,
      title: 'Career Counseling Session',
      date: '25 July 2023',
      time: '2:00 PM - 3:30 PM',
      location: 'Online (Zoom)'
    },
    {
      id: 3,
      title: 'Skills Assessment Workshop',
      date: '28 July 2023',
      time: '10:00 AM - 12:00 PM',
      location: 'EduLift Learning Center'
    }
  ];
  
  const tasks = [
    {
      id: 1,
      title: 'Complete career assessment test',
      dueDate: '18 July 2023',
      completed: true
    },
    {
      id: 2,
      title: 'Submit personal statement draft',
      dueDate: '22 July 2023',
      completed: false
    },
    {
      id: 3,
      title: 'Research university options',
      dueDate: '25 July 2023',
      completed: false
    },
    {
      id: 4,
      title: 'Schedule meeting with mentor',
      dueDate: '30 July 2023',
      completed: false
    }
  ];

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return 'Student';
    
    return `${user.first_name} ${user.last_name}`;
  };
  
  // Get user role for display
  const getUserRole = () => {
    if (!user || !user.role) return 'Student';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };
  
  const dashboardContent = (
    <>
      <Head>
        <title>Dashboard | EduLift</title>
        <meta name="description" content="Access your personalized EduLift dashboard to track your progress, upcoming events, and tasks." />
      </Head>
      
      <Box sx={{ pt: 10, pb: 8 }}>
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>
                  Welcome back, <span className="gradient-text">{getUserDisplayName()}</span>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Track your progress, manage your tasks, and stay updated with upcoming events.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<BarChartIcon />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  View Progress Report
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { title: 'Courses', value: '3', icon: <SchoolIcon sx={{ fontSize: 40 }} />, color: 'primary.main' },
              { title: 'Completed Tasks', value: '8', icon: <CheckCircleIcon sx={{ fontSize: 40 }} />, color: 'success.main' },
              { title: 'Upcoming Events', value: '5', icon: <EventIcon sx={{ fontSize: 40 }} />, color: 'secondary.main' },
              { title: 'Assessments', value: '2', icon: <AssignmentIcon sx={{ fontSize: 40 }} />, color: 'tertiary.main' }
            ].map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card className="hover-lift" sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      p: 1.5, 
                      borderRadius: '50%', 
                      mb: 2,
                      bgcolor: mode === 'light' ? 'rgba(0, 87, 255, 0.1)' : 'rgba(59, 130, 246, 0.15)',
                      color: stat.color
                    }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              {/* Current Courses */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>
                    Current Courses
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />} 
                    sx={{ textTransform: 'none' }}
                  >
                    View All
                  </Button>
                </Box>
                
                {/* Course Cards */}
                <Grid container spacing={3}>
                  {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={6} key={course.id}>
                      <Card className="hover-lift" sx={{ height: '100%', cursor: 'pointer' }}>
                        <Box sx={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                          <Box 
                            component="img"
                            src={course.image}
                            alt={course.title}
                            sx={{ 
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                              {course.title}
                            </Typography>
                            <IconButton size="small">
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Instructor: {course.instructor}
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="body2" fontWeight={600}>
                                Progress
                              </Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {course.progress}%
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={course.progress} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'
                              }} 
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Chip 
                              label={`Due: ${course.dueDate}`} 
                              size="small" 
                              variant="outlined"
                            />
                            <Button 
                              size="small" 
                              variant="text"
                              sx={{ minWidth: 'auto' }}
                            >
                              Continue
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              {/* Upcoming Events */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight={600}>
                    Upcoming Events
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />} 
                    sx={{ textTransform: 'none' }}
                  >
                    View Calendar
                  </Button>
                </Box>
                
                <Card className="hover-lift">
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ p: 0 }}>
                      {upcomingEvents.map((event, index) => (
                        <React.Fragment key={event.id}>
                          <ListItem 
                            sx={{ 
                              py: 2, 
                              px: 3,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)',
                              }
                            }}
                          >
                            <ListItemIcon>
                              <Box sx={{ 
                                bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
                                color: 'primary.main',
                                width: 45,
                                height: 45,
                                borderRadius: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1.2,
                                mr: 2
                              }}>
                                <Typography variant="caption" fontWeight={600}>
                                  {event.date.split(' ')[0]}
                                </Typography>
                                <Typography variant="caption" fontWeight={600}>
                                  {event.date.split(' ')[1]}
                                </Typography>
                              </Box>
                            </ListItemIcon>
                            <ListItemText 
                              primary={event.title}
                              secondary={
                                <>
                                  <Typography variant="body2" component="span" display="block">
                                    {event.time}
                                  </Typography>
                                  <Typography variant="body2" component="span" color="text.secondary">
                                    {event.location}
                                  </Typography>
                                </>
                              }
                            />
                            <Button 
                              variant="outlined" 
                              size="small"
                              sx={{ 
                                borderRadius: 6,
                                minWidth: 80
                              }}
                            >
                              Join
                            </Button>
                          </ListItem>
                          {index < upcomingEvents.length - 1 && (
                            <Divider />
                          )}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            {/* Right Column */}
            <Grid item xs={12} md={4}>
              {/* Profile Summary */}
              <Card className="hover-lift" sx={{ mb: 4 }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      border: 3,
                      borderColor: 'primary.main'
                    }}
                    alt={getUserDisplayName()}
                    src="/images/avatar.jpg"
                  >
                    {getUserDisplayName().charAt(0)}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {getUserDisplayName()}
                  </Typography>
                  <Chip 
                    label={getUserRole()} 
                    color="primary" 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => router.push('/profile')}
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Tasks List */}
              <Card className="hover-lift">
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Tasks
                    </Typography>
                    <Button 
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Add Task
                    </Button>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {tasks.map((task) => (
                      <ListItem 
                        key={task.id} 
                        sx={{ 
                          px: 0, 
                          py: 1,
                          opacity: task.completed ? 0.7 : 1
                        }}
                        dense
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon 
                            color={task.completed ? 'success' : 'disabled'} 
                            sx={{ cursor: 'pointer' }}
                          />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'text.secondary' : 'text.primary'
                              }}
                            >
                              {task.title}
                            </Typography>
                          }
                          secondary={`Due: ${task.dueDate}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button 
                    fullWidth 
                    variant="text" 
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    View All Tasks
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
  
  return <ProtectedRoute>{dashboardContent}</ProtectedRoute>;
};

export default Dashboard; 