/**
 * Configuración centralizada para Azure Functions
 * Todas las variables de entorno y configuraciones en un solo lugar
 */

const config = {
    // Configuración de Azure OpenAI
    azureOpenAI: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        apiVersion: process.env.AZURE_OPENAI_API_VERSION
    },

    // Nombres de servicios (configurables por variables de entorno)
    services: {
        functionName: process.env.SERVICE_NAME || 'generateSurveyQuestions',
        externalServices: {
            openai: process.env.EXTERNAL_SERVICE_OPENAI || 'azure-openai',
            openaiEndpoint: process.env.EXTERNAL_SERVICE_OPENAI_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT
        }
    },

    // Configuración de logging
    logging: {
        level: process.env.LOG_LEVEL || 'INFO',
        enableStructuredLogging: process.env.ENABLE_STRUCTURED_LOGGING === 'true',
        environment: process.env.ENVIRONMENT || 'dev'
    },

    // Configuración de Azure Functions
    azureFunctions: {
        storage: process.env.AZURE_WEBJOBS_STORAGE || 'UseDevelopmentStorage=true',
        workerRuntime: process.env.FUNCTIONS_WORKER_RUNTIME || 'node'
    },

    /**
     * Valida que la configuración esté completa
     */
    validate() {
        const required = [
            'azureOpenAI.endpoint',
            'azureOpenAI.apiKey',
            'azureOpenAI.deploymentName',
            'azureOpenAI.apiVersion'
        ];

        const missing = required.filter(key => {
            const value = key.split('.').reduce((obj, k) => obj?.[k], config);
            return !value;
        });

        if (missing.length > 0) {
            console.warn(`⚠️ Configuración incompleta. Variables faltantes: ${missing.join(', ')}`);
            return false;
        }

        return true;
    },

    /**
     * Obtiene configuración para un servicio específico
     */
    getServiceConfig(serviceName) {
        return this.services.externalServices[serviceName] || serviceName;
    },

    /**
     * Obtiene endpoint para un servicio específico
     */
    getServiceEndpoint(serviceName) {
        if (serviceName === 'openai') {
            return this.azureOpenAI.endpoint;
        }
        return this.services.externalServices[`${serviceName}Endpoint`] || null;
    },

    /**
     * Verifica si un servicio está configurado
     */
    isServiceConfigured(serviceName) {
        if (serviceName === 'openai') {
            return !!(this.azureOpenAI.endpoint && this.azureOpenAI.apiKey);
        }
        // Placeholder for other services in the future
        const serviceConfig = this.getServiceConfig(serviceName);
        const endpoint = this.getServiceEndpoint(serviceName);
        return !!(serviceConfig && endpoint);
    }
};

module.exports = config;
