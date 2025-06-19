import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Divider, Avatar } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import BuildIcon from '@mui/icons-material/Build';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DevicesIcon from '@mui/icons-material/Devices';
import Head from 'next/head';
import Link from 'next/link';
import { useThemeContext } from '../contexts/ThemeContext';
import { useImageLoadNavigation } from '../utils/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
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
                onClick={() => handleNavigation('/contact', '/images/service.gif')}
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
                src="/images/service.gif" 
                alt="EduLift Services"
                sx={{ 
                  maxWidth: '80%',
                  height: 'auto',
                  filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.15))',
                  borderRadius: '8px',
                  animation: 'rotate 4s infinite ease-in-out',
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(1deg)' },
                    '75%': { transform: 'rotate(-1deg)' },
                    '100%': { transform: 'rotate(0deg)' }
                  }
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
                    onClick={() => handleNavigation('/contact', '/images/service.gif')}
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
      
      {/* Career Guidance Section */}
      <Box sx={{ bgcolor: mode === 'light' ? '#f8fafc' : '#111827', py: 10 }} id="career-guidance">
        <Container maxWidth="lg">
          <Box className="section-title" textAlign="center" sx={{ mb: 8 }} data-aos="fade-up">
            <Typography variant="h2" gutterBottom>
              <span className="gradient-text">Career Guidance</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Our advanced AI-powered career guidance system helps students discover and pursue their ideal career paths
            </Typography>
          </Box>
          
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Box 
                component="img"
                src="/images/Career.gif" 
                alt="Career Guidance"
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  transform: 'perspective(1000px) rotateY(-5deg)',
                  transition: 'all 0.8s ease',
                  animation: 'float-career 6s ease-in-out infinite',
                  '@keyframes float-career': {
                    '0%': { transform: 'perspective(1000px) rotateY(-5deg) translateY(0)' },
                    '50%': { transform: 'perspective(1000px) rotateY(-2deg) translateY(-15px)' },
                    '100%': { transform: 'perspective(1000px) rotateY(-5deg) translateY(0)' }
                  },
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                    boxShadow: '0 25px 50px rgba(255, 92, 0, 0.25)',
                    filter: 'brightness(1.05)'
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} data-aos="fade-up">
                    <Card sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      p: 2, 
                      mb: 3,
                      borderRadius: 3,
                      boxShadow: '0 10px 20px rgba(0, 87, 255, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '30%',
                        height: '100%',
                        backgroundImage: 'linear-gradient(315deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: 1
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight={600}>
                          AI-Generated Career Pathways
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                        Our AI technology analyzes your skills, interests, and personality traits to recommend ideal career paths perfectly matched to your individual profile.
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="100">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                            <TrackChangesIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Goal-Setting Tools
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Set personalized career goals and track your journey towards specific fields and roles with interactive planning tools.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="200">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'tertiary.main', mr: 2 }}>
                            <ConnectWithoutContactIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Mentorship & Networking
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Connect with mentors and industry professionals for guidance and networking in relevant careers.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="300">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                            <BuildIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Skill-Building Recommendations
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Get tailored courses, certifications, and resources needed for your chosen career path.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="400">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                            <ExploreIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Career Exploration Hub
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Explore our detailed database of potential careers, including job roles, growth potential, and necessary skills.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Talent Identification Section */}
      <Box sx={{ bgcolor: mode === 'light' ? '#ffffff' : '#1E293B', py: 10 }} id="talent-identification">
        <Container maxWidth="lg">
          <Box className="section-title" textAlign="center" sx={{ mb: 8 }} data-aos="fade-up">
            <Typography variant="h2" gutterBottom>
              <span className="gradient-text">Talent Identification</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Discover and nurture your unique talents with our advanced AI-driven assessment system
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '300px', 
                height: '300px', 
                background: 'radial-gradient(circle, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0) 70%)',
                borderRadius: '50%',
                top: '-100px',
                left: '-100px',
                zIndex: 0
              }}
            />
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} data-aos="fade-up">
                    <Card sx={{ 
                      bgcolor: 'secondary.main', 
                      color: 'white',
                      p: 2, 
                      mb: 3,
                      borderRadius: 3,
                      boxShadow: '0 10px 20px rgba(255, 92, 0, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '30%',
                        height: '100%',
                        backgroundImage: 'linear-gradient(315deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                        zIndex: 1
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'white', color: 'secondary.main', mr: 2 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="h5" fontWeight={600}>
                          AI-Driven Skill Assessment
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                        Our cutting-edge AI technologies analyze your strengths, weaknesses, and potential areas of excellence through comprehensive testing.
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6} data-aos="fade-up" data-aos-delay="100">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                            <AssessmentIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Personalized Strengths Report
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Receive a detailed report highlighting your unique talents and suggested focus areas for development.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6} data-aos="fade-up" data-aos-delay="200">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                            <TrendingUpIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Progressive Skill Tracking
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Monitor your skill development over time with visualized growth charts showing progress in key areas.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6} data-aos="fade-up" data-aos-delay="300">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                            <AccountTreeIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Interest and Personality Mapping
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Identify your interests and align them with potential career paths to encourage tailored development.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} data-aos="fade-up" data-aos-delay="400">
                    <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                            <DevicesIcon />
                          </Avatar>
                          <Typography variant="h6" fontWeight={600}>
                            Gamified Talent Discovery
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Engage with skill-building games and interactive assessments that make talent discovery fun and motivating.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} data-aos="fade-left">
                <Box 
                  component="img"
                  src="/images/Talent.gif" 
                  alt="Talent Identification"
                  sx={{ 
                    width: '100%',
                    height: 'auto',
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                    animation: 'talent-float 8s ease-in-out infinite, talent-glow 4s ease-in-out infinite alternate',
                    '@keyframes talent-float': {
                      '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                      '25%': { transform: 'translateY(-15px) rotate(1deg)' },
                      '50%': { transform: 'translateY(0) rotate(0deg)' },
                      '75%': { transform: 'translateY(-10px) rotate(-1deg)' },
                    },
                    '@keyframes talent-glow': {
                      '0%': { filter: 'drop-shadow(0 0 10px rgba(255, 92, 0, 0.3))' },
                      '100%': { filter: 'drop-shadow(0 0 20px rgba(255, 92, 0, 0.6))' }
                    },
                    transition: 'all 0.5s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      filter: 'brightness(1.08)',
                      boxShadow: '0 30px 60px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                position: 'absolute', 
                width: '200px', 
                height: '200px', 
                background: 'radial-gradient(circle, rgba(255, 92, 0, 0.1) 0%, rgba(255, 92, 0, 0) 70%)',
                borderRadius: '50%',
                bottom: '-50px',
                right: '-50px',
                zIndex: 0
              }}
            />
          </Box>
        </Container>
      </Box>
      
      {/* Test Management Section */}
      <Box 
        sx={{ 
          bgcolor: mode === 'light' ? '#f8fafc' : '#111827', 
          py: 10,
          position: 'relative',
          overflow: 'hidden'
        }} 
        id="test-management"
      >
        <Container maxWidth="lg">
          <Box className="section-title" textAlign="center" sx={{ mb: 8 }} data-aos="fade-up">
            <Typography variant="h2" gutterBottom>
              <span className="gradient-text">Test Management</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Comprehensive testing and assessment tools powered by machine learning for educators and students
            </Typography>
          </Box>
          
          <Grid container spacing={5}>
            <Grid item xs={12} md={5} data-aos="fade-right">
              <Box 
                component="img"
                src="/images/Test.gif" 
                alt="Test Management"
                sx={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  transform: 'rotate(-2deg)',
                  transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  animation: 'test-pulse 8s ease-in-out infinite',
                  '@keyframes test-pulse': {
                    '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
                    '30%': { transform: 'rotate(-1deg) scale(1.02)' },
                    '60%': { transform: 'rotate(-3deg) scale(0.98)' }
                  },
                  filter: 'contrast(1.03)',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.04)',
                    boxShadow: '0 30px 60px rgba(0, 184, 169, 0.3)',
                    filter: 'contrast(1.1) brightness(1.05)'
                  }
                }}
              />
              
              <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 1 }} data-aos="fade-up">
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Powered by Advanced Technologies
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {['Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Natural Language Processing', 'Adaptive Learning'].map((tech, index) => (
                    <Box key={index} sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      borderRadius: 5, 
                      px: 2, 
                      py: 0.5,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      {tech}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Grid container spacing={3}>
                <Grid item xs={12} data-aos="fade-up">
                  <Card sx={{ 
                    bgcolor: 'tertiary.main', 
                    color: 'white',
                    p: 2, 
                    mb: 3,
                    borderRadius: 3,
                    boxShadow: '0 10px 20px rgba(0, 184, 169, 0.2)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'white', color: 'tertiary.main', mr: 2 }}>
                        <SmartToyIcon />
                      </Avatar>
                      <Typography variant="h5" fontWeight={600}>
                        Customizable Test Creation
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.7 }}>
                      Create and personalize assessments to meet specific educational goals and student needs with our intuitive test builder.
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="100">
                  <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <AssessmentIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          Automated Grading & Analytics
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Get instant grading and in-depth analytics to measure student performance and highlight areas for improvement.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="200">
                  <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                          <PeopleIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          Progress Reports
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Share detailed performance reports with students and parents, supporting transparency and continuous growth.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="300">
                  <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          Adaptive Testing Technology
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Experience tests that adjust question difficulty based on student performance, creating a personalized test experience.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} data-aos="fade-up" data-aos-delay="400">
                  <Card className="hover-lift" sx={{ height: '100%', borderRadius: 3, p: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                          <SchoolIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          Question Bank & Templates
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Access our library of questions and templates for quick test setup, covering diverse subjects and skill levels.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
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
              avatar: '/images/avatar1.svg'
            },
            {
              name: 'Priyanka Jayasinghe',
              role: 'IT Professional',
              quote: 'The career development program gave me clarity about my future path and helped me develop the skills needed for the tech industry.',
              avatar: '/images/avatar2.svg'
            },
            {
              name: 'Ashan Fernando',
              role: 'Medical Student',
              quote: 'The mentorship network connected me with experienced medical professionals who guided me through the application process.',
              avatar: '/images/avatar3.svg'
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
                        borderColor: 'primary.main',
                        backgroundColor: 'background.paper',
                        p: 0.5
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
              onClick={() => handleNavigation('/contact', '/images/service.gif')}
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