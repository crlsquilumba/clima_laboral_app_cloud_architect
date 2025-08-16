import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon
} from '@mui/icons-material';

// Mock data for charts
const satisfactionTrendData = [
  { month: 'Ene', satisfaccion: 7.2, participacion: 65 },
  { month: 'Feb', satisfaccion: 7.5, participacion: 72 },
  { month: 'Mar', satisfaccion: 7.8, participacion: 78 },
  { month: 'Abr', satisfaccion: 8.1, participacion: 82 },
  { month: 'May', satisfaccion: 8.3, participacion: 85 },
  { month: 'Jun', satisfaccion: 8.5, participacion: 88 }
];

const departmentData = [
  { name: 'IT', satisfaccion: 8.7, empleados: 25 },
  { name: 'Ventas', satisfaccion: 7.9, empleados: 18 },
  { name: 'Marketing', satisfaccion: 8.2, empleados: 12 },
  { name: 'RRHH', satisfaccion: 8.5, empleados: 8 },
  { name: 'Finanzas', satisfaccion: 7.8, empleados: 15 }
];

const surveyTypeData = [
  { name: 'Clima Laboral', value: 45, color: '#0088FE' },
  { name: 'Satisfacción', value: 30, color: '#00C49F' },
  { name: 'Compromiso', value: 15, color: '#FFBB28' },
  { name: 'Otros', value: 10, color: '#FF8042' }
];

export const ChartsSection: React.FC = () => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Satisfaction Trend Chart - Simplified */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tendencia de Satisfacción y Participación
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Evolución mensual del clima laboral
            </Typography>
            
            {/* Simplified chart representation */}
            <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
              {satisfactionTrendData.map((data, index) => (
                <Box key={data.month} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: `${(data.satisfaccion / 10) * 200}px`,
                      bgcolor: 'primary.main',
                      borderRadius: '4px 4px 0 0',
                      mb: 1,
                      position: 'relative'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: 'text.secondary'
                      }}
                    >
                      {data.satisfaccion}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {data.month}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'primary.main' }} />
                <Typography variant="caption">Satisfacción</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: 'secondary.main' }} />
                <Typography variant="caption">Participación</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Department Satisfaction - Simplified */}
      <Grid item xs={12} lg={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Satisfacción por Departamento
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comparativa entre áreas
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {departmentData.map((dept, index) => (
                <Box key={dept.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{dept.name}</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      {dept.satisfaccion}/10
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={dept.satisfaccion * 10}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {dept.empleados} empleados
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Survey Distribution - Simplified */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distribución de Tipos de Encuesta
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Proporción de encuestas por categoría
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              {surveyTypeData.map((survey, index) => (
                <Box key={survey.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{survey.name}</Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      {survey.value}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={survey.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: survey.color
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Stats */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estadísticas Rápidas
            </Typography>
            <Box sx={{ mt: 3 }}>
              {departmentData.map((dept, index) => (
                <Box
                  key={dept.name}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1,
                    borderBottom: index < departmentData.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body2">{dept.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="primary.main" fontWeight="bold">
                      {dept.satisfaccion}/10
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({dept.empleados} empleados)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
