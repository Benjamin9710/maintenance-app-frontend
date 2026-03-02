import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { PersonaRedirect } from '../PersonaRedirect';
import { renderWithProviders } from '../../test';

// Create mock functions
const mockUseAuth = vi.fn();

// Mock the useAuth hook
vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock Navigate component to prevent hanging
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
      <div data-testid="navigate-mock" data-to={to} data-replace={replace || false}>
        Navigate to: {to}
      </div>
    ),
  };
});

describe('PersonaRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when authenticated with different personas', () => {
    it('redirects manager to /manager', () => {
      mockUseAuth.mockReturnValue({
        persona: 'manager',
        isAuthenticated: true,
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      // Verify Navigate component is rendered with correct props
      const navigate = screen.getByTestId('navigate-mock');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/manager');
      expect(navigate).toHaveAttribute('data-replace', 'true');
    });

    it('redirects contractor to /contractor', () => {
      mockUseAuth.mockReturnValue({
        persona: 'contractor',
        isAuthenticated: true,
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      // Verify Navigate component is rendered with correct props
      const navigate = screen.getByTestId('navigate-mock');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/contractor');
      expect(navigate).toHaveAttribute('data-replace', 'true');
    });

    it('redirects admin to /admin/dashboard', () => {
      mockUseAuth.mockReturnValue({
        persona: 'admin',
        isAuthenticated: true,
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      // Verify Navigate component is rendered with correct props
      const navigate = screen.getByTestId('navigate-mock');
      expect(navigate).toBeInTheDocument();
      expect(navigate).toHaveAttribute('data-to', '/admin/dashboard');
      expect(navigate).toHaveAttribute('data-replace', 'true');
    });
  });

  describe('when authenticated but persona is null', () => {
    it('shows loading state', () => {
      mockUseAuth.mockReturnValue({
        persona: null,
        isAuthenticated: true,
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when unauthenticated', () => {
    it('shows loading state', () => {
      mockUseAuth.mockReturnValue({
        persona: null,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        apiToken: null,
        apiSessionToken: null,
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('when loading', () => {
    it('shows loading state', () => {
      mockUseAuth.mockReturnValue({
        persona: null,
        isAuthenticated: false,
        user: null,
        loading: true,
        error: null,
        apiToken: null,
        apiSessionToken: null,
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<PersonaRedirect />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });
});
