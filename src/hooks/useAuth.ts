import { useState, useEffect, useCallback } from 'react';
import { AuthUser } from '@aws-amplify/auth';
import { getCurrentUser, signInWithRedirect, signOut, fetchAuthSession } from '@aws-amplify/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthState & {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshTokens: () => Promise<void>;
} {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthState = useCallback(async () => {
    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
      // Don't set error for normal "not authenticated" state
      if (err instanceof Error && !err.message.includes('not authenticated')) {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTokens = useCallback(async () => {
    try {
      setError(null);
      await fetchAuthSession({ forceRefresh: true });
      // Re-check auth state after refresh
      await checkAuthState();
    } catch (err) {
      console.error('Token refresh failed:', err);
      setError('Token refresh failed');
      // If refresh fails, user needs to re-authenticate
      await logout();
    }
  }, [checkAuthState]);

  const login = useCallback(() => {
    setError(null);
    signInWithRedirect();
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await signOut();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      // Force clear user state even if signOut fails
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    refreshTokens
  };
}
