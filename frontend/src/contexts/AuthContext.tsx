import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For development: Mock authentication
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
        // Mock user data based on username
        let mockUser: User;
        
        if (username === 'admin@edulift.com' && password === 'admin123') {
          mockUser = { 
            id: 1, 
            username: 'admin@edulift.com', 
            email: 'admin@edulift.com',
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            is_active: true
          };
        } else if (username === 'teacher@edulift.com' && password === 'teacher123') {
          mockUser = { 
            id: 2, 
            username: 'teacher@edulift.com', 
            email: 'teacher@edulift.com',
            first_name: 'Teacher',
            last_name: 'User',
            role: 'teacher',
            is_active: true
          };
        } else if (username === 'student@edulift.com' && password === 'student123') {
          mockUser = { 
            id: 3, 
            username: 'student@edulift.com', 
            email: 'student@edulift.com',
            first_name: 'Student',
            last_name: 'User',
            role: 'student',
            is_active: true
          };
        } else if (username === 'assistant@edulift.com' && password === 'assistant123') {
          mockUser = { 
            id: 4, 
            username: 'assistant@edulift.com',
            email: 'assistant@edulift.com',
            first_name: 'Assistant',
            last_name: 'User',
            role: 'assistant',
            is_active: true
          };
        } else if (username === 'supersub@edulift.com' && password === 'supersub123') {
          mockUser = { 
            id: 5, 
            username: 'supersub@edulift.com',
            email: 'supersub@edulift.com',
            first_name: 'Super',
            last_name: 'Supervisor',
            role: 'supersub',
            is_active: true
          };
        } else {
          throw new Error('Invalid credentials');
        }
        
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        const mockRefreshToken = 'mock-refresh-token-' + Math.random().toString(36).substring(2);
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('refreshToken', mockRefreshToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        return;
      }
      
      // Production: Real API call
      const response = await authAPI.login(username, password);
      const { access_token, refresh_token, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Authentication failed');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to login. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 