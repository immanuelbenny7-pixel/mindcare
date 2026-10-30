import React, { useState, useEffect, useMemo } from 'react';
import { 
  MoodEntry, 
  SleepEntry, 
  Exercise, 
  ExerciseFeedback, 
  UserPreferences 
} from './types';
import { StorageService } from './services/storage';
import { generateRecommendations } from './services/recommender';
import { ApiService } from './services/api';

import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/Dashboard/DashboardView';
import { MoodCheckInView } from './components/Mood/MoodCheckInView';
import { SleepLogView } from './components/Sleep/SleepLogView';
import { InsightsView } from './components/Insights/InsightsView';
import { ExerciseLibraryView } from './components/Exercises/ExerciseLibraryView';
import { ActiveExerciseModal } from './components/Exercises/ActiveExerciseModal';
import { PrakashChatView } from './components/Chat/PrakashChatView';
import { SettingsView } from './components/Settings/SettingsView';
import { EmergencyModal } from './components/EmergencyModal';
import { OnboardingModal } from './components/OnboardingModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [preferences, setPreferences] = useState<UserPreferences>(() => StorageService.getPreferences());
  const [moods, setMoods] = useState<MoodEntry[]>(() => StorageService.getMoods());
  const [sleepLogs, setSleepLogs] = useState<SleepEntry[]>(() => StorageService.getSleepLogs());
  const [feedback, setFeedback] = useState<ExerciseFeedback[]>(() => StorageService.getFeedback());

  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(!preferences.hasCompletedOnboarding);

  const [apiStatus, setApiStatus] = useState<{ configured: boolean; model: string }>({
    configured: false,
    model: 'gemini-2.5-flash',
  });

  // Check backend and Gemini status on mount
  useEffect(() => {
    ApiService.getHealth().then(status => {
      setApiStatus({
        configured: status.geminiConfigured,
        model: status.model || 'gemini-2.5-flash',
      });
    }).catch(() => {
      setApiStatus({ configured: false, model: 'local-mode' });
    });
  }, []);

  // Compute dynamic personalized recommendations based on user entries and feedback
  const recommendations = useMemo(() => {
    return generateRecommendations(
      moods,
      sleepLogs,
      feedback,
      preferences.dismissedRecommendationIds
    );
  }, [moods, sleepLogs, feedback, preferences.dismissedRecommendationIds]);

  // Map of exercise feedback for fast lookup
  const feedbackMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const f of feedback) {
      map[f.exerciseId] = f.helpful;
    }
    return map;
  }, [feedback]);

  // Handlers
  const handleSaveMood = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const saved = StorageService.saveMood(entry);
    setMoods(StorageService.getMoods());
  };

  const handleDeleteMood = (id: string) => {
    StorageService.deleteMood(id);
    setMoods(StorageService.getMoods());
  };

  const handleSaveSleep = (entry: Omit<SleepEntry, 'id'>) => {
    StorageService.saveSleep(entry);
    setSleepLogs(StorageService.getSleepLogs());
  };

  const handleDeleteSleep = (id: string) => {
    StorageService.deleteSleep(id);
    setSleepLogs(StorageService.getSleepLogs());
  };

  const handleRateHelpful = (exerciseId: string, helpful: boolean) => {
    StorageService.saveFeedback(exerciseId, helpful);
    setFeedback(StorageService.getFeedback());
  };

  const handleToggleFavorite = (exerciseId: string) => {
    StorageService.toggleFavoriteExercise(exerciseId);
    setPreferences(StorageService.getPreferences());
  };

  const handleDismissRecommendation = (recId: string) => {
    StorageService.dismissRecommendation(recId);
    setPreferences(StorageService.getPreferences());
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    const saved = StorageService.savePreferences(updated);
    setPreferences(saved);
  };

  const handleExportData = () => {
    const jsonStr = StorageService.exportAllDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcare-reflection-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAllData = () => {
    StorageService.clearAllData();
    setMoods([]);
    setSleepLogs([]);
    setFeedback([]);
    setPreferences(StorageService.getPreferences());
    setActiveTab('dashboard');
  };

  const recentMood = moods.length > 0 ? moods[0] : null;
  const recentSleep = sleepLogs.length > 0 ? sleepLogs[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        apiStatus={apiStatus}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {activeTab === 'dashboard' && (
          <DashboardView
            recentMood={recentMood}
            recentSleep={recentSleep}
            recommendations={recommendations}
            onNavigateTab={setActiveTab}
            onStartExercise={(ex) => setActiveExercise(ex)}
            onDismissRecommendation={handleDismissRecommendation}
            onRateHelpful={handleRateHelpful}
          />
        )}

        {activeTab === 'mood' && (
          <MoodCheckInView
            onSaveMood={handleSaveMood}
            onNavigateInsights={() => setActiveTab('insights')}
            initialConsentPhoto={preferences.consentForPhotoAnalysis}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepLogView
            sleepLogs={sleepLogs}
            onSaveSleep={handleSaveSleep}
            onDeleteSleep={handleDeleteSleep}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            moods={moods}
            sleepLogs={sleepLogs}
            onDeleteMood={handleDeleteMood}
            onExportData={handleExportData}
            onClearAll={handleClearAllData}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibraryView
            onStartExercise={(ex) => setActiveExercise(ex)}
            favorites={preferences.favoriteExerciseIds}
            onToggleFavorite={handleToggleFavorite}
            feedbackMap={feedbackMap}
          />
        )}

        {activeTab === 'chat' && (
          <PrakashChatView
            recentMood={recentMood}
            recentSleep={recentSleep}
            onStartExercise={(ex) => setActiveExercise(ex)}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            allowLogsContext={preferences.allowPrakashToReadLogs}
            onToggleAllowLogsContext={(allow) => handleUpdatePreferences({ allowPrakashToReadLogs: allow })}
            consentAIChat={preferences.consentForAIChat}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
            onExportData={handleExportData}
            onClearAllData={handleClearAllData}
            onReopenOnboarding={() => setIsOnboardingOpen(true)}
            apiStatus={apiStatus}
          />
        )}
      </main>

      {/* Guided Active Exercise Modal */}
      {activeExercise && (
        <ActiveExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onRateHelpful={handleRateHelpful}
          isFavorite={preferences.favoriteExerciseIds.includes(activeExercise.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Emergency & Crisis Support Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      {/* Onboarding & Non-Medical Boundaries Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        preferences={preferences}
        onComplete={(updatedPrefs) => {
          handleUpdatePreferences(updatedPrefs);
          setIsOnboardingOpen(false);
        }}
      />

      {/* Footer with Clear Boundary & Privacy Reminder */}
      <footer className="mt-auto border-t border-sage-200/60 bg-white/60 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-medium text-gray-700">
            🌿 MindCare is a personal mental wellness and self-reflection space.
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            MindCare is not a medical product and does not provide clinical diagnoses, psychiatric assessments, or psychotherapy. If you are experiencing a crisis, please dial <strong>988</strong> (US/Canada), <strong>14416</strong> (India), <strong>111/999</strong> (UK), or contact your local emergency services.
          </p>
          <div className="pt-1 flex items-center justify-center gap-4 text-[11px] text-gray-400">
            <span>Server-side Gemini Integration</span>
            <span>•</span>
            <span>Zero Image Storage</span>
            <span>•</span>
            <span>Client-side Data Ownership</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;

