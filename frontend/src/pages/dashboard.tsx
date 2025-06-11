import React, { useState } from 'react';
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

const Dashboard = () => {
  const { mode } = useThemeContext();
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);
  
  if (loading || !isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
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
  
  return (
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
                  Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span>
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
                
                <Grid container spacing={3}>
                  {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                      <Card className="hover-lift" sx={{ height: '100%' }}>
                        <Box 
                          sx={{ 
                            height: 140, 
                            background: `url(${course.image || '/images/course-placeholder.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative'
                          }}
                        >
                          <Box 
                            sx={{ 
                              position: 'absolute', 
                              top: 10, 
                              right: 10,
                              bgcolor: 'background.paper',
                              borderRadius: '50%'
                            }}
                          >
                            <IconButton size="small">
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" noWrap sx={{ mb: 1, fontWeight: 600 }}>
                            {course.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Instructor: {course.instructor}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ flexGrow: 1, mr: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={course.progress} 
                                sx={{ 
                                  height: 8, 
                                  borderRadius: 4,
                                  bgcolor: mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
                                }} 
                              />
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="primary">
                              {course.progress}%
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Due: {course.dueDate}
                          </Typography>
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
                
                <Grid container spacing={3}>
                  {upcomingEvents.map((event) => (
                    <Grid item xs={12} sm={6} key={event.id}>
                      <Card className="hover-lift">
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box 
                              sx={{ 
                                p: 1.5, 
                                borderRadius: 2, 
                                bgcolor: mode === 'light' ? 'rgba(255, 92, 0, 0.1)' : 'rgba(249, 115, 22, 0.15)',
                                color: 'secondary.main',
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <EventIcon />
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                {event.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Date:</strong> {event.date}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                <strong>Time:</strong> {event.time}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                <strong>Location:</strong> {event.location}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
            
            {/* Right Column */}
            <Grid item xs={12} md={4}>
              {/* Profile Card */}
              <Card className="hover-lift" sx={{ mb: 4 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar 
                    src={user?.avatar || '/images/avatar-placeholder.jpg'} 
                    alt={user?.name || 'Student'}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      border: '3px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {user?.name || 'Student Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {user?.email || 'student@example.com'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip 
                      label="Student" 
                      size="small" 
                      color="primary" 
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip 
                      label="Grade 11" 
                      size="small" 
                      color="secondary" 
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      mt: 1
                    }}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
              
              {/* Tasks Card */}
              <Card className="hover-lift">
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      Tasks & Assignments
                    </Typography>
                    <Button 
                      size="small" 
                      sx={{ textTransform: 'none' }}
                    >
                      View All
                    </Button>
                  </Box>
                  
                  <List sx={{ p: 0 }}>
                    {tasks.map((task, index) => (
                      <React.Fragment key={task.id}>
                        <ListItem 
                          sx={{ 
                            px: 0,
                            py: 1.5,
                            opacity: task.completed ? 0.7 : 1
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <CheckCircleIcon 
                              color={task.completed ? "success" : "disabled"} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                  fontWeight: task.completed ? 400 : 500
                                }}
                              >
                                {task.title}
                              </Typography>
                            } 
                            secondary={`Due: ${task.dueDate}`}
                          />
                        </ListItem>
                        {index < tasks.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ 
                      mt: 2,
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    Add New Task
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard; 