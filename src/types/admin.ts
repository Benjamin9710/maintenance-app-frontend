export interface ManagerSummary {
  cognitoSub: string;
  username: string;
  email: string | null;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  phoneNumber: string | null;
  status: string;
  enabled: boolean;
  createdAt: string;
  lastModifiedAt: string;
}

export interface CreateManagerRequest {
  email: string;
  displayName: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
}

export interface PaginatedManagers {
  managers: ManagerSummary[];
  paginationToken?: string;
  hasMore: boolean;
}

export interface ListManagersOptions {
  limit?: number;
  paginationToken?: string;
}

// Contractor types (mirroring manager types)
export interface ContractorSummary {
  cognitoSub: string;
  username: string;
  email: string | null;
  displayName: string | null;
  givenName: string | null;
  familyName: string | null;
  phoneNumber: string | null;
  status: string;
  enabled: boolean;
  createdAt: string;
  lastModifiedAt: string;
}

export interface CreateContractorRequest {
  email: string;
  displayName: string;
  givenName: string;
  familyName: string;
  phoneNumber: string;
}

export interface PaginatedContractors {
  contractors: ContractorSummary[];
  paginationToken?: string;
  hasMore: boolean;
}

export interface ListContractorsOptions {
  limit?: number;
  paginationToken?: string;
}

// Property types
export interface Property {
  id: string;
  ownerManagerSub: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface CreatePropertyRequest {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  timezone?: string;
}

export interface UpdatePropertyRequest {
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
  timezone?: string;
}

export interface PaginatedProperties {
  properties: Property[];
  paginationToken?: string;
  hasMore: boolean;
}

export interface ListPropertiesOptions {
  limit?: number;
  paginationToken?: string;
  includeArchived?: boolean;
}
