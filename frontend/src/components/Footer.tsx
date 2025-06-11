import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Stack, Divider } from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useThemeContext } from '../contexts/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useThemeContext();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: mode === 'light' ? '#F8F9FA' : '#111827',
        pt: 8,
        pb: 4,
        borderTop: `1px solid ${mode === 'light' ? '#EAEAEA' : '#374151'}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-tertiary) 100%)',
          zIndex: 1
        }
      }}
      className="footer-wave"
    >
      <Box 
        className="wave-animation" 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '40px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='${mode === 'light' ? "%23F8F9FA" : "%23111827"}'/%3E%3C/svg%3E")`,
          backgroundSize: '100% 100%',
          zIndex: 2
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 700,
                mb: 2
              }}
            >
              EduLift
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 300 }}>
              Guiding Sri Lankan students to a brighter future through education, 
              career guidance, and skill development.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                aria-label="Facebook" 
                size="small" 
                className="social-icon-hover"
                sx={{ 
                  color: '#1877F2',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="Twitter" 
                size="small" 
                className="social-icon-hover"
                sx={{ 
                  color: '#1DA1F2',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn" 
                size="small" 
                className="social-icon-hover"
                sx={{ 
                  color: '#0A66C2',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                size="small" 
                className="social-icon-hover"
                sx={{ 
                  color: '#E4405F',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 5px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <InstagramIcon />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Navigation
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Home
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/about" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  About Us
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/services" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Services
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/contact" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Contact
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Services
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/services#academic" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Academic Guidance
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/services#career" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Career Development
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/services#skills" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Skills Assessment
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/terms" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Terms of Service
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/privacy" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Privacy Policy
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink 
                  component={Link} 
                  href="/cookies" 
                  underline="hover" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      transform: 'translateX(5px)',
                      display: 'inline-block'
                    }
                  }}
                >
                  Cookie Policy
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contact
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  123 Education Street
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colombo 05, Sri Lanka
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  info@edulift.lk
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  +94 11 234 5678
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)' }} />
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} EduLift. All rights reserved.
          </Typography>
          <Box>
            <MuiLink 
              component={Link} 
              href="/privacy" 
              underline="hover" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.875rem', 
                mr: 2,
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              Privacy
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/terms" 
              underline="hover" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.875rem',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              Terms
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;