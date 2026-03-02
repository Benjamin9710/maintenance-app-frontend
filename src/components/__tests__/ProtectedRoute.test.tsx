import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ProtectedRoute } from '../ProtectedRoute';
import { renderWithProviders } from '../../test';

// Mock component to render as children
const TestChild = () => <div data-testid="test-child">Protected Content</div>;

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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when unauthenticated', () => {
    it('redirects admin routes to /admin', () => {
      mockUseAuth.mockReturnValue({
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
      });
      
      renderWithProviders(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
        { routerProps: { initialEntries: ['/admin/dashboard'] } }
      );

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/admin');
    });

    it('redirects non-admin routes to /login', () => {
      mockUseAuth.mockReturnValue({
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
      });
      
      renderWithProviders(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>,
        { routerProps: { initialEntries: ['/manager'] } }
      );

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/login');
    });
  });

  describe('when loading', () => {
    it('shows loading state', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
        error: null,
        apiSessionToken: null,
        apiToken: null,
        persona: null,
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: false,
        refreshTokens: vi.fn().mockResolvedValue(undefined),
      });
      
      renderWithProviders(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    it('renders children for admin persona', () => {
      mockUseAuth.mockReturnValue({
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
      });

      renderWithProviders(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders children for manager persona', () => {
      mockUseAuth.mockReturnValue({
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
        persona: 'manager',
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: true,
        refreshTokens: vi.fn().mockResolvedValue(undefined),
      });

      renderWithProviders(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('redirects non-admin persona from admin-required routes', () => {
      mockUseAuth.mockReturnValue({
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
        persona: 'manager',
        login: vi.fn(),
        logout: vi.fn(),
        isAuthenticated: true,
        refreshTokens: vi.fn().mockResolvedValue(undefined),
      });

      renderWithProviders(
        <ProtectedRoute requireAdmin={true}>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toBeInTheDocument();
      expect(screen.getByTestId('navigate-mock')).toHaveAttribute('data-to', '/manager');
    });
  });
});
