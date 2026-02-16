import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PersonaRedirect() {
  const { persona } = useAuth();

  if (persona === 'manager') {
    return <Navigate to="/manager" replace />;
  }

  if (persona === 'contractor') {
    return <Navigate to="/contractor" replace />;
  }

  if (persona === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If authenticated but no persona yet, show loading state
  return <div>Loading...</div>;
}
