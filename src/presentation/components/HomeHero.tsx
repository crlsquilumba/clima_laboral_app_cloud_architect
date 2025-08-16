import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

interface HomeHeroProps {
  onCreateSurvey: () => void;
  onViewReports: () => void;
  onManageEmployees: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onCreateSurvey,
  onViewReports,
  onManageEmployees
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        p: 4,
        borderRadius: 3,
        mb: 4
      }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Bienvenido al Sistema de Clima Laboral
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Gestiona el bienestar de tu equipo con herramientas inteligentes y análisis en tiempo real
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onCreateSurvey}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Crear Encuesta con IA
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<AssessmentIcon />}
              onClick={onViewReports}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Ver Reportes
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<TrendingUpIcon />}
              onClick={onManageEmployees}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Gestionar Empleados
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
                mb: 2
              }}
            >
              <AssessmentIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Sistema Inteligente
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Powered by AI
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
