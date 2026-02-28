/**
 * Input sanitization utilities for security
 */

/**
 * Sanitizes text input to prevent XSS attacks
 * Removes HTML tags and special characters that could be malicious
 */
export const sanitizeTextInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove potentially dangerous characters
    .replace(/[<>]/g, '')
    // Remove script references
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/on\w+\s*=/gi, '')
    // Trim whitespace
    .trim();
};

/**
 * Sanitizes address fields while preserving valid characters
 */
export const sanitizeAddressInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Allow alphanumeric, spaces, common address punctuation
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove script references
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitizes suburb/postcode input
 */
export const sanitizeAlphaNumericInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Allow only alphanumeric, spaces, and hyphens
    .trim();
};

/**
 * Validates and sanitizes state input against allowed Australian states
 */
export const sanitizeStateInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  const cleanInput = input.trim().toUpperCase();
  const validStates = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];
  
  return validStates.includes(cleanInput) ? cleanInput : '';
};

/**
 * Validates and sanitizes country input (2-letter ISO code)
 */
export const sanitizeCountryInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  const cleanInput = input.trim().toUpperCase();
  // Only allow 2-letter country codes
  return /^[A-Z]{2}$/.test(cleanInput) ? cleanInput : '';
};

/**
 * Sanitizes timezone input
 */
export const sanitizeTimezoneInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Allow valid timezone characters (letters, slashes, underscores, hyphens)
  return input.replace(/[^a-zA-Z/_.-]/g, '').trim();
};
