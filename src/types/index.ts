export type MoodType = 
  | 'peaceful'
  | 'content'
  | 'joyful'
  | 'reflective'
  | 'anxious'
  | 'fatigued'
  | 'stressed'
  | 'low'
  | 'energized'
  | 'overwhelmed';

export interface MoodConfig {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
}

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  mood: MoodType;
  intensity: number; // 1 to 10
  tags: string[];
  note?: string;
  aiExpressionEstimate?: {
    expressionObserved: string;
    tentativeSuggestion: MoodType;
    confidenceNote: string;
    userConfirmed: boolean;
  };
}

export type SleepQuality = 'deep' | 'restful' | 'fair' | 'restless' | 'interrupted';

export interface SleepEntry {
  id: string;
  timestamp: string; // Date of entry
  bedTime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationHours: number;
  quality: SleepQuality;
  energyLevel: number; // 1 to 5
  stressLevel: number; // 1 to 5
  notes?: string;
}

export type ExerciseCategory = 
  | 'breathing'
  | 'grounding'
  | 'movement'
  | 'journaling'
  | 'wind-down';

export interface ExerciseStep {
  title: string;
  instruction: string;
  durationSeconds?: number;
  type?: 'inhale' | 'hold' | 'exhale' | 'read' | 'reflect' | 'move';
}

export interface Exercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  durationMinutes: number;
  shortDescription: string;
  detailedGuide: string[];
  steps?: ExerciseStep[];
  interactiveType?: 'box-breathing' | '4-7-8' | 'grounding-54321' | 'journaling' | 'guided-steps';
  tags: string[];
  isLowRisk: boolean;
}

export interface ExerciseFeedback {
  exerciseId: string;
  timestamp: string;
  helpful: boolean;
  notes?: string;
}

export interface PersonalizedRecommendation {
  id: string;
  exercise: Exercise;
  reason: string;
  informedBy: string; // e.g. "Suggested because you logged restless sleep last night"
  priority: number;
  isDismissed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    exerciseId?: string;
  };
  contextDisclosed?: {
    moodIncluded?: string;
    sleepIncluded?: string;
  };
}

export interface UserPreferences {
  hasCompletedOnboarding: boolean;
  consentForAIChat: boolean;
  consentForPhotoAnalysis: boolean;
  allowPrakashToReadLogs: boolean;
  favoriteExerciseIds: string[];
  dismissedRecommendationIds: string[];
}

