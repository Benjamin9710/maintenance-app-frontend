import { Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const { login, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          maxWidth: 440,
          width: '100%',
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <BuildIcon sx={{ fontSize: 32, color: 'white' }} />
        </Box>

        <Typography variant="h4" gutterBottom>
          Strata Maintenance
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}
        >
          Sign in to manage work orders, coordinate contractors,
          and track maintenance across your properties.
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={login}
          sx={{ py: 1.5, fontSize: '1rem' }}
        >
          Sign In
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 3 }}
        >
          Secure login powered by your organisation&apos;s identity provider
        </Typography>
      </Paper>
    </Box>
  );
}
