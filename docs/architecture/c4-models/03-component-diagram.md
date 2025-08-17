# C4 Component Diagram - Sistema de Clima Laboral

## 🎯 **Propósito**
Este diagrama muestra la arquitectura interna del Sistema de Clima Laboral a nivel de componentes, identificando los módulos principales, sus responsabilidades y las tecnologías utilizadas, basándose únicamente en los requisitos del ejercicio.

## 🏗️ **Componentes del Sistema**

### **Frontend Applications**

#### **1. Web Application Component**
- **Tecnología**: React + TypeScript
- **Hosting**: Azure Static Web Apps
- **Responsabilidades**:
  - Interfaz web para empleados
  - Dashboard administrativo para encargados de TH
  - Formularios de encuestas de clima laboral
  - Visualización de resultados y reportes
- **Escalabilidad**: Auto-scaling automático

#### **2. Mobile Application Component**
- **Tecnología**: React Native + Expo
- **Plataformas**: iOS, Android
- **Responsabilidades**:
  - Aplicación móvil para empleados
  - Encuestas offline-capable
  - Notificaciones push
  - Sincronización de datos
- **Distribución**: App Store, Google Play

### **Backend Services**

#### **3. API Gateway Component**
- **Tecnología**: Azure API Management
- **Responsabilidades**:
  - Enrutamiento de requests
  - Rate limiting
  - Autenticación y autorización
  - Logging y monitoreo
  - Versionado de APIs

#### **4. Authentication Component**
- **Tecnología**: Azure AD (Entra ID)
- **Responsabilidades**:
  - Autenticación de usuarios empleados
  - Gestión de identidades corporativas
  - Single Sign-On (SSO)
  - Multi-Factor Authentication (MFA)
  - Gestión de roles y permisos

#### **5. Survey Management Component**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - CRUD de encuestas de clima laboral
  - Gestión de preguntas configurables
  - Programación de evaluaciones mensuales
  - Configuración de notificaciones automáticas
- **Escalabilidad**: Serverless auto-scaling

#### **6. Survey Response Component**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Captura de respuestas de empleados
  - Validación de datos de entrada
  - Almacenamiento en base de datos
  - Procesamiento asíncrono de respuestas
- **Escalabilidad**: Serverless auto-scaling

#### **7. Notification Component**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Envío de emails masivos a 9K empleados
  - Envío de SMS para recordatorios
  - Notificaciones WhatsApp Business
  - Seguimiento de entregas y respuestas
  - Retry automático para fallos
- **Integración**: Servicios de Email, SMS, WhatsApp

#### **8. AI/ML Processing Component**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Análisis de sentimiento usando Azure AI Language
  - Detección de patrones con Azure Machine Learning
  - Procesamiento de datos para análisis de IA
  - Generación de insights automáticos
- **Escalabilidad**: Serverless auto-scaling

#### **8.1. Sentiment Analysis Scheduler Component**
- **Tecnología**: Azure Functions (.NET 8) + Timer Trigger
- **Responsabilidades**:
  - Ejecución automática cada 6 horas
  - Revisión de respuestas de empleados pendientes
  - Análisis de sentimiento usando Azure AI Language
  - Almacenamiento de resultados en base de datos SQL
  - Procesamiento asíncrono y batch
- **Trigger**: Cron expression (0 0 */6 * * *)
- **Escalabilidad**: Serverless auto-scaling

#### **9. Reporting Component**
- **Tecnología**: Azure Functions (.NET 8)
- **Responsabilidades**:
  - Generación de reportes de participación
  - Dashboards en tiempo real para TH
  - Exportación de datos en múltiples formatos
  - Análisis estadísticos de respuestas
- **Integración**: Azure Data Factory, Power BI

### **Data Storage**

#### **10. Primary Database Component**
- **Tecnología**: Azure SQL Database
- **Responsabilidades**:
  - Almacenamiento de 9K empleados
  - Encuestas y respuestas mensuales
  - Configuraciones del sistema
  - Metadatos de notificaciones
- **Características**: Alta disponibilidad, backup automático

#### **11. File Storage Component**
- **Tecnología**: Azure Blob Storage
- **Responsabilidades**:
  - Archivos estáticos (CSS, JS, imágenes)
  - Documentos de encuestas
  - Reportes exportados
  - Logs del sistema
- **Integración**: Azure CDN para optimización

#### **12. Message Queue Component**
- **Tecnología**: Azure Service Bus
- **Responsabilidades**:
  - Procesamiento asíncrono de notificaciones
  - Cola de análisis de IA/ML
  - Cola de reportes automáticos
  - Dead letter queue para fallos
- **Características**: FIFO, garantía de entrega

### **External Services Integration**

#### **13. Email Service Integration**
- **Tecnología**: SendGrid / Azure Communication Services
- **Responsabilidades**: Envío de emails transaccionales y masivos

#### **14. SMS Service Integration**
- **Tecnología**: Twilio / Azure Communication Services
- **Responsabilidades**: Envío de SMS y verificación

#### **15. WhatsApp Service Integration**
- **Tecnología**: WhatsApp Business API
- **Responsabilidades**: Notificaciones push por WhatsApp

#### **16. AI Services Integration**
- **Tecnología**: Azure AI Language, Azure ML, Azure OpenAI
- **Responsabilidades**: Procesamiento de IA/ML para análisis

## 🔄 **Flujos de Comunicación entre Componentes**

### **Flujo de Autenticación**
1. **Web/Mobile App** → **API Gateway** → **Authentication Component** → **Azure AD**
2. **Authentication Component** retorna token JWT
3. **Web/Mobile App** incluye token en requests a **API Gateway**

### **Flujo de Encuesta**
1. **Web/Mobile App** solicita encuesta a **Survey Management Component**
2. Usuario completa encuesta
3. **Web/Mobile App** envía respuestas a **Survey Response Component**
4. **Survey Response Component** almacena en **Primary Database**
5. **Survey Response Component** envía a **Message Queue** para procesamiento de IA

### **Flujo de Notificaciones**
1. **Survey Management Component** programa evaluación mensual
2. Crea tarea de notificación en **Message Queue**
3. **Notification Component** procesa cola
4. **Notification Component** envía notificaciones por **Email/SMS/WhatsApp Services**
5. **Notification Component** registra estado en **Primary Database**

### **Flujo de Análisis de IA**
1. **Survey Response Component** envía datos a **Message Queue**
2. **AI/ML Processing Component** procesa cola
3. **AI/ML Processing Component** envía a **AI Services Integration**
4. Resultados se almacenan en **Primary Database**
5. **Reporting Component** genera insights para **Web App**

### **Flujo de Análisis de Sentimiento Programado**
1. **Timer Trigger** ejecuta **Sentiment Analysis Scheduler Component** cada 6 horas
2. **Sentiment Analysis Scheduler Component** consulta respuestas pendientes en **Primary Database**
3. **Sentiment Analysis Scheduler Component** envía respuestas a **AI Services Integration** para análisis
4. **AI Services Integration** retorna análisis de sentimiento
5. **Sentiment Analysis Scheduler Component** almacena resultados en **Primary Database**
6. **Reporting Component** actualiza dashboards con nuevos insights

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
1. Crear diagrama de código C4
2. Definir interfaces de APIs detalladas
3. Especificar esquemas de base de datos
4. Diseñar estrategia de migración del monolito
5. Planificar testing y deployment
