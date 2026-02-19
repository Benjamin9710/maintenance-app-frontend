import { ManagerSummary, CreateManagerRequest, PaginatedManagers, ListManagersOptions } from '../types/admin';

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
};
