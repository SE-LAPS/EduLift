import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Features offered by the platform
  const features = [
    {
      title: 'Career Guidance',
      description: 'Get personalized career advice based on your skills and interests',
      icon: <WorkIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />,
      path: '/career-guidance'
    },
    {
      title: 'Talent Identification',
      description: 'Discover your hidden talents through our advanced assessment tools',
      icon: <PsychologyIcon sx={{ fontSize: 60, color: theme.palette.secondary.main }} />,
      path: '/talent-identification'
    },
    {
      title: 'Online Learning',
      description: 'Access high-quality educational resources and courses',
      icon: <SchoolIcon sx={{ fontSize: 60, color: theme.palette.primary.dark }} />,
      path: '/learning'
    },
    {
      title: 'Test Management',
      description: 'Take tests and track your progress over time',
      icon: <AssignmentIcon sx={{ fontSize: 60, color: theme.palette.secondary.dark }} />,
      path: '/tests'
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: 8, 
          pb: 6, 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            EduLift
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Guiding Sri Lankan students to a brighter future after O/L examinations
          </Typography>
          <Box sx={{ mt: 4 }}>
            {!isAuthenticated ? (
              <Button 
                variant="contained" 
                size="large" 
                color="secondary"
                onClick={() => router.push('/login')}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Get Started
              </Button>
            ) : (
              <Button 
                variant="contained" 
                size="large" 
                color="secondary"
                onClick={() => router.push(`/${user?.role}-dashboard`)}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                  }
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Our Features
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                  }
                }}
              >
                <CardActionArea onClick={() => router.push(feature.path)}>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            color="text.primary"
            gutterBottom
          >
            About EduLift
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" paragraph>
            EduLift is designed to help Sri Lankan students after they finish their ordinary school examinations.
            We guide them in choosing the right career path, learning new skills, and finding opportunities like
            scholarships or jobs. Our goal is to ensure they have a bright and successful future, no matter what
            they choose to do next.
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          EduLift
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Elevating education for a brighter future
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' EduLift. All rights reserved.'}
        </Typography>
      </Box>
    </Box>
  );
} 