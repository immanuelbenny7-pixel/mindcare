import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Sparkles, ShieldCheck, Heart, Camera, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  preferences: UserPreferences;
  onComplete: (updatedPrefs: Partial<UserPreferences>) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, preferences, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [consentAIChat, setConsentAIChat] = useState<boolean>(preferences.consentForAIChat);
  const [consentPhoto, setConsentPhoto] = useState<boolean>(preferences.consentForPhotoAnalysis);
  const [allowContext, setAllowContext] = useState<boolean>(preferences.allowPrakashToReadLogs);

  if (!isOpen) return null;

  const handleFinish = () => {
    onComplete({
      hasCompletedOnboarding: true,
      consentForAIChat: consentAIChat,
      consentForPhotoAnalysis: consentPhoto,
      allowPrakashToReadLogs: allowContext,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-sage-100 max-h-[92vh] overflow-y-auto"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 font-semibold flex items-center justify-center text-sm">
              {step}/3
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
              {step === 1 && 'Welcome & Purpose'}
              {step === 2 && 'Privacy & Boundaries'}
              {step === 3 && 'Your Choices'}
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-sage-600' : 'bg-gray-200'}`} />
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-sage-600' : 'bg-gray-200'}`} />
            <div className={`w-6 h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-sage-600' : 'bg-gray-200'}`} />
          </div>
        </div>

        {/* Step 1: Welcome & Core Purpose */}
        {step === 1 && (
          <div className="py-6 space-y-5">
            <div className="w-14 h-14 bg-sage-50 text-sage-700 rounded-2xl flex items-center justify-center shadow-inner">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <h2 id="onboarding-title" className="text-2xl font-bold text-gray-900 tracking-tight">
                Welcome to MindCare
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                MindCare is a gentle personal space to observe your daily mood, sleep, and energy levels, and to explore restorative self-care practices.
              </p>
            </div>

            <div className="p-4 bg-sage-50/70 border border-sage-200 rounded-2xl text-sm text-sage-900 space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-sage-800">
                <CheckCircle2 className="w-4 h-4 text-sage-600" /> What MindCare offers:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sage-800">
                <li>Simple, nonjudgmental daily mood and sleep reflections.</li>
                <li>Evidence-informed breathing, grounding, and wind-down exercises.</li>
                <li>Prakash: an empathetic AI companion to talk through daily thoughts.</li>
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-sm text-amber-900 space-y-2">
              <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> What MindCare is NOT:
              </div>
              <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                MindCare is a self-reflection tool, <strong>not a medical device or therapy service</strong>. It does not diagnose mental health conditions, prescribe treatments, or replace qualified medical professionals.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Boundaries & Face Photo Realism */}
        {step === 2 && (
          <div className="py-6 space-y-5">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Transparent Boundaries
              </h2>
              <p className="text-gray-600 mt-2 leading-relaxed">
                We believe in total honesty about what technology can and cannot do.
              </p>
            </div>

            <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/60 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700 mt-0.5">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Face Photos & Mood</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    A photo cannot tell how a person genuinely feels. Smiling faces can feel exhausted, and serious faces can feel peaceful. Photo analysis is <strong>strictly optional</strong>, presented only as a tentative guess of outward expression, and you can always adjust or disregard it.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/60 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-gray-200 text-gray-700 mt-0.5">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">Your Data Stays With You</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Your reflection entries are stored locally on your device in your browser. We never save photos to a database or server disk. You can export or permanently delete your records at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Consent & Permissions */}
        {step === 3 && (
          <div className="py-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Your Privacy Choices
              </h2>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                Select which AI features you feel comfortable using. You can update these anytime in Settings.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:border-sage-300 transition cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={consentAIChat}
                  onChange={(e) => setConsentAIChat(e.target.checked)}
                  className="mt-1 w-4 h-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                <div>
                  <div className="font-medium text-sm text-gray-900">Allow AI reflection chat (Prakash)</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Allows your conversational messages to be processed by Gemini AI over secure, encrypted requests.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:border-sage-300 transition cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={allowContext}
                  onChange={(e) => setAllowContext(e.target.checked)}
                  className="mt-1 w-4 h-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                <div>
                  <div className="font-medium text-sm text-gray-900">Allow Prakash to reference recent mood/sleep logs</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Shares only your most recent check-in details with Prakash so suggestions are tailored. Prakash will always visibly disclose when logs are being referenced.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 hover:border-sage-300 transition cursor-pointer bg-white">
                <input
                  type="checkbox"
                  checked={consentPhoto}
                  onChange={(e) => setConsentPhoto(e.target.checked)}
                  className="mt-1 w-4 h-4 text-sage-600 rounded border-gray-300 focus:ring-sage-500"
                />
                <div>
                  <div className="font-medium text-sm text-gray-900">Optional photo facial expression guessing</div>
                  <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Allows you to optionally upload a photo during mood check-in for a tentative expression estimate. Images are processed in-memory and immediately discarded.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Modal footer actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl text-sm font-medium transition shadow-sm"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-sage-700 hover:bg-sage-800 text-white rounded-xl text-sm font-medium transition shadow-sm"
            >
              Start MindCare <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

