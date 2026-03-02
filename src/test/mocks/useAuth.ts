import { vi } from 'vitest';
import type { AuthContextValue } from '../../hooks/AuthContext';
import type { Persona } from '../../lib/auth';

/**
 * Default mock auth state for testing
 */
export const defaultMockAuthState: AuthContextValue = {
  user: {
    userId: 'test-user-id',
    username: 'testuser',
    signInDetails: {
      loginId: 'test@example.com',
    },
  },
  loading: false,
  error: null,
  apiSessionToken: 'test-session-token',
  apiToken: 'test-api-token',
  persona: 'admin',
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: true,
  refreshTokens: vi.fn().mockResolvedValue(undefined),
};

/**
 * Mock useAuth hook with configurable state
 */
export function mockUseAuth(overrides: Partial<AuthContextValue> = {}) {
  const mockState = { ...defaultMockAuthState, ...overrides };
  
  vi.mock('../../hooks/useAuth', () => ({
    useAuth: () => mockState,
  }));
  
  return mockState;
}

/**
 * Helper to create mock auth state for different personas
 */
export function createMockAuthState(persona: Persona, isAuthenticated = true): Partial<AuthContextValue> {
  return {
    persona,
    isAuthenticated,
    user: isAuthenticated ? {
      userId: `test-${persona}-id`,
      username: `${persona}user`,
      signInDetails: {
        loginId: `${persona}@example.com`,
      },
    } : null,
    apiToken: isAuthenticated ? 'test-api-token' : null,
    apiSessionToken: isAuthenticated ? 'test-session-token' : null,
  };
}

/**
 * Setup authenticated state for specific persona
 */
export function mockAuthenticatedPersona(persona: Persona) {
  return mockUseAuth(createMockAuthState(persona, true));
}

/**
 * Setup unauthenticated state
 */
export function mockUnauthenticated() {
  return mockUseAuth({
    user: null,
    isAuthenticated: false,
    persona: null,
    apiToken: null,
    apiSessionToken: null,
    loading: false,
    error: null,
  });
}

/**
 * Setup loading state
 */
export function mockAuthLoading() {
  return mockUseAuth({
    user: null,
    isAuthenticated: false,
    persona: null,
    apiToken: null,
    apiSessionToken: null,
    loading: true,
    error: null,
  });
}
