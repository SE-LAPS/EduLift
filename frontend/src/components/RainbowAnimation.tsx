import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const RainbowAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const { mode } = useThemeContext();

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const position = window.pageYOffset;
        setScrollPosition(position);
        
        // Calculate scroll percentage (how far down the page we've scrolled)
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(100, Math.max(0, (position / totalHeight) * 100));
        setScrollPercentage(scrollPercent);
        
        if (position > 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial position
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (!isVisible) return null;

  // Calculate rainbow width based on scroll percentage
  const rainbowWidth = `${scrollPercentage}%`;

  return (
    <>
      {/* Rainbow gradient overlay container */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '5px',
          backgroundColor: 'rgba(0,0,0,0.1)',
          zIndex: 9999,
        }}
      >
        {/* Growing rainbow gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: rainbowWidth,
            background: 'linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #33cc33, #3366ff, #9933ff)',
            backgroundSize: '600% 600%',
            animation: 'rainbow 6s ease infinite',
            opacity: Math.min(1, scrollPosition / 500),
            boxShadow: mode === 'light' 
              ? '0 0 10px rgba(255,255,255,0.6)' 
              : '0 0 10px rgba(255,255,255,0.4)',
            transition: 'width 0.3s ease-out, opacity 0.3s ease',
            '@keyframes rainbow': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        />
      </Box>

      {/* Side borders */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, #ff0000, #ff9900, #ffff00, #33cc33, #3366ff, #9933ff)',
          backgroundSize: '100% 600%',
          animation: 'rainbowVertical 10s ease infinite',
          zIndex: 9997,
          opacity: 0.4,
          '@keyframes rainbowVertical': {
            '0%': { backgroundPosition: '0% 0%' },
            '50%': { backgroundPosition: '0% 100%' },
            '100%': { backgroundPosition: '0% 0%' },
          },
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          background: 'linear-gradient(to bottom, #ff0000, #ff9900, #ffff00, #33cc33, #3366ff, #9933ff)',
          backgroundSize: '100% 600%',
          animation: 'rainbowVertical 10s ease infinite',
          animationDelay: '0.5s',
          zIndex: 9997,
          opacity: 0.4,
        }}
      />

      {/* Subtle gradient overlay that follows scroll */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100px',
          background: mode === 'light'
            ? 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: Math.min(0.5, scrollPosition / 1000),
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #33cc33, #3366ff, #9933ff)',
            backgroundSize: '600% 600%',
            animation: 'rainbow 8s ease infinite',
            animationDelay: '1s',
          }
        }}
      />
    </>
  );
};

export default RainbowAnimation;


