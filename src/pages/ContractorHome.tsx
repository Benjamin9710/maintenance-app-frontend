import { Typography, Box, Paper } from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';

export function ContractorHome() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <EngineeringIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Contractor Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the Contractor portal. This is a placeholder page.
        </Typography>
      </Paper>
    </Box>
  );
}
