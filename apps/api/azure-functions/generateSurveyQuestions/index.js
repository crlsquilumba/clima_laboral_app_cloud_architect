const { app } = require("@azure/functions");
const axios = require("axios");
const StructuredLogger = require("../shared/StructuredLogger");
const config = require("../shared/config");

// Inicializar logger estructurado
const logger = new StructuredLogger();

// Iconos gamificados para preguntas
const QUESTION_ICONS = {
    satisfaction: "😊",
    leadership: "👑",
    teamwork: "🤝",
    communication: "💬",
    work_balance: "⚖️",
    growth: "📈",
    environment: "🏢",
    benefits: "🎁",
    recognition: "🏆",
    feedback: "💭",
    stress: "😰",
    motivation: "🚀",
    collaboration: "👥",
    innovation: "💡",
    culture: "🌟"
};

// Iconos gamificados para respuestas
const ANSWER_ICONS = {
    very_satisfied: "😍",
    satisfied: "😊",
    neutral: "😐",
    dissatisfied: "😕",
    very_dissatisfied: "😢",
    yes: "✅",
    no: "❌",
    excellent: "⭐",
    good: "👍",
    fair: "👌",
    poor: "👎",
    strongly_agree: "🔥",
    agree: "👍",
    disagree: "👎",
    strongly_disagree: "💥"
};

// Colores gamificados
const GAMIFICATION_COLORS = {
    primary: "#1976d2",
    success: "#2e7d32",
    warning: "#ed6c02",
    error: "#d32f2f",
    info: "#0288d1",
    secondary: "#757575"
};

app.http("generateSurveyQuestions", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "surveys/generate",
    handler: async (request, context) => {
        // Iniciar timer para medir duración total
        const totalTimer = logger.createTimer();
        
        try {
            // 🚀 LOG 1: FUNCIÓN INICIA (SIEMPRE)
            logger.functionStart({
                requestId: context.invocationId,
                method: request.method,
                url: request.url,
                headers: Object.keys(request.headers)
            });

            // 📝 Obtener y validar body del request
            const body = await request.json();
            
            // 🔍 LOG 2: VALIDACIÓN DE INPUTS (SIEMPRE)
            const validation = {
                prompt: !!body.prompt,
                questionCount: !!body.questionCount,
                questionTypes: !!body.questionTypes,
                hasAllRequiredFields: !!(body.prompt && body.questionCount && body.questionTypes)
            };
            
            logger.functionValidation(validation);
            
            // Validar campos requeridos
            if (!body.prompt || !body.questionCount || !body.questionTypes) {
                const error = "Missing required fields: prompt, questionCount, questionTypes";
                
                // 💥 LOG 3: ERROR DE VALIDACIÓN (SIEMPRE EN CASO DE ERROR)
                logger.functionError(new Error(error), { 
                    context: 'input-validation-failed',
                    receivedFields: Object.keys(body),
                    requiredFields: ['prompt', 'questionCount', 'questionTypes']
                });
                
                            // ✅ LOG 4: RESPUESTA FINAL (SIEMPRE)
            const totalDuration = totalTimer.end();
            
            // Configurar headers CORS
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Max-Age': '86400'
            };
            
            logger.functionResponse({
                    success: false,
                    error: error,
                    errorType: 'validation_error'
                }, totalDuration);
                
                return {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        success: false,
                        error: error,
                        correlationId: logger.getCorrelationId()
                    })
                };
            }
            
            const { prompt, questionCount, questionTypes } = body;
            
            // 🌐 Verificar si Azure OpenAI está configurado
            if (!config.isServiceConfigured('openai')) {
                // 💥 LOG 3: ERROR DE CONFIGURACIÓN (SIEMPRE EN CASO DE ERROR)
                logger.functionError(new Error("Azure OpenAI no configurado"), {
                    context: 'azure-openai-not-configured',
                    fallbackTo: 'mock-data'
                });
                
                // ✅ LOG 4: RESPUESTA FINAL (SIEMPRE)
                const totalDuration = totalTimer.end();
                logger.functionResponse({
                    success: true,
                    questionsCount: questionCount,
                    questionTypes: questionTypes,
                    prompt: prompt,
                    gamified: true,
                    source: 'mock-fallback'
                }, totalDuration);
                
                // Generar preguntas mock gamificadas
                const mockQuestions = [
                    {
                        id: "1",
                        text: "¿Qué tan satisfecho estás con el ambiente laboral actual? 😊",
                        type: "gamified_rating",
                        icon: "😊",
                        color: "#2e7d32",
                        theme: "satisfaction",
                        options: [
                            { text: "Muy insatisfecho 😞", icon: "😞", color: "#d32f2f", value: 1 },
                            { text: "Insatisfecho 😕", icon: "😕", color: "#f57c00", value: 2 },
                            { text: "Neutral 😐", icon: "😐", color: "#757575", value: 3 },
                            { text: "Satisfecho 🙂", icon: "🙂", color: "#388e3c", value: 4 },
                            { text: "Muy satisfecho 😊", icon: "😊", color: "#2e7d32", value: 5 }
                        ],
                        required: true
                    },
                    {
                        id: "2",
                        text: "¿Con qué frecuencia te sientes estresado en el trabajo? 😰",
                        type: "multiple_choice",
                        icon: "😰",
                        color: "#1976d2",
                        theme: "stress",
                        options: [
                            { text: "Nunca 😌", icon: "😌", color: "#4caf50" },
                            { text: "Raramente 🙂", icon: "🙂", color: "#8bc34a" },
                            { text: "A veces 😐", icon: "😐", color: "#ff9800" },
                            { text: "Frecuentemente 😰", icon: "😰", color: "#f57c00" },
                            { text: "Siempre 😱", icon: "😱", color: "#d32f2f" }
                        ],
                        required: true
                    }
                ].slice(0, questionCount);

                return {
                    status: 200,
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    },
                    body: JSON.stringify({
                        success: true,
                        questions: mockQuestions,
                        correlationId: logger.getCorrelationId(),
                        metadata: {
                            totalQuestions: mockQuestions.length,
                            questionTypes: questionTypes,
                            prompt: prompt,
                            generatedAt: new Date().toISOString(),
                            model: "mock-fallback",
                            source: "mock-fallback",
                            gamified: true,
                            totalDuration: totalDuration
                        }
                    })
                };
            }
            
            // 🚀 Intentar generar con Azure OpenAI
            try {
                const questions = await generateGamifiedWithAzureOpenAI(prompt, questionCount, questionTypes, context);
                
                // ✅ LOG 4: RESPUESTA FINAL DE LA FUNCIÓN (SIEMPRE)
                const totalDuration = totalTimer.end();
                logger.functionResponse({
                    success: true,
                    questionsCount: questions.length,
                    questionTypes: questionTypes,
                    prompt: prompt,
                    gamified: true,
                    source: 'azure-openai'
                }, totalDuration);
                
                return {
                    status: 200,
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, OPTIONS",
                        "Access-Control-Allow-Headers": "Content-Type"
                    },
                    body: JSON.stringify({
                        success: true,
                        questions: questions,
                        correlationId: logger.getCorrelationId(),
                        metadata: {
                            totalQuestions: questions.length,
                            questionTypes: questionTypes,
                            prompt: prompt,
                            generatedAt: new Date().toISOString(),
                            model: "gpt-35-turbo",
                            source: "azure-openai",
                            gamified: true,
                            totalDuration: totalDuration
                        }
                    })
                };
                
            } catch (aiError) {
                // 💥 LOG 3: ERROR CON AZURE OPENAI (SIEMPRE EN CASO DE ERROR)
                logger.functionError(aiError, {
                    context: 'azure-openai-call-failed',
                    errorDetails: {
                        message: aiError.message,
                        code: aiError.code,
                        status: aiError.response?.status,
                        statusText: aiError.response?.statusText
                    }
                });

                // ✅ LOG 4: RESPUESTA FINAL CON ERROR (SIEMPRE)
                const totalDuration = totalTimer.end();
                const statusCode = aiError.response?.status || 500;
                const errorType = statusCode >= 500 ? 'azure-openai-server-error' : 'azure-openai-client-error';

                logger.functionResponse({
                    success: false,
                    error: aiError.message,
                    errorType: errorType,
                    statusCode: statusCode
                }, totalDuration);

                return {
                    status: statusCode,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        success: false,
                        error: `Error al comunicarse con Azure OpenAI: ${aiError.message}`,
                        errorType: errorType,
                        statusCode: statusCode,
                        correlationId: logger.getCorrelationId()
                    })
                };
            }
            
        } catch (error) {
            // 💥 LOG 3: ERROR GENERAL EN LA FUNCIÓN (SIEMPRE EN CASO DE ERROR)
            logger.functionError(error, {
                context: 'function-execution',
                errorType: 'unexpected_error'
            });
            
            // ✅ LOG 4: RESPUESTA FINAL (SIEMPRE)
            const totalDuration = totalTimer.end();
            logger.functionResponse({
                success: false,
                error: "Internal server error",
                errorType: 'internal_error'
            }, totalDuration);
            
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    success: false,
                    error: "Internal server error",
                    details: error.message,
                    correlationId: logger.getCorrelationId()
                })
            };
        }
    }
});

// Función para generar con Azure OpenAI real + GAMIFICACIÓN
async function generateGamifiedWithAzureOpenAI(prompt, questionCount, questionTypes, context) {
    const openaiServiceName = config.getServiceConfig('openai');
    const openaiEndpoint = config.getServiceEndpoint('openai');
    
    const url = `${openaiEndpoint}/openai/deployments/${config.azureOpenAI.deploymentName}/chat/completions?api-version=${config.azureOpenAI.apiVersion}`;
    
    // 🌐 LOG 3: LLAMADA A SERVICIO EXTERNO (SIEMPRE)
    logger.externalServiceRequest(openaiServiceName, {
        endpoint: url,
        deployment: config.azureOpenAI.deploymentName,
        apiVersion: config.azureOpenAI.apiVersion,
        prompt: prompt,
        questionCount: questionCount,
        questionTypes: questionTypes
    });
    
    // Crear timer para medir tiempo de respuesta de Azure OpenAI
    const openaiTimer = logger.createTimer();
    
    const aiPrompt = `
Eres un experto en Recursos Humanos especializado en crear encuestas GAMIFICADAS de clima laboral.

OBJETIVO: ${prompt}

REQUISITOS:
- Número de preguntas: ${questionCount}
- Tipos de preguntas: ${Array.isArray(questionTypes) ? questionTypes.join(', ') : questionTypes}
- Contexto: Clima laboral y satisfacción de empleados
- IMPORTANTE: Todas las preguntas deben ser GAMIFICADAS

🎮 GAMIFICACIÓN REQUERIDA:
1. Cada pregunta debe tener un icono emoji relevante
2. Cada opción de respuesta debe tener su propio icono emoji
3. Usar colores para categorizar (azul, verde, naranja, rojo)
4. Hacer las preguntas divertidas pero profesionales
5. Usar lenguaje motivacional y positivo

📱 FORMATO DE RESPUESTA OBLIGATORIO:
Devuelve ÚNICAMENTE un JSON válido con este formato exacto:
{
  "questions": [
    {
      "id": "1",
      "text": "¿Qué tan satisfecho estás con el ambiente laboral? 😊",
      "type": "gamified_rating",
      "icon": "😊",
      "color": "#1976d2",
      "theme": "satisfaction",
      "options": [
        {
          "text": "Muy insatisfecho 😢",
          "icon": "😢",
          "color": "#d32f2f",
          "value": 1
        },
        {
          "text": "Insatisfecho 😕",
          "icon": "😕",
          "color": "#ed6c02",
          "value": 2
        },
        {
          "text": "Neutral 😐",
          "icon": "😐",
          "color": "#757575",
          "value": 3
        },
        {
          "text": "Satisfecho 😊",
          "icon": "😊",
          "color": "#0288d1",
          "value": 4
        },
        {
          "text": "Muy satisfecho 😍",
          "icon": "😍",
          "color": "#2e7d32",
          "value": 5
        }
      ],
      "required": true
    }
  ]
}

🎯 REGLAS DE GAMIFICACIÓN:
- SIEMPRE incluir iconos emoji en preguntas y respuestas
- Usar colores que representen emociones (rojo=negativo, verde=positivo)
- Hacer preguntas divertidas pero relevantes
- Usar temas como: satisfaction, leadership, teamwork, communication
- Cada pregunta debe ser única y creativa

🔥 REGLA ESPECIAL - ÚLTIMA PREGUNTA:
- La última pregunta DEBE ser SIEMPRE de tipo "open_text".
- Esta pregunta debe ser una invitación abierta y reflexiva para que el usuario deje comentarios adicionales sobre el tema general de la encuesta: "${prompt}".
- Formula esta pregunta de una manera que fomente una respuesta constructiva y detallada. Por ejemplo: "¿Hay algo más que te gustaría compartir para mejorar en este aspecto?" o "¿Qué idea brillante tienes para llevar nuestro ambiente al siguiente nivel? ✨".
- Asígnale un icono y tema apropiados, como 'feedback' (💭) o 'innovation' (💡).

IMPORTANTE: Responde SOLO el JSON, nada más.
    `.trim();
    
    const requestPayload = {
        messages: [
            {
                role: 'system',
                content: 'Eres un asistente experto en RRHH que genera encuestas GAMIFICADAS de clima laboral. Responde ÚNICAMENTE en formato JSON con iconos, colores y temas.'
            },
            {
                role: 'user',
                content: aiPrompt
            }
        ],
        max_tokens: 3000,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
    };
    
    const response = await axios.post(url, requestPayload, {
        headers: {
            'Content-Type': 'application/json',
            'api-key': config.azureOpenAI.apiKey
        }
    });
    
    const responseTime = openaiTimer.end();
    
    // ✅ LOG 4: RESPUESTA DE SERVICIO EXTERNO (SIEMPRE)
    logger.externalServiceResponse(openaiServiceName, {
        choices: response.data.choices?.length || 0,
        usage: response.data.usage,
        model: response.data.model
    }, responseTime);
    
    let aiResponse = response.data.choices[0].message.content;

    // Extraer el contenido JSON del string, que puede venir con texto adicional
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch && jsonMatch[0]) {
        aiResponse = jsonMatch[0];
    } else {
        // Si no se encuentra un JSON, lanzar un error claro
        logger.functionError(new Error("No JSON object found in AI response"), {
            context: 'ai-response-parsing',
            aiResponse: aiResponse.substring(0, 500)
        });
        throw new Error("Respuesta de IA no contenía un objeto JSON válido.");
    }
    
    // Parsear la respuesta JSON de la IA
    try {
        const parsedResponse = JSON.parse(aiResponse);
        if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
            // Validar y mejorar la gamificación si es necesario
            const enhancedQuestions = enhanceGamification(parsedResponse.questions);
            return enhancedQuestions;
        } else {
            throw new Error("Formato de respuesta inválido");
        }
    } catch (parseError) {
        logger.functionError(parseError, {
            context: 'ai-response-parsing',
            aiResponse: aiResponse.substring(0, 200) // Primeros 200 caracteres para debugging
        });
        throw new Error("Respuesta de IA no válida");
    }
}

// Función para mejorar la gamificación si la IA no la incluye completamente
function enhanceGamification(questions) {
    return questions.map((question, index) => {
        // Asegurar que tenga icono, usando el tema si está disponible
        if (!question.icon) {
            question.icon = QUESTION_ICONS[question.theme] || getRandomQuestionIcon();
        }
        
        // Asegurar que tenga color
        if (!question.color) {
            question.color = getRandomColor();
        }
        
        // Asegurar que tenga un tipo por defecto
        if (!question.type) {
            question.type = 'gamified_rating';
        }
        
        // Mejorar opciones si no están gamificadas
        if (question.options && Array.isArray(question.options)) {
            question.options = question.options.map((option, optIndex) => {
                if (typeof option === 'string') {
                    // Convertir string a objeto gamificado
                    return {
                        text: option,
                        icon: getRandomAnswerIcon(),
                        color: getRandomColor(),
                        value: optIndex + 1
                    };
                } else if (!option.icon) {
                    // Agregar icono si no lo tiene
                    option.icon = getRandomAnswerIcon();
                }
                if (!option.color) {
                    option.color = getRandomColor();
                }
                return option;
            });
        }
        
        return question;
    });
}

// Funciones auxiliares para gamificación
function getRandomQuestionIcon() {
    const icons = Object.values(QUESTION_ICONS);
    return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomAnswerIcon() {
    const icons = Object.values(ANSWER_ICONS);
    return icons[Math.floor(Math.random() * icons.length)];
}

function getRandomColor() {
    const colors = Object.values(GAMIFICATION_COLORS);
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomTheme() {
    const themes = Object.keys(QUESTION_ICONS);
    return themes[Math.floor(Math.random() * themes.length)];
}
