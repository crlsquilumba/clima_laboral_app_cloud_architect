# Clima Laboral - Aplicación Web

## Descripción

Aplicación web para el Asistente de RRHH que permite crear y gestionar encuestas de clima laboral utilizando inteligencia artificial.

## Características

- **Creación de Encuestas con IA**: Genera encuestas automáticamente basándose en prompts de texto
- **Dashboard Interactivo**: Visualización de métricas y estadísticas
- **Reportes Detallados**: Análisis de respuestas con gráficos y tablas
- **Arquitectura Hexagonal**: Implementación de Clean Architecture y Hexagonal Architecture
- **Material-UI**: Interfaz moderna y responsive

## Tecnologías

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI (MUI)
- **Build Tool**: Vite
- **Charts**: Recharts
- **State Management**: React Hooks + Zustand

## Estructura del Proyecto

```
src/
├── core/                    # Lógica de negocio
│   ├── entities/           # Entidades del dominio
│   ├── usecases/           # Casos de uso
│   └── interfaces/         # Contratos e interfaces
├── infrastructure/          # Implementaciones técnicas
│   ├── api/                # Servicios de API
│   └── storage/            # Repositorios de datos
└── presentation/            # Componentes de UI
    ├── components/          # Componentes reutilizables
    └── pages/              # Páginas principales
```

## Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

3. **Construir para producción**:
   ```bash
   npm run build
   ```

## Uso

### Crear Encuesta con IA

1. Haz clic en "Crear con IA" en el dashboard
2. Escribe un prompt describiendo el objetivo de la encuesta
3. Configura el número de preguntas y tipos
4. La IA generará automáticamente las preguntas
5. Revisa y guarda la encuesta

### Ver Reportes

1. En la lista de encuestas, haz clic en "Ver Reporte"
2. Visualiza estadísticas y gráficos de respuestas
3. Analiza tendencias y patrones

## Arquitectura

### Clean Architecture

- **Entities**: Objetos del dominio (Survey, Question, User)
- **Use Cases**: Lógica de aplicación (CreateSurveyWithAI)
- **Interfaces**: Contratos para implementaciones (SurveyRepository, AIService)

### Hexagonal Architecture

- **Ports**: Interfaces que definen contratos
- **Adapters**: Implementaciones concretas (AzureAIService, LocalSurveyRepository)

## Demo

Esta aplicación incluye datos de demostración para probar la funcionalidad:

- Encuesta de ejemplo pre-cargada
- Simulación de servicio de IA
- Almacenamiento local para desarrollo

## Próximos Pasos

- Integración con Azure OpenAI Service real
- Base de datos persistente (Azure SQL)
- Autenticación con Azure AD
- Notificaciones en tiempo real
- Exportación de reportes
