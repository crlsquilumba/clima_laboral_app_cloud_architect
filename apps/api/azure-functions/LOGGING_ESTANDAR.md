# 📊 ESTÁNDAR DE LOGGING ESTRUCTURADO - CLIMA LABORAL APP

## 🎯 OBJETIVO
Implementar un sistema de logging estándar para microservicios que permita:
- **Trazabilidad completa** de cada request
- **Monitoreo de servicios externos** (Azure OpenAI)
- **Visualización en Application Insights**
- **Debugging eficiente** en desarrollo y producción
- **Siempre 4 logs por request** (con opcional log de error)
- **Manejo correcto de errores HTTP** (4xx vs 5xx)

---

## 🏗️ ARQUITECTURA DE LOGGING

### **📁 ESTRUCTURA DE ARCHIVOS:**
```
shared/
├── StructuredLogger.js     # Logger centralizado
├── config.js              # Configuración centralizada
└── ...

generateSurveyQuestions/
├── index.js               # Función principal con logging
└── function.json          # Configuración de Azure Function
```

---

## 🔧 CONFIGURACIÓN

### **🌍 VARIABLES DE ENTORNO:**
```json
{
  "SERVICE_NAME": "generateSurveyQuestions",
  "EXTERNAL_SERVICE_OPENAI": "azure-openai",
  "EXTERNAL_SERVICE_OPENAI_ENDPOINT": "https://...",
  "ENVIRONMENT": "dev|test|prod",
  "LOG_LEVEL": "INFO",
  "ENABLE_STRUCTURED_LOGGING": "true"
}
```

### **📊 NIVELES DE LOG:**
- **DEBUG (0):** Información detallada para desarrollo
- **INFO (1):** Información general de operaciones
- **WARN (2):** Advertencias no críticas
- **ERROR (3):** Errores que requieren atención

---

## 📝 FLUJO COMPLETO DE LOGS - SIEMPRE 4 LOGS

### **🎯 REGLA PRINCIPAL:**
**Cada request SIEMPRE genera exactamente 4 logs, independientemente del resultado.**

---

### **🚀 1. FUNCIÓN INICIA (SIEMPRE):**
```javascript
logger.functionStart({
  requestId: context.invocationId,
  method: request.method,
  url: request.url,
  headers: Object.keys(request.headers)
});
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:00.000Z",
  "level": "INFO",
  "functionName": "generateSurveyQuestions",
  "operation": "start",
  "correlationId": "abc-123-def",
  "payload": {
    "requestId": "invocation-123",
    "method": "POST",
    "url": "/api/surveys/generate",
    "headers": ["content-type", "authorization"]
  },
  "metadata": {
    "environment": "dev",
    "operation": "function_execution_start"
  }
}
```

### **🔍 2. VALIDACIÓN DE INPUTS (SIEMPRE):**
```javascript
logger.functionValidation({
  prompt: !!body.prompt,
  questionCount: !!body.questionCount,
  questionTypes: !!body.questionTypes,
  hasAllRequiredFields: true
});
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:01.000Z",
  "level": "DEBUG",
  "functionName": "generateSurveyQuestions",
  "operation": "validation",
  "correlationId": "abc-123-def",
  "payload": {
    "prompt": true,
    "questionCount": true,
    "questionTypes": true,
    "hasAllRequiredFields": true
  },
  "metadata": {
    "environment": "dev",
    "operation": "input_validation"
  }
}
```

### **🌐 3. SERVICIO EXTERNO O ERROR (SIEMPRE):**

#### **CASO A: Request válido - Llamada a Azure OpenAI**
```javascript
logger.externalServiceRequest('azure-openai', {
  endpoint: url,
  deployment: config.azureOpenAI.deploymentName,
  prompt: prompt,
  questionCount: questionCount,
  questionTypes: questionTypes
});
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:02.000Z",
  "level": "INFO",
  "functionName": "generateSurveyQuestions",
  "operation": "azure-openai_request",
  "correlationId": "abc-123-def",
  "payload": {
    "endpoint": "https://clima-laboral-ai-v2.openai.azure.com/...",
    "deployment": "clima-laboral-ai-gpt35",
    "prompt": "Crear encuesta sobre satisfacción laboral",
    "questionCount": 5,
    "questionTypes": ["gamified_rating"]
  },
  "metadata": {
    "environment": "dev",
    "operation": "external_service_call",
    "service": "azure-openai"
  }
}
```

#### **CASO B: Error de validación**
```javascript
logger.functionError(new Error(error), { 
  context: 'input-validation-failed',
  receivedFields: Object.keys(body),
  requiredFields: ['prompt', 'questionCount', 'questionTypes']
});
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:01.500Z",
  "level": "ERROR",
  "functionName": "generateSurveyQuestions",
  "operation": "error",
  "correlationId": "abc-123-def",
  "payload": {
    "message": "Missing required fields: prompt, questionCount, questionTypes",
    "code": "UNKNOWN_ERROR",
    "stack": "Error: Missing required fields..."
  },
  "metadata": {
    "environment": "dev",
    "operation": "error_occurred",
    "context": "input-validation-failed"
  }
}
```

#### **CASO C: Error de configuración**
```javascript
logger.functionError(new Error("Azure OpenAI no configurado"), {
  context: 'azure-openai-not-configured',
  fallbackTo: 'mock-data'
});
```

#### **CASO D: Error de Azure OpenAI (CLIENTE - 4xx)**
```javascript
logger.functionError(aiError, {
  context: 'azure-openai-call-failed',
  errorDetails: {
    message: aiError.message,
    code: aiError.code,
    status: aiError.response?.status,
    statusText: aiError.response?.statusText
  }
});
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:02.500Z",
  "level": "ERROR",
  "functionName": "generateSurveyQuestions",
  "operation": "error",
  "correlationId": "abc-123-def",
  "payload": {
    "message": "Request failed with status code 429",
    "code": "ERR_BAD_REQUEST",
    "stack": "AxiosError: Request failed with status code 429...",
    "context": "azure-openai-call-failed",
    "errorDetails": {
      "message": "Request failed with status code 429",
      "code": "ERR_BAD_REQUEST",
      "status": 429,
      "statusText": "Too Many Requests"
    }
  },
  "metadata": {
    "environment": "dev",
    "operation": "error_occurred",
    "context": "azure-openai-call-failed"
  }
}
```

#### **CASO E: Error de Azure OpenAI (SERVIDOR - 5xx)**
```javascript
logger.functionError(aiError, {
  context: 'azure-openai-call-failed',
  errorDetails: {
    message: aiError.message,
    code: aiError.code,
    status: aiError.response?.status,
    statusText: aiError.response?.statusText
  }
});
```

#### **CASO F: Error general**
```javascript
logger.functionError(error, {
  context: 'function-execution',
  errorType: 'unexpected_error'
});
```

### **✅ 4. RESPUESTA FINAL (SIEMPRE):**

#### **CASO A: Request exitoso con Azure OpenAI**
```javascript
logger.functionResponse({
  success: true,
  questionsCount: questions.length,
  questionTypes: questionTypes,
  prompt: prompt,
  gamified: true,
  source: 'azure-openai'
}, totalDuration);
```

**Log generado:**
```json
{
  "timestamp": "2025-08-16T12:00:03.500Z",
  "level": "INFO",
  "functionName": "generateSurveyQuestions",
  "operation": "response",
  "correlationId": "abc-123-def",
  "payload": {
    "success": true,
    "questionsCount": 5,
    "questionTypes": ["gamified_rating"],
    "prompt": "Crear encuesta sobre satisfacción laboral",
    "gamified": true,
    "source": "azure-openai"
  },
  "metadata": {
    "environment": "dev",
    "operation": "function_execution_end",
    "totalDuration": "3500ms"
  }
}
```

#### **CASO B: Request exitoso con fallback (solo errores 5xx)**
```javascript
logger.functionResponse({
  success: true,
  questionsCount: questionCount,
  questionTypes: questionTypes,
  prompt: prompt,
  gamified: true,
  source: 'mock-fallback',
  fallbackReason: 'azure-openai-server-error',
  originalError: aiError.message
}, totalDuration);
```

#### **CASO C: Request con error (errores 4xx)**
```javascript
logger.functionResponse({
  success: false,
  error: aiError.message,
  errorType: 'azure-openai-client-error',
  statusCode: aiError.response?.status,
  statusText: aiError.response?.statusText,
  isRateLimit: isRateLimit,
  isAuthError: isAuthError
}, totalDuration);
```

**Log generado para error 429:**
```json
{
  "timestamp": "2025-08-16T12:00:02.600Z",
  "level": "INFO",
  "functionName": "generateSurveyQuestions",
  "operation": "response",
  "correlationId": "abc-123-def",
  "payload": {
    "success": false,
    "error": "Request failed with status code 429",
    "errorType": "azure-openai-client-error",
    "statusCode": 429,
    "statusText": "Too Many Requests",
    "isRateLimit": true,
    "isAuthError": false
  },
  "metadata": {
    "environment": "dev",
    "operation": "function_execution_end",
    "totalDuration": "600ms"
  }
}
```

#### **CASO D: Request con error interno**
```javascript
logger.functionResponse({
  success: false,
  error: "Internal server error",
  errorType: 'internal_error'
}, totalDuration);
```

---

## 🚨 MANEJO CORRECTO DE ERRORES HTTP

### **🎯 REGLA FUNDAMENTAL:**
**Los errores del cliente (4xx) SIEMPRE se devuelven como errores, NUNCA como fallback exitoso.**

### **📊 CLASIFICACIÓN DE ERRORES:**

#### **❌ ERRORES DEL CLIENTE (4xx) - NO USAR FALLBACK:**
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** API key inválida
- **403 Forbidden:** Sin permisos
- **429 Too Many Requests:** Rate limit excedido
- **404 Not Found:** Recurso no encontrado

#### **⚠️ ERRORES DEL SERVIDOR (5xx) - USAR FALLBACK:**
- **500 Internal Server Error:** Error interno de Azure OpenAI
- **502 Bad Gateway:** Problema de conectividad
- **503 Service Unavailable:** Servicio no disponible
- **504 Gateway Timeout:** Timeout del servicio

### **🔧 IMPLEMENTACIÓN:**
```javascript
// Determinar tipo de error
const isClientError = aiError.response?.status >= 400 && aiError.response?.status < 500;
const isRateLimit = aiError.response?.status === 429;
const isAuthError = aiError.response?.status === 401 || aiError.response?.status === 403;

if (isClientError) {
    // Devolver error, NO fallback
    return {
        status: aiError.response?.status || 500,
        body: JSON.stringify({
            success: false,
            error: aiError.message,
            errorType: 'azure-openai-client-error',
            statusCode: aiError.response?.status,
            isRateLimit: isRateLimit,
            isAuthError: isAuthError
        })
    };
} else {
    // Solo fallback para errores del servidor (5xx)
    return generateGamifiedMockQuestions(...);
}
```

---

## 🔍 QUERIES ÚTILES EN APPLICATION INSIGHTS

### **📊 1. Trazabilidad Completa por Request:**
```kusto
traces
| where customDimensions.functionName == "generateSurveyQuestions"
| where customDimensions.correlationId == "abc-123-def"
| order by timestamp asc
```

### **⚡ 2. Performance por Función:**
```kusto
traces
| where customDimensions.functionName == "generateSurveyQuestions"
| where customDimensions.operation == "response"
| extend duration = toint(customDimensions.totalDuration)
| summarize avg(duration), max(duration), min(duration)
```

### **❌ 3. Errores por Tipo:**
```kusto
traces
| where customDimensions.operation == "error"
| summarize count() by customDimensions.context
```

### **🚨 4. Errores de Rate Limit (429):**
```kusto
traces
| where customDimensions.operation == "response"
| where customDimensions.isRateLimit == "true"
| summarize count() by bin(timestamp, 1h)
```

### **🌐 5. Latencia de Servicios Externos:**
```kusto
traces
| where customDimensions.operation contains "azure-openai"
| extend responseTime = toint(customDimensions.responseTime)
| summarize avg(responseTime), p95(responseTime)
```

### **📈 6. Throughput por Hora:**
```kusto
traces
| where customDimensions.functionName == "generateSurveyQuestions"
| where customDimensions.operation == "start"
| summarize count() by bin(timestamp, 1h)
```

---

## 🚀 USO DEL LOGGER

### **📝 INICIALIZACIÓN:**
```javascript
const StructuredLogger = require('../shared/StructuredLogger');
const logger = new StructuredLogger();
```

### **⏱️ MEDICIÓN DE TIEMPO:**
```javascript
// Timer simple
const timer = logger.createTimer();
// ... operación ...
const duration = timer.end(); // "1500ms"

// Medición automática
const result = await logger.measureOperation('azure-openai-call', async () => {
  return await callAzureOpenAI();
});
```

---

## 🎯 BENEFICIOS DEL SISTEMA

### **✅ PARA DESARROLLADORES:**
- **Siempre 4 logs** por request para consistencia
- **Debugging rápido** con correlationId
- **Trazabilidad completa** de cada request
- **Logs estructurados** fáciles de leer
- **Manejo correcto de errores HTTP**

### **✅ PARA OPERACIONES:**
- **Monitoreo en tiempo real** en Application Insights
- **Alertas automáticas** por errores
- **Métricas de performance** detalladas
- **Consistencia** en el número de logs
- **Identificación de rate limits** y errores de autenticación

### **✅ PARA BUSINESS:**
- **Análisis de uso** de servicios
- **Identificación de cuellos de botella**
- **Reportes de SLA** automáticos
- **Auditoría completa** de cada request
- **Monitoreo de límites** de Azure OpenAI

---

## 🔧 MANTENIMIENTO

### **🔄 ACTUALIZAR SERVICIOS:**
```bash
# Cambiar nombre de servicio
export EXTERNAL_SERVICE_OPENAI="gpt-4-service"

# Cambiar endpoint
export EXTERNAL_SERVICE_OPENAI_ENDPOINT="https://nuevo-endpoint.com"
```

### **📊 CAMBIAR NIVEL DE LOG:**
```bash
# Solo errores en producción
export LOG_LEVEL="ERROR"

# Debug completo en desarrollo
export LOG_LEVEL="DEBUG"
```

---

## 🎉 ¡SISTEMA DE LOGGING COMPLETO Y CONSISTENTE!

**Con este estándar tienes:**
- ✅ **Siempre 4 logs** por request (consistencia garantizada)
- ✅ **Logging estructurado** para Application Insights
- ✅ **Trazabilidad completa** con correlationId
- ✅ **Monitoreo de servicios externos**
- ✅ **Configuración centralizada** por variables de entorno
- ✅ **Performance tracking** automático
- ✅ **Debugging eficiente** en todos los ambientes
- ✅ **Manejo correcto de errores HTTP** (4xx vs 5xx)

**¡Tu microservicio está listo para producción con observabilidad completa y manejo correcto de errores!** 🚀
