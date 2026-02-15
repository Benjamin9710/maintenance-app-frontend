import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type AuthUser, getCurrentUser, signInWithRedirect, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { setApiToken } from '../lib/apiToken';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  apiSessionToken: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshTokens: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiSessionToken, setApiSessionToken] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) return;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiSessionToken(data.sessionToken);
        setApiToken(data.sessionToken);
      } else {
        console.error('Failed to create session');
        setError('Failed to create API session');
      }
    } catch (error) {
      console.error('Create session failed', error);
      setError('Failed to create API session');
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await createSession();
      }
    } catch (err) {
      setUser(null);
      setApiSessionToken(null);
      setApiToken(null);
      // Don't set error for normal "not authenticated" state
      if (err instanceof Error && !err.message.includes('not authenticated')) {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  }, [createSession]);

  const login = useCallback(() => {
    setError(null);
    signInWithRedirect();
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      if (apiSessionToken) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiSessionToken}` },
        });
      }
      await signOut();
      setUser(null);
      setApiSessionToken(null);
      setApiToken(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      // Force clear user state even if signOut fails
      setUser(null);
      setApiSessionToken(null);
    }
  }, [apiSessionToken]);

  const refreshTokens = useCallback(async () => {
    try {
      setError(null);
      await fetchAuthSession({ forceRefresh: true });
      // Re-check auth state after refresh
      try {
        await checkAuthState();
      } catch (err) {
        console.error('Auth check failed', err);
        setError(err instanceof Error ? err.message : 'Authentication check failed');
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      setError('Token refresh failed');
      // If refresh fails, user needs to re-authenticate
      await logout();
    }
  }, [checkAuthState, logout]);

  useEffect(() => {
    const hasOAuthCode = window.location.search.includes('code=');

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        checkAuthState();
      }
      if (payload.event === 'signInWithRedirect_failure') {
        setError('OAuth sign-in failed');
        setLoading(false);
      }
    });

    if (!hasOAuthCode) {
      // No OAuth callback in progress; check auth state immediately
      checkAuthState();
    }
    // When ?code= is present, stay in loading state and let Hub handle it

    return unsubscribe;
  }, [checkAuthState]);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    apiSessionToken,
    login,
    logout,
    isAuthenticated: !!user,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
