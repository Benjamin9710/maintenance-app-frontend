import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { type AuthUser, getCurrentUser, signInWithRedirect, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { Persona } from '../lib/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  apiSessionToken: string | null;
  apiToken: string | null;
  persona: Persona | null;
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
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('apiToken');
    if (storedToken) {
      setApiToken(storedToken);
    }
  }, []);

  const createApiSession = useCallback(async (currentUser: AuthUser) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create API session');
    }

    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken: (await fetchAuthSession()).tokens?.idToken?.toString() 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApiSessionToken(data.sessionToken);
        setApiToken(data.sessionToken);
        localStorage.setItem('apiToken', data.sessionToken);
        // Use backend persona if provided, otherwise fallback to localStorage
        if (data.persona) {
          setPersona(data.persona);
        } else {
          const storedPersona = localStorage.getItem('authPersona') as Persona;
          setPersona(storedPersona || 'manager');
        }
      } else {
        console.error('Failed to create session');
        // Fallback to localStorage persona if API fails
        const storedPersona = localStorage.getItem('authPersona') as Persona;
        setPersona(storedPersona || 'manager');
      }
    } catch (error) {
      console.error('Error creating API session:', error);
      // Fallback to localStorage persona if there's an error
      const storedPersona = localStorage.getItem('authPersona') as Persona;
      setPersona(storedPersona || 'manager');
    }
  }, []);

  const checkAuthState = useCallback(async () => {
    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        await createApiSession(currentUser);
      } else {
        // When not authenticated, use localStorage persona if available
        const storedPersona = localStorage.getItem('authPersona') as Persona;
        setPersona(storedPersona || null);
      }
    } catch (err) {
      setUser(null);
      setApiSessionToken(null);
      setApiToken(null);
      // When auth check fails, use localStorage persona if available
      const storedPersona = localStorage.getItem('authPersona') as Persona;
      setPersona(storedPersona || null);
      // Don't set error for normal "not authenticated" state
      if (err instanceof Error && !err.message.includes('not authenticated')) {
        setError('Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  }, [createApiSession, setUser, setApiSessionToken, setPersona, setError, setLoading]);

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
      localStorage.removeItem('apiToken');
      localStorage.removeItem('authPersona');
      setPersona(null);
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
      // Force clear user state even if signOut fails
      setUser(null);
      setApiSessionToken(null);
      localStorage.removeItem('apiToken');
      localStorage.removeItem('authPersona');
      setPersona(null);
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
    persona,
    apiToken,
  login,
    logout,
    isAuthenticated: !!user,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
