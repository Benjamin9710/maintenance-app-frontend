import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { adminApi } from '../lib/api';
import { ContractorSummary, CreateContractorRequest, PaginatedContractors } from '../types/admin';
import { validateCreateContractorRequest, getContractorFieldError, ValidationError } from '../lib/validation';
import { formatDate } from '../lib/dateUtils';

export function AdminContractors() {
  const [contractors, setContractors] = useState<ContractorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationToken, setPaginationToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateContractorRequest>({
    email: '',
    displayName: '',
    givenName: '',
    familyName: '',
    phoneNumber: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    loadContractors();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContractors = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
        setContractors([]);
        setPaginationToken(undefined);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const options = reset ? {} : { paginationToken, limit: 20 };
      const data: PaginatedContractors = await adminApi.getContractors(options);
      
      if (reset) {
        setContractors(data.contractors);
      } else {
        setContractors(prev => [...prev, ...data.contractors]);
      }
      
      setPaginationToken(data.paginationToken);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contractors');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreContractors = () => {
    if (!loadingMore && hasMore && paginationToken) {
      loadContractors(false);
    }
  };

  const handleCreateContractor = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      setValidationErrors([]);
      
      // Validate form
      const errors = validateCreateContractorRequest(createForm);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      await adminApi.createContractor(createForm);
      setCreateDialogOpen(false);
      setCreateForm({
        email: '',
        displayName: '',
        givenName: '',
        familyName: '',
        phoneNumber: '',
      });
      loadContractors(); // Refresh the list
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create contractor');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateFormChange = (field: keyof CreateContractorRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Contractors
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Contractor
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No contractors found. Create your first contractor to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contractors.map((contractor) => (
                  <TableRow key={contractor.cognitoSub}>
                    <TableCell>
                      {contractor.displayName || 
                       `${contractor.givenName || ''} ${contractor.familyName || ''}`.trim() || 
                       contractor.username}
                    </TableCell>
                    <TableCell>{contractor.email || 'N/A'}</TableCell>
                    <TableCell>{contractor.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={contractor.enabled ? 'success.main' : 'error.main'}
                      >
                        {contractor.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(contractor.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Load More Button */}
        {hasMore && !loading && contractors.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={loadMoreContractors}
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={16} /> : undefined}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}

        {/* Create Contractor Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Contractor</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {createError && (
                <Alert severity="error">
                  {createError}
                </Alert>
              )}
              <TextField
                label="Email"
                type="email"
                value={createForm.email}
                onChange={handleCreateFormChange('email')}
                fullWidth
                required
                error={!!getContractorFieldError(validationErrors, 'email')}
                helperText={getContractorFieldError(validationErrors, 'email')}
              />
              <TextField
                label="Display Name"
                value={createForm.displayName}
                onChange={handleCreateFormChange('displayName')}
                fullWidth
                required
                error={!!getContractorFieldError(validationErrors, 'displayName')}
                helperText={getContractorFieldError(validationErrors, 'displayName')}
              />
              <TextField
                label="Given Name"
                value={createForm.givenName}
                onChange={handleCreateFormChange('givenName')}
                fullWidth
                required
                error={!!getContractorFieldError(validationErrors, 'givenName')}
                helperText={getContractorFieldError(validationErrors, 'givenName')}
              />
              <TextField
                label="Family Name"
                value={createForm.familyName}
                onChange={handleCreateFormChange('familyName')}
                fullWidth
                required
                error={!!getContractorFieldError(validationErrors, 'familyName')}
                helperText={getContractorFieldError(validationErrors, 'familyName')}
              />
              <TextField
                label="Phone Number"
                value={createForm.phoneNumber}
                onChange={handleCreateFormChange('phoneNumber')}
                fullWidth
                required
                placeholder="+61400111222"
                error={!!getContractorFieldError(validationErrors, 'phoneNumber')}
                helperText={getContractorFieldError(validationErrors, 'phoneNumber') || 'International format (e.g., +61400111222)'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateContractor}
              variant="contained"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Contractor'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
