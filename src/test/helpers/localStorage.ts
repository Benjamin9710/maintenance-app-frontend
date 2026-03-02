/**
 * localStorage helpers for testing
 */

/**
 * Set API token in localStorage
 */
export function setApiToken(token: string): void {
  localStorage.setItem('apiToken', token);
}

/**
 * Set auth persona in localStorage
 */
export function setAuthPersona(persona: 'manager' | 'contractor' | 'admin'): void {
  localStorage.setItem('authPersona', persona);
}

/**
 * Clear all authentication-related localStorage items
 */
export function clearAuthStorage(): void {
  localStorage.removeItem('apiToken');
  localStorage.removeItem('authPersona');
}

/**
 * Clear all localStorage items
 */
export function clearAllStorage(): void {
  localStorage.clear();
}

/**
 * Get current API token from localStorage
 */
export function getApiToken(): string | null {
  return localStorage.getItem('apiToken');
}

/**
 * Get current auth persona from localStorage
 */
export function getAuthPersona(): string | null {
  return localStorage.getItem('authPersona');
}

/**
 * Setup localStorage with auth state for testing
 */
export function setupAuthStorage(persona: 'manager' | 'contractor' | 'admin', apiToken?: string): void {
  setAuthPersona(persona);
  if (apiToken) {
    setApiToken(apiToken);
  }
}
