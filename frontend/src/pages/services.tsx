import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Head from 'next/head';
import Link from 'next/link';
import { useThemeContext } from '../contexts/ThemeContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
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
  
  // Main service categories
  const mainServices = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Academic Guidance',
      description: 'Expert guidance on choosing the right educational path after O/L examinations, including A/L subject selection and university options.',
      features: [
        'Personalized academic planning',
        'Subject selection assistance',
        'University application support',
        'Scholarship opportunities'
      ]
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: 'Career Development',
      description: 'Comprehensive career counseling to help students discover their strengths and interests, and match them with suitable career paths.',
      features: [
        'Career assessment tests',
        'Industry exploration sessions',
        'Job shadowing opportunities',
        'Resume building workshops'
      ]
    },
    {
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      title: 'Skills Assessment',
      description: 'Identify and develop essential skills needed for academic and professional success in today\'s competitive environment.',
      features: [
        'Aptitude testing',
        'Soft skills evaluation',
        'Personalized skill development plans',
        'Progress tracking and reporting'
      ]
    }
  ];
  
  // Additional services
  const additionalServices = [
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      title: 'Language Programs',
      description: 'Enhance language proficiency with our specialized English, Sinhala, and Tamil language programs designed for academic and professional settings.'
    },
    {
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      title: 'Digital Literacy',
      description: 'Build essential technology skills with courses covering basic computer operations, office applications, and introductory programming.'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Mentorship Network',
      description: 'Connect with experienced professionals and educators who provide guidance, support, and insights into various fields and industries.'
    }
  ];
  
  return (
    <>
      <Head>
        <title>Services | EduLift - Guiding Sri Lankan Students</title>
        <meta name="description" content="Explore EduLift's comprehensive services including academic guidance, career development, skills assessment, and mentorship programs for Sri Lankan students." />
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
                Our <span className="gradient-text">Services</span>
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 500 }}>
                Comprehensive educational support and career guidance
                designed specifically for Sri Lankan students.
              </Typography>
              
              <Button 
                variant="contained" 
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
                data-aos-delay="200"
              >
                Get Started
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-left" sx={{ textAlign: 'center' }}>
              <Box 
                component="img"
                src="/images/hero-image.svg" 
                alt="EduLift Services"
                sx={{ 
                  maxWidth: '80%',
                  height: 'auto',
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Main Services Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box className="section-title" sx={{ mb: 6 }} data-aos="fade-up">
          <Typography variant="h2" gutterBottom>
            Core <span className="gradient-text">Services</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Our primary services designed to guide students through their educational journey
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {mainServices.map((service, index) => (
            <Grid item xs={12} md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
              <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    bgcolor: 'primary.light', 
                    p: 2, 
                    borderRadius: 2,
                    mb: 2,
                    color: 'primary.main'
                  }}>
                    {service.icon}
                  </Box>
                  
                  <Typography variant="h4" gutterBottom>
                    {service.title}
                  </Typography>
                  
                  <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
                    {service.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    {service.features.map((feature, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }} data-aos="fade-up" data-aos-delay={(idx + 1) * 50}>
                        <CheckCircleIcon sx={{ color: 'primary.main', mr: 1.5, fontSize: 20 }} />
                        <Typography variant="body2">
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    component={Link}
                    href="/contact"
                    sx={{ 
                      mt: 2,
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Additional Services Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 10 }}>
        <Container maxWidth="lg">
          <Box className="section-title" sx={{ mb: 6 }} data-aos="fade-up">
            <Typography variant="h2" gutterBottom>
              Additional <span className="gradient-text">Programs</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              Specialized programs to complement your educational journey
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {additionalServices.map((service, index) => (
              <Grid item xs={12} md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Card className="feature-card hover-lift" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box className="feature-icon">
                      {service.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box className="section-title" sx={{ mb: 6 }} data-aos="fade-up">
          <Typography variant="h2" gutterBottom>
            Student <span className="gradient-text">Success Stories</span>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Hear from students who have benefited from our services
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {[
            {
              name: 'Dinesh Perera',
              role: 'University of Colombo',
              quote: 'The academic guidance services helped me choose the right subjects for A/Ls based on my strengths and interests.',
              avatar: '/images/avatar-placeholder.jpg'
            },
            {
              name: 'Priyanka Jayasinghe',
              role: 'IT Professional',
              quote: 'The career development program gave me clarity about my future path and helped me develop the skills needed for the tech industry.',
              avatar: '/images/avatar-placeholder.jpg'
            },
            {
              name: 'Ashan Fernando',
              role: 'Medical Student',
              quote: 'The mentorship network connected me with experienced medical professionals who guided me through the application process.',
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
                    <Box 
                      component="img" 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        borderRadius: '50%',
                        mr: 2,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
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
              Ready to <span className="gradient-text">Get Started</span>?
            </Typography>
            
            <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              Contact us today to learn more about our services and how we can help you achieve your educational goals
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
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Services; 