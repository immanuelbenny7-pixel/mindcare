import React, { useState } from 'react';
import { SleepEntry, SleepQuality } from '../../types';
import { Moon, Sun, Clock, Zap, Flame, Check, Trash2, Info, CheckCircle2 } from 'lucide-react';

interface SleepLogViewProps {
  sleepLogs: SleepEntry[];
  onSaveSleep: (entry: Omit<SleepEntry, 'id'>) => void;
  onDeleteSleep: (id: string) => void;
}

export const SleepLogView: React.FC<SleepLogViewProps> = ({
  sleepLogs,
  onSaveSleep,
  onDeleteSleep,
}) => {
  const [bedTime, setBedTime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [quality, setQuality] = useState<SleepQuality>('restful');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [stressLevel, setStressLevel] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-calculate duration in hours
  const calculateDuration = (start: string, end: string): number => {
    try {
      const [sh, sm] = start.split(':').map(Number);
      const [eh, em] = end.split(':').map(Number);
      let diffMinutes = (eh * 60 + em) - (sh * 60 + sm);
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // Overnight
      }
      return Math.round((diffMinutes / 60) * 10) / 10;
    } catch {
      return 8.0;
    }
  };

  const calculatedHours = calculateDuration(bedTime, wakeTime);

  const qualityOptions: { id: SleepQuality; label: string; icon: string; desc: string }[] = [
    { id: 'deep', label: 'Deep & Restorative', icon: '✨', desc: 'Woke feeling refreshed and uninterrupted.' },
    { id: 'restful', label: 'Restful', icon: '🌿', desc: 'Good solid sleep, woke naturally.' },
    { id: 'fair', label: 'Fair / Okay', icon: '🌤️', desc: 'Average rest, minor awakenings.' },
    { id: 'restless', label: 'Restless', icon: '🌀', desc: 'Tossed and turned, racing thoughts.' },
    { id: 'interrupted', label: 'Interrupted', icon: '⚡', desc: 'Woke multiple times throughout the night.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSleep({
      timestamp: new Date().toISOString().split('T')[0],
      bedTime,
      wakeTime,
      durationHours: calculatedHours,
      quality,
      energyLevel,
      stressLevel,
      notes: notes.trim() || undefined,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Moon className="w-3.5 h-3.5" /> Sleep & Wellbeing Log
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Rest, Energy & Daily Pacing
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
          Record your sleep and wake patterns to notice personal rhythms. This is a personal diary, not a clinical polysomnography or medical sleep disorder assessment.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium">Sleep entry recorded successfully.</span>
        </div>
      )}

      {/* Main Grid: Entry Form + Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-gray-900">
            Log Last Night&rsquo;s Rest
          </h2>

          {/* Bedtime & Wake Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bed-time" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                Bedtime
              </label>
              <div className="relative">
                <input
                  id="bed-time"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="wake-time" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                Wake Time
              </label>
              <div className="relative">
                <input
                  id="wake-time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
                Estimated Rest
              </span>
              <div className="px-3.5 py-2 rounded-xl bg-sage-50 border border-sage-200 text-sage-900 text-sm font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sage-600" />
                <span>{calculatedHours} hrs</span>
              </div>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2 pt-2">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Quality of Rest
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {qualityOptions.map((opt) => {
                const isSelected = quality === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setQuality(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-400'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{opt.label}</div>
                      <div className="text-[11px] text-gray-500 line-clamp-1">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Energy & Stress Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="morning-energy" className="text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> Morning Energy
                </label>
                <span className="text-xs font-bold text-amber-700 px-2 py-0.5 bg-amber-50 rounded">
                  {energyLevel} / 5
                </span>
              </div>
              <input
                id="morning-energy"
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Drained (1)</span>
                <span>Vibrant (5)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="morning-stress" className="text-xs font-semibold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" /> Stress / Tension
                </label>
                <span className="text-xs font-bold text-rose-700 px-2 py-0.5 bg-rose-50 rounded">
                  {stressLevel} / 5
                </span>
              </div>
              <input
                id="morning-stress"
                type="range"
                min="1"
                max="5"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Calm (1)</span>
                <span>Elevated (5)</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 pt-2">
            <label htmlFor="sleep-notes" className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
              Optional Notes (dreams, caffeine, screen time, etc.)
            </label>
            <textarea
              id="sleep-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Read a book for 20 minutes before lights out; slept undisturbed."
              className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-sage-400 focus:outline-none resize-none bg-gray-50/50"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Self-reported log for reflection
            </span>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save Sleep Log
            </button>
          </div>
        </form>

        {/* Recent Sleep Logs List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-gray-900">
            Recent Sleep Logs
          </h2>

          <div className="space-y-3">
            {sleepLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2 hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">
                    {new Date(log.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      weekday: 'short',
                    })}
                  </span>
                  <button
                    onClick={() => onDeleteSleep(log.id)}
                    aria-label="Delete entry"
                    className="p-1 text-gray-300 hover:text-rose-500 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {log.durationHours} hrs
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium capitalize">
                    {log.quality}
                  </span>
                </div>

                <div className="text-[11px] text-gray-500 flex items-center gap-3">
                  <span>Bed: {log.bedTime}</span>
                  <span>Wake: {log.wakeTime}</span>
                  <span>Energy: {log.energyLevel}/5</span>
                </div>

                {log.notes && (
                  <p className="text-[11px] text-gray-600 italic border-t border-gray-100 pt-1.5">
                    &ldquo;{log.notes}&rdquo;
                  </p>
                )}
              </div>
            ))}

            {sleepLogs.length === 0 && (
              <div className="p-6 bg-white rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
                No sleep entries logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

