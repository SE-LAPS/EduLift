import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

export default function Layout({ children, hideNavbar = false }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    router.push('/');
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Navigation items based on user role
  const getNavItems = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/login' }
      ];
    }
    
    const commonItems = [
      { label: 'Home', path: '/' }
    ];
    
    switch (user?.role) {
      case 'admin':
        return [
          ...commonItems,
          { label: 'Dashboard', path: '/admin-dashboard' },
          { label: 'Users', path: '/admin/users' }
        ];
      case 'teacher':
        return [
          ...commonItems,
          { label: 'Dashboard', path: '/teacher-dashboard' },
          { label: 'Tests', path: '/teacher/tests' },
          { label: 'Exams', path: '/teacher/exams' },
          { label: 'ML Models', path: '/teacher/ml-models' }
        ];
      case 'assistant':
      case 'supersub':
        return [
          ...commonItems,
          { label: 'Dashboard', path: '/evaluator-dashboard' },
          { label: 'Exams', path: '/evaluator/exams' }
        ];
      case 'student':
        return [
          ...commonItems,
          { label: 'Dashboard', path: '/student-dashboard' },
          { label: 'My Tests', path: '/student/tests' },
          { label: 'My Exams', path: '/student/exams' }
        ];
      default:
        return commonItems;
    }
  };
  
  const navItems = getNavItems();
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        EduLift
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.label}
            onClick={() => router.push(item.path)}
            selected={router.pathname === item.path}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideNavbar && (
        <AppBar position="sticky" color="default" elevation={1}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              {/* Logo for larger screens */}
              <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                EduLift
              </Typography>
              
              {/* Mobile menu */}
              <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleDrawerToggle}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={drawerOpen}
                  onClose={handleDrawerToggle}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                  }}
                >
                  {drawer}
                </Drawer>
              </Box>
              
              {/* Logo for mobile */}
              <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                EduLift
              </Typography>
              
              {/* Desktop navigation */}
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => router.push(item.path)}
                    sx={{ 
                      my: 2, 
                      color: 'inherit', 
                      display: 'block',
                      fontWeight: router.pathname === item.path ? 'bold' : 'normal',
                      borderBottom: router.pathname === item.path ? '2px solid' : 'none',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
              
              {/* User menu */}
              {isAuthenticated && user ? (
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={`${user.first_name} ${user.last_name}`}>
                        {user.first_name[0] + user.last_name[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      router.push('/profile');
                    }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      router.push(`/${user.role}-dashboard`);
                    }}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Button 
                  color="inherit" 
                  onClick={() => router.push('/login')}
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  Login
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      )}
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
} 