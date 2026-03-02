import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AdminEntry } from '../AdminEntry';
import { renderWithTheme } from '../../test';

// Mock the aws-amplify/auth module using vi.hoisted
const mockAuth = vi.hoisted(() => ({
  signInWithRedirect: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('aws-amplify/auth', () => mockAuth);

// Mock the configureAmplifyForPersona function using vi.hoisted
const mockAuthLib = vi.hoisted(() => ({
  configureAmplifyForPersona: vi.fn(),
}));

vi.mock('../../lib/auth', () => mockAuthLib);

describe('AdminEntry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
    
    // Default mock implementations
    mockAuth.getCurrentUser.mockResolvedValue(null);
    mockAuth.signOut.mockResolvedValue(undefined);
    mockAuth.signInWithRedirect.mockResolvedValue(undefined);
    mockAuthLib.configureAmplifyForPersona.mockReturnValue(undefined);
  });

  it('renders admin entry page with title and description', () => {
    renderWithTheme(<AdminEntry />);

    expect(screen.getByText('Administrator Access')).toBeInTheDocument();
    expect(screen.getByText('Sign in with administrator credentials to access the admin dashboard.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in as Admin' })).toBeInTheDocument();
  });

  it('sets admin persona in localStorage on mount', () => {
    renderWithTheme(<AdminEntry />);

    expect(localStorage.getItem('authPersona')).toBe('admin');
    expect(mockAuthLib.configureAmplifyForPersona).toHaveBeenCalledWith('admin');
  });

  it('calls signInWithRedirect when sign-in button is clicked', async () => {
    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state while signing in', async () => {
    // Make signInWithRedirect take some time to test loading state
    mockAuth.signInWithRedirect.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    // Should show loading state immediately
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument();
    expect(signInButton).toBeDisabled();

    // Wait for sign-in to complete
    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });
  });

  it('prevents multiple sign-in attempts while loading', async () => {
    // Make signInWithRedirect take some time
    mockAuth.signInWithRedirect.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    
    // Click multiple times quickly
    fireEvent.click(signInButton);
    fireEvent.click(signInButton);
    fireEvent.click(signInButton);

    // Should only call signInWithRedirect once
    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });
  });

  it('signs out existing user before signing in', async () => {
    // Mock an existing authenticated user
    const mockCurrentUser = {
      username: 'existing-user',
      userId: 'user-123',
    };
    mockAuth.getCurrentUser.mockResolvedValue(mockCurrentUser);

    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockAuth.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(mockAuth.signOut).toHaveBeenCalledTimes(1);
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });
  });

  it('handles sign-out error gracefully', async () => {
    // Mock getCurrentUser to return a user
    const mockCurrentUser = {
      username: 'existing-user',
      userId: 'user-123',
    };
    mockAuth.getCurrentUser.mockResolvedValue(mockCurrentUser);
    
    // Mock signOut to throw an error
    mockAuth.signOut.mockRejectedValue(new Error('Sign out failed'));

    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });

    // Should still attempt to sign in despite sign-out error
    expect(mockAuth.signInWithRedirect).toHaveBeenCalled();
  });

  it('handles case when no user is authenticated', async () => {
    // Mock getCurrentUser to throw (no user authenticated)
    mockAuth.getCurrentUser.mockRejectedValue(new Error('No authenticated user'));

    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });

    // Should not call signOut since there's no user
    expect(mockAuth.signOut).not.toHaveBeenCalled();
  });

  it('handles sign-in error and resets loading state', async () => {
    // Mock signInWithRedirect to throw an error
    mockAuth.signInWithRedirect.mockRejectedValue(new Error('Sign in failed'));

    // Mock console.error to avoid test output pollution
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(mockAuth.signInWithRedirect).toHaveBeenCalledTimes(1);
    });

    // Should reset loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign in as Admin' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign in as Admin' })).not.toBeDisabled();
    });

    // Should log the error
    expect(consoleSpy).toHaveBeenCalledWith('Admin sign-in error:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('button has proper styling and accessibility', () => {
    renderWithTheme(<AdminEntry />);

    const signInButton = screen.getByRole('button', { name: 'Sign in as Admin' });
    
    expect(signInButton).toHaveAttribute('type', 'button');
    expect(signInButton).not.toBeDisabled();
    expect(signInButton).toHaveStyle('min-width: 200px');
  });
});
