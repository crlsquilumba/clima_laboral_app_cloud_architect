import { Survey, SurveyResponse, SurveyStatus } from '@/core/entities/Survey';
import { SurveyRepository } from '@/core/interfaces/SurveyRepository';

export class LocalSurveyRepository implements SurveyRepository {
  private surveys: Survey[] = [];
  private responses: SurveyResponse[] = [];
  private nextId = 1;

  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    const now = new Date();
    const newSurvey: Survey = {
      ...survey,
      id: `survey_${this.nextId++}`,
      createdAt: now,
      updatedAt: now
    };
    
    this.surveys.push(newSurvey);
    return newSurvey;
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    return this.surveys.find(s => s.id === id) || null;
  }

  async getAllSurveys(): Promise<Survey[]> {
    return [...this.surveys];
  }

  async updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Survey not found');
    }

    this.surveys[index] = {
      ...this.surveys[index],
      ...updates,
      updatedAt: new Date()
    };

    return this.surveys[index];
  }

  async deleteSurvey(id: string): Promise<boolean> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index === -1) {
      return false;
    }

    this.surveys.splice(index, 1);
    return true;
  }

  async submitResponse(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> {
    const newResponse: SurveyResponse = {
      ...response,
      id: `response_${Date.now()}`,
      submittedAt: new Date()
    };

    this.responses.push(newResponse);

    // Update survey response count
    const survey = await this.getSurveyById(response.surveyId);
    if (survey) {
      await this.updateSurvey(response.surveyId, {
        responsesCount: survey.responsesCount + 1
      });
    }

    return newResponse;
  }

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    return this.responses.filter(r => r.surveyId === surveyId);
  }

  async getResponseCount(surveyId: string): Promise<number> {
    return this.responses.filter(r => r.surveyId === surveyId).length;
  }

  async activateSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: SurveyStatus.ACTIVE });
  }

  async pauseSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: SurveyStatus.PAUSED });
  }

  async completeSurvey(id: string): Promise<Survey> {
    return this.updateSurvey(id, { status: SurveyStatus.COMPLETED });
  }

  async searchSurveys(query: string): Promise<Survey[]> {
    const lowerQuery = query.toLowerCase();
    return this.surveys.filter(s => 
      s.title.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
    );
  }

  async getSurveysByStatus(status: SurveyStatus): Promise<Survey[]> {
    return this.surveys.filter(s => s.status === status);
  }

  async getSurveysByCreator(creatorId: string): Promise<Survey[]> {
    return this.surveys.filter(s => s.createdBy === creatorId);
  }

  // Demo helper methods
  getDemoData(): Survey[] {
    return [
      {
        id: 'demo_1',
        title: 'Encuesta de Satisfacción Laboral Q4 2024',
        description: 'Evaluación del clima laboral y satisfacción de empleados',
        questions: [
          {
            id: 'q1',
            text: '¿Cómo calificarías tu satisfacción general en la empresa?',
            type: 'rating' as any,
            required: true,
            order: 1
          },
          {
            id: 'q2',
            text: '¿Qué aspectos te gustaría que mejoremos?',
            type: 'open_ended' as any,
            required: false,
            order: 2
          }
        ],
        status: SurveyStatus.ACTIVE,
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01'),
        createdBy: 'hr_assistant_1',
        targetAudience: ['Empleados', 'Gerentes'],
        responsesCount: 45
      }
    ];
  }
}
