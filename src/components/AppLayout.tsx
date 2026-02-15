import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 'calc(100vh - 64px)',
        bgcolor: 'background.default',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 4 },
      }}
    >
      {children}
    </Box>
  );
}
