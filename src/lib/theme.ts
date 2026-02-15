import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1B3A4B',
      light: '#2D5F7A',
      dark: '#0F2330',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E07A2F',
      light: '#F5A623',
      dark: '#B85E1A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2B3C',
      secondary: '#5A6B7C',
    },
    divider: '#E0E6ED',
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    info: { main: '#0288D1' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500, color: '#5A6B7C' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
        containedPrimary: {
          boxShadow: '0 2px 8px rgba(27,58,75,0.18)',
          '&:hover': { boxShadow: '0 4px 16px rgba(27,58,75,0.24)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});
