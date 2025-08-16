import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { Question } from '../../core/entities/Survey';

interface GamifiedQuestionProps {
  question: Question;
  index: number;
}

export const GamifiedQuestion: React.FC<GamifiedQuestionProps> = ({ question, index }) => {
  return (
    <Card sx={{ 
      mb: 4, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      borderRadius: 4,
      border: '1px solid #e8eaf6',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        transform: 'translateY(-2px)'
      }
    }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header elegante con gradiente */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Elementos decorativos de fondo */}
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 1
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            zIndex: 1
          }} />
          
          {/* Contenido del header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            position: 'relative',
            zIndex: 2
          }}>
            {/* Número de pregunta con círculo */}
            <Box sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 3,
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: 'white'
              }}>
                {index + 1}
              </Typography>
            </Box>
            
            {/* Texto de la pregunta */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600,
                mb: 1,
                lineHeight: 1.3
              }}>
                {question.text}
              </Typography>
            </Box>
            
            {/* Icono único de la pregunta (solo si existe) */}
            {question.icon && (
              <Box sx={{
                ml: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography variant="h3" sx={{ 
                  fontSize: '2.5rem',
                  opacity: 0.9,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }}>
                  {question.icon}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        {/* Separador elegante */}
        <Divider sx={{ borderColor: '#e8eaf6', borderWidth: 1 }} />
        
        {/* Contenido de la pregunta */}
        <Box sx={{ p: 4 }}>
          {/* Opciones de respuesta circulares */}
          {(question.type === 'multiple_choice' || question.type === 'gamified_rating') && question.options && question.options.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ 
                mb: 4, 
                fontWeight: 500,
                color: '#37474f',
                textAlign: 'center',
                fontSize: '1.1rem'
              }}>
                Selecciona tu respuesta
              </Typography>
              
              {/* Grid de opciones */}
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                pb: 1
              }}>
                {question.options.map((option, optIndex) => (
                  <Box
                    key={optIndex}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      p: 2,
                      borderRadius: 3,
                      minWidth: '120px',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {/* Círculo con emoji */}
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${option.color || '#9e9e9e'}15 0%, ${option.color || '#9e9e9e'}25 100%)`,
                      border: `3px solid ${option.color || '#9e9e9e'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: `0 8px 24px ${option.color || '#9e9e9e'}30`,
                      transition: 'all 0.3s ease'
                    }}>
                      {option.icon && (
                        <Typography variant="h1" sx={{ 
                          fontSize: '2.5rem',
                          lineHeight: 1,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}>
                          {option.icon}
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Texto de la opción */}
                    <Typography variant="body2" sx={{ 
                      color: option.color || '#37474f',
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      lineHeight: 1.2,
                      maxWidth: '100px'
                    }}>
                      {option.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
          
          {/* Pregunta de texto abierto */}
          {question.type === 'open_text' && (
            <Box sx={{ 
              mt: 2,
              p: 4,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${question.color ? `${question.color}08` : '#f8f9fa'} 0%, ${question.color ? `${question.color}12` : '#f1f3f4'} 100%)`,
              border: `2px solid ${question.color ? `${question.color}30` : '#e8eaf6'}`,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elemento decorativo */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                borderRadius: '0 3px 0 60px',
                background: question.color ? `${question.color}20` : '#e3f2fd'
              }} />
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                position: 'relative',
                zIndex: 1
              }}>
                <Typography variant="h6" sx={{ 
                  color: '#37474f',
                  fontWeight: 500
                }}>
                  Pregunta de texto abierto
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ 
                fontWeight: 400,
                lineHeight: 1.6,
                position: 'relative',
                zIndex: 1
              }}>
                Los empleados pueden escribir libremente sus respuestas y comentarios sobre esta pregunta.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
