import { AIService } from '../../core/interfaces/AIService';
import { Question } from '../../core/entities/Survey';

export class AzureAIService implements AIService {
  private readonly baseUrl: string;

  constructor() {
    // Solo necesitamos la URL de Azure Functions
    this.baseUrl = (import.meta as any).env?.VITE_AZURE_FUNCTIONS_URL || 'https://clima-laboral-functions-a7h7gtfjc2gbb7b4.canadacentral-01.azurewebsites.net';
  }

  async generateSurveyQuestions(prompt: string, questionCount: number, questionTypes: string[]): Promise<Question[]> {
    try {
      console.log('🌐 Llamando a Azure Functions:', `${this.baseUrl}/api/surveys/generate`);
      console.log('📤 Request payload:', { prompt, questionCount, questionTypes });
      
      const response = await fetch(`${this.baseUrl}/api/surveys/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          questionCount,
          questionTypes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error en Azure Functions:', response.status, response.statusText);
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta exitosa de Azure Functions:', data);
      
      if (data.success && data.questions) {
        // Mapear la respuesta gamificada del API a nuestro formato Question
        const mappedQuestions = data.questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options || [],
          required: q.required,
          // Propiedades gamificadas
          icon: q.icon,
          color: q.color,
          theme: q.theme
        }));
        
        console.log('🎮 Preguntas gamificadas mapeadas:', mappedQuestions);
        return mappedQuestions;
      } else {
        throw new Error('No se pudieron generar las preguntas');
      }
    } catch (error) {
      console.error('❌ Error calling Azure Functions:', error);
      return this.generateMockQuestions(prompt, questionCount, questionTypes);
    }
  }

  private generateMockQuestions(prompt: string, questionCount: number, questionTypes: string[]): Question[] {
    const baseQuestions = [
      {
        id: '1',
        text: '¿Qué tan satisfecho estás con el ambiente laboral actual?',
        type: 'multiple_choice' as const,
        options: [
          { text: 'Muy insatisfecho', icon: '😞', color: '#d32f2f' },
          { text: 'Insatisfecho', icon: '😕', color: '#f57c00' },
          { text: 'Neutral', icon: '😐', color: '#757575' },
          { text: 'Satisfecho', icon: '🙂', color: '#388e3c' },
          { text: 'Muy satisfecho', icon: '😊', color: '#2e7d32' }
        ],
        required: true
      },
      {
        id: '2',
        text: '¿Con qué frecuencia te sientes estresado en el trabajo?',
        type: 'multiple_choice' as const,
        options: [
          { text: 'Nunca', icon: '😌', color: '#4caf50' },
          { text: 'Raramente', icon: '🙂', color: '#8bc34a' },
          { text: 'A veces', icon: '😐', color: '#ff9800' },
          { text: 'Frecuentemente', icon: '😰', color: '#f57c00' },
          { text: 'Siempre', icon: '😱', color: '#d32f2f' }
        ],
        required: true
      }
    ];

    return baseQuestions.slice(0, questionCount);
  }
}
