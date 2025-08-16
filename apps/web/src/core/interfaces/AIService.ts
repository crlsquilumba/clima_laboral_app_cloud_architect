import { Question } from '../entities/Survey';

export interface AIService {
  /**
   * Genera preguntas de encuesta basadas en un prompt y configuración
   * @param prompt - Descripción del objetivo de la encuesta
   * @param questionCount - Número de preguntas a generar
   * @param questionTypes - Tipos de preguntas solicitadas
   * @returns Promise con array de preguntas generadas
   */
  generateSurveyQuestions(
    prompt: string, 
    questionCount: number, 
    questionTypes: string[]
  ): Promise<Question[]>;
}
