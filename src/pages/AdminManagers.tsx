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
import { Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { ManagerSummary, CreateManagerRequest, PaginatedManagers } from '../types/admin';
import { validateCreateManagerRequest, getFieldError, ValidationError } from '../lib/validation';
import { formatDate } from '../lib/dateUtils';

export function AdminManagers() {
  const [managers, setManagers] = useState<ManagerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationToken, setPaginationToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateManagerRequest>({
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
    loadManagers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadManagers = async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
        setManagers([]);
        setPaginationToken(undefined);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const options = reset ? {} : { paginationToken, limit: 20 };
      const data: PaginatedManagers = await adminApi.getManagers(options);
      
      if (reset) {
        setManagers(data.managers);
      } else {
        setManagers(prev => [...prev, ...data.managers]);
      }
      
      setPaginationToken(data.paginationToken);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load managers');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const loadMoreManagers = () => {
    if (!loadingMore && hasMore && paginationToken) {
      loadManagers(false);
    }
  };

  const handleCreateManager = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);
      setValidationErrors([]);
      
      // Validate form
      const errors = validateCreateManagerRequest(createForm);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      await adminApi.createManager(createForm);
      setCreateDialogOpen(false);
      setCreateForm({
        email: '',
        displayName: '',
        givenName: '',
        familyName: '',
        phoneNumber: '',
      });
      loadManagers(); // Refresh the list
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create manager');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCreateFormChange = (field: keyof CreateManagerRequest) => (
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
            Managers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Manager
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
                <TableCell>Properties</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {managers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No managers found. Create your first manager to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                managers.map((manager) => (
                  <TableRow key={manager.cognitoSub}>
                    <TableCell>
                      {manager.displayName || 
                       `${manager.givenName || ''} ${manager.familyName || ''}`.trim() || 
                       manager.username}
                    </TableCell>
                    <TableCell>{manager.email || 'N/A'}</TableCell>
                    <TableCell>{manager.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color={manager.enabled ? 'success.main' : 'error.main'}
                      >
                        {manager.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {formatDate(manager.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<HomeIcon />}
                        component={Link}
                        to={`/admin/managers/${manager.cognitoSub}/properties`}
                      >
                        Manage Properties
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Load More Button */}
        {hasMore && !loading && managers.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={loadMoreManagers}
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={16} /> : undefined}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}

        {/* Create Manager Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Manager</DialogTitle>
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
                error={!!getFieldError(validationErrors, 'email')}
                helperText={getFieldError(validationErrors, 'email')}
              />
              <TextField
                label="Display Name"
                value={createForm.displayName}
                onChange={handleCreateFormChange('displayName')}
                fullWidth
                required
                error={!!getFieldError(validationErrors, 'displayName')}
                helperText={getFieldError(validationErrors, 'displayName')}
              />
              <TextField
                label="Given Name"
                value={createForm.givenName}
                onChange={handleCreateFormChange('givenName')}
                fullWidth
                required
                error={!!getFieldError(validationErrors, 'givenName')}
                helperText={getFieldError(validationErrors, 'givenName')}
              />
              <TextField
                label="Family Name"
                value={createForm.familyName}
                onChange={handleCreateFormChange('familyName')}
                fullWidth
                required
                error={!!getFieldError(validationErrors, 'familyName')}
                helperText={getFieldError(validationErrors, 'familyName')}
              />
              <TextField
                label="Phone Number"
                value={createForm.phoneNumber}
                onChange={handleCreateFormChange('phoneNumber')}
                fullWidth
                required
                placeholder="+61400111222"
                error={!!getFieldError(validationErrors, 'phoneNumber')}
                helperText={getFieldError(validationErrors, 'phoneNumber') || 'International format (e.g., +61400111222)'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateManager}
              variant="contained"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Manager'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
