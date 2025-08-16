# Modelo de Datos - Sistema de Clima Laboral

## 🗄️ Entidades Principales

### 1. Employee (Empleado)
```json
{
  "id": "string",
  "employeeId": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "department": "string",
  "position": "string",
  "hireDate": "date",
  "isActive": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### 2. Survey (Cuestionario)
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "isActive": "boolean",
  "startDate": "date",
  "endDate": "date",
  "questions": ["Question"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

### 3. Question (Pregunta)
```json
{
  "id": "string",
  "surveyId": "string",
  "order": "number",
  "text": "string",
  "type": "rating|multiple-choice|text",
  "options": ["string"],
  "isRequired": "boolean",
  "createdAt": "date"
}
```

### 4. SurveyResponse (Respuesta del Cuestionario)
```json
{
  "id": "string",
  "surveyId": "string",
  "employeeId": "string",
  "answers": ["SurveyAnswer"],
  "submittedAt": "date",
  "isAnonymous": "boolean",
  "metadata": {
    "deviceType": "string",
    "location": "string",
    "sessionDuration": "number"
  }
}
```

### 5. SurveyAnswer (Respuesta Individual)
```json
{
  "id": "string",
  "questionId": "string",
  "value": "string|number",
  "textValue": "string",
  "ratingValue": "number",
  "answeredAt": "date"
}
```

## 🔗 Relaciones
- **Employee** → **SurveyResponse** (1:N)
- **Survey** → **Question** (1:N)
- **Survey** → **SurveyResponse** (1:N)
- **Question** → **SurveyAnswer** (1:N)

## 📊 Consideraciones de Diseño
- **Anonimización**: Los datos de empleado se pueden anonimizar para análisis
- **Auditoría**: Todas las operaciones se registran con timestamps
- **Escalabilidad**: Uso de particionamiento por fecha en Cosmos DB
- **Seguridad**: Encriptación de datos sensibles

## 🎯 Próximos Pasos
1. Definir índices de base de datos
2. Crear esquemas de validación
3. Diseñar estrategia de anonimización
