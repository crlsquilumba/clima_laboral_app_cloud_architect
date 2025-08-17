import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Mock data for recent activity
const recentSurveys = [
  {
    id: 1,
    title: 'Encuesta de Satisfacción Q2 2024',
    status: 'active',
    responses: 45,
    target: 78,
    createdAt: '2024-06-15',
    creator: 'Ana García'
  },
  {
    id: 2,
    title: 'Evaluación del Clima Laboral',
    status: 'draft',
    responses: 0,
    target: 78,
    createdAt: '2024-06-14',
    creator: 'Carlos López'
  },
  {
    id: 3,
    title: 'Feedback sobre Nuevas Políticas',
    status: 'completed',
    responses: 78,
    target: 78,
    createdAt: '2024-06-10',
    creator: 'María Rodríguez'
  }
];

const recentSuggestions = [
  {
    id: 1,
    title: 'Mejora del sistema de ventilación',
    status: 'pending',
    department: 'IT',
    employee: 'Juan Pérez',
    createdAt: '2024-06-16'
  },
  {
    id: 2,
    title: 'Implementar horario flexible',
    status: 'approved',
    department: 'RRHH',
    employee: 'Laura Martínez',
    createdAt: '2024-06-15'
  },
  {
    id: 3,
    title: 'Actualizar equipos de oficina',
    status: 'in_progress',
    department: 'Administración',
    employee: 'Roberto Silva',
    createdAt: '2024-06-14'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'draft': return 'warning';
    case 'completed': return 'info';
    case 'pending': return 'warning';
    case 'approved': return 'success';
    case 'in_progress': return 'primary';
    default: return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Activa';
    case 'draft': return 'Borrador';
    case 'completed': return 'Completada';
    case 'pending': return 'Pendiente';
    case 'approved': return 'Aprobada';
    case 'in_progress': return 'En Progreso';
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircleIcon />;
    case 'draft': return <ScheduleIcon />;
    case 'completed': return <TrendingUpIcon />;
    case 'pending': return <WarningIcon />;
    case 'approved': return <CheckCircleIcon />;
    case 'in_progress': return <TrendingUpIcon />;
    default: return <AssessmentIcon />;
  }
};

export const RecentActivity: React.FC = () => {
  return (
    <Grid container spacing={3}>
      {/* Recent Surveys */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                Encuestas Recientes
              </Typography>
            </Box>
            
            <List>
              {recentSurveys.map((survey, index) => (
                <React.Fragment key={survey.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {getStatusIcon(survey.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" component="span">
                            {survey.title}
                          </Typography>
                          <Chip
                            label={getStatusLabel(survey.status)}
                            size="small"
                            color={getStatusColor(survey.status) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Creada por {survey.creator} • {survey.createdAt}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Respuestas: {survey.responses}/{survey.target}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box
                                sx={{
                                  width: 60,
                                  height: 4,
                                  bgcolor: 'grey.200',
                                  borderRadius: 2,
                                  overflow: 'hidden'
                                }}
                              >
                                <Box
                                  sx={{
                                    width: `${(survey.responses / survey.target) * 100}%`,
                                    height: '100%',
                                    bgcolor: 'primary.main'
                                  }}
                                />
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {Math.round((survey.responses / survey.target) * 100)}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentSurveys.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Suggestions */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
              <Typography variant="h6">
                Sugerencias Recientes
              </Typography>
            </Box>
            
            <List>
              {recentSuggestions.map((suggestion, index) => (
                <React.Fragment key={suggestion.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.light' }}>
                        {getStatusIcon(suggestion.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" component="span">
                            {suggestion.title}
                          </Typography>
                          <Chip
                            label={getStatusLabel(suggestion.status)}
                            size="small"
                            color={getStatusColor(suggestion.status) as any}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Por {suggestion.employee} • {suggestion.createdAt}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Departamento: {suggestion.department}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < recentSuggestions.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
