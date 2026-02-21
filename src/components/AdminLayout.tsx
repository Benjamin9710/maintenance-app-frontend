import { Outlet, Link, useLocation } from 'react-router-dom';
import { Box, Tabs, Tab } from '@mui/material';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const getTabValue = () => {
    if (location.pathname === '/admin/managers') {
      return 1;
    }
    if (location.pathname === '/admin/contractors') {
      return 2;
    }
    return 0; // Default to dashboard
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={getTabValue()} aria-label="Admin navigation tabs">
          <Tab 
            label="Dashboard" 
            component={Link} 
            to="/admin/dashboard" 
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Managers" 
            component={Link} 
            to="/admin/managers" 
            sx={{ textTransform: 'none' }}
          />
          <Tab 
            label="Contractors" 
            component={Link} 
            to="/admin/contractors" 
            sx={{ textTransform: 'none' }}
          />
        </Tabs>
      </Box>
      {children || <Outlet />}
    </Box>
  );
}
