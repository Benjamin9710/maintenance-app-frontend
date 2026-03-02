import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import { 
  renderWithProviders, 
  renderWithTheme,
  mockAuthenticatedPersona,
  mockUnauthenticated,
  setupAdminApiSuccessMocks,
  createMockManager,
  createMockProperty,
} from '../index';

// Simple test component
const TestComponent = () => <div>Test Content</div>;

describe('Test Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderWithProviders works correctly', () => {
    renderWithProviders(<TestComponent />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renderWithTheme works correctly', () => {
    renderWithTheme(<TestComponent />);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('mockAuthenticatedPersona works', () => {
    const authState = mockAuthenticatedPersona('admin');
    expect(authState.persona).toBe('admin');
    expect(authState.isAuthenticated).toBe(true);
  });

  it('mockUnauthenticated works', () => {
    const authState = mockUnauthenticated();
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.persona).toBe(null);
  });

  it('createMockManager works', () => {
    const manager = createMockManager({
      displayName: 'Custom Manager',
    });
    expect(manager.displayName).toBe('Custom Manager');
    expect(manager.cognitoSub).toBe('manager-123');
  });

  it('createMockProperty works', () => {
    const property = createMockProperty({
      name: 'Custom Property',
    });
    expect(property.name).toBe('Custom Property');
    expect(property.id).toBe('property-123');
  });

  it('setupAdminApiSuccessMocks works', () => {
    const mocks = setupAdminApiSuccessMocks();
    expect(mocks.getManagers).toBeDefined();
    expect(mocks.getContractors).toBeDefined();
    expect(mocks.getProperty).toBeDefined();
  });
});
