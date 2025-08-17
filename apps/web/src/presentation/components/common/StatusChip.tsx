import React from 'react';
import { Chip, ChipProps } from '@mui/material';

export interface StatusChipProps extends Omit<ChipProps, 'color'> {
  status: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  variant = 'filled',
  size = 'small',
  ...chipProps
}) => {
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase();
    
    switch (lowerStatus) {
      // Survey statuses
      case 'active':
      case 'activa':
        return { color: 'success' as const, label: 'Activa', icon: '🟢' };
      case 'draft':
      case 'borrador':
        return { color: 'warning' as const, label: 'Borrador', icon: '🟡' };
      case 'completed':
      case 'completada':
        return { color: 'info' as const, label: 'Completada', icon: '🔵' };
      case 'paused':
      case 'pausada':
        return { color: 'default' as const, label: 'Pausada', icon: '⚪' };
      case 'archived':
      case 'archivada':
        return { color: 'default' as const, label: 'Archivada', icon: '⚫' };
      case 'scheduled':
      case 'programada':
        return { color: 'primary' as const, label: 'Programada', icon: '📅' };
      
      // Suggestion statuses
      case 'pending':
      case 'pendiente':
        return { color: 'warning' as const, label: 'Pendiente', icon: '🟡' };
      case 'approved':
      case 'aprobada':
        return { color: 'success' as const, label: 'Aprobada', icon: '🟢' };
      case 'in_progress':
      case 'en_progreso':
        return { color: 'primary' as const, label: 'En Progreso', icon: '🔵' };
      case 'rejected':
      case 'rechazada':
        return { color: 'error' as const, label: 'Rechazada', icon: '🔴' };
      case 'implemented':
      case 'implementada':
        return { color: 'success' as const, label: 'Implementada', icon: '✅' };
      
      // User statuses (consolidated with survey statuses)
      case 'inactive':
      case 'inactivo':
        return { color: 'error' as const, label: 'Inactivo', icon: '🔴' };
      
      // Default
      default:
        return { color: 'default' as const, label: status, icon: '❓' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={variant}
      size={size}
      icon={<span>{config.icon}</span>}
      sx={{
        fontWeight: 500,
        '& .MuiChip-icon': {
          fontSize: '0.875rem'
        }
      }}
      {...chipProps}
    />
  );
};
