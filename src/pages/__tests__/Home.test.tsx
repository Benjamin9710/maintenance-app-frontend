import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Home } from '../Home';
import { renderWithProviders } from '../../test';

const mockApiFetch = vi.fn();

vi.mock('../../lib/http', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

const mockProfile = {
  sub: 'user-123',
  email: 'manager@example.com',
  email_verified: true,
  given_name: 'Test',
  family_name: 'Manager',
};

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner while profile request is in-flight', () => {
    mockApiFetch.mockReturnValue(new Promise(() => {}));

    renderWithProviders(<Home />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders error state when profile fetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Failed to load profile'));

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to load profile');
    });
  });

  it('renders welcome banner and dashboard sections on success', async () => {
    mockApiFetch.mockResolvedValue(mockProfile);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Welcome back, Test Manager')).toBeInTheDocument();
    });

    expect(screen.getByText(/manager@example.com/i)).toBeInTheDocument();
    expect(screen.getByText('Recent Work Orders')).toBeInTheDocument();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('New Work Order')).toBeInTheDocument();
  });
});
