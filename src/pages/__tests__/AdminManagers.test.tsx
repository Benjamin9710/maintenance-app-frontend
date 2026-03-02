import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { AdminManagers } from '../AdminManagers';
import { 
  renderWithProviders, 
  mockAuthenticatedPersona, 
  createMockManager,
  createMockManagersResponse,
} from '../../test';
import { ValidationError } from '../../lib/validation';

const adminApiMock = vi.hoisted(() => ({
  getManagers: vi.fn(),
  createManager: vi.fn(),
}));

vi.mock('../../lib/api', () => ({
  adminApi: adminApiMock,
}));

// Mock the validation module (use hoisted refs since vi.mock is hoisted)
const validationMocks = vi.hoisted(() => ({
  validateCreateManagerRequest: vi.fn(),
  getFieldError: vi.fn(),
}));

vi.mock('../../lib/validation', () => ({
  validateCreateManagerRequest: validationMocks.validateCreateManagerRequest,
  getFieldError: validationMocks.getFieldError,
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

describe('AdminManagers', () => {
  const mockManagers = [
    createMockManager({
      cognitoSub: 'manager-1',
      displayName: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '+61400111222',
      enabled: true,
      status: 'ACTIVE',
      createdAt: '2024-01-15T00:00:00.000Z',
    }),
    createMockManager({
      cognitoSub: 'manager-2',
      displayName: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '+61400111333',
      enabled: false,
      status: 'INACTIVE',
      createdAt: '2024-01-10T00:00:00.000Z',
    }),
  ];

  const openCreateDialog = async () => {
    await waitFor(() => {
      expect(screen.getByText('Managers')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create Manager');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Manager')).toBeInTheDocument();
    });

    return getCreateDialog();
  };

  const getCreateDialog = () => screen.getByRole('dialog', { name: /create new manager/i });
  const getCreateDialogSubmitButton = (dialog: HTMLElement = getCreateDialog()) =>
    within(dialog).getByRole('button', { name: 'Create Manager' });

  const fillCreateForm = (dialog: HTMLElement = getCreateDialog()) => {
    const getInput = (label: RegExp | string) => within(dialog).getByLabelText(label, { selector: 'input' });

    fireEvent.change(getInput(/email/i), { target: { value: 'new@example.com' } });
    fireEvent.change(getInput(/display name/i), { target: { value: 'New Manager' } });
    fireEvent.change(getInput(/given name/i), { target: { value: 'New' } });
    fireEvent.change(getInput(/family name/i), { target: { value: 'Manager' } });
    fireEvent.change(getInput(/phone number/i), { target: { value: '+61400111444' } });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthenticatedPersona('admin');
    
    // Setup default API mocks
    adminApiMock.getManagers.mockResolvedValue(createMockManagersResponse(mockManagers));
    adminApiMock.createManager.mockResolvedValue(undefined);
    
    // Setup validation mocks
    validationMocks.validateCreateManagerRequest.mockReturnValue([]);
    validationMocks.getFieldError.mockReturnValue(null);
  });

  it('renders managers list with correct headers', async () => {
    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getByText('Managers')).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  it('displays managers data correctly', async () => {
    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    // Check first manager
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+61400111222')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();

    // Check second manager
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('+61400111333')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Make API call take longer
    adminApiMock.getManagers.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminManagers />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    adminApiMock.getManagers.mockRejectedValue(new Error('Failed to load managers'));

    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load managers')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('shows empty state when no managers', async () => {
    adminApiMock.getManagers.mockResolvedValue(createMockManagersResponse([]));

    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getByText('No managers found. Create your first manager to get started.')).toBeInTheDocument();
    });
  });

  it('opens create manager dialog when create button is clicked', async () => {
    renderWithProviders(<AdminManagers />);

    await openCreateDialog();

    const dialog = getCreateDialog();
    expect(within(dialog).getByLabelText(/email/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/display name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/given name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/family name/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('closes create dialog when cancel is clicked', async () => {
    renderWithProviders(<AdminManagers />);

    await openCreateDialog();

    // Close dialog
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Create New Manager')).not.toBeInTheDocument();
    });
  });

  it('creates manager successfully', async () => {
    adminApiMock.getManagers
      .mockResolvedValueOnce(createMockManagersResponse(mockManagers))
      .mockResolvedValueOnce(createMockManagersResponse([...mockManagers, createMockManager({ displayName: 'New Manager' })]));

    renderWithProviders(<AdminManagers />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    // Submit form
    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(adminApiMock.createManager).toHaveBeenCalledWith({
        email: 'new@example.com',
        displayName: 'New Manager',
        givenName: 'New',
        familyName: 'Manager',
        phoneNumber: '+61400111444',
      });
    });

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByText('Create New Manager')).not.toBeInTheDocument();
    });
  });

  it('shows validation errors in create form', async () => {
    validationMocks.validateCreateManagerRequest.mockReturnValue([
      { field: 'email', message: 'Invalid email' },
      { field: 'displayName', message: 'Display name required' },
    ]);
    validationMocks.getFieldError.mockImplementation((errors: ValidationError[], field: string) => {
      const error = errors.find((e: ValidationError) => e.field === field);
      return error ? error.message : null;
    });

    renderWithProviders(<AdminManagers />);

    const dialog = await openCreateDialog();

    // Submit empty form to trigger validation
    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByText('Display name required')).toBeInTheDocument();
    });

    // Should not call API
    expect(adminApiMock.createManager).not.toHaveBeenCalled();
  });

  it('shows loading state while creating manager', async () => {
    adminApiMock.createManager.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminManagers />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('shows error when create manager fails', async () => {
    adminApiMock.createManager.mockRejectedValue(new Error('Creation failed'));

    renderWithProviders(<AdminManagers />);

    const dialog = await openCreateDialog();

    // Fill form
    fillCreateForm(dialog);

    const submitButton = getCreateDialogSubmitButton(dialog);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Creation failed')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('loads more managers when load more button is clicked', async () => {
    adminApiMock.getManagers
      .mockResolvedValueOnce(createMockManagersResponse(mockManagers, true, 'token-1'))
      .mockResolvedValueOnce(createMockManagersResponse([createMockManager({ displayName: 'Manager 3' })], false));

    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Load More')).toBeInTheDocument();
    });

    const loadMoreButton = screen.getByText('Load More');
    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(adminApiMock.getManagers).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Manager 3')).toBeInTheDocument();
    });
  });

  it('shows loading state while loading more managers', async () => {
    adminApiMock.getManagers
      .mockResolvedValueOnce(createMockManagersResponse(mockManagers, true, 'token-1'))
      .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<AdminManagers />);

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

  it('renders manage properties buttons for each manager', async () => {
    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      expect(screen.getAllByText('Manage Properties')).toHaveLength(2);
    });

    const manageButtons = screen.getAllByText('Manage Properties');
    expect(manageButtons[0]).toHaveAttribute('href', '/admin/managers/manager-1/properties');
    expect(manageButtons[1]).toHaveAttribute('href', '/admin/managers/manager-2/properties');
  });

  it('displays status with correct colors', async () => {
    renderWithProviders(<AdminManagers />);

    await waitFor(() => {
      const activeStatus = screen.getByText('ACTIVE');
      const inactiveStatus = screen.getByText('INACTIVE');
      
      expect(activeStatus).toHaveStyle('color: rgb(46, 125, 50)'); // success.main
      expect(inactiveStatus).toHaveStyle('color: rgb(211, 47, 47)'); // error.main
    });
  });
});
