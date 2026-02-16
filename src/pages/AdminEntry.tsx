import { useEffect } from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { signInWithRedirect } from 'aws-amplify/auth';
import { configureAmplifyForPersona } from '../lib/auth';

export function AdminEntry() {
  useEffect(() => {
    // Set the persona in localStorage before Amplify configuration
    localStorage.setItem('authPersona', 'admin');
    configureAmplifyForPersona('admin');
  }, []);

  const handleAdminSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error('Admin sign-in error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        gap={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Administrator Access
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Sign in with administrator credentials to access the admin dashboard.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={handleAdminSignIn}
          sx={{ minWidth: 200 }}
        >
          Sign in as Admin
        </Button>
      </Box>
    </Container>
  );
}
