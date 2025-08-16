# API Specifications - Sistema de Clima Laboral

## 🎯 **Propósito**
Este documento define las especificaciones de las APIs para el Sistema de Clima Laboral, incluyendo endpoints, autenticación, modelos de datos y ejemplos de uso.

## 🔐 **Autenticación y Seguridad**

### **Autenticación**
- **Tipo**: OAuth 2.0 + OpenID Connect
- **Proveedor**: Azure AD (Entra ID)
- **Flujo**: Authorization Code Flow
- **Tokens**: JWT (JSON Web Tokens)
- **Expiración**: Access Token (1 hora), Refresh Token (30 días)

### **Autorización**
- **Método**: RBAC (Role-Based Access Control)
- **Roles**:
  - `Employee`: Acceso a encuestas y respuestas propias
  - `TH_Manager`: Gestión de encuestas y visualización de resultados
  - `System_Admin`: Administración completa del sistema

### **Headers Requeridos**
```http
Authorization: Bearer {access_token}
Content-Type: application/json
X-Request-ID: {uuid}
X-User-Agent: {client_info}
```

## 📊 **Endpoints de Autenticación**

### **POST /api/auth/login**
**Descripción**: Inicio de sesión de usuario
**Roles**: Todos

**Request Body**:
```json
{
  "email": "usuario@empresa.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": 12345,
      "email": "usuario@empresa.com",
      "firstName": "Juan",
      "lastName": "Pérez",
      "role": "Employee",
      "department": "IT"
    }
  }
}
```

### **POST /api/auth/refresh**
**Descripción**: Renovación de token de acceso
**Roles**: Todos

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **POST /api/auth/logout**
**Descripción**: Cierre de sesión
**Roles**: Todos

## 📋 **Endpoints de Encuestas**

### **GET /api/surveys**
**Descripción**: Obtener lista de encuestas disponibles
**Roles**: Employee, TH_Manager, System_Admin

**Query Parameters**:
- `status`: active, inactive, all
- `type`: monthly, quarterly, annual
- `department`: ID del departamento
- `page`: número de página
- `limit`: elementos por página

**Response**:
```json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": 1,
        "name": "Encuesta de Clima Laboral - Enero 2024",
        "description": "Evaluación mensual del ambiente laboral",
        "type": "monthly",
        "startDate": "2024-01-01",
        "endDate": "2024-01-31",
        "status": "active",
        "totalQuestions": 15,
        "estimatedTime": "10-15 minutos",
        "participationRate": 85.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### **GET /api/surveys/{id}**
**Descripción**: Obtener detalles de una encuesta específica
**Roles**: Employee, TH_Manager, System_Admin

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Encuesta de Clima Laboral - Enero 2024",
    "description": "Evaluación mensual del ambiente laboral",
    "type": "monthly",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "status": "active",
    "questions": [
      {
        "id": 1,
        "text": "¿Qué tan satisfecho estás con tu trabajo en general?",
        "type": "scale",
        "minValue": 1,
        "maxValue": 10,
        "required": true,
        "orderIndex": 1
      }
    ],
    "instructions": "Responde honestamente cada pregunta...",
    "estimatedTime": "10-15 minutos"
  }
}
```

### **POST /api/surveys**
**Descripción**: Crear nueva encuesta
**Roles**: TH_Manager, System_Admin

**Request Body**:
```json
{
  "name": "Nueva Encuesta de Clima Laboral",
  "description": "Descripción de la encuesta",
  "type": "monthly",
  "startDate": "2024-02-01",
  "endDate": "2024-02-29",
  "notificationDate": "2024-01-25",
  "questions": [
    {
      "text": "¿Qué tan satisfecho estás con tu trabajo?",
      "type": "scale",
      "minValue": 1,
      "maxValue": 10,
      "required": true,
      "orderIndex": 1
    }
  ],
  "targetAudience": {
    "departments": [1, 2, 3],
    "positions": [1, 2],
    "excludeInactive": true
  }
}
```

### **PUT /api/surveys/{id}**
**Descripción**: Actualizar encuesta existente
**Roles**: TH_Manager, System_Admin

### **DELETE /api/surveys/{id}**
**Descripción**: Eliminar encuesta
**Roles**: System_Admin

## 📝 **Endpoints de Respuestas**

### **POST /api/surveys/{id}/responses**
**Descripción**: Enviar respuestas de encuesta
**Roles**: Employee

**Request Body**:
```json
{
  "answers": [
    {
      "questionId": 1,
      "answerValue": "8",
      "numericValue": 8
    },
    {
      "questionId": 2,
      "answerValue": "Excelente ambiente de trabajo",
      "numericValue": null
    }
  ],
  "startedAt": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:45:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "responseId": 12345,
    "status": "completed",
    "message": "Encuesta enviada exitosamente",
    "referenceNumber": "SR-2024-001-12345"
  }
}
```

### **GET /api/surveys/{id}/responses**
**Descripción**: Obtener respuestas de una encuesta
**Roles**: TH_Manager, System_Admin

**Query Parameters**:
- `status`: started, completed, abandoned
- `department`: ID del departamento
- `dateFrom`: fecha de inicio
- `dateTo`: fecha de fin

### **GET /api/employees/{id}/responses**
**Descripción**: Obtener historial de respuestas de un empleado
**Roles**: Employee (solo propias), TH_Manager, System_Admin

## 🔔 **Endpoints de Notificaciones**

### **POST /api/notifications/send**
**Descripción**: Enviar notificaciones masivas
**Roles**: TH_Manager, System_Admin

**Request Body**:
```json
{
  "surveyId": 1,
  "notificationType": "email",
  "template": "survey_reminder",
  "audience": {
    "departments": [1, 2, 3],
    "excludeResponded": true
  },
  "schedule": {
    "sendImmediately": false,
    "scheduledDate": "2024-01-20T09:00:00Z"
  }
}
```

### **GET /api/notifications/status**
**Descripción**: Obtener estado de notificaciones enviadas
**Roles**: TH_Manager, System_Admin

### **POST /api/notifications/retry**
**Descripción**: Reintentar notificaciones fallidas
**Roles**: TH_Manager, System_Admin

## 🤖 **Endpoints de IA/ML**

### **POST /api/ai/sentiment-analysis**
**Descripción**: Analizar sentimiento de respuestas de texto
**Roles**: TH_Manager, System_Admin

**Request Body**:
```json
{
  "text": "Excelente ambiente de trabajo, muy satisfecho",
  "language": "es"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 0.95,
    "score": 0.8,
    "keyPhrases": ["excelente ambiente", "muy satisfecho"],
    "language": "es"
  }
}
```

### **POST /api/ai/pattern-detection**
**Descripción**: Detectar patrones en respuestas
**Roles**: TH_Manager, System_Admin

### **GET /api/ai/insights**
**Descripción**: Obtener insights generados por IA
**Roles**: TH_Manager, System_Admin

## 📊 **Endpoints de Reportes**

### **GET /api/reports/participation**
**Descripción**: Reporte de participación por departamento
**Roles**: TH_Manager, System_Admin

**Query Parameters**:
- `surveyId`: ID de la encuesta
- `dateFrom`: fecha de inicio
- `dateTo`: fecha de fin
- `format`: json, csv, pdf, excel

### **GET /api/reports/satisfaction**
**Descripción**: Reporte de satisfacción general
**Roles**: TH_Manager, System_Admin

### **GET /api/reports/trends**
**Descripción**: Análisis de tendencias históricas
**Roles**: TH_Manager, System_Admin

## 👥 **Endpoints de Empleados**

### **GET /api/employees**
**Descripción**: Obtener lista de empleados
**Roles**: TH_Manager, System_Admin

### **GET /api/employees/{id}**
**Descripción**: Obtener detalles de un empleado
**Roles**: Employee (solo propio), TH_Manager, System_Admin

### **GET /api/departments**
**Descripción**: Obtener lista de departamentos
**Roles**: Todos

### **GET /api/positions**
**Descripción**: Obtener lista de posiciones
**Roles**: Todos

## 📈 **Endpoints de Métricas**

### **GET /api/metrics/dashboard**
**Descripción**: Métricas para dashboard ejecutivo
**Roles**: TH_Manager, System_Admin

**Response**:
```json
{
  "success": true,
  "data": {
    "participationRate": 87.5,
    "averageSatisfaction": 7.8,
    "totalResponses": 7890,
    "pendingResponses": 1110,
    "departmentBreakdown": [
      {
        "department": "IT",
        "participationRate": 92.3,
        "averageSatisfaction": 8.1
      }
    ],
    "trends": {
      "lastMonth": 85.2,
      "currentMonth": 87.5,
      "change": "+2.3%"
    }
  }
}
```

### **GET /api/metrics/real-time**
**Descripción**: Métricas en tiempo real
**Roles**: TH_Manager, System_Admin

## 🔧 **Endpoints de Sistema**

### **GET /api/system/health**
**Descripción**: Estado de salud del sistema
**Roles**: Todos

### **GET /api/system/logs**
**Descripción**: Logs del sistema
**Roles**: System_Admin

### **POST /api/system/maintenance**
**Descripción**: Programar mantenimiento
**Roles**: System_Admin

## 📋 **Códigos de Estado HTTP**

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos de entrada inválidos
- **401**: Unauthorized - Token inválido o expirado
- **403**: Forbidden - Sin permisos para la operación
- **404**: Not Found - Recurso no encontrado
- **429**: Too Many Requests - Límite de rate exceeded
- **500**: Internal Server Error - Error interno del servidor

## 🔒 **Rate Limiting**

- **Límite general**: 1000 requests por hora por usuario
- **Endpoints críticos**: 100 requests por hora por usuario
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite de requests
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Tiempo de reset

## 📚 **Documentación Adicional**

- **Swagger/OpenAPI**: Disponible en `/api/docs`
- **Postman Collection**: Disponible para importar
- **SDK**: Cliente .NET disponible en NuGet
- **Ejemplos**: Repositorio de ejemplos en GitHub

## 🎯 **Próximos Pasos**
1. Implementar endpoints en Azure Functions
2. Configurar Azure API Management
3. Implementar autenticación con Azure AD
4. Crear tests unitarios y de integración
5. Documentar con Swagger/OpenAPI
