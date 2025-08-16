import React from 'react';
import { Grid } from '@mui/material';
import {
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { MetricCard } from './common/MetricCard';

interface MetricsCardsProps {
  totalEmployees: number;
  activeSurveys: number;
  responseRate: number;
  satisfactionScore: number;
  pendingSuggestions: number;
  upcomingSurveys: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  totalEmployees,
  activeSurveys,
  responseRate,
  satisfactionScore,
  pendingSuggestions,
  upcomingSurveys
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Total Empleados"
          value={totalEmployees}
          subtitle="Personal activo en la organización"
          icon={<PeopleIcon />}
          color="primary"
          trend="up"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Encuestas Activas"
          value={activeSurveys}
          subtitle="Encuestas en curso de recolección"
          icon={<AssessmentIcon />}
          color="secondary"
          trend="stable"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Tasa de Respuesta"
          value={`${responseRate}%`}
          subtitle="Participación en encuestas"
          icon={<TrendingUpIcon />}
          color="success"
          progress={responseRate}
          trend="up"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Satisfacción General"
          value={`${satisfactionScore}/10`}
          subtitle="Puntuación promedio del clima laboral"
          icon={<CheckCircleIcon />}
          color="info"
          progress={satisfactionScore * 10}
          trend="up"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Sugerencias Pendientes"
          value={pendingSuggestions}
          subtitle="Ideas de mejora por revisar"
          icon={<WarningIcon />}
          color="warning"
          trend="down"
        />
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <MetricCard
          title="Próximas Encuestas"
          value={upcomingSurveys}
          subtitle="Programadas para las próximas semanas"
          icon={<ScheduleIcon />}
          color="error"
          trend="stable"
        />
      </Grid>
    </Grid>
  );
};
