export interface QuestionOption {
  text: string;
  icon?: string;
  color?: string;
  value?: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'open_text' | 'rating' | 'yes_no' | 'ranking' | 'gamified_rating';
  options?: QuestionOption[];
  required: boolean;
  icon?: string;
  color?: string;
  theme?: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  objective: string;
  targetAudience: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived' | 'scheduled';
  questions: Question[];
  createdAt: string;
  responses: number;
  target: number;
  scheduledDate?: string;
  notificationMethods?: string[];
  reminderFrequency?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  OPEN_ENDED = 'open_ended',
  RATING = 'rating',
  YES_NO = 'yes_no'
}

export enum SurveyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  answers: Answer[];
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  value: string | number | string[];
}
