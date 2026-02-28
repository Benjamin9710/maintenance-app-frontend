import { ManagerSummary, CreateManagerRequest, PaginatedManagers, ListManagersOptions, ContractorSummary, CreateContractorRequest, PaginatedContractors, ListContractorsOptions, Property, CreatePropertyRequest, UpdatePropertyRequest, PaginatedProperties, ListPropertiesOptions } from '../types/admin';

export const api = {
  // placeholder for generated API client
};

const getApiToken = (): string => {
  const token = localStorage.getItem('apiToken');
  if (!token) {
    throw new Error('No authentication token available. Please sign in again.');
  }
  return token;
};

const handleApiError = (response: Response, defaultMessage: string): never => {
  if (response.status === 401) {
    localStorage.removeItem('apiToken');
    throw new Error('Authentication expired. Please sign in again.');
  }
  if (response.status === 403) {
    throw new Error('Access denied. You do not have permission to perform this action.');
  }
  if (response.status >= 500) {
    throw new Error('Server error. Please try again later.');
  }
  throw new Error(defaultMessage);
};

export const adminApi = {
  // Manager management endpoints
  async getManagers(options?: ListManagersOptions): Promise<PaginatedManagers> {
    try {
      const token = getApiToken();
      
      // Build query string
      const params = new URLSearchParams();
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options?.paginationToken) {
        params.append('paginationToken', options.paginationToken);
      }
      
      const queryString = params.toString();
      const url = `/api/admin/managers${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to load managers');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load managers');
    }
  },

  async createManager(request: CreateManagerRequest): Promise<ManagerSummary> {
    try {
      const token = getApiToken();
      const response = await fetch('/api/admin/managers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to create manager');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create manager');
    }
  },

  // Contractor management endpoints
  async getContractors(options?: ListContractorsOptions): Promise<PaginatedContractors> {
    try {
      const token = getApiToken();
      
      // Build query string
      const params = new URLSearchParams();
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options?.paginationToken) {
        params.append('paginationToken', options.paginationToken);
      }
      
      const queryString = params.toString();
      const url = `/api/admin/contractors${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to load contractors');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load contractors');
    }
  },

  async createContractor(request: CreateContractorRequest): Promise<ContractorSummary> {
    try {
      const token = getApiToken();
      const response = await fetch('/api/admin/contractors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to create contractor');
      }
      
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create contractor');
    }
  },

  // Property management endpoints
  async getManagerProperties(managerSub: string, options?: ListPropertiesOptions): Promise<PaginatedProperties> {
    try {
      const token = getApiToken();
      
      // Build query string
      const params = new URLSearchParams();
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      if (options?.paginationToken) {
        params.append('paginationToken', options.paginationToken);
      }
      if (options?.includeArchived) {
        params.append('includeArchived', 'true');
      }
      
      const queryString = params.toString();
      const url = `/api/admin/managers/${managerSub}/properties${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to load properties');
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!Array.isArray(data.properties)) {
        throw new Error('Invalid properties data format');
      }
      
      return {
        properties: data.properties,
        paginationToken: data.paginationToken,
        hasMore: Boolean(data.hasMore),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load properties');
    }
  },

  async createProperty(managerSub: string, request: CreatePropertyRequest): Promise<Property> {
    try {
      const token = getApiToken();
      const response = await fetch(`/api/admin/managers/${managerSub}/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to create property');
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!data.id || !data.name || !data.addressLine1) {
        throw new Error('Invalid property data format');
      }
      
      return data as Property;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create property');
    }
  },

  async getProperty(propertyId: string): Promise<Property> {
    try {
      const token = getApiToken();
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to load property');
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!data.id || !data.name || !data.addressLine1) {
        throw new Error('Invalid property data format');
      }
      
      return data as Property;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to load property');
    }
  },

  async updateProperty(propertyId: string, request: UpdatePropertyRequest): Promise<Property> {
    try {
      const token = getApiToken();
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to update property');
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      if (!data.id || !data.name || !data.addressLine1) {
        throw new Error('Invalid property data format');
      }
      
      return data as Property;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update property');
    }
  },

  async archiveProperty(propertyId: string): Promise<void> {
    try {
      const token = getApiToken();
      const response = await fetch(`/api/admin/properties/${propertyId}/archive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        handleApiError(response, 'Failed to archive property');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to archive property');
    }
  },
};
