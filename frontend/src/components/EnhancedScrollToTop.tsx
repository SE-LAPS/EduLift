import React, { useState, useEffect } from 'react';
import { Box, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useThemeContext } from '../contexts/ThemeContext';

const EnhancedScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { mode } = useThemeContext();
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (typeof window !== 'undefined') {
        if (window.pageYOffset > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
      toggleVisibility();
      return () => window.removeEventListener('scroll', toggleVisibility);
    }
  }, []);
  
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <Zoom in={isVisible}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: { xs: 70, sm: 30 },
          left: { xs: 20, sm: 30 },
          zIndex: 99
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FF8C00', // Orange color
            color: 'white',
            borderRadius: 1, // Square shape with slightly rounded corners
            boxShadow: mode === 'light' 
              ? '0 4px 14px rgba(255, 140, 0, 0.4)' 
              : '0 4px 14px rgba(255, 140, 0, 0.6)',
            transform: isHovering ? 'translateY(-5px) rotate(360deg)' : 'translateY(0) rotate(0deg)',
            transition: 'transform 0.5s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 6px 20px rgba(255, 140, 0, 0.6)'
                : '0 6px 20px rgba(255, 140, 0, 0.8)',
              cursor: 'pointer',
            },
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                boxShadow: '0 0 0 0 rgba(255, 140, 0, 0.7)',
              },
              '70%': {
                boxShadow: '0 0 0 10px rgba(255, 140, 0, 0)',
              },
              '100%': {
                boxShadow: '0 0 0 0 rgba(255, 140, 0, 0)',
              }
            }
          }}
        >
          <KeyboardArrowUpIcon 
            sx={{ 
              fontSize: '1.8rem',
              animation: isHovering ? 'bounce 0.6s ease infinite' : 'none',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-8px)',
                },
                '60%': {
                  transform: 'translateY(-4px)',
                }
              }
            }}
          />
        </Box>
      </Box>
    </Zoom>
  );
};

export default EnhancedScrollToTop;


