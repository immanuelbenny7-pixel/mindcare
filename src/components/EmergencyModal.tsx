import React from 'react';
import { PhoneCall, ShieldAlert, Heart, X, ExternalLink } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-dialog-title"
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="emergency-dialog-title" className="text-xl font-semibold text-gray-900">
                Immediate Crisis & Support Resources
              </h2>
              <p className="text-sm text-gray-500">
                You do not have to navigate difficult moments by yourself.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close crisis resources dialog"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900 leading-relaxed">
          <strong>Important Boundary:</strong> MindCare and Prakash are automated wellness software, not human clinicians or emergency responders. If you or someone you know is in immediate danger or considering self-harm, please reach out to one of the trusted services below right now.
        </div>

        <div className="mt-6 space-y-4">
          {/* US / Canada */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-rose-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  United States & Canada
                </span>
                <h3 className="font-medium text-gray-900 mt-1">988 Suicide & Crisis Lifeline</h3>
                <p className="text-sm text-gray-600 mt-0.5">Free, confidential 24/7 call and text support.</p>
              </div>
              <a
                href="tel:988"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition"
              >
                <PhoneCall className="w-4 h-4" /> Call 988
              </a>
            </div>
          </div>

          {/* India */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-emerald-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  India
                </span>
                <h3 className="font-medium text-gray-900 mt-1">Tele-MANAS National Helpline</h3>
                <p className="text-sm text-gray-600 mt-0.5">Government 24/7 mental health service in multiple languages.</p>
              </div>
              <a
                href="tel:14416"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 transition"
              >
                <PhoneCall className="w-4 h-4" /> 14416
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">Alternate toll-free: 1800-891-4416</p>
          </div>

          {/* United Kingdom */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  United Kingdom
                </span>
                <h3 className="font-medium text-gray-900 mt-1">NHS Mental Health Services</h3>
                <p className="text-sm text-gray-600 mt-0.5">Call 111 for mental health support, or 999 for emergencies.</p>
              </div>
              <a
                href="tel:111"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <PhoneCall className="w-4 h-4" /> Call 111
              </a>
            </div>
          </div>

          {/* International */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                  International / Worldwide
                </span>
                <h3 className="font-medium text-gray-900 mt-1">Find a Helpline Directory</h3>
                <p className="text-sm text-gray-600 mt-0.5">Free, confidential support from local helplines across 130+ countries.</p>
              </div>
              <a
                href="https://findahelpline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
              >
                <ExternalLink className="w-4 h-4" /> Visit
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>Support is confidential and free.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

