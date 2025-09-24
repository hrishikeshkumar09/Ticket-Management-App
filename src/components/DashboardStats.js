// src/components/DashboardStats.js
import React from 'react';
import { Grid, Paper, Box, Typography, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const StatCard = ({ title, value, icon, iconColor, valueColor }) => (
  <Grid item xs={12} sm={6} md={2.4}> {/* md={2.4} for 5 items in a row */}
    <Paper sx={{ p: 2, textAlign: 'center', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
        <Box sx={{ color: iconColor }}>{icon}</Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const DashboardStats = ({ stats }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        <StatCard
          title="Open Tickets"
          value={stats.open}
          icon={<ErrorOutlineIcon />}
          iconColor="status.open"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<AccessTimeIcon />}
          iconColor="status.inProgress"
        />
        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircleOutlineIcon />}
          iconColor="status.resolved"
        />
        <StatCard
          title="AI Assisted"
          value={stats.aiAssisted}
          icon={<FlashOnIcon />}
          iconColor="status.aiAssisted"
        />
        <StatCard
          title="AI Costs"
          value={`$${stats.aiCosts.toFixed(3)}`}
          icon={<AttachMoneyIcon />}
          iconColor="status.aiCosts"
          valueColor="status.aiCosts"
        />
      </Grid>
    </Box>
  );
};

export default DashboardStats;