import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    // If trying to access admin routes, redirect to /admin instead of /login
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
