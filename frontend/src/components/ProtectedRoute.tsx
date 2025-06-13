import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Check if user is not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      // Check if role restrictions exist and user doesn't have an allowed role
      if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, user, allowedRoles]);

  // Don't render children until authentication is checked
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have the required role
  if (!isAuthenticated || (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role)))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 