import { useEffect, useState } from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { signInWithRedirect, signOut, getCurrentUser } from 'aws-amplify/auth';
import { configureAmplifyForPersona } from '../lib/auth';

export function AdminEntry() {
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Set the persona in localStorage before Amplify configuration
    localStorage.setItem('authPersona', 'admin');
    configureAmplifyForPersona('admin');
  }, []);

  const handleAdminSignIn = async () => {
    if (isSigningIn) return; // Prevent multiple clicks
    
    try {
      setIsSigningIn(true);
      
      // Check if there's an existing authenticated user and sign them out first
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          await signOut();
          // Give a brief moment for sign-out to complete
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch {
        // No user authenticated, continue with sign-in
      }
      
      await signInWithRedirect();
    } catch (error) {
      console.error('Admin sign-in error:', error);
      setIsSigningIn(false);
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
          disabled={isSigningIn}
          sx={{ minWidth: 200 }}
        >
          {isSigningIn ? 'Signing in...' : 'Sign in as Admin'}
        </Button>
      </Box>
    </Container>
  );
}
