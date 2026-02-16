import { Typography, Box, Paper } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

export function ManagerHome() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <BusinessIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Manager Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the Manager portal. This is a placeholder page.
        </Typography>
      </Paper>
    </Box>
  );
}
