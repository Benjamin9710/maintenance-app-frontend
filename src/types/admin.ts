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
