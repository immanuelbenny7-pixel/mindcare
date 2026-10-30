import { MoodEntry, SleepEntry, ExerciseFeedback, UserPreferences } from '../types';

const STORAGE_KEYS = {
  MOODS: 'mindcare_mood_entries_v1',
  SLEEP: 'mindcare_sleep_entries_v1',
  FEEDBACK: 'mindcare_exercise_feedback_v1',
  PREFERENCES: 'mindcare_user_preferences_v1',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  hasCompletedOnboarding: false,
  consentForAIChat: true,
  consentForPhotoAnalysis: false,
  allowPrakashToReadLogs: true,
  favoriteExerciseIds: ['box-breathing', 'grounding-54321'],
  dismissedRecommendationIds: [],
};

// Cautious, realistic sample entries for first-time orientation, clearly marked
export const SAMPLE_MOODS: MoodEntry[] = [
  {
    id: 'sample-mood-1',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    mood: 'content',
    intensity: 7,
    tags: ['Outdoors', 'Quiet Time'],
    note: 'Took a morning walk in the park. Feeling balanced.'
  },
  {
    id: 'sample-mood-2',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    mood: 'stressed',
    intensity: 6,
    tags: ['Work', 'Screen time'],
    note: 'Back-to-back meetings and tight deadlines.'
  },
  {
    id: 'sample-mood-3',
    timestamp: new Date().toISOString(),
    mood: 'reflective',
    intensity: 5,
    tags: ['Quiet Time'],
    note: 'Reflecting on the week and resting.'
  }
];

export const SAMPLE_SLEEP: SleepEntry[] = [
  {
    id: 'sample-sleep-1',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString().split('T')[0],
    bedTime: '23:00',
    wakeTime: '07:00',
    durationHours: 8.0,
    quality: 'restful',
    energyLevel: 4,
    stressLevel: 2,
    notes: 'Slept soundly without interruptions.'
  },
  {
    id: 'sample-sleep-2',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString().split('T')[0],
    bedTime: '00:30',
    wakeTime: '06:15',
    durationHours: 5.75,
    quality: 'restless',
    energyLevel: 2,
    stressLevel: 4,
    notes: 'Woke up thinking about tomorrow.'
  }
];

export const StorageService = {
  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  },

  getMoods(): MoodEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MOODS);
      if (!data) {
        // Return sample data initially so users see how charts and features look
        localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(SAMPLE_MOODS));
        return SAMPLE_MOODS;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveMood(entry: Omit<MoodEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }): MoodEntry {
    const moods = this.getMoods();
    const newEntry: MoodEntry = {
      id: entry.id || 'mood_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: entry.timestamp || new Date().toISOString(),
      mood: entry.mood,
      intensity: entry.intensity,
      tags: entry.tags,
      note: entry.note,
      aiExpressionEstimate: entry.aiExpressionEstimate
    };

    const existingIndex = moods.findIndex(m => m.id === newEntry.id);
    if (existingIndex >= 0) {
      moods[existingIndex] = newEntry;
    } else {
      moods.unshift(newEntry);
    }
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
    return newEntry;
  },

  deleteMood(id: string): void {
    const moods = this.getMoods().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  },

  getSleepLogs(): SleepEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SLEEP);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(SAMPLE_SLEEP));
        return SAMPLE_SLEEP;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveSleep(entry: Omit<SleepEntry, 'id'> & { id?: string }): SleepEntry {
    const logs = this.getSleepLogs();
    const newEntry: SleepEntry = {
      ...entry,
      id: entry.id || 'sleep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    };

    const existingIndex = logs.findIndex(s => s.id === newEntry.id);
    if (existingIndex >= 0) {
      logs[existingIndex] = newEntry;
    } else {
      logs.unshift(newEntry);
    }
    localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(logs));
    return newEntry;
  },

  deleteSleep(id: string): void {
    const logs = this.getSleepLogs().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SLEEP, JSON.stringify(logs));
  },

  getFeedback(): ExerciseFeedback[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveFeedback(exerciseId: string, helpful: boolean, notes?: string): void {
    const all = this.getFeedback().filter(f => f.exerciseId !== exerciseId);
    all.push({
      exerciseId,
      timestamp: new Date().toISOString(),
      helpful,
      notes
    });
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(all));
  },

  toggleFavoriteExercise(exerciseId: string): boolean {
    const prefs = this.getPreferences();
    const favorites = new Set(prefs.favoriteExerciseIds || []);
    const isFav = favorites.has(exerciseId);
    if (isFav) {
      favorites.delete(exerciseId);
    } else {
      favorites.add(exerciseId);
    }
    this.savePreferences({ favoriteExerciseIds: Array.from(favorites) });
    return !isFav;
  },

  dismissRecommendation(id: string): void {
    const prefs = this.getPreferences();
    const dismissed = new Set(prefs.dismissedRecommendationIds || []);
    dismissed.add(id);
    this.savePreferences({ dismissedRecommendationIds: Array.from(dismissed) });
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.MOODS);
    localStorage.removeItem(STORAGE_KEYS.SLEEP);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
  },

  exportAllDataJson(): string {
    const exportBundle = {
      app: 'MindCare',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      disclaimer: 'This data is personal self-reflection information recorded by the user. It does not constitute medical records or health diagnoses.',
      preferences: this.getPreferences(),
      moodEntries: this.getMoods(),
      sleepEntries: this.getSleepLogs(),
      exerciseFeedback: this.getFeedback(),
    };
    return JSON.stringify(exportBundle, null, 2);
  }
};

