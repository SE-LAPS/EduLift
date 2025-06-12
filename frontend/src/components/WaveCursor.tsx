import React, { useState, useEffect } from 'react';
import { useThemeContext } from '../contexts/ThemeContext';

const WaveCursor: React.FC = () => {
  const { mode } = useThemeContext();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 1000);
    };
    
    window.addEventListener('mousemove', updateCursorPosition);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      window.removeEventListener('click', handleClick);
    };
  }, []);
  
  return (
    <div 
      className={`wave-cursor ${clicked ? 'active' : ''}`} 
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        borderColor: mode === 'light' ? 'var(--primary-color)' : '#fff'
      }}
    />
  );
};

export default WaveCursor; 