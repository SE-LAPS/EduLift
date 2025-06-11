import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  role: string;
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
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkUserSession();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkUserSession = async () => {
    try {
      // This would be replaced with a real API call to validate the token
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && userData.id) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Session validation error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For development: Mock authentication
      if (process.env.NODE_ENV === 'development') {
        // Mock user data based on username
        let mockUser: User;
        
        if (username === 'admin@edulift.com' && password === 'admin123') {
          mockUser = { id: 1, username: 'admin@edulift.com', role: 'admin' };
        } else if (username === 'teacher@edulift.com' && password === 'teacher123') {
          mockUser = { id: 2, username: 'teacher@edulift.com', role: 'teacher' };
        } else if (username === 'student@edulift.com' && password === 'student123') {
          mockUser = { id: 3, username: 'student@edulift.com', role: 'student' };
        } else if (username === 'assistant@edulift.com' && password === 'assistant123') {
          mockUser = { id: 4, username: 'assistant@edulift.com', role: 'assistant' };
        } else if (username === 'supersub@edulift.com' && password === 'supersub123') {
          mockUser = { id: 5, username: 'supersub@edulift.com', role: 'supersub' };
        } else {
          throw new Error('Invalid credentials');
        }
        
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        
        localStorage.setItem('accessToken', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        setUser(mockUser);
        return;
      }
      
      // Production: Real API call
      const response = await axios.post('/api/auth/login', { username, password });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
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