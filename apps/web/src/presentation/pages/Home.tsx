import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Lightbulb as LightbulbIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { MetricsCards } from '../components/MetricsCards';
import { ChartsSection } from '../components/ChartsSection';
import { RecentActivity } from '../components/RecentActivity';
import { CreateSurveyModal } from '../components/CreateSurveyModal';

export const Home: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data for metrics
  const metricsData = {
    totalEmployees: 78,
    activeSurveys: 3,
    responseRate: 85,
    satisfactionScore: 8.5,
    pendingSuggestions: 12,
    upcomingSurveys: 2
  };

  const handleCreateSurvey = () => {
    setModalOpen(true);
  };

  const handleViewReports = () => {
    // Navigate to reports page
    console.log('Navigate to reports');
  };

  const handleManageEmployees = () => {
    // Navigate to employees page
    console.log('Navigate to employees');
  };

  const handleSurveyCreated = (survey: any) => {
    setModalOpen(false);
    // Handle survey creation
    console.log('Survey created:', survey);
  };

  const drawerWidth = drawerOpen ? 240 : 64;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clima Laboral - Asistente RRHH
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            // Forzar que solo se muestren los elementos que queremos
            '& *': {
              boxSizing: 'border-box'
            }
          },
        }}
      >
        <Toolbar />
        <Box sx={{ 
          overflow: 'auto',
          // Asegurar que no haya elementos extra
          '& > *': {
            display: 'block'
          }
        }}>
          <List sx={{ p: 0 }}>
            <ListItem button selected sx={{ minHeight: 48 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <DashboardIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Home" />}
            </ListItem>
            <ListItem button onClick={() => window.location.href = '/surveys'}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AssessmentIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Encuestas" />}
            </ListItem>
            <ListItem button sx={{ minHeight: 48 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PeopleIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Empleados" />}
            </ListItem>
            <ListItem button sx={{ minHeight: 48 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LightbulbIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Sugerencias" />}
            </ListItem>
          </List>
          <Divider />
          <List sx={{ p: 0 }}>
            <ListItem button sx={{ minHeight: 48 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <SettingsIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Configuración" />}
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        <Container maxWidth="xl">
          {/* Metrics Cards */}
          <MetricsCards {...metricsData} />

          {/* Charts Section */}
          <ChartsSection />

          {/* Recent Activity */}
          <RecentActivity />
        </Container>
      </Box>

      {/* Create Survey Modal */}
      <CreateSurveyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSurveyCreated={handleSurveyCreated}
      />
    </Box>
  );
};
