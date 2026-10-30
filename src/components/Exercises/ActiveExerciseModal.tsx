import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import { X, Play, Pause, RotateCcw, ThumbsUp, ThumbsDown, CheckCircle, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActiveExerciseModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onRateHelpful: (exerciseId: string, helpful: boolean) => void;
  isFavorite: boolean;
  onToggleFavorite: (exerciseId: string) => void;
}

export const ActiveExerciseModal: React.FC<ActiveExerciseModalProps> = ({
  exercise,
  onClose,
  onRateHelpful,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!exercise) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [ratedFeedback, setRatedFeedback] = useState<boolean | null>(null);

  const steps = exercise.steps || [];
  const currentStep = steps[currentStepIndex];

  // Reset timer on step change
  useEffect(() => {
    if (currentStep?.durationSeconds) {
      setTimerSeconds(currentStep.durationSeconds);
    } else {
      setTimerSeconds(0);
    }
  }, [currentStepIndex, currentStep]);

  // Step countdown timer
  useEffect(() => {
    if (!isPlaying || isCompleted || !currentStep?.durationSeconds) return;

    if (timerSeconds <= 0) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      } else {
        handleFinish();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timerSeconds, currentStepIndex, steps.length, isCompleted]);

  const handleFinish = () => {
    setIsCompleted(true);
    setIsPlaying(false);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#648566', '#abc0ac', '#8c6ad7']
      });
    } catch {
      // ignore
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRating = (helpful: boolean) => {
    setRatedFeedback(helpful);
    onRateHelpful(exercise.id, helpful);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-exercise-title"
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-sage-100 flex flex-col max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-sage-50 text-sage-700 border border-sage-200">
              {exercise.category}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              ~{exercise.durationMinutes} min
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(exercise.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              className={`p-2 rounded-full transition ${
                isFavorite ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close exercise"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isCompleted ? (
          <div className="py-6 flex-1 flex flex-col items-center text-center justify-center space-y-6">
            <h2 id="active-exercise-title" className="text-2xl font-bold text-gray-900">
              {exercise.title}
            </h2>
            <p className="text-sm text-gray-600 max-w-md">
              {exercise.shortDescription}
            </p>

            {/* Interactive Visualizations */}
            {exercise.interactiveType === 'box-breathing' && (
              <div className="py-8 flex flex-col items-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-sage-200 animate-spin" style={{ animationDuration: '32s' }} />
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-sage-500 text-white flex flex-col items-center justify-center shadow-lg transition-all animate-breathing-circle">
                    <span className="text-sm uppercase tracking-widest font-semibold opacity-90">
                      {currentStep?.title || 'Breathe'}
                    </span>
                    {timerSeconds > 0 && (
                      <span className="text-3xl font-bold mt-1">
                        {timerSeconds}s
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-6 text-sm text-sage-900 font-medium px-4 py-1.5 bg-sage-50 rounded-full">
                  {currentStep?.instruction || 'Inhale 4s • Hold 4s • Exhale 4s • Rest 4s'}
                </p>
              </div>
            )}

            {exercise.interactiveType === '4-7-8' && (
              <div className="py-8 flex flex-col items-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-lavender-200" />
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-lavender-500 text-white flex flex-col items-center justify-center shadow-lg transition-all animate-breathing-478">
                    <span className="text-sm uppercase tracking-widest font-semibold opacity-90">
                      {currentStep?.title || '4-7-8'}
                    </span>
                    {timerSeconds > 0 && (
                      <span className="text-3xl font-bold mt-1">
                        {timerSeconds}s
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-6 text-sm text-lavender-800 font-medium px-4 py-1.5 bg-lavender-50 rounded-full">
                  {currentStep?.instruction || 'Inhale 4s • Hold 7s • Exhale 8s'}
                </p>
              </div>
            )}

            {exercise.interactiveType === 'grounding-54321' && (
              <div className="py-4 w-full max-w-lg space-y-4 text-left">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-800">
                    Step {currentStepIndex + 1} of {steps.length}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {currentStep?.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">
                    {currentStep?.instruction}
                  </p>
                </div>
                <div className="text-xs text-center text-gray-500">
                  Take your time to look or listen. There is no rush.
                </div>
              </div>
            )}

            {exercise.interactiveType === 'journaling' && (
              <div className="w-full max-w-lg space-y-3 text-left">
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                  <h3 className="font-semibold text-sky-950 text-sm">
                    {currentStep?.title || 'Reflection Prompt'}
                  </h3>
                  <p className="text-xs text-sky-900 mt-1">
                    {currentStep?.instruction || 'Jot down whatever comes to mind freely.'}
                  </p>
                </div>
                <textarea
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  placeholder="Your quiet reflection notes here (stored only in this session)..."
                  rows={4}
                  className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none resize-none bg-gray-50/50"
                />
              </div>
            )}

            {exercise.interactiveType === 'guided-steps' && (
              <div className="w-full max-w-lg space-y-4 text-left">
                <div className="p-5 rounded-2xl bg-sage-50/80 border border-sage-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-sage-700">
                      Movement {currentStepIndex + 1} of {steps.length}
                    </span>
                    {timerSeconds > 0 && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sage-200 text-sage-800">
                        {timerSeconds}s remaining
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">
                    {currentStep?.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                    {currentStep?.instruction}
                  </p>
                </div>
              </div>
            )}

            {/* Stepper Controls */}
            {steps.length > 1 && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStepIndex === 0}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  Previous
                </button>
                <div className="text-xs text-gray-500">
                  {currentStepIndex + 1} / {steps.length}
                </div>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-1.5 rounded-xl bg-sage-700 text-white text-xs font-medium hover:bg-sage-800 shadow-xs"
                >
                  {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next Step'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completion Screen with Helpful Rating */
          <div className="py-8 flex-1 flex flex-col items-center text-center justify-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Exercise Completed
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-sm">
                Thank you for taking this gentle pause for yourself. Notice how your body feels right now.
              </p>
            </div>

            {/* Rating Section to train future recommendations */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl w-full max-w-sm space-y-3">
              <p className="text-xs font-medium text-gray-700">
                Did this exercise feel helpful today?
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleRating(true)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition ${
                    ratedFeedback === true
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes, helpful</span>
                </button>
                <button
                  onClick={() => handleRating(false)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium border transition ${
                    ratedFeedback === false
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>Not quite</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-400">
                Your feedback helps tailor future suggestions in MindCare.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl text-sm font-medium transition shadow-sm"
            >
              Return to MindCare
            </button>
          </div>
        )}

        {/* Footer info & stop button */}
        {!isCompleted && (
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Low-risk restorative exercise. Stop at any time.</span>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 font-medium underline"
            >
              Pause & Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

