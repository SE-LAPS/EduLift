import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define the light and dark theme palettes
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light mode palette
          primary: {
            main: '#0057FF',
            light: '#3378FF',
            dark: '#0046CC',
          },
          secondary: {
            main: '#FF5C00',
            light: '#FF7D33',
            dark: '#CC4A00',
          },
          tertiary: {
            main: '#00B8A9',
            light: '#33C6BB',
            dark: '#009387',
          },
          background: {
            default: '#FFFFFF',
            paper: '#F8FAFC',
          },
          text: {
            primary: '#111827',
            secondary: '#4B5563',
          },
        }
      : {
          // Dark mode palette
          primary: {
            main: '#3B82F6',
            light: '#60A5FA',
            dark: '#2563EB',
          },
          secondary: {
            main: '#F97316',
            light: '#FB923C',
            dark: '#EA580C',
          },
          tertiary: {
            main: '#14B8A6',
            light: '#2DD4BF',
            dark: '#0D9488',
          },
          background: {
            default: '#111827',
            paper: '#1F2937',
          },
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
          },
        }),
  },
  typography: {
    fontFamily: '"Manrope", "Poppins", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.375rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
          fontWeight: 600,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 87, 255, 0.25)',
          },
        },
        contained: {
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #0057FF 0%, #0046CC 100%)' 
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          color: '#FFFFFF',
        },
        containedSecondary: {
          background: mode === 'light'
            ? 'linear-gradient(135deg, #FF5C00 0%, #CC4A00 100%)'
            : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 4px 20px rgba(0, 0, 0, 0.08)' 
            : '0 4px 20px rgba(0, 0, 0, 0.2)',
          border: mode === 'light' 
            ? '1px solid #E5E7EB' 
            : '1px solid #374151',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 4px 20px rgba(0, 0, 0, 0.08)' 
            : '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
        elevation1: {
          boxShadow: mode === 'light' 
            ? '0 2px 10px rgba(0, 0, 0, 0.05)' 
            : '0 2px 10px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: mode === 'light' 
            ? '0 4px 20px rgba(0, 0, 0, 0.08)' 
            : '0 4px 20px rgba(0, 0, 0, 0.2)',
        },
        elevation3: {
          boxShadow: mode === 'light' 
            ? '0 8px 30px rgba(0, 0, 0, 0.12)' 
            : '0 8px 30px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1F2937',
          color: mode === 'light' ? '#111827' : '#F9FAFB',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'light' ? '#0057FF' : '#3B82F6',
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          transition: 'color 0.2s ease-in-out',
          '&:hover': {
            color: mode === 'light' ? '#0057FF' : '#3B82F6',
          },
        },
      },
    },
  },
});

// Define the context type
type ThemeContextType = {
  mode: PaletteMode;
  toggleColorMode: () => void;
};

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

// ThemeProvider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Use localStorage to persist theme preference
  const [mode, setMode] = useState<PaletteMode>('light');

  // Effect to load the saved theme preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Check if user prefers dark mode
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  // Effect to update the body data attribute for CSS selectors
  useEffect(() => {
    document.body.setAttribute('data-mui-color-scheme', mode);
  }, [mode]);

  // Function to toggle between light and dark mode
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  // Create the theme based on the current mode
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 