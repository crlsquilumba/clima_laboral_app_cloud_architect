import { Survey, SurveyResponse } from '../entities/Survey';

export interface SurveyRepository {
  // Survey CRUD operations
  createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
  getSurveyById(id: string): Promise<Survey | null>;
  getAllSurveys(): Promise<Survey[]>;
  updateSurvey(id: string, updates: Partial<Survey>): Promise<Survey>;
  deleteSurvey(id: string): Promise<boolean>;
  
  // Survey responses
  submitResponse(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse>;
  getSurveyResponses(surveyId: string): Promise<SurveyResponse[]>;
  getResponseCount(surveyId: string): Promise<number>;
  
  // Survey management
  activateSurvey(id: string): Promise<Survey>;
  pauseSurvey(id: string): Promise<Survey>;
  completeSurvey(id: string): Promise<Survey>;
  
  // Search and filtering
  searchSurveys(query: string): Promise<Survey[]>;
  getSurveysByStatus(status: Survey['status']): Promise<Survey[]>;
  getSurveysByCreator(creatorId: string): Promise<Survey[]>;
}
