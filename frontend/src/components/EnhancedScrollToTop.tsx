import React, { useState, useEffect } from 'react';
import { Box, Zoom, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useThemeContext } from '../contexts/ThemeContext';

const EnhancedScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { mode } = useThemeContext();
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <Zoom in={isVisible}>
      <Box
        onClick={scrollToTop}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: { xs: 70, sm: 30 },
          right: { xs: 30, sm: 30 },
          zIndex: 99
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Fab
          color="primary"
          size="medium"
          aria-label="scroll back to top"
          sx={{
            boxShadow: mode === 'light' 
              ? '0 4px 14px rgba(0, 87, 255, 0.4)' 
              : '0 4px 14px rgba(66, 153, 225, 0.6)',
            borderRadius: '4px',
            width: '40px',
            height: '40px',
            transform: isHovering ? 'translateY(-5px)' : 'translateY(0)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0 6px 20px rgba(0, 87, 255, 0.6)'
                : '0 6px 20px rgba(66, 153, 225, 0.8)',
            }
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default EnhancedScrollToTop;
