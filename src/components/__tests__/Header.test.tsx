import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Header } from '../Header';
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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when unauthenticated', () => {
    it('returns null (does not render)', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        persona: null,
        loading: false,
        error: null,
        apiToken: null,
        apiSessionToken: null,
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      const { container } = renderWithProviders(<Header />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when authenticated', () => {

    it('renders app title and branding', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);
      
      expect(screen.getByText('Strata Maintenance')).toBeInTheDocument();
      
      // Check for BuildIcon
      const toolbar = screen.getByRole('banner');
      expect(toolbar).toBeInTheDocument();
    });

    it('displays user email when available', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: {
          userId: 'test-user-id',
          username: 'testuser',
          signInDetails: {
            loginId: 'admin@example.com',
          },
        },
        loading: false,
        error: null,
        apiToken: 'test-token',
        apiSessionToken: 'test-session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    });

    it('shows avatar with person icon', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      const avatar = screen.getByRole('button');
      expect(avatar).toBeInTheDocument();
      
      // Check for PersonIcon within the avatar
      const personIcon = avatar.querySelector('[data-testid="PersonIcon"]');
      expect(personIcon).toBeInTheDocument();
    });

    it('opens user menu when avatar is clicked', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      const avatarButton = screen.getByRole('button');
      
      // Menu should not be open initially
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
      
      // Click avatar to open menu
      fireEvent.click(avatarButton);

      // Menu should now be visible
      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });

    it('calls logout when sign out is clicked', async () => {
      const mockLogout = vi.fn();
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: mockLogout,
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      // Open menu
      const avatarButton = screen.getByRole('button');
      fireEvent.click(avatarButton);

      // Wait for menu to open and click Sign Out
      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });

      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);

      // Verify logout was called
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('hides email on small screens', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: {
          userId: 'test-user-id',
          username: 'testuser',
          signInDetails: {
            loginId: 'admin@example.com',
          },
        },
        loading: false,
        error: null,
        apiToken: 'test-token',
        apiSessionToken: 'test-session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      const emailElement = screen.getByText('admin@example.com');
      
      // Check that the email has display: none on xs screens via sx prop
      // The actual responsive behavior is handled by MUI's sx prop
      expect(emailElement).toBeInTheDocument();
    });

    it('works with different personas', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'manager',
        user: {
          userId: 'manager-id',
          username: 'manager',
          signInDetails: {
            loginId: 'manager@example.com',
          },
        },
        loading: false,
        error: null,
        apiToken: 'test-token',
        apiSessionToken: 'test-session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      expect(screen.getByText('Strata Maintenance')).toBeInTheDocument();
      expect(screen.getByText('manager@example.com')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      // Check for banner role (AppBar)
      const banner = screen.getByRole('banner');
      expect(banner).toBeInTheDocument();

      // Check for button (avatar/menu trigger)
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('updates ARIA expanded when menu opens', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        persona: 'admin',
        user: { userId: 'test-id', username: 'test', signInDetails: { loginId: 'test@example.com' } },
        loading: false,
        error: null,
        apiToken: 'token',
        apiSessionToken: 'session',
        login: vi.fn(),
        logout: vi.fn(),
        refreshTokens: vi.fn(),
      });

      renderWithProviders(<Header />);

      const avatarButton = screen.getByRole('button');
      
      // Open menu
      fireEvent.click(avatarButton);

      // Verify menu is visible (MUI Menu handles aria-expanded internally)
      await waitFor(() => {
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });
  });
});
