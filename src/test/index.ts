/**
 * Central export point for all test utilities
 */

// Render utilities
export {
  renderWithProviders,
  renderWithTheme,
  renderWithRouter,
} from './render';

// Auth mocking utilities
export {
  mockUseAuth,
  createMockAuthState,
  mockAuthenticatedPersona,
  mockUnauthenticated,
  mockAuthLoading,
  defaultMockAuthState,
} from './mocks/useAuth';

// API mocking utilities
export {
  mockAdminApi,
  mockApiFetch,
  setupAdminApiMocks,
  setupApiFetchMock,
  setupAdminApiSuccessMocks,
  setupAdminApiErrorMocks,
  createMockManager,
  createMockContractor,
  createMockProperty,
  createMockPaginatedResponse,
  createMockManagersResponse,
  createMockContractorsResponse,
  createMockPropertiesResponse,
} from './mocks/api';

// localStorage helpers
export {
  setApiToken,
  setAuthPersona,
  clearAuthStorage,
  clearAllStorage,
  getApiToken,
  getAuthPersona,
  setupAuthStorage,
} from './helpers/localStorage';
