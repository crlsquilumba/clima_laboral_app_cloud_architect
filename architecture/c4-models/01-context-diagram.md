# Diagrama de Contexto C4 - Sistema de Clima Laboral

## 🎯 **Propósito**
Mostrar el contexto del Sistema de Clima Laboral para una empresa de retail de alimentos, identificando los usuarios principales, sistemas externos y el sistema principal de manera clara y entendible.

## 👥 **Actores del Sistema**

### **Usuarios Humanos**
- **Empleados (9K usuarios)**: Usuarios finales que responden encuestas de clima laboral
- **Encargados de TH**: Personal que configura evaluaciones y visualiza resultados
- **Administradores del Sistema**: Personal técnico para mantenimiento y configuración

## 🏗️ **Sistema Principal**
**Clima Laboral App**: Sistema de evaluación de clima laboral que permite a los empleados responder encuestas desde cualquier ubicación las 24 horas del día, con notificaciones automáticas por email y SMS.

## 🔗 **Sistemas Externos Relacionados**

### **Autenticación y Seguridad**
- **Azure AD (Entra ID)**: Sistema de autenticación corporativa para empleados
- **Azure Key Vault**: Gestión segura de secretos y claves

### **Servicios de Notificación**
- **Servicio de Email**: Para notificaciones masivas de evaluaciones
- **Servicio de SMS**: Para recordatorios por mensaje de texto
- **Servicio de WhatsApp**: Para notificaciones push adicionales

### **Sistemas Corporativos**
- **Sistema de Nómina**: Para sincronización de empleados activos
- **Sistema de RRHH**: Para datos organizacionales y estructura

### **Servicios de IA/ML**
- **Azure AI Language**: Para análisis de sentimiento de respuestas
- **Azure Machine Learning**: Para detección de patrones y tendencias
- **Azure OpenAI**: Para chatbot interno de consultas

## 🔄 **Relaciones Clave**

### **Empleados → Clima Laboral App**
- **Reciben** notificaciones por Email/SMS
- **Acceden** a la aplicación web/móvil 24/7
- **Responden** encuestas de clima laboral
- **Reciben** confirmaciones de participación

### **Encargados de TH → Clima Laboral App**
- **Configuran** evaluaciones y preguntas
- **Monitorean** tasas de participación
- **Visualizan** resultados y análisis
- **Generan** reportes ejecutivos

### **Administradores → Clima Laboral App**
- **Gestionan** usuarios y permisos
- **Configuran** parámetros de seguridad
- **Monitorean** rendimiento del sistema
- **Mantienen** la infraestructura

### **Clima Laboral App → Azure AD**
- **Autentica** usuarios empleados
- **Autoriza** acceso a funcionalidades
- **Gestiona** sesiones de usuario

### **Clima Laboral App → Servicios de Notificación**
- **Envía** notificaciones masivas por Email
- **Envía** recordatorios por SMS
- **Envía** notificaciones por WhatsApp
- **Monitorea** entregas y respuestas

### **Clima Laboral App → Sistemas Corporativos**
- **Sincroniza** lista de empleados activos
- **Obtiene** información organizacional
- **Valida** estado y permisos de empleados

### **Clima Laboral App → Servicios de IA**
- **Envía** respuestas para análisis de sentimiento
- **Procesa** datos para detección de patrones
- **Integra** chatbot para consultas automáticas

## 📱 **Tecnologías del Sistema**
- **Frontend Web**: React + TypeScript (Azure Static Web Apps)
- **Frontend Móvil**: React Native + Expo (multi-plataforma)
- **Backend**: Azure Functions (.NET 8) - Serverless
- **Base de Datos**: Azure SQL Database
- **Almacenamiento**: Azure Blob Storage + CDN
- **Infraestructura**: Azure Application Gateway + VNet

## 🎯 **Objetivo del Sistema**
Permitir a 9K empleados responder encuestas de clima laboral de manera confidencial y anónima desde cualquier ubicación las 24 horas del día, proporcionando a la organización insights valiosos sobre el ambiente laboral para la toma de decisiones estratégicas, con alta disponibilidad y escalabilidad en Azure.

## 🔒 **Consideraciones de Seguridad**
- Autenticación mediante Azure AD (Entra ID) con MFA
- Gestión de secretos en Azure Key Vault
- WAF (Web Application Firewall) para protección
- Datos encriptados en tránsito y reposo
- Cumplimiento de regulaciones de privacidad (GDPR, etc.)

## 📊 **Flujo Principal**
1. **Sistema** programa evaluaciones mensuales (2 por empleado)
2. **Sistema** envía notificaciones masivas por Email/SMS
3. **Empleados** se autentican en **Azure AD**
4. **Empleados** acceden a **Clima Laboral App** (Web/Móvil)
5. **Empleados** responden encuestas de clima laboral
6. **Sistema** procesa y almacena respuestas en **Azure SQL**
7. **Sistema** envía datos a servicios de **IA/ML** para análisis
8. **Encargados de TH** visualizan resultados en dashboard
9. **Sistema** genera reportes automáticos y análisis

## 📈 **Métricas de Escala**
- **Usuarios**: 9,000 empleados
- **Evaluaciones**: 18,000 por mes (2 por empleado)
- **Notificaciones**: 36,000 por mes (Email + SMS)
- **Disponibilidad**: 24/7
- **Respuesta**: < 2 segundos para operaciones críticas
- **Alta Disponibilidad**: 99.9%+ uptime

## 🎯 **Próximos Pasos**
1. Crear diagrama de contenedores C4
2. Definir arquitectura de Azure detallada
3. Especificar flujos de datos y APIs
4. Diseñar módulos de IA/ML
5. Planificar estrategia de migración
