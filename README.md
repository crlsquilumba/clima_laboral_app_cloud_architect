# 🌟 Clima Laboral App Cloud Architect

## 📋 Descripción del Proyecto

Aplicación web completa para la gestión de encuestas de clima laboral con integración de Inteligencia Artificial. El sistema permite a los profesionales de RRHH crear, gestionar y analizar encuestas de manera eficiente y gamificada.

## 🏗️ Arquitectura

- **Frontend**: React 18 + Material-UI + Vite
- **Backend**: Azure Functions (Node.js)
- **IA**: Azure OpenAI Service (GPT-3.5-turbo)
- **Arquitectura**: Hexagonal/Clean Architecture
- **Monorepo**: Estructura organizada por aplicaciones

## 🚀 Características Principales

### ✨ Web App (RRHH)
- **Creación de Encuestas con IA**: Generación automática de preguntas gamificadas
- **Gestión de Encuestas**: Listado, edición y programación de envío
- **Dashboard Interactivo**: Métricas y actividad reciente
- **Diseño Responsivo**: Interfaz moderna y profesional

### 🤖 Integración IA
- **Generación Automática**: Preguntas contextuales basadas en prompt
- **Gamificación**: Emojis, colores y temas para mejor engagement
- **Personalización**: Adaptación según audiencia y objetivos

### 📱 Estructura del Proyecto
```
clima_laboral_app_cloud_architect/
├── apps/
│   ├── web/                    # React Frontend App
│   │   ├── src/
│   │   │   ├── core/          # Entidades y casos de uso
│   │   │   ├── infrastructure/# Servicios externos
│   │   │   └── presentation/  # Componentes y páginas
│   │   └── package.json
│   └── api/                    # Azure Functions
│       ├── generateSurveyQuestions/
│       ├── shared/
│       └── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18**: Framework principal
- **Material-UI (MUI)**: Componentes de UI
- **Vite**: Build tool y dev server
- **React Router DOM**: Navegación
- **Zustand**: Estado global
- **React Hook Form**: Formularios

### Backend
- **Azure Functions**: Serverless backend
- **Node.js**: Runtime de JavaScript
- **Azure OpenAI**: Servicio de IA
- **Axios**: Cliente HTTP

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- Azure CLI
- Cuenta de Azure con OpenAI Service

### Frontend (Web App)
```bash
cd apps/web
npm install
npm run dev
```

### Backend (Azure Functions)
```bash
cd apps/api/azure-functions
npm install
npm run start
```

## 🌐 Endpoints de la API

### Generar Preguntas de Encuesta
```
POST /api/surveys/generate
Body: {
  "prompt": "string",
  "questionCount": "number",
  "questionTypes": ["array"]
}
```

## 🎯 Estado Actual del Proyecto

### ✅ Completado
- [x] Estructura del proyecto (Hexagonal Architecture)
- [x] Web App con React y Material-UI
- [x] Modal de creación de encuestas (4 pasos)
- [x] Integración con Azure OpenAI
- [x] Componentes gamificados
- [x] Gestión de encuestas
- [x] Diseño profesional y responsivo

### 🔄 En Desarrollo
- [ ] Corrección del Azure Function
- [ ] Función para guardar encuestas
- [ ] App móvil React Native
- [ ] Análisis de sentimientos con IA

## 📊 Capturas de Pantalla

- **Dashboard Principal**: Interfaz de RRHH con métricas
- **Creación de Encuestas**: Modal de 4 pasos profesional
- **Gestión de Encuestas**: Tabla con acciones
- **Vista de Encuesta**: Modal de resumen elegante

## 🤝 Contribución

Este proyecto es parte del ejercicio práctico de Arquitecto de Soluciones Cloud.

## 📄 Licencia

Proyecto educativo para demostración de arquitectura cloud.

---

**Desarrollado con ❤️ para la gestión moderna de clima laboral**
