import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';
import { useThemeContext } from '../contexts/ThemeContext';

interface SlideProps {
  image: string;
  title: string;
  description: string;
}

interface ImageSliderProps {
  slides: SlideProps[];
  direction: 'ltr' | 'rtl';
  autoSlideInterval?: number;
  showDots?: boolean;
  multipleSlides?: boolean;
  visibleSlides?: number;
  landscapeLayout?: boolean;
  showPartialSlides?: boolean;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  slides, 
  direction = 'ltr',
  autoSlideInterval = 5000,
  showDots = true,
  multipleSlides = false,
  visibleSlides = 3,
  landscapeLayout = false,
  showPartialSlides = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { mode } = useThemeContext();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length;
  const maxIndex = multipleSlides ? totalSlides - visibleSlides : totalSlides - 1;

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? maxIndex : currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const isLastSlide = currentIndex === maxIndex;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (slideIndex: number) => {
    if (isTransitioning || slideIndex === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(slideIndex);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Auto slide effect
  useEffect(() => {
    if (autoSlideInterval > 0) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, autoSlideInterval);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, autoSlideInterval]);

  // Pause auto slide on hover
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (autoSlideInterval > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, autoSlideInterval);
    }
  };

  // Calculate slide width based on visible slides
  const slideWidth = multipleSlides ? `${100 / visibleSlides}%` : showPartialSlides ? '80%' : '100%';
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: landscapeLayout ? '300px' : multipleSlides ? '500px' : '400px',
        overflow: 'hidden',
        borderRadius: '12px',
        '&:hover .slider-controls': {
          opacity: 1
        },
        display: landscapeLayout ? 'flex' : 'block',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {landscapeLayout && (
        <Box 
          sx={{ 
            width: '40%', 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center'
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {slides[currentIndex].title}
          </Typography>
          <Typography variant="body1">
            {slides[currentIndex].description}
          </Typography>
        </Box>
      )}
      
      {/* Slides Container */}
      <Box 
        sx={{ 
          width: landscapeLayout ? '60%' : '100%',
          height: '100%',
          display: 'flex',
          transition: 'transform 0.5s ease-in-out',
          transform: multipleSlides 
            ? `translateX(${direction === 'ltr' ? -currentIndex * (100 / visibleSlides) : currentIndex * (100 / visibleSlides)}%)`
            : showPartialSlides
              ? `translateX(calc(${direction === 'ltr' ? '-' : ''}${currentIndex * 80}% + ${direction === 'ltr' ? '10%' : '-10%'}))`
              : `translateX(${direction === 'ltr' ? -currentIndex * 100 : currentIndex * 100}%)`,
          flexDirection: direction === 'ltr' ? 'row' : 'row-reverse'
        }}
      >
        {slides.map((slide, index) => (
          <Box 
            key={index}
            sx={{ 
              minWidth: slideWidth,
              height: '100%',
              position: 'relative',
              padding: multipleSlides ? '0 10px' : showPartialSlides ? '0 5px' : 0
            }}
          >
            <Image 
              src={slide.image} 
              alt={slide.title} 
              layout="fill"
              objectFit="cover"
              priority={index === 0}
            />
            {!landscapeLayout && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 3,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                  textAlign: direction === 'ltr' ? 'left' : 'right',
                  color: '#fff'
                }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {slide.title}
                </Typography>
                <Typography variant="body1">
                  {slide.description}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Navigation Arrows */}
      <Box 
        className="slider-controls"
        sx={{ 
          position: 'absolute',
          top: '50%',
          left: landscapeLayout ? '40%' : 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          transform: 'translateY(-50%)',
          px: 2,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 2
        }}
      >
        <IconButton 
          onClick={goToPrevious}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.3)',
            color: '#fff',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.5)'
            }
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <IconButton 
          onClick={goToNext}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.3)',
            color: '#fff',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.5)'
            }
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Dots */}
      {showDots && (
        <Box 
          sx={{ 
            position: 'absolute',
            bottom: 16,
            left: landscapeLayout ? '40%' : 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            zIndex: 2
          }}
        >
          {slides.map((_, index) => {
            // For multiple slides mode, only show dots for valid starting positions
            if (multipleSlides && index > maxIndex) return null;
            
            return (
              <Box 
                key={index}
                onClick={() => goToSlide(index)}
                sx={{ 
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ImageSlider; 