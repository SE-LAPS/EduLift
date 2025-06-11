import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Card, CardContent, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Head from 'next/head';
import Link from 'next/link';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const { mode } = useThemeContext();
  
  // Initialize AOS animation library
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <Head>
        <title>EduLift - Guiding Sri Lankan Students to a Brighter Future</title>
        <meta name="description" content="EduLift provides guidance, resources, and opportunities for Sri Lankan students after O/L examinations to help them make informed decisions about their future." />
      </Head>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 10, md: 12 }, 
          pb: { xs: 8, md: 10 },
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
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' }
                }}
              >
                Guiding Sri Lankan <span className="gradient-text">Students</span> to a <span className="orange-gradient-text">Brighter Future</span>
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500 }}>
                We provide guidance, resources, and opportunities for students after O/L examinations
                to help them make informed decisions about their future.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  component={Link}
                  href="/services"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Explore Services
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="large"
                  component={Link}
                  href="/contact"
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-left" sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src="/images/hero-image.svg" 
                alt="EduLift Hero"
                sx={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box className="section-title" sx={{ mb: 6, textAlign: 'center' }} data-aos="fade-up">
          <Typography variant="h2" gutterBottom>
            How We <span className="gradient-text">Help</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Our comprehensive approach to guiding students through their educational journey
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            {
              icon: <SchoolIcon sx={{ fontSize: 40 }} />,
              title: 'Academic Guidance',
              description: 'Get expert advice on choosing the right educational path after O/L examinations, including A/L subject selection and university options.'
            },
            {
              icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
              title: 'Career Development',
              description: 'Discover your strengths and interests, and learn how to match them with suitable career paths through our comprehensive counseling.'
            },
            {
              icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
              title: 'Skills Assessment',
              description: 'Identify and develop essential skills needed for academic and professional success in today\'s competitive environment.'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box className="feature-icon">
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                  <Button 
                    component={Link}
                    href="/services"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* About Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Box 
                component="img"
                src="/images/hero-image.svg" 
                alt="About EduLift"
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Typography variant="h2" gutterBottom>
                About <span className="gradient-text">EduLift</span>
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                EduLift was founded with a clear purpose: to bridge the gap between secondary education and successful careers for Sri Lankan students. After witnessing the challenges that students face after completing their O/L examinations, we created a platform that provides guidance, resources, and opportunities.
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
                Our team of educators, technologists, and career counselors work together to ensure that every student has access to quality education, skill development, and career opportunities regardless of their background or location.
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                {[
                  'Personalized academic planning',
                  'Career assessment and guidance',
                  'Skill development programs',
                  'Mentorship opportunities'
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }} data-aos="fade-up" data-aos-delay={index * 100}>
                    <CheckCircleIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 20 }} />
                    <Typography variant="body1">
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                component={Link}
                href="/about"
                sx={{ 
                  mt: 3,
                  py: 1.5, 
                  px: 4, 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Learn More About Us
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box className="section-title" sx={{ mb: 6, textAlign: 'center' }} data-aos="fade-up">
          <Typography variant="h2" gutterBottom>
            Student <span className="gradient-text">Success Stories</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Hear from students who have benefited from our guidance
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            {
              name: 'Dinesh Perera',
              role: 'University of Colombo',
              quote: 'EduLift helped me choose the right A/L subjects based on my strengths and interests. Now I\'m pursuing my dream course at university.',
              avatar: '/images/avatar-placeholder.jpg'
            },
            {
              name: 'Priyanka Jayasinghe',
              role: 'IT Professional',
              quote: 'The career guidance I received from EduLift was invaluable. They helped me discover my passion for technology and supported me in developing the necessary skills.',
              avatar: '/images/avatar-placeholder.jpg'
            },
            {
              name: 'Ashan Fernando',
              role: 'Medical Student',
              quote: 'EduLift\'s mentorship program connected me with experienced professionals in the medical field who guided me through the application process and preparation.',
              avatar: '/images/avatar-placeholder.jpg'
            }
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <Card className="testimonial-card hover-lift" sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="body1" paragraph sx={{ mb: 4, fontStyle: 'italic' }}>
                    "{testimonial.quote}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ mr: 2 }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          background: mode === 'light'
            ? 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
            : 'linear-gradient(135deg, #111827 0%, #1E293B 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box className="bg-blob bg-blob-1" />
        <Box className="bg-blob bg-blob-2" />
        
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Box data-aos="fade-up">
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Ready to Start Your <span className="gradient-text">Journey</span>?
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              Join EduLift today and take the first step towards a brighter educational future
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary"
              size="large"
              component={Link}
              href="/contact"
              sx={{ 
                py: 1.5, 
                px: 5, 
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1.1rem'
              }}
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home; 