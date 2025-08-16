export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  HR_ASSISTANT = 'hr_assistant',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface UserProfile {
  userId: string;
  phoneNumber?: string;
  address?: string;
  emergencyContact?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notificationSettings: NotificationSettings;
  theme: 'light' | 'dark';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  surveyReminders: boolean;
  ideaUpdates: boolean;
  generalAnnouncements: boolean;
}
