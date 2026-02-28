import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Archive as ArchiveIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { ManagerSummary, Property, CreatePropertyRequest, UpdatePropertyRequest, PaginatedProperties, ListPropertiesOptions } from '../types/admin';
import { validateCreatePropertyRequest, validateUpdatePropertyRequest, getPropertyFieldError, ValidationError } from '../lib/validation';
import { formatDate } from '../lib/dateUtils';

// Australian states and territories
const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' },
];

// Australian timezones
const AUSTRALIAN_TIMEZONES = [
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEDT/AEST)' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
  { value: 'Australia/Adelaide', label: 'Adelaide (ACDT/ACST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Australia/Hobart', label: 'Hobart (AEDT/AEST)' },
  { value: 'Australia/Darwin', label: 'Darwin (ACST)' },
  { value: 'Australia/Canberra', label: 'Canberra (AEDT/AEST)' },
];

interface AdminPropertiesProps {
  manager?: ManagerSummary;
}

export function AdminProperties({ manager: propManager }: AdminPropertiesProps) {
  const { managerSub } = useParams<{ managerSub: string }>();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationToken, setPaginationToken] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [manager] = useState<ManagerSummary | undefined>(propManager);
  
  // Create property dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreatePropertyRequest>({
    name: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    state: '',
    postcode: '',
    country: 'AU',
    timezone: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  // Edit property dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<UpdatePropertyRequest>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editValidationErrors, setEditValidationErrors] = useState<ValidationError[]>([]);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const targetManagerSub = managerSub || manager?.cognitoSub;

  // Memoized manager name resolution
  const resolvedManagerName = React.useMemo(() => {
    if (manager?.displayName) return manager.displayName;
    const fullName = `${manager?.givenName || ''} ${manager?.familyName || ''}`.trim();
    if (fullName) return fullName;
    if (manager?.username) return manager.username;
    return 'Unknown Manager';
  }, [manager]);

  useEffect(() => {
    if (targetManagerSub) {
      loadProperties();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetManagerSub]);

  const loadProperties = useCallback(async (reset = true) => {
    if (!targetManagerSub) {
      setError('Manager ID not found');
      return;
    }
    
    try {
      if (reset) {
        setLoading(true);
        setError(null);
        setProperties([]);
        setPaginationToken(undefined);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }
      
      const options: ListPropertiesOptions = reset ? {} : { paginationToken, limit: 20 };
      const data: PaginatedProperties = await adminApi.getManagerProperties(targetManagerSub, options);
      
      if (reset) {
        setProperties(data.properties);
      } else {
        setProperties(prev => [...prev, ...data.properties]);
      }
      
      setPaginationToken(data.paginationToken);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [targetManagerSub, paginationToken]);

  const loadMoreProperties = React.useCallback(() => {
    if (!loadingMore && hasMore && paginationToken && targetManagerSub) {
      loadProperties(false);
    }
  }, [loadingMore, hasMore, paginationToken, targetManagerSub, loadProperties]);

  const handleCreateProperty = useCallback(async () => {
    if (!targetManagerSub) return;
    
    try {
      setCreateLoading(true);
      setCreateError(null);
      setValidationErrors([]);
      
      // Validate form
      const errors = validateCreatePropertyRequest(createForm);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      await adminApi.createProperty(targetManagerSub, createForm);
      setCreateDialogOpen(false);
      setCreateForm({
        name: '',
        addressLine1: '',
        addressLine2: '',
        suburb: '',
        state: '',
        postcode: '',
        country: 'AU',
        timezone: '',
      });
      loadProperties(); // Refresh the list
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setCreateLoading(false);
    }
  }, [targetManagerSub, createForm, loadProperties]);

  const handleCreateFormChange = useCallback((field: keyof CreatePropertyRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleEditProperty = useCallback(async () => {
    if (!editingProperty) return;
    
    try {
      setEditLoading(true);
      setEditError(null);
      setEditValidationErrors([]);
      
      // Validate form using update validation (allows partial updates)
      const errors = validateUpdatePropertyRequest(editForm);
      if (errors.length > 0) {
        setEditValidationErrors(errors);
        return;
      }

      await adminApi.updateProperty(editingProperty.id, editForm);
      setEditDialogOpen(false);
      setEditingProperty(null);
      setEditForm({});
      loadProperties(); // Refresh the list
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update property');
    } finally {
      setEditLoading(false);
    }
  }, [editingProperty, editForm, loadProperties]);

  const handleEditFormChange = useCallback((field: keyof UpdatePropertyRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEditForm(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  }, []);

  const handleArchiveProperty = useCallback(async () => {
    if (!selectedProperty) return;
    
    try {
      await adminApi.archiveProperty(selectedProperty.id);
      loadProperties(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive property');
    } finally {
      // Close menu inline to avoid circular dependency
      setAnchorEl(null);
      setSelectedProperty(null);
    }
  }, [selectedProperty, loadProperties]);

  const openEditDialog = useCallback((property: Property) => {
    setEditingProperty(property);
    setEditForm({
      name: property.name,
      addressLine1: property.addressLine1,
      addressLine2: property.addressLine2 || '',
      suburb: property.suburb,
      state: property.state,
      postcode: property.postcode,
      country: property.country,
      timezone: property.timezone || '',
    });
    setEditDialogOpen(true);
    // Close menu inline to avoid circular dependency
    setAnchorEl(null);
    setSelectedProperty(null);
  }, []);

  const handleMenuClick = useCallback((event: React.MouseEvent<HTMLElement>, property: Property) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  }, []);


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
            Properties - {resolvedManagerName}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            disabled={!targetManagerSub}
          >
            Create Property
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
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                      No properties found. Create your first property to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {property.addressLine1}
                        {property.addressLine2 && <br />}
                        {property.addressLine2 && `${property.addressLine2}, `}
                        {!property.addressLine2 && `, `}
                        {property.suburb} {property.state} {property.postcode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={property.archivedAt ? 'Archived' : 'Active'}
                        color={property.archivedAt ? 'default' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDate(property.createdAt)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuClick(e, property)}
                        disabled={!!property.archivedAt}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Load More Button */}
        {hasMore && !loading && properties.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={loadMoreProperties}
              disabled={loadingMore}
              startIcon={loadingMore ? <CircularProgress size={16} /> : undefined}
            >
              {loadingMore ? 'Loading...' : 'Load More'}
            </Button>
          </Box>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => {
            setAnchorEl(null);
            setSelectedProperty(null);
          }}
        >
          <MenuItem onClick={() => selectedProperty && openEditDialog(selectedProperty)}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleArchiveProperty}>
            <ArchiveIcon sx={{ mr: 1 }} />
            Archive
          </MenuItem>
        </Menu>

        {/* Create Property Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Property</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {createError && (
                <Alert severity="error">
                  {createError}
                </Alert>
              )}
              <TextField
                label="Property Name"
                value={createForm.name}
                onChange={handleCreateFormChange('name')}
                fullWidth
                required
                error={!!getPropertyFieldError(validationErrors, 'name')}
                helperText={getPropertyFieldError(validationErrors, 'name')}
              />
              <TextField
                label="Address Line 1"
                value={createForm.addressLine1}
                onChange={handleCreateFormChange('addressLine1')}
                fullWidth
                required
                error={!!getPropertyFieldError(validationErrors, 'addressLine1')}
                helperText={getPropertyFieldError(validationErrors, 'addressLine1')}
              />
              <TextField
                label="Address Line 2"
                value={createForm.addressLine2}
                onChange={handleCreateFormChange('addressLine2')}
                fullWidth
                error={!!getPropertyFieldError(validationErrors, 'addressLine2')}
                helperText={getPropertyFieldError(validationErrors, 'addressLine2')}
              />
              <TextField
                label="Suburb"
                value={createForm.suburb}
                onChange={handleCreateFormChange('suburb')}
                fullWidth
                required
                error={!!getPropertyFieldError(validationErrors, 'suburb')}
                helperText={getPropertyFieldError(validationErrors, 'suburb')}
              />
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  value={createForm.state}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, state: e.target.value }))}
                  label="State"
                  error={!!getPropertyFieldError(validationErrors, 'state')}
                >
                  {AUSTRALIAN_STATES.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Postcode"
                value={createForm.postcode}
                onChange={handleCreateFormChange('postcode')}
                fullWidth
                required
                error={!!getPropertyFieldError(validationErrors, 'postcode')}
                helperText={getPropertyFieldError(validationErrors, 'postcode')}
              />
              <TextField
                label="Country"
                value="Australia"
                fullWidth
                required
                disabled
                helperText="Australia only"
              />
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={createForm.timezone || ''}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, timezone: e.target.value }))}
                  label="Timezone"
                >
                  {AUSTRALIAN_TIMEZONES.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateProperty}
              variant="contained"
              disabled={createLoading}
            >
              {createLoading ? 'Creating...' : 'Create Property'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Property Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              {editError && (
                <Alert severity="error">
                  {editError}
                </Alert>
              )}
              <TextField
                label="Property Name"
                value={editForm.name || ''}
                onChange={handleEditFormChange('name')}
                fullWidth
                required
                error={!!getPropertyFieldError(editValidationErrors, 'name')}
                helperText={getPropertyFieldError(editValidationErrors, 'name')}
              />
              <TextField
                label="Address Line 1"
                value={editForm.addressLine1 || ''}
                onChange={handleEditFormChange('addressLine1')}
                fullWidth
                required
                error={!!getPropertyFieldError(editValidationErrors, 'addressLine1')}
                helperText={getPropertyFieldError(editValidationErrors, 'addressLine1')}
              />
              <TextField
                label="Address Line 2"
                value={editForm.addressLine2 || ''}
                onChange={handleEditFormChange('addressLine2')}
                fullWidth
                error={!!getPropertyFieldError(editValidationErrors, 'addressLine2')}
                helperText={getPropertyFieldError(editValidationErrors, 'addressLine2')}
              />
              <TextField
                label="Suburb"
                value={editForm.suburb || ''}
                onChange={handleEditFormChange('suburb')}
                fullWidth
                required
                error={!!getPropertyFieldError(editValidationErrors, 'suburb')}
                helperText={getPropertyFieldError(editValidationErrors, 'suburb')}
              />
              <FormControl fullWidth required>
                <InputLabel>State</InputLabel>
                <Select
                  value={editForm.state || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                  label="State"
                  error={!!getPropertyFieldError(editValidationErrors, 'state')}
                >
                  {AUSTRALIAN_STATES.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Postcode"
                value={editForm.postcode || ''}
                onChange={handleEditFormChange('postcode')}
                fullWidth
                required
                error={!!getPropertyFieldError(editValidationErrors, 'postcode')}
                helperText={getPropertyFieldError(editValidationErrors, 'postcode')}
              />
              <TextField
                label="Country"
                value="Australia"
                fullWidth
                required
                disabled
                helperText="Australia only"
              />
              <FormControl fullWidth>
                <InputLabel>Timezone</InputLabel>
                <Select
                  value={editForm.timezone || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, timezone: e.target.value }))}
                  label="Timezone"
                >
                  {AUSTRALIAN_TIMEZONES.map((tz) => (
                    <MenuItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditProperty}
              variant="contained"
              disabled={editLoading}
            >
              {editLoading ? 'Updating...' : 'Update Property'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
