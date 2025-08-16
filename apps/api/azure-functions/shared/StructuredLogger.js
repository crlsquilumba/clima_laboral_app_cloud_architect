const { v4: uuidv4 } = require('uuid');

/**
 * Logger estructurado para Azure Functions con Application Insights
 * Implementa estándar de logging para microservicios
 */
class StructuredLogger {
    constructor() {
        this.correlationId = null;
        this.functionName = process.env.SERVICE_NAME || 'unknown';
        this.environment = process.env.ENVIRONMENT || 'dev';
        this.logLevel = process.env.LOG_LEVEL || 'INFO';
        this.enableStructuredLogging = process.env.ENABLE_STRUCTURED_LOGGING === 'true';
    }

    /**
     * Inicia un nuevo request con correlationId único
     */
    startRequest() {
        this.correlationId = uuidv4();
        return this.correlationId;
    }

    /**
     * Obtiene el correlationId actual
     */
    getCorrelationId() {
        if (!this.correlationId) {
            this.startRequest();
        }
        return this.correlationId;
    }

    /**
     * Log principal con formato estándar
     */
    log(level, operation, payload = {}, metadata = {}) {
        // Validar nivel de log
        if (!this.shouldLog(level)) {
            return;
        }

        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            functionName: this.functionName,
            operation: operation,
            correlationId: this.getCorrelationId(),
            payload: payload,
            metadata: {
                environment: this.environment,
                ...metadata
            }
        };

        // Enviar a Application Insights (Azure Functions lo hace automáticamente)
        if (this.enableStructuredLogging) {
            // Log estructurado para Application Insights
            console.log(JSON.stringify(logEntry));
        } else {
            // Log simple para desarrollo local
            console.log(`[${logEntry.level}] ${logEntry.functionName}_${logEntry.operation} | ${logEntry.correlationId} | ${JSON.stringify(payload)}`);
        }

        return logEntry;
    }

    /**
     * Log de inicio de función
     */
    functionStart(payload = {}) {
        return this.log('INFO', 'start', payload, {
            operation: 'function_execution_start',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log de validación de inputs
     */
    functionValidation(validation = {}) {
        return this.log('DEBUG', 'validation', validation, {
            operation: 'input_validation',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log de llamada a servicio externo
     */
    externalServiceRequest(serviceName, payload = {}) {
        return this.log('INFO', `${serviceName}_request`, payload, {
            operation: 'external_service_call',
            service: serviceName,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log de respuesta de servicio externo
     */
    externalServiceResponse(serviceName, payload = {}, responseTime = null) {
        const metadata = {
            operation: 'external_service_response',
            service: serviceName,
            timestamp: new Date().toISOString()
        };

        if (responseTime) {
            metadata.responseTime = responseTime;
        }

        return this.log('INFO', `${serviceName}_response`, payload, metadata);
    }

    /**
     * Log de respuesta final de la función
     */
    functionResponse(payload = {}, totalDuration = null) {
        const metadata = {
            operation: 'function_execution_end',
            timestamp: new Date().toISOString()
        };

        if (totalDuration) {
            metadata.totalDuration = totalDuration;
        }

        return this.log('INFO', 'response', payload, metadata);
    }

    /**
     * Log de error
     */
    functionError(error, context = {}) {
        const errorPayload = {
            message: error.message || 'Unknown error',
            code: error.code || 'UNKNOWN_ERROR',
            stack: error.stack,
            ...context
        };

        return this.log('ERROR', 'error', errorPayload, {
            operation: 'error_occurred',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log de warning
     */
    functionWarning(message, payload = {}) {
        return this.log('WARN', 'warning', { message, ...payload }, {
            operation: 'warning_occurred',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Log de debug
     */
    functionDebug(operation, payload = {}) {
        return this.log('DEBUG', operation, payload, {
            operation: 'debug_info',
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Determina si debe hacer log basado en el nivel configurado
     */
    shouldLog(level) {
        const levels = {
            'DEBUG': 0,
            'INFO': 1,
            'WARN': 2,
            'ERROR': 3
        };

        const currentLevel = levels[this.logLevel] || 1;
        const requestedLevel = levels[level.toUpperCase()] || 1;

        return requestedLevel >= currentLevel;
    }

    /**
     * Mide tiempo de ejecución de una operación
     */
    async measureOperation(operationName, operation) {
        const startTime = Date.now();
        
        try {
            const result = await operation();
            const duration = Date.now() - startTime;
            
            this.log('DEBUG', `${operationName}_completed`, { duration: `${duration}ms` });
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            this.log('ERROR', `${operationName}_failed`, { 
                duration: `${duration}ms`,
                error: error.message 
            });
            throw error;
        }
    }

    /**
     * Crea un timer para medir duración
     */
    createTimer() {
        const startTime = Date.now();
        return {
            end: () => {
                const duration = Date.now() - startTime;
                return `${duration}ms`;
            }
        };
    }
}

module.exports = StructuredLogger;
