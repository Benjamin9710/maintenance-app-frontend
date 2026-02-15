import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';
import BuildIcon from '@mui/icons-material/Build';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        <BuildIcon sx={{ mr: 1.5, fontSize: 28 }} />
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Strata Maintenance
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              display: { xs: 'none', sm: 'block' },
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {user?.signInDetails?.loginId ?? ''}
          </Typography>

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 0.5 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'secondary.main',
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: { mt: 1, minWidth: 180 },
              },
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
