import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0057FF', // Bright blue like Absolx
      light: '#3378FF',
      dark: '#0046CC',
    },
    secondary: {
      main: '#FF5C00', // Orange accent like Absolx
      light: '#FF7D33',
      dark: '#CC4A00',
    },
    tertiary: {
      main: '#00B8A9', // Teal for special elements
      light: '#33C6BB',
      dark: '#009387',
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#F8FAFC',
    },
    text: {
      primary: '#111827', // Dark gray for text
      secondary: '#4B5563', // Medium gray for secondary text
    },
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
          background: 'linear-gradient(135deg, #0057FF 0%, #0046CC 100%)',
          color: '#FFFFFF',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #FF5C00 0%, #CC4A00 100%)',
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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#111827',
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
              borderColor: '#0057FF',
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
            color: '#0057FF',
          },
        },
      },
    },
  },
}); 