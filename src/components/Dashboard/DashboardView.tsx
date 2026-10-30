import React from 'react';
import { MoodEntry, SleepEntry, PersonalizedRecommendation, Exercise } from '../../types';
import { MOOD_DEFINITIONS } from '../../data/moods';
import { 
  Smile, 
  Moon, 
  Sparkles, 
  BookOpen, 
  MessageSquareHeart, 
  ArrowRight, 
  Check, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Play, 
  Flame, 
  Zap,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  recentMood: MoodEntry | null;
  recentSleep: SleepEntry | null;
  recommendations: PersonalizedRecommendation[];
  onNavigateTab: (tab: any) => void;
  onStartExercise: (exercise: Exercise) => void;
  onDismissRecommendation: (id: string) => void;
  onRateHelpful: (exerciseId: string, helpful: boolean) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  recentMood,
  recentSleep,
  recommendations,
  onNavigateTab,
  onStartExercise,
  onDismissRecommendation,
  onRateHelpful,
}) => {
  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentMoodDef = recentMood ? MOOD_DEFINITIONS[recentMood.mood] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900 text-white p-7 sm:p-10 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-sage-100 text-xs font-semibold uppercase tracking-wider">
            <span>🌿</span> MindCare Daily Space
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {getGreeting()}. What are you noticing today?
          </h1>
          <p className="text-sage-100/90 text-sm sm:text-base leading-relaxed">
            Welcome to your calm pause. Take a deep, unhurried breath. There are no expectations or metrics to hit here—just gentle self-reflection.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('mood')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sage-900 hover:bg-sage-50 text-xs sm:text-sm font-semibold transition shadow-sm"
            >
              <Smile className="w-4 h-4 text-sage-700" />
              <span>Log My Mood</span>
            </button>
            <button
              onClick={() => onNavigateTab('chat')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs sm:text-sm font-semibold transition border border-white/20"
            >
              <MessageSquareHeart className="w-4 h-4" />
              <span>Reflect with Prakash</span>
            </button>
            <button
              onClick={() => onNavigateTab('exercises')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md text-xs sm:text-sm font-semibold transition border border-white/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Try an Exercise</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-sage-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Personalized "Suggested for you" Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Suggested For You
              </h2>
              <p className="text-xs text-gray-500">
                Gentle, optional practices based on your recent check-in reflections
              </p>
            </div>
          </div>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-sage-300 transition group"
              >
                <div className="space-y-3">
                  {/* Transparent Rationale Badge */}
                  <div className="p-2.5 rounded-xl bg-sage-50/80 border border-sage-100 flex items-start justify-between gap-2">
                    <div className="flex items-start gap-1.5 text-xs text-sage-900 leading-snug">
                      <Info className="w-3.5 h-3.5 text-sage-700 mt-0.5 flex-shrink-0" />
                      <span>{rec.informedBy}</span>
                    </div>
                    <button
                      onClick={() => onDismissRecommendation(rec.id)}
                      title="Dismiss this suggestion"
                      className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
                      aria-label="Dismiss recommendation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-sage-700">
                      {rec.exercise.category} • ~{rec.exercise.durationMinutes} min
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-0.5 group-hover:text-sage-800 transition">
                      {rec.exercise.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                </div>

                {/* Card Actions: Start + Helpfulness */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRateHelpful(rec.exercise.id, true)}
                      title="Mark as helpful"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      aria-label="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onRateHelpful(rec.exercise.id, false)}
                      title="Mark as not helpful"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      aria-label="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onStartExercise(rec.exercise)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white text-xs font-semibold transition shadow-xs"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Begin</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white rounded-3xl border border-gray-200 text-center text-xs text-gray-500">
            No active suggestions. Check in your mood or sleep to receive tailored recommendations.
          </div>
        )}
      </div>

      {/* 3. At A Glance: Recent Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Mood Snapshot */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="w-5 h-5 text-sage-600" />
              <h2 className="font-bold text-gray-900 text-base">Latest Mood Check-in</h2>
            </div>
            <button
              onClick={() => onNavigateTab('mood')}
              className="text-xs text-sage-700 hover:text-sage-900 font-semibold"
            >
              + Check In
            </button>
          </div>

          {recentMood && currentMoodDef ? (
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/60 border border-gray-100">
              <span className="text-3xl">{currentMoodDef.emoji}</span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{currentMoodDef.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-medium">
                    Intensity: {recentMood.intensity}/10
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {recentMood.note ? `“${recentMood.note}”` : currentMoodDef.description}
                </p>
                <div className="text-[10px] text-gray-400 flex items-center gap-1.5 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(recentMood.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl">
              No mood check-ins recorded yet today.
            </div>
          )}
        </div>

        {/* Latest Sleep Snapshot */}
        <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-gray-900 text-base">Latest Sleep Log</h2>
            </div>
            <button
              onClick={() => onNavigateTab('sleep')}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold"
            >
              + Log Sleep
            </button>
          </div>

          {recentSleep ? (
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {recentSleep.durationHours} hours
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-medium capitalize">
                  {recentSleep.quality}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Energy: {recentSleep.energyLevel}/5
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Stress: {recentSleep.stressLevel}/5
                </span>
              </div>
              {recentSleep.notes && (
                <p className="text-xs text-gray-600 italic pt-1 border-t border-indigo-100">
                  &ldquo;{recentSleep.notes}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-2xl">
              No sleep recorded for last night.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

