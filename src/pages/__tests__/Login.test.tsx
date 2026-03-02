import { fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Login } from '../Login';
import { renderWithTheme } from '../../test';

const mockUseAuth = vi.fn();
const mockSignInWithRedirect = vi.fn();
const mockConfigureAmplifyForPersona = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('aws-amplify/auth', () => ({
  signInWithRedirect: (...args: unknown[]) => mockSignInWithRedirect(...args),
}));

vi.mock('../../lib/auth', () => ({
  configureAmplifyForPersona: (...args: unknown[]) => mockConfigureAmplifyForPersona(...args),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );

  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate-mock" data-to={to}>
        Navigate to {to}
      </div>
    ),
  };
});

const baseAuthState = {
  user: null,
  loading: false,
  error: null,
  apiSessionToken: null,
  apiToken: null,
  persona: null,
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: false,
  refreshTokens: vi.fn().mockResolvedValue(undefined),
};

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders loading state while auth is loading', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuthState,
      loading: true,
    });

    renderWithTheme(<Login />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('redirects home when already authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuthState,
      isAuthenticated: true,
    });

    renderWithTheme(<Login />);

    expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/');
  });

  it('renders persona buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue(baseAuthState);

    renderWithTheme(<Login />);

    expect(screen.getByRole('button', { name: 'Sign in as Manager' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Sign in as Contractor' }),
    ).toBeInTheDocument();
  });

  it('kicks off manager login flow when button clicked', async () => {
    mockUseAuth.mockReturnValue(baseAuthState);
    mockSignInWithRedirect.mockResolvedValue(undefined);

    renderWithTheme(<Login />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign in as Manager' }));

    await waitFor(() => {
      expect(mockConfigureAmplifyForPersona).toHaveBeenCalledWith('manager');
      expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1);
    });
    expect(localStorage.getItem('authPersona')).toBe('manager');
  });

  it('kicks off contractor login flow when button clicked', async () => {
    mockUseAuth.mockReturnValue(baseAuthState);
    mockSignInWithRedirect.mockResolvedValue(undefined);

    renderWithTheme(<Login />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign in as Contractor' }));

    await waitFor(() => {
      expect(mockConfigureAmplifyForPersona).toHaveBeenCalledWith('contractor');
      expect(mockSignInWithRedirect).toHaveBeenCalledTimes(1);
    });
    expect(localStorage.getItem('authPersona')).toBe('contractor');
  });
});
