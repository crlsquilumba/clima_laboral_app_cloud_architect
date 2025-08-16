# Data Model - Sistema de Clima Laboral

## 🎯 **Propósito**
Este documento define el modelo de datos para el Sistema de Clima Laboral, incluyendo las entidades principales, sus relaciones y el esquema de base de datos en Azure SQL.

## 🏗️ **Arquitectura de Base de Datos**

### **Tecnología Principal**
- **Base de Datos**: Azure SQL Database
- **Tipo**: Relacional con soporte para JSON
- **Escalabilidad**: Auto-scaling con DTU vCore
- **Alta Disponibilidad**: 99.99% uptime con geo-replicación

### **Consideraciones de Diseño**
- **Normalización**: 3NF para optimizar consultas
- **Índices**: Optimizados para consultas frecuentes
- **Particionamiento**: Por fecha para tablas grandes
- **Compresión**: Para optimizar almacenamiento

## 📊 **Entidades Principales**

### **1. Employees (Empleados)**
```sql
CREATE TABLE Employees (
    EmployeeId INT PRIMARY KEY IDENTITY(1,1),
    EmployeeCode NVARCHAR(20) UNIQUE NOT NULL,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Phone NVARCHAR(20),
    DepartmentId INT NOT NULL,
    PositionId INT NOT NULL,
    ManagerId INT,
    HireDate DATE NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),
    LastLoginAt DATETIME2,
    AzureADObjectId UNIQUEIDENTIFIER UNIQUE
);
```

**Propósito**: Almacenar información de los 9K empleados del sistema.

### **2. Departments (Departamentos)**
```sql
CREATE TABLE Departments (
    DepartmentId INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL,
    DepartmentCode NVARCHAR(20) UNIQUE NOT NULL,
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

**Propósito**: Estructura organizacional de la empresa.

### **3. Positions (Posiciones)**
```sql
CREATE TABLE Positions (
    PositionId INT PRIMARY KEY IDENTITY(1,1),
    PositionName NVARCHAR(100) NOT NULL,
    PositionCode NVARCHAR(20) UNIQUE NOT NULL,
    Level INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

**Propósito**: Jerarquía de posiciones laborales.

### **4. Surveys (Encuestas)**
```sql
CREATE TABLE Surveys (
    SurveyId INT PRIMARY KEY IDENTITY(1,1),
    SurveyName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    SurveyType NVARCHAR(50) NOT NULL, -- 'Monthly', 'Quarterly', 'Annual'
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    NotificationDate DATE NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

**Propósito**: Configuración de encuestas programadas (2 por mes por empleado).

### **5. Questions (Preguntas)**
```sql
CREATE TABLE Questions (
    QuestionId INT PRIMARY KEY IDENTITY(1,1),
    SurveyId INT NOT NULL,
    QuestionText NVARCHAR(1000) NOT NULL,
    QuestionType NVARCHAR(50) NOT NULL, -- 'MultipleChoice', 'Scale', 'Text', 'YesNo'
    Options JSON, -- Para preguntas de opción múltiple
    MinValue INT, -- Para escalas
    MaxValue INT, -- Para escalas
    IsRequired BIT DEFAULT 1,
    OrderIndex INT NOT NULL,
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (SurveyId) REFERENCES Surveys(SurveyId)
);
```

**Propósito**: Preguntas configurables para cada encuesta.

### **6. SurveyResponses (Respuestas de Encuestas)**
```sql
CREATE TABLE SurveyResponses (
    ResponseId INT PRIMARY KEY IDENTITY(1,1),
    SurveyId INT NOT NULL,
    EmployeeId INT NOT NULL,
    StartedAt DATETIME2,
    CompletedAt DATETIME2,
    Status NVARCHAR(20) DEFAULT 'Started', -- 'Started', 'Completed', 'Abandoned'
    SentimentScore DECIMAL(3,2), -- Score de análisis de sentimiento
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (SurveyId) REFERENCES Surveys(SurveyId),
    FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId),
    UNIQUE(SurveyId, EmployeeId)
);
```

**Propósito**: Registro de participación de empleados en encuestas.

### **7. SurveyAnswers (Respuestas Individuales)**
```sql
CREATE TABLE SurveyAnswers (
    AnswerId INT PRIMARY KEY IDENTITY(1,1),
    ResponseId INT NOT NULL,
    QuestionId INT NOT NULL,
    AnswerValue NVARCHAR(MAX), -- Respuesta del empleado
    NumericValue DECIMAL(10,2), -- Para respuestas numéricas
    SentimentAnalysis JSON, -- Resultados del análisis de IA
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (ResponseId) REFERENCES SurveyResponses(ResponseId),
    FOREIGN KEY (QuestionId) REFERENCES Questions(QuestionId)
);
```

**Propósito**: Respuestas individuales a cada pregunta.

### **8. Notifications (Notificaciones)**
```sql
CREATE TABLE Notifications (
    NotificationId INT PRIMARY KEY IDENTITY(1,1),
    SurveyId INT NOT NULL,
    EmployeeId INT NOT NULL,
    NotificationType NVARCHAR(20) NOT NULL, -- 'Email', 'SMS', 'WhatsApp'
    Status NVARCHAR(20) DEFAULT 'Pending', -- 'Pending', 'Sent', 'Delivered', 'Failed'
    SentAt DATETIME2,
    DeliveredAt DATETIME2,
    ErrorMessage NVARCHAR(500),
    RetryCount INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (SurveyId) REFERENCES Surveys(SurveyId),
    FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
);
```

**Propósito**: Seguimiento de notificaciones enviadas por Email/SMS/WhatsApp.

### **9. AIAnalysis (Análisis de IA)**
```sql
CREATE TABLE AIAnalysis (
    AnalysisId INT PRIMARY KEY IDENTITY(1,1),
    ResponseId INT NOT NULL,
    AnalysisType NVARCHAR(50) NOT NULL, -- 'Sentiment', 'Pattern', 'Trend'
    RawData JSON, -- Datos originales enviados a IA
    Results JSON, -- Resultados del análisis
    Confidence DECIMAL(3,2), -- Nivel de confianza del análisis
    ProcessedAt DATETIME2 DEFAULT GETUTCDATE(),
    FOREIGN KEY (ResponseId) REFERENCES SurveyResponses(ResponseId)
);
```

**Propósito**: Almacenar resultados de análisis de IA/ML.

### **10. SystemLogs (Logs del Sistema)**
```sql
CREATE TABLE SystemLogs (
    LogId INT PRIMARY KEY IDENTITY(1,1),
    LogLevel NVARCHAR(20) NOT NULL, -- 'Info', 'Warning', 'Error', 'Critical'
    Category NVARCHAR(100) NOT NULL, -- 'Authentication', 'Survey', 'Notification', 'AI'
    Message NVARCHAR(1000) NOT NULL,
    Details JSON,
    UserId INT,
    IPAddress NVARCHAR(45),
    UserAgent NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);
```

**Propósito**: Auditoría y monitoreo del sistema.

## 🔗 **Relaciones entre Entidades**

### **Relaciones Principales**
- **Employees** → **Departments** (Muchos a Uno)
- **Employees** → **Positions** (Muchos a Uno)
- **Employees** → **Employees** (Auto-referencia para Manager)
- **Surveys** → **Questions** (Uno a Muchos)
- **SurveyResponses** → **Surveys** (Muchos a Uno)
- **SurveyResponses** → **Employees** (Muchos a Uno)
- **SurveyAnswers** → **SurveyResponses** (Muchos a Uno)
- **SurveyAnswers** → **Questions** (Muchos a Uno)
- **Notifications** → **Surveys** (Muchos a Uno)
- **Notifications** → **Employees** (Muchos a Uno)
- **AIAnalysis** → **SurveyResponses** (Muchos a Uno)

### **Índices Recomendados**
```sql
-- Índices para optimizar consultas frecuentes
CREATE INDEX IX_Employees_Email ON Employees(Email);
CREATE INDEX IX_Employees_DepartmentId ON Employees(DepartmentId);
CREATE INDEX IX_SurveyResponses_SurveyId ON SurveyResponses(SurveyId);
CREATE INDEX IX_SurveyResponses_EmployeeId ON SurveyResponses(EmployeeId);
CREATE INDEX IX_SurveyResponses_Status ON SurveyResponses(Status);
CREATE INDEX IX_Notifications_SurveyId ON Notifications(SurveyId);
CREATE INDEX IX_Notifications_Status ON Notifications(Status);
CREATE INDEX IX_SystemLogs_CreatedAt ON SystemLogs(CreatedAt);
CREATE INDEX IX_SystemLogs_Category ON SystemLogs(Category);
```

## 📊 **Particionamiento y Optimización**

### **Particionamiento por Fecha**
```sql
-- Particionar tablas grandes por fecha
CREATE PARTITION FUNCTION PF_ByMonth (DATE)
AS RANGE RIGHT FOR VALUES (
    '2024-01-01', '2024-02-01', '2024-03-01', ...
);

-- Aplicar a tablas con datos históricos
CREATE PARTITION SCHEME PS_ByMonth
AS PARTITION PF_ByMonth ALL TO ([PRIMARY]);
```

### **Compresión de Datos**
```sql
-- Comprimir tablas para optimizar almacenamiento
ALTER TABLE SurveyAnswers REBUILD PARTITION = ALL
WITH (DATA_COMPRESSION = PAGE);

ALTER TABLE SystemLogs REBUILD PARTITION = ALL
WITH (DATA_COMPRESSION = PAGE);
```

## 🔒 **Seguridad y Compliance**

### **Encriptación**
- **TDE**: Transparent Data Encryption habilitado
- **Always Encrypted**: Para datos sensibles (PII)
- **Column Encryption**: Para campos críticos

### **Auditoría**
- **SQL Server Audit**: Para todas las operaciones DML/DDL
- **Change Data Capture**: Para tracking de cambios
- **Temporal Tables**: Para historial de cambios

### **Cumplimiento**
- **GDPR**: Anonimización de datos personales
- **HIPAA**: Protección de información de salud
- **SOX**: Auditoría de cambios financieros

## 📈 **Métricas de Rendimiento**

### **Objetivos de SLA**
- **Disponibilidad**: 99.99% uptime
- **Latencia**: < 100ms para consultas simples
- **Throughput**: 1000 transacciones/segundo
- **Backup**: RPO < 15 minutos, RTO < 1 hora

### **Monitoreo**
- **Query Performance**: Azure SQL Insights
- **Resource Usage**: CPU, memoria, I/O
- **Connection Pooling**: Gestión de conexiones
- **Deadlock Detection**: Prevención de bloqueos

## 🎯 **Próximos Pasos**
1. Crear scripts de migración de datos
2. Implementar stored procedures para operaciones comunes
3. Configurar políticas de retención de datos
4. Diseñar estrategia de backup y recovery
5. Implementar testing de rendimiento
