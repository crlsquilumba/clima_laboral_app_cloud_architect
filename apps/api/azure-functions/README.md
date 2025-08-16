# Azure Functions - Clima Laboral

## Descripción
Azure Functions para la aplicación de Clima Laboral, implementado en JavaScript puro con **Azure OpenAI real** y **GAMIFICACIÓN COMPLETA**.

## Estructura del Proyecto
```
apps/api/azure-functions/
├── generateSurveyQuestions/    # Genera preguntas gamificadas con IA
│   ├── index.js               # Código de la función + Azure OpenAI + Gamificación
│   └── function.json          # Configuración de la función
├── package.json               # Dependencias (incluye axios)
├── host.json                  # Configuración del host
├── local.settings.json        # Variables de entorno Azure OpenAI
├── .funcignore               # Archivos a ignorar en deployment
└── index.js                  # Archivo principal
```

## Configuración Azure OpenAI

### Variables de Entorno Requeridas:
```bash
AZURE_OPENAI_ENDPOINT=https://tu-recurso.openai.azure.com
AZURE_OPENAI_API_KEY=tu-api-key
AZURE_OPENAI_DEPLOYMENT_NAME=tu-deployment-name
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Configuración Actual (Demo):
- **Endpoint:** `https://clima-laboral-ai-v2.openai.azure.com`
- **Modelo:** `gpt-35-turbo`
- **Deployment:** `clima-laboral-ai-gpt35`

## 🎮 GAMIFICACIÓN COMPLETA

### ✨ Características Gamificadas:
- **Iconos Emoji:** Cada pregunta y respuesta tiene su propio icono
- **Colores Temáticos:** Paleta de colores que representa emociones
- **Temas Categorizados:** satisfaction, leadership, teamwork, communication
- **Respuestas Visuales:** Opciones con iconos y colores únicos
- **Experiencia Divertida:** Preguntas motivacionales y positivas

### 🎨 Paleta de Colores:
- **Azul (#1976d2):** Neutral, profesional
- **Verde (#2e7d32):** Positivo, satisfecho
- **Naranja (#ed6c02):** Advertencia, neutral
- **Rojo (#d32f2f):** Negativo, insatisfecho
- **Info (#0288d1):** Informativo, satisfecho
- **Gris (#757575):** Neutral, balanceado

### 😊 Iconos Disponibles:
- **Preguntas:** 😊👑🤝💬⚖️📈🏢🎁🏆💭😰🚀👥💡🌟
- **Respuestas:** 😍😊😐😕😢✅❌⭐👍👌👎🔥💥

## Instalación
```bash
cd apps/api/azure-functions
npm install
```

## Desarrollo Local
```bash
npm start
```

## Endpoints

### POST /api/surveys/generate
Genera preguntas de encuesta **GAMIFICADAS** usando Azure OpenAI real con fallback a mock data gamificado.

**Request:**
```json
{
  "prompt": "Crear encuesta sobre satisfacción laboral",
  "questionCount": 5,
  "questionTypes": ["gamified_rating", "gamified_choice"]
}
```

**Response (Azure OpenAI Gamificado):**
```json
{
  "success": true,
  "questions": [
    {
      "id": "1",
      "text": "¿Qué tan satisfecho estás con el ambiente laboral? 😊",
      "type": "gamified_rating",
      "icon": "😊",
      "color": "#1976d2",
      "theme": "satisfaction",
      "options": [
        {
          "text": "Muy insatisfecho 😢",
          "icon": "😢",
          "color": "#d32f2f",
          "value": 1
        },
        {
          "text": "Insatisfecho 😕",
          "icon": "😕",
          "color": "#ed6c02",
          "value": 2
        },
        {
          "text": "Neutral 😐",
          "icon": "😐",
          "color": "#757575",
          "value": 3
        },
        {
          "text": "Satisfecho 😊",
          "icon": "😊",
          "color": "#0288d1",
          "value": 4
        },
        {
          "text": "Muy satisfecho 😍",
          "icon": "😍",
          "color": "#2e7d32",
          "value": 5
        }
      ],
      "required": true
    }
  ],
  "metadata": {
    "totalQuestions": 5,
    "questionTypes": ["gamified_rating", "gamified_choice"],
    "prompt": "Crear encuesta sobre satisfacción laboral",
    "generatedAt": "2025-08-16T01:30:00Z",
    "model": "gpt-35-turbo",
    "source": "azure-openai",
    "gamified": true
  }
}
```

**Response (Fallback Mock Gamificado):**
```json
{
  "success": true,
  "questions": [
    {
      "id": "1",
      "text": "Pregunta 1: Crear encuesta sobre satisfacción laboral 😊",
      "type": "gamified_rating",
      "icon": "😊",
      "color": "#1976d2",
      "theme": "satisfaction",
      "options": [
        {
          "text": "Muy insatisfecho 😢",
          "icon": "😢",
          "color": "#d32f2f",
          "value": 1
        }
      ],
      "required": true
    }
  ],
  "metadata": {
    "totalQuestions": 5,
    "questionTypes": ["gamified_rating", "gamified_choice"],
    "prompt": "Crear encuesta sobre satisfacción laboral",
    "generatedAt": "2025-08-16T01:30:00Z",
    "model": "mock-generator",
    "source": "fallback",
    "gamified": true
  }
}
```

## Características
- ✅ **Azure OpenAI real** - Genera preguntas inteligentes con GPT-3.5-turbo
- ✅ **GAMIFICACIÓN COMPLETA** - Iconos, colores, temas y respuestas visuales
- ✅ **Fallback inteligente** - Si falla la IA, usa mock data gamificado
- ✅ **Prompt engineering gamificado** - Instrucciones específicas para RRHH + gamificación
- ✅ **Validación robusta** - Campos requeridos y formato JSON gamificado
- ✅ **Manejo de errores** - Logging detallado y respuestas consistentes
- ✅ **CORS habilitado** - Para frontend web
- ✅ **JavaScript puro** - Sin TypeScript, fácil de mantener

## 🎯 Flujo de Funcionamiento

### 1. **Intento con Azure OpenAI Gamificado:**
- Valida configuración
- Construye prompt estructurado con requisitos de gamificación
- Llama a GPT-3.5-turbo con instrucciones específicas
- Parsea respuesta JSON gamificada
- Mejora gamificación si es necesario
- Retorna preguntas gamificadas generadas por IA

### 2. **Fallback a Mock Data Gamificado:**
- Si Azure OpenAI falla
- Genera preguntas básicas con iconos, colores y temas
- Mantiene funcionalidad del demo con gamificación

## 🎮 Tipos de Preguntas Gamificadas

### **gamified_rating:**
- Escala de 1-5 con iconos y colores
- Cada nivel tiene su propio emoji y color
- Tema específico (satisfaction, leadership, etc.)

### **gamified_choice:**
- Opciones binarias (Sí/No) con iconos
- Colores que representan la respuesta
- Tema contextual

### **gamified_slider:**
- Rango visual con iconos de inicio y fin
- Colores que representan el espectro
- Tema específico

## Deployment
```bash
# Deploy a Azure
func azure functionapp publish clima-laboral-functions-v2

# Deploy individual
func azure functionapp publish clima-laboral-functions-v2 --functions generateSurveyQuestions
```

## Tecnologías
- **Azure Functions v4** - Runtime serverless
- **JavaScript (Node.js)** - Lenguaje principal
- **@azure/functions** - Framework oficial
- **Axios** - Cliente HTTP para Azure OpenAI
- **Azure OpenAI Service** - GPT-3.5-turbo real
- **Gamificación** - Iconos, colores, temas y respuestas visuales

## Diferencias con Versión Anterior

### ❌ **Antes (DUMMY):**
- Preguntas genéricas: `"Pregunta 1: ${prompt}"`
- Opciones fijas siempre iguales
- Sin inteligencia artificial
- Sin contexto real
- Sin gamificación

### ✅ **Ahora (AZURE OPENAI + GAMIFICACIÓN):**
- Preguntas inteligentes basadas en el prompt
- Opciones contextuales y relevantes
- Con GPT-3.5-turbo real
- Entiende el contexto del usuario
- **GAMIFICACIÓN COMPLETA:**
  - Iconos emoji para preguntas y respuestas
  - Colores temáticos que representan emociones
  - Temas categorizados (satisfaction, leadership, etc.)
  - Experiencia visual y divertida
  - Fallback inteligente gamificado
