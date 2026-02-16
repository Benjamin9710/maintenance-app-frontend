import { Typography, Box, Container, Paper } from '@mui/material';

export function AdminDashboard() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Administrator Portal
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to the administrator dashboard. Admin features will be implemented here.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
