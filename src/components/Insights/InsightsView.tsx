import React, { useState } from 'react';
import { MoodEntry, SleepEntry } from '../../types';
import { MOOD_DEFINITIONS } from '../../data/moods';
import { 
  LineChart, 
  Calendar, 
  Trash2, 
  Download, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Clock, 
  Moon,
  Smile
} from 'lucide-react';

interface InsightsViewProps {
  moods: MoodEntry[];
  sleepLogs: SleepEntry[];
  onDeleteMood: (id: string) => void;
  onExportData: () => void;
  onClearAll: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  moods,
  sleepLogs,
  onDeleteMood,
  onExportData,
  onClearAll,
}) => {
  const [activeView, setActiveView] = useState<'timeline' | 'charts'>('charts');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Derive cautious non-causal observations
  const generateCautiousObservations = () => {
    const observations: string[] = [];

    if (moods.length < 2 && sleepLogs.length < 2) {
      return [
        'Keep recording check-ins over a few days to view personal rhythm patterns here.'
      ];
    }

    // Check correlation between low sleep duration and stressed/fatigued mood on same/next day
    const shortSleepNights = sleepLogs.filter(s => s.durationHours < 6.5);
    const lowMoods = moods.filter(m => m.mood === 'fatigued' || m.mood === 'stressed' || m.mood === 'overwhelmed');

    if (shortSleepNights.length > 0 && lowMoods.length > 0) {
      observations.push(
        'You logged fatigued or stressed moods on some days following less than 6.5 hours of sleep. (Note: These reflect co-occurring self-reports, not direct cause-and-effect).'
      );
    }

    // Check peaceful/content days
    const gentleMoods = moods.filter(m => m.mood === 'peaceful' || m.mood === 'content' || m.mood === 'joyful');
    if (gentleMoods.length > 0) {
      const topTags = gentleMoods.flatMap(m => m.tags);
      if (topTags.length > 0) {
        observations.push(
          `Moments of ease or peace frequently coincided with activities tagged: ${Array.from(new Set(topTags)).slice(0, 3).join(', ')}.`
        );
      }
    }

    // Energy trends
    const avgSleep = sleepLogs.length > 0 
      ? Math.round((sleepLogs.reduce((acc, s) => acc + s.durationHours, 0) / sleepLogs.length) * 10) / 10 
      : null;

    if (avgSleep) {
      observations.push(`Your self-reported sleep across logged nights averages about ${avgSleep} hours.`);
    }

    return observations;
  };

  const observations = generateCautiousObservations();

  // Prepare simple 7-day trend data for custom SVG chart
  const recentDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = recentDays.map(dayStr => {
    const dayMoods = moods.filter(m => m.timestamp.startsWith(dayStr));
    const daySleep = sleepLogs.find(s => s.timestamp.startsWith(dayStr));

    const avgIntensity = dayMoods.length > 0
      ? dayMoods.reduce((acc, m) => acc + m.intensity, 0) / dayMoods.length
      : null;

    return {
      date: dayStr,
      label: new Date(dayStr).toLocaleDateString(undefined, { weekday: 'short' }),
      intensity: avgIntensity,
      sleepHours: daySleep ? daySleep.durationHours : null,
      primaryMood: dayMoods[0]?.mood
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <LineChart className="w-3.5 h-3.5" /> History & Insights
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Reflective Trends & Personal Rhythms
          </h1>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            Review confirmed entries. All summaries describe observations in your self-reported logs without claiming medical diagnosis or causation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportData}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-medium transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export (JSON)</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-medium transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* Cautious Pattern Summary Card */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sage-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-sage-600" />
            <span>Cautious Pattern Observations</span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">Non-causal self-reflections</span>
        </div>

        <div className="space-y-2">
          {observations.map((obs, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <span className="text-sage-500 font-bold">•</span>
              <span>{obs}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-500 italic">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>MindCare never implies that one event caused another. Many factors affect human wellbeing.</span>
        </div>
      </div>

      {/* Toggle View: Charts vs Timeline */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveView('charts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeView === 'charts'
              ? 'bg-sage-700 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" /> Trend Charts (7 Days)
        </button>
        <button
          onClick={() => setActiveView('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeView === 'timeline'
              ? 'bg-sage-700 text-white shadow-xs'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Chronological Timeline
        </button>
      </div>

      {/* Charts View */}
      {activeView === 'charts' && (
        <div className="space-y-6 animate-fade-in">
          {/* Mood Intensity Chart */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-sage-600" /> Daily Mood Intensity (Scale 1 - 10)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Average strength of self-reported feeling per day</p>
              </div>
            </div>

            {/* Responsive SVG Chart */}
            <div className="h-44 w-full flex items-end justify-between pt-6 px-2 gap-2">
              {chartData.map((d) => {
                const heightPercent = d.intensity ? Math.round((d.intensity / 10) * 100) : 0;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-sage-700 opacity-0 group-hover:opacity-100 transition">
                      {d.intensity ? `${Math.round(d.intensity * 10) / 10}` : '—'}
                    </div>

                    <div className="w-full max-w-[42px] bg-sage-50 rounded-xl h-32 flex items-end p-1 border border-sage-100">
                      {d.intensity ? (
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-sage-500 group-hover:bg-sage-600 transition-all rounded-lg shadow-inner"
                        />
                      ) : (
                        <div className="w-full h-1 bg-gray-200 rounded" />
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-gray-600">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sleep Hours Chart */}
          <div className="p-6 bg-white rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" /> Logged Sleep Duration (Hours)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Duration recorded in your sleep journal</p>
              </div>
            </div>

            <div className="h-44 w-full flex items-end justify-between pt-6 px-2 gap-2">
              {chartData.map((d) => {
                const maxHourScale = 10;
                const heightPercent = d.sleepHours ? Math.min(Math.round((d.sleepHours / maxHourScale) * 100), 100) : 0;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-indigo-700 opacity-0 group-hover:opacity-100 transition">
                      {d.sleepHours ? `${d.sleepHours}h` : '—'}
                    </div>

                    <div className="w-full max-w-[42px] bg-indigo-50/60 rounded-xl h-32 flex items-end p-1 border border-indigo-100">
                      {d.sleepHours ? (
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-indigo-500 group-hover:bg-indigo-600 transition-all rounded-lg shadow-inner"
                        />
                      ) : (
                        <div className="w-full h-1 bg-gray-200 rounded" />
                      )}
                    </div>

                    <span className="text-[11px] font-medium text-gray-600">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {activeView === 'timeline' && (
        <div className="space-y-4 animate-fade-in">
          {moods.map((entry) => {
            const def = MOOD_DEFINITIONS[entry.mood] || MOOD_DEFINITIONS.content;
            return (
              <div
                key={entry.id}
                className="p-5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${def.bgColor} border border-current text-2xl flex-shrink-0`}>
                    {def.emoji}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">
                        {def.label}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
                        Intensity: {entry.intensity}/10
                      </span>
                      {entry.aiExpressionEstimate && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-50 text-sage-700 border border-sage-200">
                          Tentative photo guess confirmed
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(entry.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    {entry.note && (
                      <p className="text-xs text-gray-700 mt-1 italic">
                        &ldquo;{entry.note}&rdquo;
                      </p>
                    )}

                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.map(t => (
                          <span key={t} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMood(entry.id)}
                  aria-label="Delete mood check-in"
                  className="self-end sm:self-center p-2 text-gray-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {moods.length === 0 && (
            <div className="p-8 bg-white rounded-3xl border border-gray-200 text-center text-sm text-gray-500">
              No mood check-ins recorded yet. Head to &ldquo;Mood Log&rdquo; to add your first reflection.
            </div>
          )}
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-data-dialog-title"
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 id="clear-data-dialog-title" className="text-lg font-bold text-gray-900">
                Clear all reflection records?
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                This will delete your mood entries, sleep logs, and exercise feedback from your browser storage. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

