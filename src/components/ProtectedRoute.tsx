import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, loading, persona } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // If not authenticated, redirect to appropriate login
  if (!isAuthenticated) {
    // For admin routes, redirect to admin login
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" state={{ from: location }} replace />;
    }
    // For other routes, redirect to main login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for admin-only routes
  if (requireAdmin && persona !== 'admin') {
    // If authenticated but not admin, redirect based on persona
    if (persona === 'manager') {
      return <Navigate to="/manager" replace />;
    }
    if (persona === 'contractor') {
      return <Navigate to="/contractor" replace />;
    }
    // If persona is somehow null but authenticated, fallback to main login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
