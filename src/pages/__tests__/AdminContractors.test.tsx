import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { AdminContractors } from '../AdminContractors';
import { 
  renderWithProviders, 
  mockAuthenticatedPersona, 
  createMockContractor,
  createMockContractorsResponse,
} from '../../test';
import { ValidationError } from '../../lib/validation';

const adminApiMock = vi.hoisted(() => ({
  getContractors: vi.fn(),
  createContractor: vi.fn(),
}));

vi.mock('../../lib/api', () => ({
  adminApi: adminApiMock,
}));

const validationMocks = vi.hoisted(() => ({
  validateCreateContractorRequest: vi.fn(),
  getContractorFieldError: vi.fn(),
}));

vi.mock('../../lib/validation', () => ({
  validateCreateContractorRequest: validationMocks.validateCreateContractorRequest,
  getContractorFieldError: validationMocks.getContractorFieldError,
  ValidationError: class ValidationError extends Error {
    constructor(message: string, public field: string) {
      super(message);
      this.name = 'ValidationError';
    }
  },
}));

// Mock dateUtils
vi.mock('../../lib/dateUtils', () => ({
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}));

// Mock Navigate component to prevent hanging
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to, replace }: { to: string; replace?: boolean }) => (
      <div data-testid="navigate-mock" data-to={to} data-replace={replace || false}>
        Navigate to: {to}
      </div>
    ),
  };
});

describe('AdminContractors', () => {
  const mockContractors = [
    createMockContractor({
      cognitoSub: 'contractor-1',
      displayName: 'Bob Builder',
      email: 'bob@example.com',
      phoneNumber: '+61400111555',
      enabled: true,
      status: 'ACTIVE',
      createdAt: '2024-01-15T00:00:00.000Z',
    }),
    createMockContractor({
      cognitoSub: 'contractor-2',
      displayName: 'Carol Construction',
      email: 'carol@example.com',
      phoneNumber: '+61400111666',
      enabled: false,
      status: 'INACTIVE',
      createdAt: '2024-01-10T00:00:00.000Z',
    }),
  ];

  const openCreateDialog = async () => {
    await waitFor(() => {
      expect(screen.getByText('Contractors')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create Contractor');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Contractor')).toBeInTheDocument();
    });

    return getCreateDialog();
  };

  const getCreateDialog = () => screen.getByRole('dialog', { name: /create new contractor/i });
  const getCreateDialogSubmitButton = (dialog: HTMLElement = getCreateDialog()) =>
    within(dialog).getByRole('button', { name: 'Create Contractor' });

  const fillCreateForm = (dialog: HTMLElement = getCreateDialog()) => {
    const getInput = (label: RegExp | string) => within(dialog).getByLabelText(label, { selector: 'input' });

    fireEvent.change(getInput(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(getInput(/display name/i), { target: { value: 'New Contractor' } });
    fireEvent.change(getInput(/given name/i), { target: { value: 'New' } });
    fireEvent.change(getInput(/family name/i), { target: { value: 'Contractor' } });
    fireEvent.change(getInput(/phone number/i), { target: { value: '+61400111777' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthenticatedPersona('admin');

    adminApiMock.getContractors.mockResolvedValue(createMockContractorsResponse(mockContractors));
    adminApiMock.createContractor.mockResolvedValue(undefined);

    validationMocks.validateCreateContractorRequest.mockReturnValue([]);
    validationMocks.getContractorFieldError.mockReturnValue(null);
  });

  it('renders contractors list with correct headers', async () => {
    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('Contractors')).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('displays contractors data correctly', async () => {
    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('Bob Builder')).toBeInTheDocument();
      expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    });

    // Check first contractor
    expect(screen.getByText('Bob Builder')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    expect(screen.getByText('+61400111555')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();

    // Check second contractor
    expect(screen.getByText('Carol Construction')).toBeInTheDocument();
    expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    expect(screen.getByText('+61400111666')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Make API call take longer
    adminApiMock.getContractors.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminContractors />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    adminApiMock.getContractors.mockRejectedValue(new Error('Failed to load contractors'));

    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load contractors')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows empty state when no contractors', async () => {
    adminApiMock.getContractors.mockResolvedValue(createMockContractorsResponse([]));

    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('No contractors found. Create your first contractor to get started.')).toBeInTheDocument();
    });
  });

  it('opens create contractor dialog when create button is clicked', async () => {
    renderWithProviders(<AdminContractors />);

    await openCreateDialog();

    const dialog = getCreateDialog();
    expect(within(dialog).getByLabelText(/email/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/display name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/given name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/family name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('closes create dialog when cancel is clicked', async () => {
    renderWithProviders(<AdminContractors />);

    await openCreateDialog();

    // Close dialog
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Create New Contractor')).not.toBeInTheDocument();
    });
  });

  it('creates contractor successfully', async () => {
    adminApiMock.getContractors
      .mockResolvedValueOnce(createMockContractorsResponse(mockContractors))
      .mockResolvedValueOnce(createMockContractorsResponse([...mockContractors, createMockContractor({ displayName: 'New Contractor' })]));

    renderWithProviders(<AdminContractors />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    // Submit form
    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminApiMock.createContractor).toHaveBeenCalledWith({
        email: 'new@example.com',
        displayName: 'New Contractor',
        givenName: 'New',
        familyName: 'Contractor',
        phoneNumber: '+61400111777',
      });
    });

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Create New Contractor')).not.toBeInTheDocument();
    });
  });

  it('shows validation errors in create form', async () => {
    validationMocks.validateCreateContractorRequest.mockReturnValue([
      { field: 'email', message: 'Invalid email' },
      { field: 'displayName', message: 'Display name required' },
    ]);
    validationMocks.getContractorFieldError.mockImplementation((errors: ValidationError[], field: string) => {
      const error = errors.find((e: ValidationError) => e.field === field);
      return error ? error.message : null;
    });

    renderWithProviders(<AdminContractors />);

    await openCreateDialog();

    // Submit empty form to trigger validation
    const submitButton = getCreateDialogSubmitButton();
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Display name required')).toBeInTheDocument();
    });

    // Should not call API
    expect(adminApiMock.createContractor).not.toHaveBeenCalled();
  });

  it('shows loading state while creating contractor', async () => {
    adminApiMock.createContractor.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminContractors />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    // Submit form
    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows error when create contractor fails', async () => {
    adminApiMock.createContractor.mockRejectedValue(new Error('Creation failed'));

    renderWithProviders(<AdminContractors />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    // Submit form
    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creation failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('loads more contractors when load more button is clicked', async () => {
    adminApiMock.getContractors
      .mockResolvedValueOnce(createMockContractorsResponse(mockContractors, true, 'token-1'))
      .mockResolvedValueOnce(createMockContractorsResponse([createMockContractor({ displayName: 'Contractor 3' })], false));

    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('Bob Builder')).toBeInTheDocument();
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(adminApiMock.getContractors).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Contractor 3')).toBeInTheDocument();
    });
  });

  it('shows loading state while loading more contractors', async () => {
    adminApiMock.getContractors
      .mockResolvedValueOnce(createMockContractorsResponse(mockContractors, true, 'token-1'))
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(loadMoreButton).toBeDisabled();
    });
  });

  it('displays status with correct colors', async () => {
    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      const activeStatus = screen.getByText('ACTIVE');
      const inactiveStatus = screen.getByText('INACTIVE');
      
      expect(activeStatus).toHaveStyle('color: rgb(46, 125, 50)'); // success.main
      expect(inactiveStatus).toHaveStyle('color: rgb(211, 47, 47)'); // error.main
    });
  });

  it('handles contractor name display logic correctly', async () => {
    const contractorsWithMissingFields = [
      createMockContractor({
        cognitoSub: 'contractor-1',
        displayName: '', // Missing display name
        givenName: 'John',
        familyName: 'Doe',
        username: 'johndoe',
      }),
      createMockContractor({
        cognitoSub: 'contractor-2',
        displayName: '', // Missing display name
        givenName: '', // Missing given name
        familyName: '', // Missing family name
        username: 'janedoe',
      }),
    ];

    adminApiMock.getContractors.mockResolvedValue(createMockContractorsResponse(contractorsWithMissingFields));

    renderWithProviders(<AdminContractors />);

    await waitFor(() => {
      // Should show "John Doe" when display name is missing but given/family names exist
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      // Should show username when all name fields are missing
      expect(screen.getByText('janedoe')).toBeInTheDocument();
    });
  });
});
