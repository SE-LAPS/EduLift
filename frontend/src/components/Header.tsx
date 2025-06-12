import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import Image from 'next/image';

// Create a waterfall animation component for the EduLift text
interface WaterfallTextProps {
  text: string;
  color?: string;
}

const WaterfallText: React.FC<WaterfallTextProps> = ({ text, color = 'primary.main' }) => {
  return (
    <Box sx={{ display: 'inline-flex', overflow: 'hidden' }}>
      {text.split('').map((char: string, index: number) => (
        <Typography
          key={index}
          variant="inherit"
          component="span"
          sx={{
            display: 'inline-block',
            color,
            fontWeight: 'inherit',
            animation: `waterfall 2s infinite ease-in-out ${index * 0.15}s`,
            '@keyframes waterfall': {
              '0%': { transform: 'translateY(-20%)', opacity: 0.7 },
              '50%': { transform: 'translateY(0)', opacity: 1 },
              '100%': { transform: 'translateY(-20%)', opacity: 0.7 }
            }
          }}
        >
          {char}
        </Typography>
      ))}
    </Box>
  );
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeContext();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleMenuItemClick = (path: string) => {
    router.push(path);
    handleClose();
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
    handleClose();
  };

  const navigationLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];
  
  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <WaterfallText text="EduLift" />
      </Typography>
      <Divider />
      <List>
        {navigationLinks.map((link) => (
          <ListItem 
            button 
            key={link.name} 
            component={Link}
            href={link.path}
            sx={{ 
              color: isActive(link.path) ? 'primary.main' : 'text.primary',
              fontWeight: isActive(link.path) ? 600 : 400,
            }}
          >
            <ListItemText primary={link.name} />
          </ListItem>
        ))}
        <ListItem button onClick={toggleColorMode}>
          <ListItemText primary={mode === 'light' ? 'Dark Mode' : 'Light Mode'} />
        </ListItem>
        <Divider sx={{ my: 1 }} />
        {!isAuthenticated ? (
          <ListItem button component={Link} href="/login">
            <Button variant="contained" fullWidth>
              Login
            </Button>
          </ListItem>
        ) : (
          <>
            <ListItem button component={Link} href="/dashboard">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo */}
            <Box 
              component={Link}
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: { xs: 1, md: 0 },
              }}
            >
              <Box 
                component="img" 
                src="/images/edu.png" 
                alt="EduLift Logo" 
                sx={{ 
                  height: 50, 
                  mr: 1,
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                }}
              >
                <WaterfallText text="EduLift" />
              </Typography>
            </Box>

            {/* Mobile menu icon */}
            {isMobile && (
              <>
                <ThemeToggle />
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {navigationLinks.map((link) => (
                    <MenuItem 
                      key={link.name} 
                      onClick={() => handleMenuItemClick(link.path)}
                      selected={isActive(link.path)}
                    >
                      {link.name}
                    </MenuItem>
                  ))}
                  <MenuItem onClick={toggleColorMode}>
                    {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/login')}>
                    Sign In
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Mobile logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                textDecoration: 'none',
              }}
            >
              <Box 
                component="img" 
                src="/images/edu.png" 
                alt="EduLift Logo" 
                sx={{ 
                  height: 55, 
                  mr: 1 
                }} 
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 700,
                }}
              >
                <WaterfallText text="EduLift" />
              </Typography>
            </Box>

            {/* Desktop menu */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                {navigationLinks.map((link) => (
                  <Button
                    key={link.name}
                    component={Link}
                    href={link.path}
                    sx={{
                      mx: 1.5,
                      color: isActive(link.path) ? 'primary.main' : 'text.primary',
                      fontWeight: isActive(link.path) ? 700 : 500,
                      '&:hover': {
                        color: 'primary.main',
                      },
                      position: 'relative',
                      '&::after': isActive(link.path) ? {
                        content: '""',
                        position: 'absolute',
                        width: '50%',
                        height: '3px',
                        bottom: '-3px',
                        left: '25%',
                        backgroundColor: 'primary.main',
                        borderRadius: '2px'
                      } : {}
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Box>
            )}

            {/* Theme toggle button */}
            {!isMobile && (
              <ThemeToggle />
            )}

            {/* Authentication buttons */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {!isAuthenticated ? (
                  <Button 
                    variant="contained" 
                    component={Link} 
                    href="/login"
                    sx={{ 
                      ml: 2
                    }}
                  >
                    Login
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      onClick={handleMenu}
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{ 
                        textTransform: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {user?.username}
                      </Box>
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        elevation: 2,
                        sx: { minWidth: 180 }
                      }}
                    >
                      <MenuItem component={Link} href="/dashboard" onClick={handleClose}>
                        Dashboard
                      </MenuItem>
                      <MenuItem component={Link} href="/profile" onClick={handleClose}>
                        Profile
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 