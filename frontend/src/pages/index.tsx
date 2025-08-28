import React, { useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Card, CardContent, Avatar, Divider } from '@mui/material';
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
import Image from 'next/image';
import ChatIcon from '@mui/icons-material/Chat';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ImageSlider from '../components/ImageSlider';
import { useRouter } from 'next/router';
import usePageTransition from '../hooks/usePageTransition';

// Circular Wave Background Component
const CircularWaveBackground = ({ mode }: { mode: string }) => {
  return (
    <>
      <Box
        className="circular-wave wave1"
        sx={{
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(0, 87, 255, 0.2) 0%, rgba(0, 87, 255, 0) 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0) 70%)'
        }}
      />
      <Box
        className="circular-wave wave2"
        sx={{
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(255, 92, 0, 0.15) 0%, rgba(255, 92, 0, 0) 70%)'
            : 'radial-gradient(circle, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0) 70%)'
        }}
      />
      <Box
        className="circular-wave wave3"
        sx={{
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(0, 184, 169, 0.2) 0%, rgba(0, 184, 169, 0) 70%)'
            : 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(20, 184, 166, 0) 70%)'
        }}
      />
      <Box
        className="circular-wave wave4"
        sx={{
          background: mode === 'light'
            ? 'radial-gradient(circle, rgba(0, 87, 255, 0.15) 0%, rgba(0, 87, 255, 0) 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)'
        }}
      />
    </>
  );
};

// Preload important images
const preloadImages = (): void => {
  if (typeof window === 'undefined') return;
  
  const images = [
    '/images/1.gif',
    '/images/2.gif',
    '/images/3.gif',
    '/images/Home AI-1.gif'
  ];
  
  images.forEach(src => {
    const img: HTMLImageElement = document.createElement('img');
    img.src = src;
    img.style.display = 'none'; // Don't show the preloaded image
    img.onload = () => document.body.removeChild(img); // Clean up after loading
    document.body.appendChild(img); // Add to DOM to trigger load
  });
};

// Common routes for prefetching
const commonRoutes = [
  '/services',
  '/about',
  '/contact',
  '/register'
];

const Home = () => {
  const { mode } = useThemeContext();
  const router = useRouter();
  const { handleNavigation, prefetchRoutes } = usePageTransition();
  
  // Initialize AOS animation library
  useEffect(() => {
    // Initialize AOS with optimized settings
    AOS.init({
      duration: 800, // Reduced duration for faster animations
      once: true, // Only animate once to improve performance
      mirror: false, // Don't mirror animations on scroll up
      offset: 100,
      easing: 'ease-out',
      delay: 50, // Reduced delay
    });
    
    // Preload important images
    preloadImages();
    
    // Prefetch common routes
    prefetchRoutes(commonRoutes);
    
    // Refresh AOS after window loads completely
    window.addEventListener('load', () => {
      AOS.refresh();
    });
    
    // Cleanup function
    return () => {
      window.removeEventListener('load', () => {
        AOS.refresh();
      });
    };
  }, [prefetchRoutes]);

  return (
    <>
      <Head>
        <title>EduLift - Guiding Sri Lankan Students to a Brighter Future</title>
        <meta name="description" content="EduLift provides guidance, resources, and opportunities for Sri Lankan students after O/L examinations to help them make informed decisions about their future." />
        
        {/* Add preload for critical resources */}
        <link rel="preload" href="/images/1.gif" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style jsx global>{`
          .page-transition {
            opacity: 0.8;
            transition: opacity 0.2s ease;
          }
          @media (prefers-reduced-motion: no-preference) {
            * {
              scroll-behavior: smooth;
            }
          }
          
          /* Optimize image loading */
          img.blur-load {
            filter: blur(10px);
            transition: filter 0.3s ease-out;
          }
          img.blur-load.loaded {
            filter: blur(0);
          }
          
          /* Circular wave animation */
          @keyframes circularWave {
            0% {
              transform: translate(-50%, -50%) scale(0.1);
              opacity: 0.9;
            }
            100% {
              transform: translate(-50%, -50%) scale(3);
              opacity: 0;
            }
          }
          
          .circular-wave {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
          }
          
          .wave1 {
            animation: circularWave 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          }
          
          .wave2 {
            animation: circularWave 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 2s;
          }
          
          .wave3 {
            animation: circularWave 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 4s;
          }
          
          .wave4 {
            animation: circularWave 8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite 6s;
          }

          /* Wave speed variations for different sections */
          .wave-slow .wave1 { animation-duration: 12s; }
          .wave-slow .wave2 { animation-duration: 12s; }
          .wave-slow .wave3 { animation-duration: 12s; }
          .wave-slow .wave4 { animation-duration: 12s; }
          
          .wave-medium .wave1 { animation-duration: 10s; }
          .wave-medium .wave2 { animation-duration: 10s; }
          .wave-medium .wave3 { animation-duration: 10s; }
          .wave-medium .wave4 { animation-duration: 10s; }
        `}</style>
      </Head>
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)' 
            : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          py: { xs: 10, md: 15 },
          overflow: 'hidden',
          position: 'relative',
          minHeight: '80vh', // Ensure enough height for waves to be visible
        }}
        data-aos="fade-in"
      >
        {/* Circular Wave Animation */}
        <CircularWaveBackground mode={mode} />
        
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right" data-aos-delay="100" className="will-animate">
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    mb: 2,
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Navigate Your <span style={{ color: '#FF9800' }}>Educational Journey</span> with Confidence
                </Typography>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    mb: 4, 
                    color: mode === 'light' ? 'text.secondary' : 'text.primary',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 400,
                    maxWidth: '90%'
                  }}
                >
                  Guiding Sri Lankan students after their O/L examinations to make informed decisions about their future
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleNavigation('/services')}
                    className="fast-button"
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      boxShadow: '0 10px 20px rgba(0, 87, 255, 0.15)'
                    }}
                    data-aos="fade-up" 
                    data-aos-delay="300"
                  >
                    Explore Services
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large"
                    onClick={handleNavigation('/contact')}
                    className="fast-button"
                    sx={{ 
                      py: 1.5, 
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '8px'
                    }}
                    data-aos="fade-up" 
                    data-aos-delay="400"
                  >
                    Contact Us
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left" data-aos-delay="200">
              <Box 
                sx={{ 
                  position: 'relative',
                  height: { xs: '300px', md: '500px' },
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '140%',
                    height: '140%',
                    background: mode === 'light' 
                      ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(255,255,255,0) 70%)' 
                      : 'radial-gradient(circle, rgba(0, 87, 255, 0.15) 0%, rgba(0,0,0,0) 70%)',
                    top: '-20%',
                    left: '-20%',
                    borderRadius: '50%',
                    zIndex: 1
                  },
                   overflow: 'hidden'
                }}
              >
                <Box 
                  className="hero-image-container"
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    zIndex: 2,
                    animation: 'pulse 3s ease-in-out infinite',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      transition: 'all 0.5s ease',
                      filter: mode === 'light' 
                        ? 'drop-shadow(0 10px 25px rgba(0, 87, 255, 0.2))' 
                        : 'drop-shadow(0 10px 25px rgba(66, 153, 225, 0.3)) brightness(0.9)',
                      animation: 'spread 10s ease-in-out infinite',
                      transform: 'scale(0.9)',
                    }
                  }}
                >
                  <style jsx global>{`
                    @keyframes pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                    }
                    
                    @keyframes spread {
                      0% { transform: scale(0.9); filter: blur(0px); }
                      50% { transform: scale(1.05); filter: blur(1px); }
                      100% { transform: scale(0.9); filter: blur(0px); }
                    }
                    
                    .hero-image-container::after {
                      content: '';
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      background: ${mode === 'light' 
                        ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(255,255,255,0) 70%)' 
                        : 'radial-gradient(circle, rgba(0, 87, 255, 0.15) 0%, rgba(0,0,0,0) 70%)'};
                      animation: pulse 8s ease-in-out infinite alternate;
                      z-index: -1;
                    }
                  `}</style>
                  <Image 
                    src="/images/1.gif" 
                    alt="Educational Guidance" 
                    width={500}
                    height={500}
                    objectFit="contain"
                    className="blur-load"
                    onLoadingComplete={(img) => img.classList.add('loaded')}
                    priority
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box 
        sx={{ 
          py: 10, 
          bgcolor: mode === 'light' ? '#fff' : '#1E293B',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Circular Wave Animation - Medium Speed */}
        <Box className="wave-medium">
          <CircularWaveBackground mode={mode} />
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4} data-aos="fade-up" data-aos-delay="100">
              <Card 
                className="feature-card"
                sx={{ 
                  height: '100%',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'secondary.main', 
                      width: 60, 
                      height: 60,
                      mb: 2,
                      boxShadow: '0 10px 20px rgba(255, 92, 0, 0.2)'
                    }}
                  >
                    <WorkIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    Career Guidance
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Our AI-powered system recommends ideal career paths based on your skills, interests, and personality traits.
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />} 
                    onClick={handleNavigation('/career-guidance')}
                    className="fast-button"
                    sx={{ fontWeight: 600 }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} data-aos="fade-up" data-aos-delay="200">
              <Card 
                className="feature-card"
                sx={{ 
                  height: '100%',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 60, 
                      height: 60,
                      mb: 2,
                      boxShadow: '0 10px 20px rgba(0, 87, 255, 0.15)'
                    }}
                  >
                    <SmartToyIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    Talent Identification
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Our AI analyzes your strengths and potential areas of excellence through comprehensive assessment.
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />} 
                    onClick={handleNavigation('/talent-identification')}
                    sx={{ fontWeight: 600 }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4} data-aos="fade-up" data-aos-delay="300">
              <Card 
                className="feature-card"
                sx={{ 
                  height: '100%',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'tertiary.main', 
                      width: 60, 
                      height: 60,
                      mb: 2,
                      boxShadow: '0 10px 20px rgba(0, 184, 169, 0.2)'
                    }}
                  >
                    <AssignmentIcon fontSize="large" />
                  </Avatar>
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                    Test Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Create personalized assessments with automated grading, analytics, and adaptive testing technology.
                  </Typography>
                  <Button 
                    endIcon={<ArrowForwardIcon />} 
                    onClick={handleNavigation('/test-management')}
                    sx={{ fontWeight: 600 }}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* AI & ML Technology Section */}
      <Box 
        sx={{ 
          py: 10,
          bgcolor: mode === 'light' ? '#f8fafc' : '#111827',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Circular Wave Animation - Slow Speed */}
        <Box className="wave-slow">
          <CircularWaveBackground mode={mode} />
        </Box>
        
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right">
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Powered by <span style={{ color: '#FF9800' }}>AI & ML</span> Technology
              </Typography>
              
              <Typography variant="body1" paragraph>
                Our platform leverages cutting-edge Artificial Intelligence and Machine Learning to provide personalized educational guidance and career recommendations.
              </Typography>
              
              <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body1">
                    <strong>AI-Powered Career Matching</strong> - Personalized career recommendations
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body1">
                    <strong>ML Skill Assessment</strong> - Identify strengths and growth areas
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: 'primary.main', mr: 2 }} />
                  <Typography variant="body1">
                    <strong>Adaptive Testing</strong> - Adjusts to your individual performance
                  </Typography>
                </Box>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleNavigation('/services')}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Explore Our Technology
              </Button>
            </Grid>
            
            <Grid item xs={12} md={6} data-aos="fade-left">
              <Box 
                sx={{ 
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    animation: 'pulsate 3s ease-in-out infinite alternate',
                    '@keyframes pulsate': {
                      '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
                      '100%': { transform: 'scale(1.03)', filter: 'brightness(1.1)' }
                    }
                  }}
                >
                  <Image 
                    src="/images/Home AI-1.gif" 
                    alt="AI Technology" 
                    layout="fill" 
                    objectFit="cover"
                    priority
                    className="hover-glow"
                  />
                  <style jsx global>{`
                    .hover-glow {
                      transition: all 0.5s ease-in-out;
                    }
                    .hover-glow:hover {
                      filter: drop-shadow(0 0 15px rgba(0, 87, 255, 0.6));
                      transform: scale(1.02);
                    }
                  `}</style>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* About Section */}
      <Box 
        sx={{ 
          py: 12,
          bgcolor: mode === 'light' ? '#ffffff' : '#1E293B',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Circular Wave Animation - Medium Speed */}
        <Box className="wave-medium">
          <CircularWaveBackground mode={mode} />
        </Box>
        
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: mode === 'light' 
                      ? 'linear-gradient(135deg, rgba(0, 87, 255, 0.05) 0%, rgba(0, 87, 255, 0.1) 100%)' 
                      : 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0.15) 100%)',
                    zIndex: 1
                  }
                }}
              >
                <Box
                  className="about-image-container"
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                    overflow: 'hidden'
                  }}
                >
                  <style jsx global>{`
                    @keyframes pulse-spread {
                      0% { transform: scale(1); filter: brightness(1); }
                      50% { transform: scale(1.03); filter: brightness(1.1); }
                      100% { transform: scale(1); filter: brightness(1); }
                    }
                    
                    @keyframes color-overlay {
                      0% { opacity: 0.3; }
                      50% { opacity: 0.5; }
                      100% { opacity: 0.3; }
                    }
                    
                    .about-image-container::after {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: ${mode === 'light' 
                        ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(0, 87, 255, 0) 70%)' 
                        : 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, rgba(66, 153, 225, 0) 70%)'};
                      animation: color-overlay 6s ease-in-out infinite;
                      z-index: 1;
                      pointer-events: none;
                    }
                    
                    .about-image-container img {
                      animation: pulse-spread 8s ease-in-out infinite;
                    }
                  `}</style>
                  <Image 
                    src="/images/2.gif" 
                    alt="About EduLift" 
                    layout="fill" 
                    objectFit="cover"
                    priority
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                About EduLift
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                EduLift is dedicated to guiding Sri Lankan students after their O/L examinations, helping them navigate the critical decisions that will shape their educational and professional futures.
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Our team of experienced educators, career counselors, and industry professionals provides personalized guidance, resources, and support to help students make informed decisions about their academic and career paths.
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                We believe that every student has unique talents, interests, and potential. Our mission is to help them discover and develop these qualities to achieve their goals and contribute meaningfully to society.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleNavigation('/about')}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px'
                }}
              >
                Learn More About Us
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }} data-aos="fade-up">
        <Box sx={{ textAlign: 'center', mb: 8 }} data-aos="fade-up" data-aos-delay="100">
          <Typography 
            variant="h2" 
            sx={{ 
              mb: 2,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            What Our Students Say
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              mb: 2,
              color: 'text.secondary',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Hear from students who have benefited from our guidance and support
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="100">
            <Card 
              className="testimonial-card"
              sx={{ 
                height: '100%',
                borderRadius: '12px',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src="/images/testimonial-1.svg" 
                  alt="Dinesh Perera"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Dinesh Perera
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A/L Science Student
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                "EduLift's guidance helped me choose the right A/L subjects based on my strengths and career aspirations. Their counselors provided valuable insights that I couldn't find anywhere else."
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="200">
            <Card 
              className="testimonial-card"
              sx={{ 
                height: '100%',
                borderRadius: '12px',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src="/images/testimonial-2.svg" 
                  alt="Amali Fernando"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Amali Fernando
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Commerce Student
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                "The skills assessment at EduLift opened my eyes to career paths I hadn't considered before. Now I'm pursuing commerce with a clear vision of how it aligns with my strengths and interests."
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4} data-aos="fade-up" data-aos-delay="300">
            <Card 
              className="testimonial-card"
              sx={{ 
                height: '100%',
                borderRadius: '12px',
                p: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 30px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src="/images/testimonial-3.svg" 
                  alt="Malik Jayawardena"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Malik Jayawardena
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Technology Student
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                "I was unsure about my path after O/Ls, but EduLift's career counseling helped me discover my passion for technology. Their ongoing support has been invaluable throughout my educational journey."
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Chatbot Promotion Section */}
      <Box sx={{ 
        bgcolor: mode === 'light' ? '#ffffff' : '#1E293B', 
        py: 12,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Circular Wave Animation */}
        <Box className="wave-medium">
          <CircularWaveBackground mode={mode} />
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                sx={{ 
                  mb: 3,
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Get Instant Answers with Our AI Assistant
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
                Have questions about your educational journey? Our AI chatbot is available 24/7 to provide guidance, answer your questions, and help you navigate your options after O/L examinations.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AutoGraphIcon sx={{ color: '#fff' }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Instant Responses
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PeopleIcon sx={{ color: '#fff' }} />
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    24/7 Availability
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<ChatIcon />}
                onClick={() => {
                  // This will be handled by the Chatbot component's toggle function
                  const chatbotFab = document.querySelector('[aria-label="chat"]');
                  if (chatbotFab) {
                    (chatbotFab as HTMLElement).click();
                  }
                }}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: '0 10px 20px rgba(0, 87, 255, 0.15)'
                }}
              >
                Chat Now
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                sx={{ 
                  position: 'relative',
                  height: { xs: '300px', md: '400px' },
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: '12px'
                }}
              >
                <Box 
                  className="chatbot-image-container"
                  sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <style jsx global>{`
                    @keyframes chatbot-pulse {
                      0% { transform: scale(1); }
                      50% { transform: scale(1.05); }
                      100% { transform: scale(1); }
                    }
                    
                    @keyframes chatbot-glow {
                      0% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                      50% { filter: drop-shadow(0 0 15px rgba(0, 87, 255, 0.6)); }
                      100% { filter: drop-shadow(0 0 5px rgba(0, 87, 255, 0.3)); }
                    }
                    
                    .chatbot-image-container::before {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: ${mode === 'light' 
                        ? 'radial-gradient(circle, rgba(0, 87, 255, 0.1) 0%, rgba(0, 87, 255, 0) 70%)' 
                        : 'radial-gradient(circle, rgba(66, 153, 225, 0.15) 0%, rgba(66, 153, 225, 0) 70%)'};
                      animation: chatbot-pulse 8s ease-in-out infinite;
                      z-index: -1;
                      border-radius: 50%;
                      transform: scale(1.2);
                    }
                    
                    .chatbot-image-container img {
                      animation: chatbot-glow 4s ease-in-out infinite;
                      filter: ${mode === 'light' 
                        ? 'drop-shadow(0 0 10px rgba(0, 87, 255, 0.4))' 
                        : 'drop-shadow(0 0 10px rgba(66, 153, 225, 0.5))'};
                      max-width: 100%;
                      height: auto;
                      border-radius: 12px;
                      transform: scale(0.9);
                      transition: transform 0.3s ease;
                    }
                    
                    .chatbot-image-container:hover img {
                      transform: scale(0.95);
                    }
                  `}</style>
                  <Image 
                    src="/images/3.gif" 
                    alt="AI Chatbot Assistant" 
                    width={450}
                    height={550}
                    objectFit="contain"
                    priority
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* First Image Slider - Right to Left */}
      <Box sx={{ my: 8 }} data-aos="fade-up">
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            textAlign: 'center'
          }}
        >
          Explore Our <span className="gradient-text">Educational Pathways to Success</span>
        </Typography>
        
        <Box sx={{ width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
          <ImageSlider 
            direction="rtl"
            autoSlideInterval={2000}
            showDots={false}
            landscapeLayout={true}
            showPartialSlides={true}
            slides={[
              {
                image: '/images/b1.jpg',
                title: 'Academic Excellence',
                description: 'Discover resources to excel in your studies and achieve top grades'
              },
              {
                image: '/images/b2.jpg',
                title: 'Career Guidance',
                description: 'Get expert advice on choosing the right career path after O/L examinations'
              },
              {
                image: '/images/b3.jpg',
                title: 'Skill Development',
                description: 'Build essential skills that will set you apart in today\'s competitive world'
              },
              {
                image: '/images/b4.jpg',
                title: 'Personalized Learning',
                description: 'Access customized learning plans tailored to your strengths and interests'
              },
              {
                image: '/images/b5.jpg',
                title: 'Interactive Workshops',
                description: 'Participate in engaging workshops led by industry professionals'
              },
              {
                image: '/images/b6.jpg',
                title: 'Study Abroad Opportunities',
                description: 'Explore international education options and scholarship programs'
              },
              {
                image: '/images/b7.jpg',
                title: 'Community Support',
                description: 'Join a community of like-minded students on similar educational journeys'
              }
            ]}
          />
        </Box>
      </Box>
      
      {/* Second Image Slider - Left to Right */}
      <Box sx={{ my: 8 }} data-aos="fade-up">
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4,
            fontWeight: 700,
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            textAlign: 'center'
          }}
        >
          Student <span className="orange-gradient-text">Success Stories</span>
        </Typography>
        
        <Box sx={{ width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
          <ImageSlider 
            direction="ltr"
            autoSlideInterval={1200}
            showDots={false}
            landscapeLayout={true}
            multipleSlides={true}
            visibleSlides={3}
            slides={[
              {
                image: '/images/bb1.jpg',
                title: 'Nimal\'s Journey to Medical School',
                description: 'How EduLift helped Nimal secure a place at a top medical university'
              },
              {
                image: '/images/bb2.jpg',
                title: 'Kumari\'s Tech Career',
                description: 'From O/L student to software engineer at a leading tech company'
              },
              {
                image: '/images/bb3.jpg',
                title: 'Rajiv\'s Scholarship Success',
                description: 'Securing a full scholarship to study abroad with EduLift\'s guidance'
              },
              {
                image: '/images/bb4.jpg',
                title: 'Amali\'s Business Venture',
                description: 'How career counseling led to entrepreneurial success'
              },
              {
                image: '/images/bb5.jpg',
                title: 'Dinesh\'s Academic Achievement',
                description: 'Top A/L results after following EduLift\'s study strategies'
              },
              {
                image: '/images/bb6.jpg',
                title: 'Priya\'s Language Journey',
                description: 'Building multilingual skills that opened international opportunities'
              },
              {
                image: '/images/bb7.jpg',
                title: 'Malik\'s Engineering Path',
                description: 'From uncertain O/L student to confident engineering professional'
              }
            ]}
          />
        </Box>
      </Box>
      
      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }} data-aos="fade-up">
        <Typography 
          variant="h2" 
          sx={{ 
            mb: 3,
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.75rem' }
          }}
          data-aos="fade-up" 
          data-aos-delay="100"
        >
          Ready to Shape Your Future?
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Join EduLift today and get the guidance you need to make informed decisions about your educational journey
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleNavigation('/register')}
            sx={{ 
              py: 1.5, 
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px',
              boxShadow: '0 10px 20px rgba(0, 87, 255, 0.15)'
            }}
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            Register Now
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleNavigation('/contact')}
            sx={{ 
              py: 1.5, 
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '8px'
            }}
            data-aos="fade-up" 
            data-aos-delay="300"
          >
            Contact Us
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Home; 