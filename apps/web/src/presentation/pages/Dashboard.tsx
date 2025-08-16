import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Avatar,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Create as CreateIcon,
  People as PeopleIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { CreateSurveyModal } from '../components/CreateSurveyModal';
import { SurveyReport } from '../components/SurveyReport';
import { LocalSurveyRepository } from '@/infrastructure/storage/LocalSurveyRepository';
import { Survey, SurveyResponse } from '@/core/entities/Survey';

export const Dashboard: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [showReport, setShowReport] = useState(false);

  const surveyRepository = new LocalSurveyRepository();

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const allSurveys = await surveyRepository.getAllSurveys();
      if (allSurveys.length === 0) {
        // Load demo data if no surveys exist
        const demoSurveys = surveyRepository.getDemoData();
        setSurveys(demoSurveys);
      } else {
        setSurveys(allSurveys);
      }
    } catch (error) {
      console.error('Error loading surveys:', error);
    }
  };

  const handleSurveyCreated = async (survey: Survey) => {
    setSurveys(prev => [survey, ...prev]);
    setModalOpen(false);
  };

  const handleViewReport = async (survey: Survey) => {
    setSelectedSurvey(survey);
    try {
      const surveyResponses = await surveyRepository.getSurveyResponses(survey.id);
      setResponses(surveyResponses);
      setShowReport(true);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setSelectedSurvey(null);
    setResponses([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'draft': return 'warning';
      case 'completed': return 'info';
      case 'paused': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'draft': return 'Borrador';
      case 'completed': return 'Completada';
      case 'paused': return 'Pausada';
      default: return status;
    }
  };

  if (showReport && selectedSurvey) {
    return (
      <Box>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Button onClick={handleCloseReport} startIcon={<AssignmentIcon />}>
            Volver al Dashboard
          </Button>
        </Box>
        <SurveyReport survey={selectedSurvey} responses={responses} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
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
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText primary="Encuestas" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Empleados" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard de Clima Laboral
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestiona encuestas y analiza el clima laboral de tu organización
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Crear Nueva Encuesta
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Utiliza IA para generar encuestas personalizadas
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setModalOpen(true)}
                    fullWidth
                  >
                    Crear con IA
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Encuestas Activas
                  </Typography>
                  <Typography variant="h3" color="primary">
                    {surveys.filter(s => s.status === 'active').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Encuestas en curso
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Respuestas
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {surveys.reduce((total, s) => total + s.responsesCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Respuestas recibidas
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Surveys List */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Encuestas Recientes
              </Typography>
              
              {surveys.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No hay encuestas creadas. ¡Crea tu primera encuesta con IA!
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {surveys.map((survey) => (
                    <Grid item xs={12} key={survey.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>
                                {survey.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {survey.description}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Chip
                                label={getStatusLabel(survey.status)}
                                color={getStatusColor(survey.status) as any}
                                size="small"
                              />
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Typography variant="body2">
                                <strong>{survey.questions.length}</strong> preguntas
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {survey.responsesCount} respuestas
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={2}>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleViewReport(survey)}
                                startIcon={<TrendingUpIcon />}
                              >
                                Ver Reporte
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
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
