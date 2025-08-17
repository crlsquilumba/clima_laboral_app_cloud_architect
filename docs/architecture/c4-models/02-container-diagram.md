# C4 Container Diagram - Sistema de Clima Laboral

## 🎯 **Propósito**
Este diagrama muestra la arquitectura interna del Sistema de Clima Laboral a nivel de contenedores, identificando los contenedores principales, sus responsabilidades y las tecnologías utilizadas, basándose únicamente en los requisitos del ejercicio.

## 🏗️ **Contenedores del Sistema**

### **Frontend Applications**

#### **1. Web Application Container**
- **Tecnología**: React + TypeScript
- **Hosting**: Azure Static Web Apps
- **Responsabilidades**:
  - Interfaz web para empleados
  - Dashboard administrativo para encargados de TH
  - Formularios de encuestas de clima laboral
  - Visualización de resultados y reportes
- **Escalabilidad**: Auto-scaling automático
- **Acceso**: 24/7 desde cualquier ubicación

#### **2. Mobile Application Container**
- **Tecnología**: React Native + Expo
- **Plataformas**: iOS, Android
- **Responsabilidades**:
  - Aplicación móvil para empleados
  - Encuestas offline-capable
  - Notificaciones push
  - Sincronización de datos
- **Distribución**: App Store, Google Play
- **Acceso**: 24/7 desde cualquier ubicación

### **Backend Services**

#### **3. API Gateway Container**
- **Tecnología**: Azure API Management
- **Responsabilidades**:
  - Enrutamiento de requests
  - Rate limiting
  - Autenticación y autorización
  - Logging y monitoreo
  - Versionado de APIs
- **Escalabilidad**: Auto-scaling automático

#### **4. Authentication Container**
- **Tecnología**: Azure AD (Entra ID)
- **Responsabilidades**:
  - Autenticación de usuarios empleados
  - Gestión de identidades corporativas
  - Single Sign-On (SSO)
  - Multi-Factor Authentication (MFA)
  - Gestión de roles y permisos
- **Integración**: Sistema corporativo existente

#### **5. Survey Management Container**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - CRUD de encuestas de clima laboral
  - Gestión de preguntas configurables
  - Programación de evaluaciones mensuales (2 veces por mes)
  - Configuración de notificaciones automáticas
- **Escalabilidad**: Serverless auto-scaling
- **Procesamiento**: 9K empleados

#### **6. Survey Response Container**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Captura de respuestas de empleados
  - Validación de datos de entrada
  - Almacenamiento en base de datos
  - Procesamiento asíncrono de respuestas
- **Escalabilidad**: Serverless auto-scaling
- **Volumen**: 18K evaluaciones/mes

#### **7. Notification Container**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Envío de emails masivos a 9K empleados
  - Envío de SMS para recordatorios
  - Notificaciones WhatsApp Business
  - Seguimiento de entregas y respuestas
  - Retry automático para fallos
- **Volumen**: 36K notificaciones/mes
- **Escalabilidad**: Serverless auto-scaling

#### **8. AI/ML Processing Container**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Análisis de sentimiento usando Azure AI Language
  - Detección de patrones con Azure Machine Learning
  - Procesamiento de datos para análisis de IA
  - Generación de insights automáticos
- **Escalabilidad**: Serverless auto-scaling
- **Integración**: Azure AI Services

#### **8.1. Sentiment Analysis Scheduler Container**
- **Tecnología**: Azure Functions (.NET 8) + Timer Trigger
- **Responsabilidades**:
  - Ejecución automática cada 6 horas
  - Revisión de respuestas de empleados pendientes
  - Análisis de sentimiento usando Azure AI Language
  - Almacenamiento de resultados en base de datos SQL
  - Procesamiento asíncrono y batch
- **Trigger**: Cron expression (0 0 */6 * * *)
- **Escalabilidad**: Serverless auto-scaling

#### **9. Reporting Container**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Generación de reportes de participación
  - Dashboards en tiempo real para TH
  - Exportación de datos en múltiples formatos
  - Análisis estadísticos de respuestas
- **Integración**: Azure Data Factory, Power BI
- **Escalabilidad**: Serverless auto-scaling

### **Data Storage**

#### **10. Primary Database Container**
- **Tecnología**: Azure SQL Database
- **Responsabilidades**:
  - Almacenamiento de 9K empleados
  - Encuestas y respuestas mensuales
  - Configuraciones del sistema
  - Metadatos de notificaciones
- **Características**: Alta disponibilidad, backup automático
- **Escalabilidad**: Auto-scaling con DTU vCore

#### **11. File Storage Container**
- **Tecnología**: Azure Blob Storage
- **Responsabilidades**:
  - Archivos estáticos (CSS, JS, imágenes)
  - Documentos de encuestas
  - Reportes exportados
  - Logs del sistema
- **Integración**: Azure CDN para optimización
- **Escalabilidad**: Ilimitada

#### **12. Message Queue Container**
- **Tecnología**: Azure Service Bus
- **Responsabilidades**:
  - Procesamiento asíncrono de notificaciones
  - Cola de análisis de IA/ML
  - Cola de reportes automáticos
  - Dead letter queue para fallos
- **Características**: FIFO, garantía de entrega
- **Escalabilidad**: Auto-scaling automático

### **External Services Integration**

#### **13. Email Service Integration Container**
- **Tecnología**: SendGrid / Azure Communication Services
- **Responsabilidades**: Envío de emails transaccionales y masivos
- **Volumen**: 18K emails/mes para evaluaciones

#### **14. SMS Service Integration Container**
- **Tecnología**: Twilio / Azure Communication Services
- **Responsabilidades**: Envío de SMS y verificación
- **Volumen**: 18K SMS/mes para recordatorios

#### **15. WhatsApp Service Integration Container**
- **Tecnología**: WhatsApp Business API
- **Responsabilidades**: Notificaciones push por WhatsApp
- **Uso**: Notificaciones adicionales opcionales

#### **16. AI Services Integration Container**
- **Tecnología**: Azure AI Language, Azure ML, Azure OpenAI
- **Responsabilidades**: Procesamiento de IA/ML para análisis
- **Funcionalidades**: Análisis de sentimiento, detección de patrones, chatbot

#### **17. Power BI Integration Container**
- **Tecnología**: Azure Data Factory
- **Responsabilidades**: Dashboards ejecutivos y reportes automáticos
- **Usuarios**: Encargados de TH y administradores

## 🔄 **Flujos de Comunicación entre Contenedores**

### **Flujo de Autenticación**
1. **Web/Mobile App Container** → **API Gateway Container** → **Authentication Container** → **Azure AD**
2. **Authentication Container** retorna token JWT
3. **Web/Mobile App Container** incluye token en requests a **API Gateway Container**

### **Flujo de Encuesta**
1. **Web/Mobile App Container** solicita encuesta a **Survey Management Container**
2. Usuario completa encuesta
3. **Web/Mobile App Container** envía respuestas a **Survey Response Container**
4. **Survey Response Container** almacena en **Primary Database Container**
5. **Survey Response Container** envía a **Message Queue Container** para procesamiento de IA

### **Flujo de Notificaciones**
1. **Survey Management Container** programa evaluación mensual
2. Crea tarea de notificación en **Message Queue Container**
3. **Notification Container** procesa cola
4. **Notification Container** envía notificaciones por **Email/SMS/WhatsApp Services**
5. **Notification Container** registra estado en **Primary Database Container**

### **Flujo de Análisis de IA**
1. **Survey Response Container** envía datos a **Message Queue Container**
2. **AI/ML Processing Container** procesa cola
3. **AI/ML Processing Container** envía a **AI Services Integration Container**
4. Resultados se almacenan en **Primary Database Container**
5. **Reporting Container** genera insights para **Web App Container**

### **Flujo de Análisis de Sentimiento Programado**
1. **Timer Trigger** ejecuta **Sentiment Analysis Scheduler Container** cada 6 horas
2. **Sentiment Analysis Scheduler Container** consulta respuestas pendientes en **Primary Database Container**
3. **Sentiment Analysis Scheduler Container** envía respuestas a **AI Services Integration Container** para análisis
4. **AI Services Integration Container** retorna análisis de sentimiento
5. **Sentiment Analysis Scheduler Container** almacena resultados en **Primary Database Container**
6. **Reporting Container** actualiza dashboards con nuevos insights

## 🔒 **Seguridad y Compliance**

- **Autenticación**: Azure AD con MFA obligatorio
- **Autorización**: RBAC basado en roles (Employee, TH_Manager, System_Admin)
- **Encriptación**: TLS 1.3, datos encriptados en reposo
- **Cumplimiento**: GDPR, normativas locales de retail
- **Auditoría**: Logs completos de acceso y cambios
- **WAF**: Azure Application Gateway con reglas de seguridad

## 📈 **Escalabilidad y Alta Disponibilidad**

- **Auto-scaling**: Basado en métricas de CPU, memoria y colas
- **Multi-región**: Despliegue en múltiples regiones de Azure
- **Load Balancing**: Azure Application Gateway con health checks
- **Failover**: Recuperación automática ante fallos
- **Backup**: Copias automáticas con geo-replicación

## 📊 **Métricas de Rendimiento**

### **Objetivos de SLA**
- **Disponibilidad**: 99.9%+ uptime
- **Latencia**: < 2 segundos para operaciones críticas
- **Throughput**: 1000+ transacciones/segundo
- **Backup**: RPO < 15 minutos, RTO < 1 hora

### **Monitoreo**
- **Azure Monitor**: Métricas de infraestructura
- **Application Insights**: Telemetría de aplicaciones
- **Log Analytics**: Análisis de logs centralizado
- **Alertas**: Notificaciones automáticas para incidentes

## 🎯 **Próximos Pasos**
1. Crear diagrama de componentes C4
2. Definir interfaces de APIs detalladas
3. Especificar esquemas de base de datos
4. Diseñar estrategia de migración del monolito
5. Planificar testing y deployment
