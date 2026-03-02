import { vi } from 'vitest';
import type { 
  ManagerSummary, 
  ContractorSummary, 
  Property, 
  PaginatedManagers,
  PaginatedContractors, 
  PaginatedProperties
} from '../../types/admin';

/**
 * Mock adminApi with all methods
 */
export const mockAdminApi = {
  // Manager methods
  getManagers: vi.fn(),
  createManager: vi.fn(),
  
  // Contractor methods  
  getContractors: vi.fn(),
  createContractor: vi.fn(),
  
  // Property methods
  getManagerProperties: vi.fn(),
  createProperty: vi.fn(),
  getProperty: vi.fn(),
  updateProperty: vi.fn(),
  archiveProperty: vi.fn(),
};

/**
 * Mock apiFetch for non-admin API calls
 */
export const mockApiFetch = vi.fn();

/**
 * Setup adminApi mocks
 */
export function setupAdminApiMocks() {
  vi.mock('../../lib/api', () => ({
    adminApi: mockAdminApi,
    api: {
      // Add any non-admin api methods here if needed
    },
  }));
  
  return mockAdminApi;
}

/**
 * Setup apiFetch mock
 */
export function setupApiFetchMock() {
  vi.mock('../../lib/http', () => ({
    apiFetch: mockApiFetch,
  }));
  
  return mockApiFetch;
}

/**
 * Helper to create mock manager data
 */
export function createMockManager(overrides: Partial<ManagerSummary> = {}): ManagerSummary {
  return {
    cognitoSub: 'manager-123',
    username: 'testmanager',
    email: 'manager@example.com',
    displayName: 'Test Manager',
    givenName: 'Test',
    familyName: 'Manager',
    phoneNumber: '+1234567890',
    status: 'ACTIVE',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastModifiedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Helper to create mock contractor data
 */
export function createMockContractor(overrides: Partial<ContractorSummary> = {}): ContractorSummary {
  return {
    cognitoSub: 'contractor-123',
    username: 'testcontractor',
    email: 'contractor@example.com',
    displayName: 'Test Contractor',
    givenName: 'Test',
    familyName: 'Contractor',
    phoneNumber: '+1234567890',
    status: 'ACTIVE',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastModifiedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Helper to create mock property data
 */
export function createMockProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 'property-123',
    ownerManagerSub: 'manager-123',
    name: 'Test Property',
    addressLine1: '123 Test St',
    suburb: 'Testville',
    state: 'NSW',
    postcode: '2000',
    country: 'AU',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/**
 * Helper to create mock paginated response
 */
export function createMockPaginatedResponse<T>(
  items: T[],
  hasMore = false,
  paginationToken?: string
) {
  return {
    items,
    hasMore,
    paginationToken,
  };
}

/**
 * Helper to create mock managers paginated response
 */
export function createMockManagersResponse(
  managers: ManagerSummary[],
  hasMore = false,
  paginationToken?: string
): PaginatedManagers {
  return {
    managers,
    hasMore,
    paginationToken,
  };
}

/**
 * Helper to create mock contractors paginated response
 */
export function createMockContractorsResponse(
  contractors: ContractorSummary[],
  hasMore = false,
  paginationToken?: string
): PaginatedContractors {
  return {
    contractors,
    hasMore,
    paginationToken,
  };
}

/**
 * Helper to create mock properties paginated response
 */
export function createMockPropertiesResponse(
  properties: Property[],
  hasMore = false,
  paginationToken?: string
): PaginatedProperties {
  return {
    properties,
    hasMore,
    paginationToken,
  };
}

/**
 * Setup adminApi with successful responses
 */
export function setupAdminApiSuccessMocks() {
  const mocks = setupAdminApiMocks();
  
  // Default successful responses
  mocks.getManagers.mockResolvedValue(createMockManagersResponse([createMockManager()]));
  mocks.getContractors.mockResolvedValue(createMockContractorsResponse([createMockContractor()]));
  mocks.getManagerProperties.mockResolvedValue(createMockPropertiesResponse([createMockProperty()]));
  mocks.getProperty.mockResolvedValue(createMockProperty());
  mocks.createManager.mockResolvedValue(createMockManager());
  mocks.createContractor.mockResolvedValue(createMockContractor());
  mocks.createProperty.mockResolvedValue(createMockProperty());
  mocks.updateProperty.mockResolvedValue(createMockProperty());
  mocks.archiveProperty.mockResolvedValue(undefined);
  
  return mocks;
}

/**
 * Setup adminApi with error responses
 */
export function setupAdminApiErrorMocks() {
  const mocks = setupAdminApiMocks();
  
  const error = new Error('API Error');
  mocks.getManagers.mockRejectedValue(error);
  mocks.getContractors.mockRejectedValue(error);
  mocks.getManagerProperties.mockRejectedValue(error);
  mocks.getProperty.mockRejectedValue(error);
  mocks.createManager.mockRejectedValue(error);
  mocks.createContractor.mockRejectedValue(error);
  mocks.createProperty.mockRejectedValue(error);
  mocks.updateProperty.mockRejectedValue(error);
  mocks.archiveProperty.mockRejectedValue(error);
  
  return mocks;
}
