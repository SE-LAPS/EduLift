import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Divider, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Head from 'next/head';
import Link from 'next/link';
import { useThemeContext } from '../contexts/ThemeContext';
import { useImageLoadNavigation } from '../utils/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  const { mode } = useThemeContext();
  const navigateWithImageLoad = useImageLoadNavigation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  // Handle navigation with image preloading
  const handleNavigation = (route: string, imageUrl: string) => {
    setIsLoading(true);
    navigateWithImageLoad(route, imageUrl);
  };

  return (
    <>
      <Head>
        <title>About Us | EduLift - Guiding Sri Lankan Students</title>
        <meta name="description" content="Learn about EduLift's mission to guide Sri Lankan students after O/L examinations towards a brighter future through education and skill development." />
      </Head>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: 12, 
          pb: 10, 
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 800 }}
              >
                Our <span className="gradient-text">Mission</span> &<br />
                <span className="orange-gradient-text">Vision</span>
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500 }}>
                Empowering Sri Lankan students to reach their full potential through
                guidance, education, and opportunity.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={() => handleNavigation('/contact', '/images/vision.gif')}
                sx={{ 
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
                data-aos="fade-up"
                data-aos-delay="200"
                endIcon={<ArrowForwardIcon />}
              >
                Learn More
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-left" sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src="/images/vision.gif" 
                alt="EduLift Mission"
                sx={{ 
                  maxWidth: '80%',
                  height: 'auto',
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))',
                  borderRadius: '8px',
                  animation: 'pulse 2s infinite ease-in-out',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6} data-aos="fade-up">
            <Box 
              component="img"
              src="/images/story.gif" 
              alt="Our Story"
              sx={{ 
                width: '100%',
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                animation: 'float 3s infinite ease-in-out',
                '@keyframes float': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                  '100%': { transform: 'translateY(0px)' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6} data-aos="fade-up" data-aos-delay="200">
            <Typography variant="h2" gutterBottom>
              Our <span className="gradient-text">Story</span>
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
              EduLift was founded with a clear purpose: to bridge the gap between secondary education and successful careers for Sri Lankan students. After witnessing the challenges that students face after completing their O/L examinations, we created a platform that provides guidance, resources, and opportunities.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
              Our team of educators, technologists, and career counselors work together to ensure that every student has access to quality education, skill development, and career opportunities regardless of their background or location.
            </Typography>
            
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Through our innovative approach that combines traditional education with modern technology, we're helping shape the future of education in Sri Lanka and beyond.
            </Typography>
          </Grid>
        </Grid>
      </Container>
      
      {/* Values Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="lg">
          <Box className="section-title" data-aos="fade-up">
            <Typography variant="h2" gutterBottom>
              Our <span className="gradient-text">Values</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              The core principles that guide our approach to education and student development
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sm={6} data-aos="fade-up" data-aos-delay="100">
              <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                <CardContent>
                  <Box className="feature-icon">
                    <SchoolIcon sx={{ color: '#0057FF', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Excellence
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We strive for the highest standards in education, technology, and service delivery.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3} sm={6} data-aos="fade-up" data-aos-delay="200">
              <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                <CardContent>
                  <Box className="feature-icon">
                    <PeopleIcon sx={{ color: '#0057FF', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Inclusivity
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We ensure our platform is accessible and beneficial to all students regardless of background.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3} sm={6} data-aos="fade-up" data-aos-delay="300">
              <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                <CardContent>
                  <Box className="feature-icon">
                    <LightbulbIcon sx={{ color: '#0057FF', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Innovation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We continuously improve our methods and technology to provide the best learning experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3} sm={6} data-aos="fade-up" data-aos-delay="400">
              <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                <CardContent>
                  <Box className="feature-icon">
                    <TrendingUpIcon sx={{ color: '#0057FF', fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    Growth
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We foster personal and academic development for both our students and team members.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box className="section-title" data-aos="fade-up">
          <Typography variant="h2" gutterBottom>
            Our <span className="gradient-text">Team</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Meet the dedicated professionals working to make education accessible and effective
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            {
              name: 'Dr. Amara Silva',
              role: 'Founder & Education Director',
              bio: 'With over 15 years of experience in education, Dr. Silva leads our academic initiatives.',
              avatar: '/images/avatar1.svg'
            },
            {
              name: 'Rajiv Perera',
              role: 'Technology Lead',
              bio: 'Rajiv oversees our platform development and ensures our technology serves educational goals.',
              avatar: '/images/avatar2.svg'
            },
            {
              name: 'Nisha Jayawardena',
              role: 'Student Success Manager',
              bio: 'Nisha works directly with students to ensure they receive personalized guidance and support.',
              avatar: '/images/avatar3.svg'
            },
            {
              name: 'Malik Fernando',
              role: 'Career Counselor',
              bio: 'Malik helps students discover career paths aligned with their interests and strengths.',
              avatar: '/images/avatar4.svg'
            }
          ].map((member, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar 
                    src={member.avatar} 
                    alt={member.name}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      border: '3px solid',
                      borderColor: 'primary.main',
                      backgroundColor: 'background.paper',
                      p: 0.5
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default About; 