import { AIService } from '../interfaces/AIService';
import { Question } from '../entities/Survey';

export class CreateSurveyWithAI {
  constructor(private aiService: AIService) {}

  /**
   * Crea una encuesta usando IA basada en un prompt
   * @param prompt - Descripción del objetivo de la encuesta
   * @param questionCount - Número de preguntas a generar
   * @param questionTypes - Tipos de preguntas solicitadas
   * @returns Promise con array de preguntas generadas por IA
   */
  async execute(
    prompt: string,
    questionCount: number,
    questionTypes: string[]
  ): Promise<Question[]> {
    try {
      // Validar inputs
      if (!prompt.trim()) {
        throw new Error('El prompt es requerido');
      }

      if (questionCount < 1 || questionCount > 20) {
        throw new Error('El número de preguntas debe estar entre 1 y 20');
      }

      if (!questionTypes.length) {
        throw new Error('Debe especificar al menos un tipo de pregunta');
      }

      // Generar preguntas usando IA
      const questions = await this.aiService.generateSurveyQuestions(
        prompt,
        questionCount,
        questionTypes
      );

      return questions;

    } catch (error) {
      console.error('Error en CreateSurveyWithAI:', error);
      throw error;
    }
  }
}
