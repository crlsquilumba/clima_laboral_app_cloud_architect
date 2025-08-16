# User Flow - Sistema de Clima Laboral

## 🎯 **Propósito**
Este documento describe el flujo de usuario para el Sistema de Clima Laboral, incluyendo las experiencias tanto para empleados como para encargados de Talento Humano (TH).

## 👥 **Usuarios del Sistema**

### **1. Empleados (9K usuarios)**
- **Rol**: Responder encuestas de clima laboral
- **Acceso**: Web y móvil, 24/7
- **Frecuencia**: 2 veces por mes
- **Ubicación**: Cualquier lugar

### **2. Encargados de Talento Humano (TH)**
- **Rol**: Configurar evaluaciones y visualizar resultados
- **Acceso**: Panel administrativo web
- **Responsabilidades**: Gestión de encuestas y análisis de resultados

### **3. Administradores del Sistema**
- **Rol**: Mantenimiento y configuración del sistema
- **Acceso**: Consola de administración
- **Responsabilidades**: Gestión de usuarios, configuración de seguridad

## 📱 **Flujo de Usuario - Empleados**

### **1. Notificación y Acceso**
```
1. Empleado recibe notificación por Email/SMS
2. Hace clic en enlace o accede directamente a la app
3. Se autentica con Azure AD (SSO corporativo)
4. Es redirigido a la aplicación principal
```

### **2. Dashboard Principal**
```
1. Empleado ve dashboard personalizado
2. Visualiza encuestas pendientes
3. Ve historial de participaciones anteriores
4. Accede a notificaciones del sistema
```

### **3. Proceso de Encuesta**
```
1. Selecciona encuesta pendiente
2. Lee instrucciones y propósito
3. Responde preguntas una por una:
   - Preguntas de escala (1-10)
   - Preguntas de opción múltiple
   - Preguntas de texto libre
   - Preguntas de Sí/No
4. Revisa respuestas antes de enviar
5. Confirma envío
6. Recibe confirmación de participación
```

### **4. Funcionalidades Adicionales**
```
1. Modo offline para completar encuestas
2. Sincronización automática cuando hay conexión
3. Notificaciones push para recordatorios
4. Acceso a FAQ y soporte
```

## 🖥️ **Flujo de Usuario - Encargados de TH**

### **1. Acceso Administrativo**
```
1. Accede al panel administrativo web
2. Se autentica con Azure AD (rol TH)
3. Ve dashboard ejecutivo con métricas clave
4. Accede a módulos de gestión
```

### **2. Gestión de Encuestas**
```
1. Crea nueva encuesta:
   - Define nombre y descripción
   - Establece fechas de inicio/fin
   - Configura preguntas y tipos
   - Define audiencia objetivo
2. Programa notificaciones automáticas
3. Configura recordatorios
4. Activa/desactiva encuestas
```

### **3. Monitoreo y Seguimiento**
```
1. Visualiza tasas de participación en tiempo real
2. Monitorea respuestas por departamento
3. Recibe alertas de baja participación
4. Envía recordatorios manuales si es necesario
```

### **4. Análisis de Resultados**
```
1. Accede a dashboard de resultados
2. Visualiza análisis por:
   - Departamento
   - Posición
   - Período de tiempo
   - Tendencias históricas
3. Exporta reportes en múltiples formatos
4. Comparte insights con stakeholders
```

## 🤖 **Flujo de Usuario - Módulos de IA/ML**

### **1. Análisis de Sentimiento**
```
1. Sistema procesa respuestas de texto libre
2. Azure AI Language analiza sentimiento
3. Genera scores de satisfacción
4. Identifica temas críticos
5. Presenta resultados en dashboard
```

### **2. Detección de Patrones**
```
1. Azure ML analiza datos históricos
2. Identifica tendencias y correlaciones
3. Predice posibles problemas futuros
4. Sugiere acciones preventivas
5. Genera alertas automáticas
```

### **3. Chatbot de Consultas**
```
1. Usuario accede al chatbot
2. Hace pregunta sobre RRHH
3. Azure OpenAI procesa consulta
4. Sistema responde con información relevante
5. Escala a humano si es necesario
```

## 📊 **Pantallas y Elementos de UI**

### **Pantalla de Login**
- Logo corporativo
- Campo de email/usuario
- Campo de contraseña
- Botón de inicio de sesión
- Enlace "Olvidé mi contraseña"
- Opción de SSO corporativo

### **Dashboard Principal (Empleados)**
- Encuestas pendientes destacadas
- Progreso de participación
- Notificaciones recientes
- Acceso rápido a encuestas
- Menú de navegación

### **Formulario de Encuesta**
- Barra de progreso
- Pregunta actual destacada
- Opciones de respuesta claras
- Botones de navegación (Anterior/Siguiente)
- Botón de guardar borrador
- Botón de enviar final

### **Dashboard Administrativo (TH)**
- Métricas clave (participación, satisfacción)
- Gráficos de tendencias
- Lista de encuestas activas
- Alertas y notificaciones
- Acceso a módulos de gestión

### **Panel de Configuración**
- Formulario de creación de encuestas
- Editor de preguntas drag & drop
- Configuración de notificaciones
- Gestión de audiencias
- Programación de fechas

## 🔄 **Flujos de Error y Excepciones**

### **Error de Autenticación**
```
1. Usuario ingresa credenciales incorrectas
2. Sistema muestra mensaje de error
3. Ofrece opciones de recuperación
4. Redirige a soporte si es necesario
```

### **Error de Conexión**
```
1. Sistema detecta pérdida de conexión
2. Activa modo offline
3. Guarda respuestas localmente
4. Sincroniza cuando se restaura conexión
5. Notifica al usuario del estado
```

### **Encuesta Incompleta**
```
1. Usuario intenta salir sin completar
2. Sistema muestra advertencia
3. Ofrece opción de guardar borrador
4. Confirma acción del usuario
5. Registra estado en sistema
```

## 📱 **Consideraciones de UX/UI**

### **Accesibilidad**
- Soporte para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado
- Tamaños de fuente configurables

### **Responsive Design**
- Adaptación a diferentes tamaños de pantalla
- Optimización para móviles
- Gestos táctiles intuitivos
- Orientación portrait y landscape

### **Performance**
- Carga inicial < 3 segundos
- Transiciones suaves entre pantallas
- Feedback visual inmediato
- Indicadores de progreso claros

### **Internacionalización**
- Soporte para múltiples idiomas
- Formato de fechas localizado
- Moneda y números locales
- Textos adaptados culturalmente

## 🎯 **Métricas de Usuario**

### **KPIs de Engagement**
- Tasa de participación en encuestas
- Tiempo promedio de completar encuesta
- Tasa de abandono por pantalla
- Satisfacción del usuario (NPS)

### **KPIs de Performance**
- Tiempo de carga de pantallas
- Tasa de errores de autenticación
- Disponibilidad del sistema
- Tiempo de respuesta de APIs

## 🚀 **Próximos Pasos**
1. Crear wireframes detallados
2. Implementar prototipo funcional
3. Realizar testing de usabilidad
4. Iterar basado en feedback
5. Implementar en producción
