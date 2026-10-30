import React, { useState } from 'react';
import { UserPreferences } from '../../types';
import { 
  Settings, 
  ShieldCheck, 
  Trash2, 
  Download, 
  HelpCircle, 
  Sparkles, 
  Eye, 
  Server, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsViewProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onExportData: () => void;
  onClearAllData: () => void;
  onReopenOnboarding: () => void;
  apiStatus: { configured: boolean; model: string };
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  preferences,
  onUpdatePreferences,
  onExportData,
  onClearAllData,
  onReopenOnboarding,
  apiStatus,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleToggle = (key: keyof UserPreferences, value: boolean) => {
    onUpdatePreferences({ [key]: value });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Settings className="w-3.5 h-3.5" /> Settings & Privacy Controls
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Privacy, Consent & Data Ownership
        </h1>
        <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
          You are in total control of what is saved and what gets shared with AI services. MindCare operates with strict privacy-by-default standards.
        </p>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings updated successfully.</span>
        </div>
      )}

      {/* 1. AI Consent Toggles */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sage-600" />
          <h2 className="text-lg font-bold text-gray-900">AI Consent Permissions</h2>
        </div>

        <div className="space-y-4">
          {/* Chat AI Consent */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-900 block">
                Allow AI Reflection Conversations (Prakash)
              </span>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Enables chatting with Prakash powered by Google Gemini via our secure backend. Calls are transmitted over TLS and never permanently logged.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preferences.consentForAIChat}
                onChange={(e) => handleToggle('consentForAIChat', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600" />
            </label>
          </div>

          {/* Context Sharing for Chat */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-900 block">
                Include Recent Mood & Sleep Context in Prakash Chat
              </span>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Allows Prakash to reference your latest self-reported mood and sleep duration to provide more relevant reflection exercises.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preferences.allowPrakashToReadLogs}
                onChange={(e) => handleToggle('allowPrakashToReadLogs', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600" />
            </label>
          </div>

          {/* Photo Expression Consent */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100">
            <div className="space-y-1">
              <span className="font-semibold text-sm text-gray-900 block">
                Enable Optional Photo Facial Expression Guessing
              </span>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Permits sending an optional photo during mood check-in for tentative expression description. Images are processed in-memory and immediately discarded.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preferences.consentForPhotoAnalysis}
                onChange={(e) => handleToggle('consentForPhotoAnalysis', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600" />
            </label>
          </div>
        </div>
      </div>

      {/* 2. System Status & Security Architecture */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-gray-900">Backend & API Configuration</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Gemini Service Status
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <span className={`w-2.5 h-2.5 rounded-full ${apiStatus.configured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-sm font-bold text-gray-900">
                {apiStatus.configured ? 'Configured & Active' : 'Fallback / Local Mode'}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              API key securely loaded from server environment variable (never exposed in frontend code).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Active Gemini Model
            </span>
            <div className="text-sm font-bold text-gray-900 pt-0.5 font-mono">
              {apiStatus.model}
            </div>
            <p className="text-[11px] text-gray-500">
              Configured centrally in server/gemini.js for seamless model updates.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Data Export & Deletion */}
      <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sage-600" />
          <h2 className="text-lg font-bold text-gray-900">Data Storage & Rights</h2>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          All your mood check-ins, sleep logs, and favorite exercises are stored locally on your device in your web browser&rsquo;s private storage. You can export a full copy of your data anytime, or completely erase all records.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={onExportData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition shadow-2xs"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Download All Data (JSON)</span>
          </button>

          <button
            onClick={onReopenOnboarding}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <span>Review Onboarding & Boundaries</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Permanently Delete All Data</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100 space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 id="confirm-delete-title" className="text-lg font-bold text-gray-900">
                Permanently Delete All MindCare Data?
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                This will delete your mood logs, sleep records, exercise ratings, and preferences. Because data is stored only on this device, this cannot be recovered.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowDeleteModal(false);
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

