import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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
  Lightbulb as LightbulbIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { CreateSurveyModal } from '../components/CreateSurveyModal';
import { SurveyViewModal } from '../components/SurveyViewModal';

export const SurveyManagement: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [surveys, setSurveys] = useState([
    {
      id: '1',
      title: 'Satisfacción Laboral Q1 2024',
      status: 'active',
      audience: 'Todos',
      createdAt: '2024-01-15',
      scheduledDate: '2024-01-15T09:00',
      responses: 45,
      target: 50,
      description: 'Encuesta trimestral de satisfacción laboral'
    },
    {
      id: '2',
      title: 'Clima de Equipo IT',
      status: 'draft',
      audience: 'IT',
      createdAt: '2024-01-20',
      scheduledDate: null,
      responses: 0,
      target: 15,
      description: 'Evaluación del clima laboral del equipo de IT'
    },
    {
      id: '3',
      title: 'Retroalimentación Gerencial',
      status: 'completed',
      audience: 'Gerentes',
      createdAt: '2024-01-10',
      scheduledDate: '2024-01-10T14:00',
      responses: 12,
      target: 12,
      description: 'Encuesta de retroalimentación para gerentes'
    }
  ]);

  // Función para determinar estado según fecha
  const getStatusFromDate = (scheduledDate: string | null) => {
    if (!scheduledDate) return 'draft';
    const scheduled = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    scheduled.setHours(0, 0, 0, 0);
    if (scheduled < today) return 'invalid';
    if (scheduled.getTime() === today.getTime()) return 'sent';
    if (scheduled > today) return 'scheduled';
    return 'draft';
  };

  const handleSurveySaved = (survey: any) => {
    setModalOpen(false);
    const scheduledDate = new Date(survey.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduledDate < today) {
      alert('❌ ERROR: La fecha de envío no puede ser anterior a hoy');
      return;
    }

    let automaticStatus = 'draft';
    const scheduledDateOnly = new Date(survey.scheduledDate);
    scheduledDateOnly.setHours(0, 0, 0, 0);

    if (scheduledDateOnly.getTime() === today.getTime()) {
      automaticStatus = 'sent';
    } else if (scheduledDateOnly > today) {
      automaticStatus = 'scheduled';
    }

    const newSurvey = {
      id: Date.now().toString(),
      title: survey.title,
      status: automaticStatus, // Automatic status
      audience: survey.targetAudience || 'Todos',
      createdAt: new Date().toISOString().split('T')[0],
      scheduledDate: survey.scheduledDate, // Added scheduledDate
      responses: 0,
      target: survey.target || 0,
      description: survey.description || 'Sin descripción'
    };

    const existingIndex = surveys.findIndex(s => s.id === survey.id);
    let updatedSurveys;
    if (existingIndex >= 0) {
      updatedSurveys = [...surveys];
      updatedSurveys[existingIndex] = newSurvey;
    } else {
      updatedSurveys = [newSurvey, ...surveys].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    setSurveys(updatedSurveys);
    alert(`✅ Encuesta "${survey.title}" creada exitosamente con estado: ${automaticStatus === 'sent' ? 'Enviado' : automaticStatus === 'scheduled' ? 'Programado' : 'Borrador'}!`);
  };

  const handleEdit = (survey: any) => {
    setSelectedSurvey(survey);
    if (survey.status === 'draft') {
      setModalOpen(true); // Abrir modal de edición
    } else {
      setViewModalOpen(true); // Abrir modal de visualización
    }
  };

  const handleNewSurvey = () => {
    setModalOpen(true);
  };

  const handleNavigation = (route: string) => {
    // Aquí puedes agregar navegación real cuando implementes react-router
    console.log('Navegando a:', route);
    if (route === 'home') {
      // Navegar a Home
      window.location.href = '/';
    }
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
            overflowX: 'hidden'
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => handleNavigation('home')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Home" />}
            </ListItem>
            <ListItem button selected>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Encuestas" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation('employees')}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Empleados" />}
            </ListItem>
            <ListItem button onClick={() => handleNavigation('suggestions')}>
              <ListItemIcon>
                <LightbulbIcon />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Sugerencias" />}
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigation('settings')}>
              <ListItemIcon>
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
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Gestión de Encuestas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNewSurvey}
            sx={{ fontWeight: 'bold' }}
          >
            Nueva Encuesta
          </Button>
        </Box>

        {/* Metrics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">{surveys.length}</Typography>
            <Typography variant="body2">Total</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {surveys.filter(s => s.status === 'active').length}
            </Typography>
            <Typography variant="body2">Activas</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {surveys.filter(s => s.status === 'draft').length}
            </Typography>
            <Typography variant="body2">Borrador</Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              {surveys.filter(s => s.status === 'scheduled').length}
            </Typography>
            <Typography variant="body2">Programadas</Typography>
          </Paper>
        </Box>

        {/* Surveys Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Título</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Audiencia</strong></TableCell>
                  <TableCell><strong>Fecha Creación</strong></TableCell>
                  <TableCell><strong>Fecha Programada</strong></TableCell>
                  <TableCell><strong>Respuestas</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow
                    key={survey.id}
                    hover
                    onClick={() => handleEdit(survey)}
                    sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                  >
                    <TableCell>{survey.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={survey.status === 'active' ? 'Activa' :
                               survey.status === 'draft' ? 'Borrador' :
                               survey.status === 'completed' ? 'Completada' :
                               survey.status === 'paused' ? 'Pausada' :
                               survey.status === 'scheduled' ? 'Programada' :
                               survey.status === 'sent' ? 'Enviado' : survey.status}
                        color={survey.status === 'active' ? 'success' :
                               survey.status === 'draft' ? 'warning' :
                               survey.status === 'completed' ? 'info' :
                               survey.status === 'paused' ? 'default' :
                               survey.status === 'scheduled' ? 'primary' :
                               survey.status === 'sent' ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{survey.audience}</TableCell>
                    <TableCell>{survey.createdAt}</TableCell>
                    <TableCell>
                      {survey.scheduledDate ?
                        new Date(survey.scheduledDate).toLocaleDateString() :
                        'No programada'
                      }
                    </TableCell>
                    <TableCell>{survey.responses}/{survey.target}</TableCell>
                    <TableCell>
                      {/* Acciones condicionales según estado */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {survey.status === 'draft' ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(survey);
                            }}
                            sx={{ fontWeight: 'bold' }}
                          >
                            EDITAR
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(survey);
                            }}
                            sx={{ fontWeight: 'bold' }}
                          >
                            VISUALIZAR
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Create Survey Modal */}
        <CreateSurveyModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSurveyCreated={handleSurveySaved}
        />

        {/* View Survey Modal */}
        <SurveyViewModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          survey={selectedSurvey}
        />
      </Box>
    </Box>
  );
};
