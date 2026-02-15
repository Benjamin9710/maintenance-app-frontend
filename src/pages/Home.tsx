import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { apiFetch } from '../lib/http';

interface UserProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  given_name: string | null;
  family_name: string | null;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
        <Avatar
          sx={{
            bgcolor: color,
            width: 52,
            height: 52,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function QuickAction({ icon, title, description }: QuickActionProps) {
  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

interface RecentItem {
  id: string;
  title: string;
  property: string;
  status: 'open' | 'in_progress' | 'completed';
  date: string;
}

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'warning' as const },
  in_progress: { label: 'In Progress', color: 'info' as const },
  completed: { label: 'Completed', color: 'success' as const },
};

const PLACEHOLDER_RECENT: RecentItem[] = [
  { id: '1', title: 'Lift maintenance – annual inspection', property: '42 George St', status: 'in_progress', date: '12 Feb 2026' },
  { id: '2', title: 'Common area lighting replacement', property: '15 Harbour Ave', status: 'open', date: '10 Feb 2026' },
  { id: '3', title: 'Fire safety compliance check', property: '42 George St', status: 'completed', date: '8 Feb 2026' },
  { id: '4', title: 'Plumbing – Level 3 leak repair', property: '88 Pitt Rd', status: 'open', date: '7 Feb 2026' },
];

export function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const data = await apiFetch<UserProfile>(
          `${import.meta.env.VITE_API_BASE_URL}/me`,
          { auth: true },
        );
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load profile');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!profile) return null;

  const displayName =
    [profile.given_name, profile.family_name].filter(Boolean).join(' ') || null;

  return (
    <Container maxWidth="lg">
      {/* Welcome banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          background: 'linear-gradient(135deg, #1B3A4B 0%, #2D5F7A 100%)',
          color: 'white',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Welcome back{displayName ? `, ${displayName}` : ''}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.85 }}>
          {profile.email} &middot; Here&apos;s your maintenance overview for today.
        </Typography>
      </Paper>

      {/* Stat cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<AssignmentIcon />}
            label="Open Work Orders"
            value="12"
            color="#E07A2F"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<PendingActionsIcon />}
            label="Awaiting Approval"
            value="4"
            color="#0288D1"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<EngineeringIcon />}
            label="In Progress"
            value="7"
            color="#1B3A4B"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard
            icon={<CheckCircleOutlineIcon />}
            label="Completed (Month)"
            value="23"
            color="#2E7D32"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent work orders */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <Box
              sx={{
                px: 3,
                py: 2.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6">Recent Work Orders</Typography>
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
              >
                View All
              </Typography>
            </Box>

            {PLACEHOLDER_RECENT.map((item) => {
              const statusCfg = STATUS_CONFIG[item.status];
              return (
                <Box
                  key={item.id}
                  sx={{
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { bgcolor: 'action.hover' },
                    cursor: 'pointer',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.property}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={statusCfg.label}
                      color={statusCfg.color}
                      size="small"
                      variant="outlined"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', sm: 'block' }, whiteSpace: 'nowrap' }}
                    >
                      {item.date}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>

        {/* Quick actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <QuickAction
              icon={<AssignmentIcon />}
              title="New Work Order"
              description="Create a maintenance request for a property"
            />
            <QuickAction
              icon={<HomeWorkIcon />}
              title="Properties"
              description="View and manage your strata properties"
            />
            <QuickAction
              icon={<ScheduleIcon />}
              title="Schedule"
              description="View upcoming inspections and contractor visits"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
