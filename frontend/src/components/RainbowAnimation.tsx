import React, { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const RainbowAnimation: React.FC = () => {
  const { mode } = useThemeContext();
  const theme = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      // Calculate how far down the page the user has scrolled
      const scrollPx = window.scrollY;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      
      setScrollProgress(scrolled);
      
      // Show animation when user has scrolled down
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      <style jsx global>{`
        @keyframes rainbow-border-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes rainbow-glow {
          0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.4); }
          16.7% { box-shadow: 0 0 10px rgba(255, 165, 0, 0.4); }
          33.4% { box-shadow: 0 0 10px rgba(255, 255, 0, 0.4); }
          50% { box-shadow: 0 0 10px rgba(0, 255, 0, 0.4); }
          66.7% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.4); }
          83.4% { box-shadow: 0 0 10px rgba(0, 0, 255, 0.4); }
          100% { box-shadow: 0 0 10px rgba(255, 0, 255, 0.4); }
        }
        
        .rainbow-corner {
          position: fixed;
          width: 40px;
          height: 40px;
          z-index: 9998;
          background: linear-gradient(45deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000);
          background-size: 200% 200%;
          animation: rainbow-border-animation 10s linear infinite;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
          pointer-events: none;
          filter: blur(1px);
        }
      `}</style>
      
      {/* Top rainbow progress bar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          zIndex: 9999,
          opacity: isVisible ? 0.85 : 0,
          transition: 'opacity 0.5s ease-in-out',
          background: 'linear-gradient(90deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000)',
          backgroundSize: '200% 200%',
          animation: 'rainbow-border-animation 12s linear infinite',
          width: `${scrollProgress * 100}%`,
          pointerEvents: 'none',
          boxShadow: mode === 'light'
            ? '0 0 10px rgba(255, 255, 255, 0.3)'
            : '0 0 10px rgba(0, 0, 0, 0.3)',
        }}
      />
      
      {/* Corners with rainbow effect */}
      <Box 
        className="rainbow-corner"
        sx={{ 
          top: mode === 'dark' ? '8px' : '6px', 
          left: mode === 'dark' ? '8px' : '6px', 
          borderRadius: '0 0 50% 0',
          opacity: isVisible ? (mode === 'light' ? 0.6 : 0.7) : 0,
          pointerEvents: 'none',
        }} 
      />
      <Box 
        className="rainbow-corner"
        sx={{ 
          top: mode === 'dark' ? '8px' : '6px', 
          right: mode === 'dark' ? '8px' : '6px',
          borderRadius: '0 0 0 50%',
          opacity: isVisible ? (mode === 'light' ? 0.6 : 0.7) : 0,
          pointerEvents: 'none',
        }} 
      />
      <Box 
        className="rainbow-corner"
        sx={{ 
          bottom: mode === 'dark' ? '8px' : '6px', 
          left: mode === 'dark' ? '8px' : '6px',
          borderRadius: '0 50% 0 0',
          opacity: isVisible ? (mode === 'light' ? 0.6 : 0.7) : 0,
          pointerEvents: 'none',
        }} 
      />
      <Box 
        className="rainbow-corner"
        sx={{ 
          bottom: mode === 'dark' ? '8px' : '6px', 
          right: mode === 'dark' ? '8px' : '6px',
          borderRadius: '50% 0 0 0',
          opacity: isVisible ? (mode === 'light' ? 0.6 : 0.7) : 0,
          pointerEvents: 'none',
        }} 
      />
      
      {/* Rainbow border and gradient overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: '8px',
          left: '8px', 
          right: '8px',
          bottom: '8px',
          zIndex: 9990,
          opacity: isVisible ? 0.1 : 0,
          transition: 'opacity 0.5s ease-in-out',
          borderRadius: '12px',
          border: '1px solid transparent',
          backgroundImage: 'linear-gradient(90deg, #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000)',
          backgroundSize: '200% 200%',
          animation: 'rainbow-border-animation 15s linear infinite',
          pointerEvents: 'none',
          filter: 'blur(2px)',
        }}
      />
    </>
  );
};

export default RainbowAnimation; 