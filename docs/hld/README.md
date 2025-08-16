# High Level Design - Aplicación de Clima Laboral

## 📋 Descripción del Proyecto
Sistema de evaluación de clima laboral para empleados con aplicación móvil y web.

## 🎯 Objetivos
- Permitir a los empleados responder cuestionarios de clima laboral
- Proporcionar dashboard de administración
- Generar reportes y análisis
- Asegurar confidencialidad y anonimato

## 🏗️ Arquitectura de Alto Nivel

### Componentes Principales
1. **Aplicación Móvil** - React Native + Expo
2. **Aplicación Web** - React + TypeScript  
3. **Backend API** - Azure Functions (.NET 8)
4. **Base de Datos** - Azure Cosmos DB
5. **Autenticación** - Azure AD B2C
6. **Hosting** - Azure Static Web Apps + Azure Functions

### Flujo de Usuario
```
Empleado → Login → Cuestionario (7 preguntas) → Envío → Confirmación
```

## 🔐 Consideraciones de Seguridad
- Autenticación mediante Azure AD B2C
- Datos anonimizados para análisis
- Encriptación en tránsito y reposo

## 📱 Pantallas Identificadas
- Login/Autenticación
- Bienvenida
- Cuestionario (7 preguntas)
- Confirmación de envío
- Dashboard de administración

## 🚀 Próximos Pasos
1. Definir modelo de datos
2. Crear diagramas C4
3. Diseñar pantallas en Figma
4. Implementar prototipos
