import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import { Survey, Question } from '../../core/entities/Survey';
import { GamifiedQuestion } from './GamifiedQuestion';

export interface CreateSurveyModalProps {
  open: boolean;
  onClose: () => void;
  onSurveyCreated: (survey: Survey) => void;
}

type SurveyStep = 'prompt' | 'review' | 'schedule' | 'complete';

interface GeneratedSurvey {
  title: string;
  objective: string;
  description: string;
  questions: Question[];
  targetAudience: string;
  questionCount: number;
  questionTypes: string[];
}

export const CreateSurveyModal: React.FC<CreateSurveyModalProps> = ({
  open,
  onClose,
  onSurveyCreated
}) => {
  const [currentStep, setCurrentStep] = useState<SurveyStep>('prompt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: Prompt & Configuration
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyObjective, setSurveyObjective] = useState('');
  const [prompt, setPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [targetAudience, setTargetAudience] = useState('Empleados');
  const [questionTypes, setQuestionTypes] = useState(['multiple_choice']);
  const [includeOpenQuestion, setIncludeOpenQuestion] = useState(true);
  
  // Step 2: Generated Survey Review
  const [generatedSurvey, setGeneratedSurvey] = useState<GeneratedSurvey | null>(null);
  const [editedSurvey, setEditedSurvey] = useState<GeneratedSurvey | null>(null);
  
  // Step 3: Scheduling
  const [surveyName, setSurveyName] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [reminderFrequency, setReminderFrequency] = useState('Semanal');
  const [notificationMethods, setNotificationMethods] = useState(['Email']);

  const steps = [
    { label: 'Prompt & Configuración', key: 'prompt' },
    { label: 'Revisar Preguntas', key: 'review' },
    { label: 'Programar Envío', key: 'schedule' },
    { label: 'Finalizar', key: 'complete' }
  ];

  // Función para determinar estado según fecha seleccionada
  const getStatusFromDate = (date: string | null) => {
    if (!date) return 'draft';
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) return 'invalid';
    if (selectedDate.getTime() === today.getTime()) return 'sent';
    if (selectedDate > today) return 'scheduled';
    
    return 'draft';
  };

  const handleGenerateSurvey = async () => {
    if (!surveyTitle.trim()) {
      setError('El título de la encuesta es requerido');
      return;
    }
    if (!surveyObjective.trim()) {
      setError('El objetivo de la encuesta es requerido');
      return;
    }
    if (!prompt.trim()) {
      setError('El prompt es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Crear prompt inteligente combinando todos los campos
      const intelligentPrompt = `Crear una encuesta sobre: ${prompt}

Objetivo de la encuesta: ${surveyObjective}
Audiencia objetivo: ${targetAudience}
Número de preguntas: ${questionCount}
Tipos de preguntas: ${questionTypes.join(', ')}
${includeOpenQuestion ? 'Incluir al menos 1 pregunta abierta para comentarios adicionales.' : ''}

La encuesta debe ser gamificada con emojis, colores temáticos y opciones visuales atractivas.`;

      console.log('🚀 Iniciando generación de encuesta con IA...');
      console.log('📝 Prompt inteligente:', intelligentPrompt);
      console.log('🔢 Número de preguntas:', questionCount);
      console.log('📋 Tipos de preguntas:', questionTypes);
      
      // Llamada REAL al Azure Function
      console.log('🌐 Llamando al API:', 'https://clima-laboral-functions-a7h7gtfjc2gbb7b4.canadacentral-01.azurewebsites.net/api/surveys/generate');
      
      const response = await fetch('https://clima-laboral-functions-a7h7gtfjc2gbb7b4.canadacentral-01.azurewebsites.net/api/surveys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: intelligentPrompt,
          questionCount,
          questionTypes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error en API:', response.status, response.statusText);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('✅ Respuesta completa del API:', apiResponse);
      
      if (!apiResponse.success || !apiResponse.questions) {
        throw new Error('El API no devolvió preguntas válidas');
      }

      const generatedQuestions = apiResponse.questions;
      console.log('✅ Preguntas generadas por IA:', generatedQuestions);

      // Crear encuesta con las preguntas generadas por IA
      const generatedSurveyData: GeneratedSurvey = {
        title: surveyTitle,
        objective: surveyObjective,
        description: `Encuesta generada por IA sobre: ${prompt}`,
        targetAudience,
        questionCount,
        questionTypes,
        questions: generatedQuestions
      };

      // La IA ya incluye preguntas abiertas según el prompt, no necesitamos agregar más

      setGeneratedSurvey(generatedSurveyData);
      setEditedSurvey(generatedSurveyData);
      setSurveyName(generatedSurveyData.title);
      setSurveyDescription(generatedSurveyData.objective);
      
      console.log('🎯 Encuesta generada exitosamente, pasando a revisión...');
      setCurrentStep('review');
      
    } catch (err) {
      console.error('❌ Error al generar encuesta con IA:', err);
      setError('Error al generar la encuesta con IA. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSurvey = () => {
    setCurrentStep('prompt');
  };

  const handleContinueToSchedule = () => {
    if (editedSurvey) {
      setSurveyName(editedSurvey.title);
      setSurveyDescription(editedSurvey.objective);
      setSurveyObjective(editedSurvey.objective);
    }
    setCurrentStep('schedule');
  };

  const handleScheduleSurvey = () => {
    if (!surveyName.trim() || !scheduledDate) {
      setError('Nombre de encuesta y fecha de envío son requeridos');
      return;
    }

    setCurrentStep('complete');
  };

  const handleFinalizeSurvey = () => {
    if (!generatedSurvey || !editedSurvey) return;

    // Determinar estado automáticamente según la fecha seleccionada
    let automaticStatus = getStatusFromDate(scheduledDate);
    
    // Mapear 'invalid' a 'draft' ya que no es un estado válido de Survey
    if (automaticStatus === 'invalid') {
      automaticStatus = 'draft';
    }

    // Asegurar que el estado sea válido para la interfaz Survey
    const validStatus: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived' = 
      automaticStatus === 'sent' ? 'active' : 
      automaticStatus === 'scheduled' ? 'scheduled' : 'draft';

    const finalSurvey: Survey = {
      id: Date.now().toString(),
      title: surveyName,
      description: surveyDescription,
      objective: surveyObjective || editedSurvey.objective,
      targetAudience,
      status: validStatus, // Estado dinámico válido según fecha
      scheduledDate,
      notificationMethods,
      reminderFrequency,
      questions: editedSurvey.questions,
      createdAt: new Date().toISOString(),
      responses: 0,
      target: 0
    };

    onSurveyCreated(finalSurvey);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep('prompt');
    setPrompt('');
    setGeneratedSurvey(null);
    setEditedSurvey(null);
    setError(null);
    onClose();
  };

  const renderPromptStep = () => (
    <Box sx={{ p: 4 }}>
      {/* Header del formulario */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1
        }}>
          Crear Encuesta con IA
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Define los detalles de tu encuesta y la IA generará preguntas gamificadas
        </Typography>
      </Box>

      {/* Sección 1: Información Básica */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#3498db', 
          fontWeight: 600, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          📋 Información Básica
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Título de la Encuesta"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="Ej: Encuesta de Clima Laboral 2024"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Objetivo de la Encuesta"
              value={surveyObjective}
              onChange={(e) => setSurveyObjective(e.target.value)}
              multiline
              rows={3}
              placeholder="Ej: Evaluar la satisfacción laboral de los empleados para identificar áreas de mejora y fortalecer el compromiso organizacional"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sección 2: Configuración de Preguntas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#e74c3c', 
          fontWeight: 600, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          🎯 Configuración de Preguntas
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Número de Preguntas"
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              inputProps={{ min: 1, max: 20 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e74c3c',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e74c3c',
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Audiencia Objetivo</InputLabel>
              <Select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                label="Audiencia Objetivo"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    }
                  }
                }}
              >
                <MenuItem value="Empleados">Empleados</MenuItem>
                <MenuItem value="Gerentes">Gerentes</MenuItem>
                <MenuItem value="RRHH">RRHH</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Ventas">Ventas</MenuItem>
                <MenuItem value="Todos">Todos</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipos de Preguntas</InputLabel>
              <Select
                multiple
                value={questionTypes}
                onChange={(e) => setQuestionTypes(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                label="Tipos de Preguntas"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    }
                  }
                }}
              >
                <MenuItem value="multiple_choice">Selección Múltiple</MenuItem>
                <MenuItem value="rating">Escala de Calificación</MenuItem>
                <MenuItem value="yes_no">Sí/No</MenuItem>
                <MenuItem value="ranking">Ranking</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeOpenQuestion}
                  onChange={(e) => setIncludeOpenQuestion(e.target.checked)}
                  sx={{
                    color: '#e74c3c',
                    '&.Mui-checked': {
                      color: '#e74c3c',
                    }
                  }}
                />
              }
              label="Incluir pregunta abierta"
              sx={{ 
                mt: 1,
                '& .MuiFormControlLabel-label': {
                  color: '#2c3e50',
                  fontWeight: 500
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sección 3: Prompt para IA */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#9b59b6', 
          fontWeight: 600, 
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          🤖 Prompt para la IA
        </Typography>
        
        <TextField
          fullWidth
          label="Descripción del Tema"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          multiline
          rows={4}
          placeholder="Describe el tema principal de tu encuesta. Ej: Evaluar la satisfacción laboral, medir el engagement del equipo, conocer opiniones sobre nuevos procesos..."
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9b59b6',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#9b59b6',
              }
            }
          }}
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          💡 La IA combinará esta información con el título, objetivo y configuración para generar preguntas gamificadas
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const renderReviewStep = () => (
    <Box sx={{ p: 4 }}>
      {/* Header del formulario */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1
        }}>
          Revisar Preguntas Generadas
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Revisa las preguntas generadas por la IA antes de continuar
        </Typography>
      </Box>

      {/* Información de la Encuesta */}
      {editedSurvey ? (
        <Card sx={{ 
          mb: 4, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          borderRadius: 4,
          border: '1px solid #e3f2fd',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Título Principal - Más Grande y Llamativo */}
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              color: '#1a237e',
              mb: 3,
              textAlign: 'center',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '-0.5px'
            }}>
              {editedSurvey?.title || 'Título de la Encuesta'}
            </Typography>
            
            {/* Objetivo - Más Prominente y Legible */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: 4,
              p: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: 3,
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#37474f',
                mb: 2,
                fontWeight: 600,
                fontSize: '1.25rem'
              }}>
                🎯 Objetivo de la Encuesta
              </Typography>
              <Typography variant="body1" sx={{ 
                color: '#424242',
                lineHeight: 1.7,
                fontSize: '1.1rem',
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {editedSurvey?.objective || 'Objetivo de la encuesta no especificado'}
              </Typography>
            </Box>
            
            {/* Metadata - Colores Más Sutiles */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <Chip 
                label={`Audiencia: ${editedSurvey?.targetAudience || 'No especificada'}`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#e3f2fd',
                  color: '#1565c0',
                  fontWeight: 600,
                  border: '1px solid #bbdefb'
                }} 
              />
              <Chip 
                label={`${editedSurvey?.questions?.length || 0} preguntas`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  fontWeight: 600,
                  border: '1px solid #ffcdd2'
                }} 
              />
              <Chip 
                label={`Tipos: ${editedSurvey.questionTypes?.join(', ') || 'No especificado'}`} 
                size="medium" 
                sx={{ 
                  backgroundColor: '#f3e5f5',
                  color: '#6a1b9a',
                  fontWeight: 600,
                  border: '1px solid #e1bee7'
                }} 
              />
            </Box>
          </CardContent>
        </Card>
      ) : null}

      {/* Preguntas Generadas por IA */}
      {editedSurvey?.questions && editedSurvey.questions.length > 0 ? (
        <Box>
          <Typography variant="h6" sx={{ 
            color: '#27ae60', 
            fontWeight: 600, 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            🤖 Preguntas Generadas por IA
          </Typography>
          
          {editedSurvey.questions.map((question, index) => (
            <GamifiedQuestion 
              key={question.id} 
              question={question} 
              index={index} 
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          p: 4,
          borderRadius: 3,
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6'
        }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No hay preguntas para revisar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Las preguntas se generarán automáticamente cuando completes el paso anterior
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderScheduleStep = () => (
    <Box sx={{ p: 4 }}>
      {/* Header del formulario */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1
        }}>
          Programar Envío de Encuesta
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Configura los detalles finales y programa el envío de la encuesta
        </Typography>
      </Box>

      {/* Sección 1: Información de la Encuesta */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#3498db', 
          fontWeight: 600, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          📋 Información de la Encuesta
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la Encuesta"
              value={editedSurvey?.title || ''}
              onChange={(e) => setSurveyName(e.target.value)}
              placeholder="Nombre descriptivo de la encuesta..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              value={editedSurvey?.description || ''}
              onChange={(e) => setSurveyDescription(e.target.value)}
              placeholder="Descripción detallada de la encuesta..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Objetivo de la Encuesta"
              value={editedSurvey?.objective || ''}
              onChange={(e) => setSurveyObjective(e.target.value)}
              placeholder="Describe el objetivo principal que persigue esta encuesta..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3498db',
                  }
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Sección 2: Programación y Configuración */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          color: '#e74c3c', 
          fontWeight: 600, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          📅 Programación y Configuración
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Fecha y Hora de Envío"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e74c3c',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e74c3c',
                  }
                }
              }}
            />
            
            {/* Indicador de estado según fecha */}
            {scheduledDate && (
              <Box sx={{ 
                mt: 2, 
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#37474f',
                  fontWeight: 600,
                  mb: 1
                }}>
                  Estado de la encuesta:
                </Typography>
                <Chip
                  label={
                    getStatusFromDate(scheduledDate) === 'invalid' ? '❌ Fecha inválida (pasada)' :
                    getStatusFromDate(scheduledDate) === 'draft' ? '📝 Borrador' :
                    getStatusFromDate(scheduledDate) === 'scheduled' ? '📅 Programada' :
                    getStatusFromDate(scheduledDate) === 'sent' ? '📤 Enviada' : '📝 Borrador'
                  }
                  color={
                    getStatusFromDate(scheduledDate) === 'invalid' ? 'error' :
                    getStatusFromDate(scheduledDate) === 'draft' ? 'warning' :
                    getStatusFromDate(scheduledDate) === 'scheduled' ? 'primary' :
                    getStatusFromDate(scheduledDate) === 'sent' ? 'success' : 'warning'
                  }
                  variant="filled"
                  size="medium"
                  sx={{ fontWeight: 'bold', mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ 
                  display: 'block',
                  fontStyle: 'italic',
                  lineHeight: 1.4
                }}>
                  {getStatusFromDate(scheduledDate) === 'invalid' ? 'La fecha no puede ser anterior a hoy' :
                   getStatusFromDate(scheduledDate) === 'draft' ? 'Sin fecha programada' :
                   getStatusFromDate(scheduledDate) === 'scheduled' ? 'Se enviará en la fecha seleccionada' :
                   getStatusFromDate(scheduledDate) === 'sent' ? 'Se enviará hoy mismo' : 'Estado por defecto'}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frecuencia de Recordatorios</InputLabel>
              <Select
                value={reminderFrequency}
                onChange={(e) => setReminderFrequency(e.target.value)}
                label="Frecuencia de Recordatorios"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e74c3c',
                    }
                  }
                }}
              >
                <MenuItem value="Diario">Diario</MenuItem>
                <MenuItem value="Semanal">Semanal</MenuItem>
                <MenuItem value="Quincenal">Quincenal</MenuItem>
                <MenuItem value="Mensual">Mensual</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ 
                color: '#e74c3c',
                fontWeight: 600,
                mb: 2
              }}>
                🔔 Métodos de Notificación
              </FormLabel>
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexWrap: 'wrap',
                p: 2,
                borderRadius: 2,
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationMethods.includes('Email')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationMethods([...notificationMethods, 'Email']);
                        } else {
                          setNotificationMethods(notificationMethods.filter(m => m !== 'Email'));
                        }
                      }}
                      sx={{
                        color: '#e74c3c',
                        '&.Mui-checked': {
                          color: '#e74c3c',
                        }
                      }}
                    />
                  }
                  label="📧 Email"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500,
                      color: '#37474f'
                    }
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationMethods.includes('WhatsApp')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationMethods([...notificationMethods, 'WhatsApp']);
                        } else {
                          setNotificationMethods(notificationMethods.filter(m => m !== 'WhatsApp'));
                        }
                      }}
                      sx={{
                        color: '#e74c3c',
                        '&.Mui-checked': {
                          color: '#e74c3c',
                        }
                      }}
                    />
                  }
                  label="💬 WhatsApp"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500,
                      color: '#37474f'
                    }
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={notificationMethods.includes('SMS')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationMethods([...notificationMethods, 'SMS']);
                        } else {
                          setNotificationMethods(notificationMethods.filter(m => m !== 'SMS'));
                        }
                      }}
                      sx={{
                        color: '#e74c3c',
                        '&.Mui-checked': {
                          color: '#e74c3c',
                        }
                      }}
                    />
                  }
                  label="📱 SMS"
                  sx={{ 
                    '& .MuiFormControlLabel-label': {
                      fontWeight: 500,
                      color: '#37474f'
                    }
                  }}
                />
              </Box>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );

  const renderCompleteStep = () => (
    <Box sx={{ p: 4 }}>
      {/* Header del formulario */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        border: '1px solid #dee2e6'
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: '#2c3e50',
          mb: 1
        }}>
          ¡Encuesta Creada Exitosamente!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Tu encuesta ha sido creada y está en estado {getStatusFromDate(scheduledDate) === 'scheduled' ? 'programada' : 
                                                     getStatusFromDate(scheduledDate) === 'sent' ? 'enviada' : 'borrador'}. 
          {getStatusFromDate(scheduledDate) === 'scheduled' ? 'Se enviará en la fecha programada.' :
           getStatusFromDate(scheduledDate) === 'sent' ? 'Se enviará hoy mismo.' :
           'Puedes editarla antes de programar el envío.'}
        </Typography>
      </Box>

      {/* Resumen de la Encuesta */}
      <Card sx={{ 
        mb: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        borderRadius: 4,
        border: '1px solid #e3f2fd',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Título de la Encuesta */}
          <Typography variant="h5" sx={{ 
            fontWeight: 600, 
            color: '#1a237e',
            mb: 3,
            textAlign: 'center'
          }}>
            {surveyName}
          </Typography>
          
          {/* Descripción */}
          {surveyDescription && (
            <Typography variant="body1" sx={{ 
              color: '#37474f',
              mb: 3,
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              {surveyDescription}
            </Typography>
          )}
          
          {/* Objetivo */}
          {surveyObjective && (
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
                {surveyObjective}
              </Typography>
            </Box>
          )}
          
          {/* Información Clave */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Chip 
              label={`📅 Envío: ${scheduledDate ? new Date(scheduledDate).toLocaleString('es-ES') : 'No programado'}`} 
              size="medium" 
              sx={{ 
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                fontWeight: 600,
                border: '1px solid #bbdefb'
              }} 
            />
            <Chip 
              label={`👥 Audiencia: ${targetAudience}`} 
              size="medium" 
              sx={{ 
                backgroundColor: '#ffebee',
                color: '#c62828',
                fontWeight: 600,
                border: '1px solid #ffcdd2'
              }} 
            />
            <Chip 
              label={`🔔 Notificaciones: ${notificationMethods.join(', ')}`} 
              size="medium" 
              sx={{ 
                backgroundColor: '#f3e5f5',
                color: '#6a1b9a',
                fontWeight: 600,
                border: '1px solid #e1bee7'
              }} 
            />
            {/* Estado dinámico según fecha seleccionada */}
            <Chip 
              label={`📊 Estado: ${
                getStatusFromDate(scheduledDate) === 'invalid' ? 'Fecha Inválida' :
                getStatusFromDate(scheduledDate) === 'draft' ? 'Borrador' :
                getStatusFromDate(scheduledDate) === 'scheduled' ? 'Programada' :
                getStatusFromDate(scheduledDate) === 'sent' ? 'Enviada' : 'Borrador'
              }`} 
              color={
                getStatusFromDate(scheduledDate) === 'invalid' ? 'error' :
                getStatusFromDate(scheduledDate) === 'draft' ? 'warning' :
                getStatusFromDate(scheduledDate) === 'scheduled' ? 'primary' :
                getStatusFromDate(scheduledDate) === 'sent' ? 'success' : 'warning'
              }
              size="medium" 
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Mensaje Final */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        p: 3,
        borderRadius: 3,
        backgroundColor: '#e8f5e8',
        border: '1px solid #c8e6c9'
      }}>
        <Typography variant="body1" sx={{ 
          color: '#2e7d32',
          fontWeight: 500,
          lineHeight: 1.6
        }}>
          {getStatusFromDate(scheduledDate) === 'scheduled' ? 
            '🎯 La encuesta está programada para envío automático en la fecha seleccionada.' :
           getStatusFromDate(scheduledDate) === 'sent' ? 
            '📤 La encuesta se enviará hoy mismo a la audiencia seleccionada.' :
            '📝 La encuesta está lista para ser revisada y editada. Una vez que esté completa, podrás activarla desde el dashboard.'}
        </Typography>
      </Box>
    </Box>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'prompt':
        return renderPromptStep();
      case 'review':
        return renderReviewStep();
      case 'schedule':
        return renderScheduleStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderPromptStep();
    }
  };

  const getStepActions = () => {
    const buttonStyle = {
      px: 4,
      py: 1.5,
      borderRadius: 2,
      fontWeight: 600,
      transition: 'all 0.3s ease'
    };

    const primaryButtonStyle = {
      ...buttonStyle,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
      '&:hover': {
        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
        transform: 'translateY(-1px)'
      }
    };

    const secondaryButtonStyle = {
      ...buttonStyle,
      borderColor: '#667eea',
      color: '#667eea',
      '&:hover': {
        borderColor: '#5a6fd8',
        backgroundColor: '#667eea08'
      }
    };

    switch (currentStep) {
      case 'prompt':
        return (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={handleClose}
              sx={secondaryButtonStyle}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleGenerateSurvey}
              disabled={loading || !prompt.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{
                ...primaryButtonStyle,
                '&:disabled': {
                  background: '#e0e0e0',
                  color: '#9e9e9e',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Generando...' : 'Generar Encuesta →'}
            </Button>
          </Box>
        );
      case 'review':
        return (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={() => setCurrentStep('prompt')}
              sx={secondaryButtonStyle}
            >
              ← Anterior
            </Button>
            <Button 
              variant="contained" 
              onClick={handleContinueToSchedule}
              sx={primaryButtonStyle}
            >
              Siguiente →
            </Button>
          </Box>
        );
      case 'schedule':
        return (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'space-between', width: '100%' }}>
            <Button 
              onClick={() => setCurrentStep('review')}
              sx={secondaryButtonStyle}
            >
              ← Anterior
            </Button>
            <Button 
              variant="contained" 
              onClick={handleScheduleSurvey}
              sx={primaryButtonStyle}
            >
              Programar Encuesta →
            </Button>
          </Box>
        );
      case 'complete':
        return (
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', width: '100%' }}>
            <Button 
              variant="contained" 
              onClick={handleFinalizeSurvey}
              sx={primaryButtonStyle}
            >
              Finalizar Encuesta
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {steps.find(s => s.key === currentStep)?.label}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={steps.findIndex(s => s.key === currentStep)}>
            {steps.map((step) => (
              <Step key={step.key}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {renderCurrentStep()}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {getStepActions()}
      </DialogActions>
    </Dialog>
  );
};
