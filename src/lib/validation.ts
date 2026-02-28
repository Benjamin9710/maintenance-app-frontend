import { CreateManagerRequest, CreateContractorRequest, CreatePropertyRequest, UpdatePropertyRequest } from '../types/admin';

// Type for validation that allows optional fields (same as UpdatePropertyRequest)
export type UpdatePropertyRequestForValidation = UpdatePropertyRequest;
import {
  sanitizeTextInput,
  sanitizeAddressInput,
  sanitizeAlphaNumericInput,
  sanitizeStateInput,
  sanitizeCountryInput,
  sanitizeTimezoneInput,
} from './sanitization';

export interface ValidationError {
  field: keyof CreateManagerRequest | keyof CreateContractorRequest | keyof CreatePropertyRequest | keyof UpdatePropertyRequestForValidation;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic international phone format validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

export const validateName = (name: string): boolean => {
  // Name should be at least 2 characters and contain only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\u00C0-\u017F\s\-']{2,}$/;
  return nameRegex.test(name.trim());
};

export const validateCreateManagerRequest = (request: CreateManagerRequest): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!request.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(request.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Display name validation
  if (!request.displayName?.trim()) {
    errors.push({ field: 'displayName', message: 'Display name is required' });
  } else if (!validateName(request.displayName)) {
    errors.push({ field: 'displayName', message: 'Display name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Given name validation
  if (!request.givenName?.trim()) {
    errors.push({ field: 'givenName', message: 'Given name is required' });
  } else if (!validateName(request.givenName)) {
    errors.push({ field: 'givenName', message: 'Given name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Family name validation
  if (!request.familyName?.trim()) {
    errors.push({ field: 'familyName', message: 'Family name is required' });
  } else if (!validateName(request.familyName)) {
    errors.push({ field: 'familyName', message: 'Family name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Phone number validation
  if (!request.phoneNumber?.trim()) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  } else if (!validatePhoneNumber(request.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Please enter a valid phone number (e.g., +61400111222)' });
  }

  return errors;
};

export const getFieldError = (errors: ValidationError[], field: keyof CreateManagerRequest): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
};

// Contractor validation functions (mirroring manager validation)
export const validateCreateContractorRequest = (request: CreateContractorRequest): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Email validation
  if (!request.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(request.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Display name validation
  if (!request.displayName?.trim()) {
    errors.push({ field: 'displayName', message: 'Display name is required' });
  } else if (!validateName(request.displayName)) {
    errors.push({ field: 'displayName', message: 'Display name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Given name validation
  if (!request.givenName?.trim()) {
    errors.push({ field: 'givenName', message: 'Given name is required' });
  } else if (!validateName(request.givenName)) {
    errors.push({ field: 'givenName', message: 'Given name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Family name validation
  if (!request.familyName?.trim()) {
    errors.push({ field: 'familyName', message: 'Family name is required' });
  } else if (!validateName(request.familyName)) {
    errors.push({ field: 'familyName', message: 'Family name must contain only letters, spaces, hyphens, and apostrophes' });
  }

  // Phone number validation
  if (!request.phoneNumber?.trim()) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  } else if (!validatePhoneNumber(request.phoneNumber)) {
    errors.push({ field: 'phoneNumber', message: 'Please enter a valid phone number (e.g., +61400111222)' });
  }

  return errors;
};

export const getContractorFieldError = (errors: ValidationError[], field: keyof CreateContractorRequest): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
};

// Property validation functions
export const validatePropertyName = (name: string): boolean => {
  // Property name should be at least 2 characters and max 200 characters
  return name.trim().length >= 2 && name.trim().length <= 200;
};

export const validateAddressLine = (address: string): boolean => {
  // Address line should be at least 5 characters and max 255 characters
  return address.trim().length >= 5 && address.trim().length <= 255;
};

export const validateSuburb = (suburb: string): boolean => {
  // Suburb should be at least 2 characters and max 100 characters
  return suburb.trim().length >= 2 && suburb.trim().length <= 100;
};

export const validateState = (state: string): boolean => {
  // State should be a valid Australian state code (2-3 letters)
  const australianStateRegex = /^(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)$/;
  return australianStateRegex.test(state.trim());
};

export const validatePostcode = (postcode: string): boolean => {
  // Basic postcode validation - 3-10 characters alphanumeric
  const postcodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;
  return postcodeRegex.test(postcode.trim());
};

export const validateCountry = (country: string): boolean => {
  // Country should be a 2-character ISO code (for Australia: AU)
  const isoCountryRegex = /^[A-Z]{2}$/;
  return isoCountryRegex.test(country.trim());
};

export const validateCreatePropertyRequest = (request: CreatePropertyRequest): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Sanitize inputs first
  const sanitizedRequest = {
    name: sanitizeTextInput(request.name || ''),
    addressLine1: sanitizeAddressInput(request.addressLine1 || ''),
    addressLine2: sanitizeAddressInput(request.addressLine2 || ''),
    suburb: sanitizeAlphaNumericInput(request.suburb || ''),
    state: sanitizeStateInput(request.state || ''),
    postcode: sanitizeAlphaNumericInput(request.postcode || ''),
    country: sanitizeCountryInput(request.country || ''),
    timezone: sanitizeTimezoneInput(request.timezone || ''),
  };

  // Property name validation
  if (!sanitizedRequest.name) {
    errors.push({ field: 'name', message: 'Property name is required' });
  } else if (!validatePropertyName(sanitizedRequest.name)) {
    errors.push({ field: 'name', message: 'Property name must be between 2 and 200 characters' });
  }

  // Address line 1 validation
  if (!sanitizedRequest.addressLine1) {
    errors.push({ field: 'addressLine1', message: 'Address line 1 is required' });
  } else if (!validateAddressLine(sanitizedRequest.addressLine1)) {
    errors.push({ field: 'addressLine1', message: 'Address line 1 must be between 5 and 255 characters' });
  }

  // Suburb validation
  if (!sanitizedRequest.suburb) {
    errors.push({ field: 'suburb', message: 'Suburb is required' });
  } else if (!validateSuburb(sanitizedRequest.suburb)) {
    errors.push({ field: 'suburb', message: 'Suburb must be between 2 and 100 characters' });
  }

  // State validation
  if (!sanitizedRequest.state) {
    errors.push({ field: 'state', message: 'State is required' });
  } else if (!validateState(sanitizedRequest.state)) {
    errors.push({ field: 'state', message: 'Please select a valid Australian state' });
  }

  // Postcode validation
  if (!sanitizedRequest.postcode) {
    errors.push({ field: 'postcode', message: 'Postcode is required' });
  } else if (!validatePostcode(sanitizedRequest.postcode)) {
    errors.push({ field: 'postcode', message: 'Please enter a valid postcode' });
  }

  // Country validation
  if (!sanitizedRequest.country) {
    errors.push({ field: 'country', message: 'Country is required' });
  } else if (!validateCountry(sanitizedRequest.country)) {
    errors.push({ field: 'country', message: 'Country must be a 2-character ISO code' });
  }

  // Address line 2 is optional, but if provided, should be valid
  if (sanitizedRequest.addressLine2 && !validateAddressLine(sanitizedRequest.addressLine2)) {
    errors.push({ field: 'addressLine2', message: 'Address line 2 must be between 5 and 255 characters' });
  }

  return errors;
};

export const validateUpdatePropertyRequest = (request: UpdatePropertyRequestForValidation): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Sanitize inputs first
  const sanitizedRequest = {
    name: sanitizeTextInput(request.name || ''),
    addressLine1: sanitizeAddressInput(request.addressLine1 || ''),
    addressLine2: sanitizeAddressInput(request.addressLine2 || ''),
    suburb: sanitizeAlphaNumericInput(request.suburb || ''),
    state: sanitizeStateInput(request.state || ''),
    postcode: sanitizeAlphaNumericInput(request.postcode || ''),
    country: sanitizeCountryInput(request.country || ''),
    timezone: sanitizeTimezoneInput(request.timezone || ''),
  };

  // For updates, only validate fields that are provided (non-empty)
  // Property name validation (optional for update)
  if (request.name !== undefined && request.name !== '') {
    if (!sanitizedRequest.name) {
      errors.push({ field: 'name', message: 'Property name cannot be empty' });
    } else if (!validatePropertyName(sanitizedRequest.name)) {
      errors.push({ field: 'name', message: 'Property name must be between 2 and 200 characters' });
    }
  }

  // Address line 1 validation (optional for update)
  if (request.addressLine1 !== undefined && request.addressLine1 !== '') {
    if (!sanitizedRequest.addressLine1) {
      errors.push({ field: 'addressLine1', message: 'Address line 1 cannot be empty' });
    } else if (!validateAddressLine(sanitizedRequest.addressLine1)) {
      errors.push({ field: 'addressLine1', message: 'Address line 1 must be between 5 and 255 characters' });
    }
  }

  // Suburb validation (optional for update)
  if (request.suburb !== undefined && request.suburb !== '') {
    if (!sanitizedRequest.suburb) {
      errors.push({ field: 'suburb', message: 'Suburb cannot be empty' });
    } else if (!validateSuburb(sanitizedRequest.suburb)) {
      errors.push({ field: 'suburb', message: 'Suburb must be between 2 and 100 characters' });
    }
  }

  // State validation (optional for update)
  if (request.state !== undefined && request.state !== '') {
    if (!sanitizedRequest.state) {
      errors.push({ field: 'state', message: 'State cannot be empty' });
    } else if (!validateState(sanitizedRequest.state)) {
      errors.push({ field: 'state', message: 'Please select a valid Australian state' });
    }
  }

  // Postcode validation (optional for update)
  if (request.postcode !== undefined && request.postcode !== '') {
    if (!sanitizedRequest.postcode) {
      errors.push({ field: 'postcode', message: 'Postcode cannot be empty' });
    } else if (!validatePostcode(sanitizedRequest.postcode)) {
      errors.push({ field: 'postcode', message: 'Please enter a valid postcode' });
    }
  }

  // Country validation (optional for update)
  if (request.country !== undefined && request.country !== '') {
    if (!sanitizedRequest.country) {
      errors.push({ field: 'country', message: 'Country cannot be empty' });
    } else if (!validateCountry(sanitizedRequest.country)) {
      errors.push({ field: 'country', message: 'Country must be a 2-character ISO code' });
    }
  }

  // Address line 2 is optional, but if provided, should be valid
  if (request.addressLine2 !== undefined && request.addressLine2 !== '' && !validateAddressLine(sanitizedRequest.addressLine2)) {
    errors.push({ field: 'addressLine2', message: 'Address line 2 must be between 5 and 255 characters' });
  }

  return errors;
};

export const getPropertyFieldError = (errors: ValidationError[], field: keyof CreatePropertyRequest | keyof UpdatePropertyRequestForValidation): string | undefined => {
  const error = errors.find(err => err.field === field);
  return error?.message;
};
