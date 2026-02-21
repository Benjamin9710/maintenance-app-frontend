import { CreateManagerRequest, CreateContractorRequest } from '../types/admin';

export interface ValidationError {
  field: keyof CreateManagerRequest | keyof CreateContractorRequest;
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
