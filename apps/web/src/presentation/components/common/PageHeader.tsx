import React from 'react';
import {
  Box,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onBack?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onHelp?: () => void;
  showDivider?: boolean;
  sx?: any;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBack,
  onRefresh,
  onSettings,
  onHelp,
  showDivider = true,
  sx
}) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) => (
            <Link
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              href={item.href}
              onClick={item.onClick}
              underline="hover"
              sx={{ cursor: item.onClick ? 'pointer' : 'default' }}
            >
              {item.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}

      {/* Header Content */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          {/* Back Button */}
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{ mr: 1, mb: 1 }}
              size="small"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          
          {/* Title and Subtitle */}
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onRefresh && (
            <Tooltip title="Actualizar">
              <IconButton onClick={onRefresh} size="small">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onSettings && (
            <Tooltip title="Configuración">
              <IconButton onClick={onSettings} size="small">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {onHelp && (
            <Tooltip title="Ayuda">
              <IconButton onClick={onHelp} size="small">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {actions}
        </Box>
      </Box>

      {/* Divider */}
      {showDivider && <Divider />}
    </Box>
  );
};
