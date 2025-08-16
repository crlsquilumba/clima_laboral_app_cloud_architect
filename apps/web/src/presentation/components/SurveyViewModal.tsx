import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Survey } from '../../core/entities/Survey';
import { StatusChip } from './common/StatusChip';

export interface SurveyViewModalProps {
  open: boolean;
  onClose: () => void;
  survey: Survey | null;
  onEdit?: (survey: Survey) => void;
  onActivate?: (survey: Survey) => void;
}

export const SurveyViewModal: React.FC<SurveyViewModalProps> = ({
  open,
  onClose,
  survey,
  onEdit,
  onActivate
}) => {
  // Debug logs
  console.log('🔍 SurveyViewModal render:', { open, survey: survey?.title });
  
  if (!survey) {
    console.log('❌ No survey provided');
    return null;
  }

  // Validar que las propiedades existan antes de usarlas
  const questions = survey.questions || [];
  const objective = survey.objective || 'No especificado';
  const targetAudience = survey.targetAudience || 'No especificado';
  const responses = survey.responses || 0;
  const target = survey.target || 0;
  const scheduledDate = survey.scheduledDate;
  const notificationMethods = survey.notificationMethods || [];

  const canEdit = survey.status === 'draft';
  const canActivate = survey.status === 'draft';

  console.log('✅ Modal should be visible:', { open, surveyTitle: survey.title, questionsCount: questions.length });

  const handleEdit = () => {
    if (onEdit && canEdit) {
      onEdit(survey);
    }
  };

  const handleActivate = () => {
    if (onActivate && canActivate) {
      onActivate(survey);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 9999 }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998
        }
      }}
      PaperProps={{
        sx: { 
          minHeight: '600px',
          zIndex: 9999,
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderBottom: '1px solid #dee2e6',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            📊 Vista de Encuesta
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{
              color: '#6c757d',
              '&:hover': {
                backgroundColor: 'rgba(108, 117, 125, 0.1)',
                color: '#495057'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Header de la Encuesta */}
        <Card sx={{ 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 4,
          border: '1px solid #e3f2fd',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Título de la Encuesta */}
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1a237e',
              mb: 3,
              textAlign: 'center'
            }}>
              {survey.title}
            </Typography>
            
            {/* Descripción */}
            {survey.description && (
              <Typography variant="body1" sx={{ 
                color: '#37474f',
                mb: 3,
                textAlign: 'center',
                fontStyle: 'italic',
                lineHeight: 1.6
              }}>
                {survey.description}
              </Typography>
            )}
            
            {/* Objetivo */}
            <Box sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: 3,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#37474f',
                fontWeight: 600,
                mb: 2,
                textAlign: 'center'
              }}>
                🎯 Objetivo de la Encuesta
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#424242',
                lineHeight: 1.7,
                textAlign: 'center'
              }}>
                {objective}
              </Typography>
            </Box>
            
            {/* Información Clave */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              justifyContent: 'center',
              mb: 3
            }}>
              <StatusChip status={survey.status} />
              <Chip 
                label={`👥 Audiencia: ${targetAudience}`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 600,
                  border: '1px solid #bbdefb'
                }} 
              />
              <Chip 
                label={`📝 ${questions.length} preguntas`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  fontWeight: 600,
                  border: '1px solid #ffcdd2'
                }} 
              />
              <Chip 
                label={`📊 ${responses}/${target} respuestas`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#f3e5f5',
                  color: '#6a1b9a',
                  fontWeight: 600,
                  border: '1px solid #e1bee7'
                }} 
              />
            </Box>

            {/* Fecha y Notificaciones */}
            {scheduledDate && (
              <Box sx={{ 
                mt: 3,
                p: 3,
                backgroundColor: '#e8f5e8',
                borderRadius: 3,
                border: '1px solid #c8e6c9'
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#2e7d32',
                  fontWeight: 600,
                  mb: 2,
                  textAlign: 'center'
                }}>
                  📅 Programación
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ 
                      color: '#2e7d32',
                      fontWeight: 500,
                      textAlign: 'center'
                    }}>
                      <strong>Fecha Programada:</strong><br />
                      {new Date(scheduledDate).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Grid>
                  {notificationMethods.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ 
                        color: '#2e7d32',
                        fontWeight: 500,
                        textAlign: 'center'
                      }}>
                        <strong>Notificaciones:</strong><br />
                        {notificationMethods.join(', ')}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Preguntas de la Encuesta */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ 
            color: '#27ae60', 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            🤖 Preguntas de la Encuesta
          </Typography>
          
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <Card key={question.id || index} sx={{ 
                mb: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: 3,
                border: '1px solid #e8eaf6',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Header de la pregunta */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#27ae60',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      color: '#2c3e50',
                      flex: 1
                    }}>
                      {question.text}
                    </Typography>
                  </Box>
                  
                  {/* Metadatos de la pregunta */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    flexWrap: 'wrap',
                    mb: 2
                  }}>
                    <Chip 
                      label={`Tipo: ${question.type === 'multiple_choice' ? 'Selección Múltiple' : 'Texto Abierto'}`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        fontWeight: 500
                      }}
                    />
                    {question.required && (
                      <Chip 
                        label="Requerida"
                        size="small"
                        sx={{ 
                          backgroundColor: '#ffebee',
                          color: '#c62828',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Opciones de la pregunta */}
                  {question.type === 'multiple_choice' && question.options && question.options.length > 0 && (
                    <Box sx={{ 
                      mt: 2,
                      p: 2,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography variant="body2" sx={{ 
                        color: '#6c757d',
                        fontWeight: 500,
                        mb: 2
                      }}>
                        Opciones de respuesta:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {question.options.map((option, optIndex) => (
                          <Chip 
                            key={optIndex} 
                            label={typeof option === 'string' ? option : option.text}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderColor: '#dee2e6',
                              color: '#495057'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              p: 4,
              borderRadius: 3,
              backgroundColor: '#f8f9fa',
              border: '2px dashed #dee2e6'
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                📝 No hay preguntas definidas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta encuesta aún no tiene preguntas configuradas
              </Typography>
            </Box>
          )}
        </Box>

        {/* Información de Creación */}
        <Box sx={{ 
          mt: 4,
          p: 3,
          backgroundColor: '#f8f9fa',
          borderRadius: 3,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <Typography variant="body1" sx={{ 
            color: '#6c757d',
            fontWeight: 500
          }}>
            📅 <strong>Creada:</strong> {survey.createdAt ? new Date(survey.createdAt).toLocaleString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Fecha no disponible'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderTop: '1px solid #dee2e6'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: '#6c757d',
            color: '#6c757d',
            '&:hover': {
              borderColor: '#495057',
              backgroundColor: 'rgba(108, 117, 125, 0.1)'
            }
          }}
        >
          Cerrar
        </Button>
        
        {canEdit && onEdit && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              borderColor: '#3498db',
              color: '#3498db',
              '&:hover': {
                borderColor: '#2980b9',
                backgroundColor: 'rgba(52, 152, 219, 0.1)'
              }
            }}
          >
            ✏️ Editar
          </Button>
        )}
        
        {canActivate && onActivate && (
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={handleActivate}
            sx={{
              background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #229954 0%, #27ae60 100%)',
                boxShadow: '0 4px 20px rgba(39, 174, 96, 0.3)'
              }
            }}
          >
            🚀 Activar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
