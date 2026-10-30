import React, { useState, useRef } from 'react';
import { MOOD_DEFINITIONS, COMMON_TAGS } from '../../data/moods';
import { MoodType, MoodEntry } from '../../types';
import { ApiService, PhotoExpressionResponse } from '../../services/api';
import { 
  Smile, 
  Camera, 
  Check, 
  Sparkles, 
  Info, 
  Trash2, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  X,
  CheckCircle2
} from 'lucide-react';

interface MoodCheckInViewProps {
  onSaveMood: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  onNavigateInsights: () => void;
  initialConsentPhoto: boolean;
}

export const MoodCheckInView: React.FC<MoodCheckInViewProps> = ({
  onSaveMood,
  onNavigateInsights,
  initialConsentPhoto
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>('content');
  const [intensity, setIntensity] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Quiet Time']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [note, setNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Photo analysis state
  const [photoConsent, setPhotoConsent] = useState(initialConsentPhoto);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [expressionResult, setExpressionResult] = useState<PhotoExpressionResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
      setCustomTagInput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPEG or PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
      setPhotoError(null);
      setExpressionResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzePhoto = async () => {
    if (!photoDataUrl) return;
    if (!photoConsent) {
      setPhotoError('Please review and check the consent box before analyzing.');
      return;
    }

    setAnalyzingPhoto(true);
    setPhotoError(null);

    try {
      const mimeType = photoDataUrl.split(';')[0].replace('data:', '') || 'image/jpeg';
      const result = await ApiService.analyzePhotoExpression(photoDataUrl, mimeType, photoConsent);
      setExpressionResult(result);

      // Offer tentative suggestion if recognized
      if (result.tentativeSuggestion && MOOD_DEFINITIONS[result.tentativeSuggestion as MoodType]) {
        setSelectedMood(result.tentativeSuggestion as MoodType);
      }
    } catch (err: any) {
      setPhotoError(err.message || 'Unable to connect to expression analysis service.');
    } finally {
      setAnalyzingPhoto(false);
    }
  };

  const handleApplyExpressionSuggestion = () => {
    if (expressionResult?.tentativeSuggestion && MOOD_DEFINITIONS[expressionResult.tentativeSuggestion as MoodType]) {
      setSelectedMood(expressionResult.tentativeSuggestion as MoodType);
    }
    setShowPhotoModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entry: Omit<MoodEntry, 'id' | 'timestamp'> = {
      mood: selectedMood,
      intensity,
      tags: selectedTags,
      note: note.trim() || undefined,
      aiExpressionEstimate: expressionResult ? {
        expressionObserved: expressionResult.expressionObserved,
        tentativeSuggestion: (expressionResult.tentativeSuggestion as MoodType) || selectedMood,
        confidenceNote: expressionResult.confidenceNote,
        userConfirmed: true,
      } : undefined
    };

    onSaveMood(entry);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Smile className="w-3.5 h-3.5" /> Daily Check-In
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            What are you noticing right now?
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            There are no &ldquo;good&rdquo; or &ldquo;bad&rdquo; moods. Every feeling is a valid signal of your human experience.
          </p>
        </div>

        {/* Optional Photo Analysis Launch Button */}
        <button
          type="button"
          onClick={() => setShowPhotoModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:border-sage-300 hover:bg-sage-50/50 text-xs font-medium transition shadow-2xs self-start"
        >
          <Camera className="w-4 h-4 text-sage-600" />
          <span>Optional: Photo expression guess</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">Your check-in has been saved securely to your device.</span>
          </div>
          <button
            onClick={onNavigateInsights}
            className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
          >
            View in Insights →
          </button>
        </div>
      )}

      {/* Main Check-in Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        {/* Step 1: Mood Choice */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-900">
            1. Select a mood descriptor that comes closest:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {Object.values(MOOD_DEFINITIONS).map((def) => {
              const isSelected = selectedMood === def.type;
              return (
                <button
                  type="button"
                  key={def.type}
                  onClick={() => setSelectedMood(def.type)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                    isSelected
                      ? `${def.bgColor} border-current ring-2 ring-sage-400 ring-offset-1`
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/40 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{def.emoji}</span>
                  <div>
                    <span className={`block font-semibold text-xs sm:text-sm ${isSelected ? def.color : 'text-gray-900'}`}>
                      {def.label}
                    </span>
                    <span className="block text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {def.description}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-sage-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 italic mt-1">
            Active selection: &ldquo;{MOOD_DEFINITIONS[selectedMood]?.description}&rdquo;
          </p>
        </div>

        {/* Step 2: Intensity Slider */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <label htmlFor="intensity-range" className="text-sm font-bold text-gray-900">
              2. Intensity: How strongly are you feeling this?
            </label>
            <span className="text-sm font-bold text-sage-800 px-2.5 py-0.5 bg-sage-100 rounded-lg">
              {intensity} / 10
            </span>
          </div>

          <input
            id="intensity-range"
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-600"
          />

          <div className="flex justify-between text-[11px] text-gray-500">
            <span>Subtle whisper (1)</span>
            <span>Moderate presence (5)</span>
            <span>Very pronounced (10)</span>
          </div>
        </div>

        {/* Step 3: Context Tags */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label className="block text-sm font-bold text-gray-900">
            3. What is touching your day? (Optional tags)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    active
                      ? 'bg-sage-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {/* Custom tag input */}
          <div className="flex gap-2 max-w-xs mt-2">
            <input
              type="text"
              placeholder="Add your own tag..."
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-gray-200 flex-1 focus:ring-2 focus:ring-sage-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              disabled={!customTagInput.trim()}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-xl transition disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 4: Reflection Notes */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <label htmlFor="reflection-notes" className="block text-sm font-bold text-gray-900">
            4. Personal Reflection Notes (Optional)
          </label>
          <textarea
            id="reflection-notes"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What is happening in your body or mind right now? Anything you want to remember..."
            className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:ring-2 focus:ring-sage-400 focus:outline-none resize-none bg-gray-50/50"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Data is stored privately in your browser storage.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl text-sm font-semibold transition shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Check-In
          </button>
        </div>
      </form>

      {/* Photo Expression Modal with Strict Consent & Uncertainty Notice */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="photo-modal-title"
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-sage-600" />
                <h3 id="photo-modal-title" className="font-bold text-gray-900 text-base">
                  Optional Facial Expression Observation
                </h3>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Essential Uncertainty & Privacy Notice */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5 leading-relaxed">
              <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                <Info className="w-4 h-4" /> Important Clarification:
              </div>
              <p>
                Facial expressions cannot reliably reveal true mood or psychological state. This feature offers only an uncertain, surface-level guess by Gemini AI. It does <strong>not diagnose</strong>, determine character, or replace your own self-knowledge.
              </p>
              <p className="text-[11px] text-amber-700">
                Privacy: Photos are processed in-memory and discarded immediately. They are never saved to disk or server databases.
              </p>
            </div>

            {/* Consent Checkbox */}
            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={photoConsent}
                onChange={(e) => setPhotoConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
              />
              <span className="text-xs text-gray-700 leading-snug">
                I understand this is an uncertain expression guess and consent to sending this single image to Gemini for analysis.
              </span>
            </label>

            {/* Image Upload Input */}
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />

              {!photoDataUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-300 hover:border-sage-400 rounded-2xl flex flex-col items-center justify-center gap-2 bg-gray-50/50 hover:bg-sage-50/30 transition text-gray-600"
                >
                  <Camera className="w-8 h-8 text-sage-500" />
                  <span className="text-xs font-medium">Click to select or capture a photo</span>
                  <span className="text-[11px] text-gray-400">JPG or PNG supported</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-40 h-40 mx-auto rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <img
                      src={photoDataUrl}
                      alt="Selected upload"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoDataUrl(null);
                        setExpressionResult(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {!expressionResult && (
                    <button
                      type="button"
                      disabled={analyzingPhoto || !photoConsent}
                      onClick={handleAnalyzePhoto}
                      className="w-full py-2.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl text-xs font-semibold transition disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {analyzingPhoto ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Observing visible expression...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Analyze Visible Expression</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {photoError && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{photoError}</span>
                </p>
              )}
            </div>

            {/* Expression Result Display */}
            {expressionResult && (
              <div className="p-4 bg-sage-50/80 border border-sage-200 rounded-2xl space-y-3 animate-fade-in text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-sage-800">
                    Tentative Observation
                  </span>
                  <span className="text-xs text-sage-600 bg-white px-2 py-0.5 rounded-full border border-sage-200">
                    AI Guess: {expressionResult.tentativeSuggestion}
                  </span>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong>Visible Cues:</strong> {expressionResult.expressionObserved}
                </p>

                <p className="text-[11px] text-gray-500 italic">
                  {expressionResult.confidenceNote}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyExpressionSuggestion}
                    className="flex-1 py-2 bg-sage-700 text-white text-xs font-medium rounded-xl hover:bg-sage-800 transition"
                  >
                    Accept as Starting Mood
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPhotoModal(false)}
                    className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-xl hover:bg-gray-50"
                  >
                    Keep My Own Choice
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Close without using photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

