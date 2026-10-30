import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MoodEntry, SleepEntry, Exercise } from '../../types';
import { ApiService, ChatContextPayload } from '../../services/api';
import { EXERCISE_LIBRARY } from '../../data/exercises';
import { 
  MessageSquareHeart, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Play, 
  RefreshCw, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface PrakashChatViewProps {
  recentMood: MoodEntry | null;
  recentSleep: SleepEntry | null;
  onStartExercise: (exercise: Exercise) => void;
  onOpenEmergency: () => void;
  allowLogsContext: boolean;
  onToggleAllowLogsContext: (allow: boolean) => void;
  consentAIChat: boolean;
}

export const PrakashChatView: React.FC<PrakashChatViewProps> = ({
  recentMood,
  recentSleep,
  onStartExercise,
  onOpenEmergency,
  allowLogsContext,
  onToggleAllowLogsContext,
  consentAIChat,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hello, I am Prakash. I'm glad you're taking this moment for yourself today. There is nothing you need to fix or perform here—how is your day feeling right now?",
      timestamp: new Date().toISOString(),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    if (!consentAIChat) {
      setErrorNotice('AI Chat consent is currently disabled in your Settings.');
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputValue('');
    setIsLoading(true);
    setErrorNotice(null);

    // Prepare context payload only if user enabled context sharing
    const contextPayload: ChatContextPayload | null = allowLogsContext ? {
      mood: recentMood?.mood,
      intensity: recentMood?.intensity,
      sleepDuration: recentSleep?.durationHours,
      sleepQuality: recentSleep?.quality,
      recentTags: recentMood?.tags,
    } : null;

    try {
      const historyPayload = messages.map(m => ({
        role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: m.content
      }));

      const res = await ApiService.sendPrakashMessage(
        textToSend,
        historyPayload,
        consentAIChat,
        contextPayload
      );

      // Check if Prakash suggested an exercise from the library
      let foundExercise: Exercise | undefined;
      const lowerReply = res.reply.toLowerCase();
      if (lowerReply.includes('box breathing')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'box-breathing');
      } else if (lowerReply.includes('5-4-3-2-1') || lowerReply.includes('grounding')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'grounding-54321');
      } else if (lowerReply.includes('4-7-8')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'breath-478');
      } else if (lowerReply.includes('unburdening') || lowerReply.includes('evening thought')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'evening-unburdening');
      } else if (lowerReply.includes('walk')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'mindful-walk');
      } else if (lowerReply.includes('shoulder') || lowerReply.includes('neck')) {
        foundExercise = EXERCISE_LIBRARY.find(e => e.id === 'gentle-neck-shoulders');
      }

      const botMsg: ChatMessage = {
        id: 'prakash_' + Date.now(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
        suggestedAction: foundExercise ? {
          label: `Try ${foundExercise.title}`,
          exerciseId: foundExercise.id
        } : undefined,
        contextDisclosed: allowLogsContext && recentMood ? {
          moodIncluded: recentMood.mood,
          sleepIncluded: recentSleep ? `${recentSleep.durationHours}h` : undefined
        } : undefined
      };

      setMessages(prev => [...prev, botMsg]);

      if (res.isCrisisSafetyAlert) {
        onOpenEmergency();
      }

      if (res.notice) {
        setErrorNotice(res.notice);
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'Unable to connect to Prakash.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleStarters = [
    "I'm feeling a bit restless and finding it hard to settle down.",
    "Today had a lot of demands, and I just need a gentle pause.",
    "Could we try a quick grounding or breathing exercise together?",
    "My mind is caught up in thoughts about tomorrow."
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 flex flex-col h-[calc(100vh-80px)] animate-fade-in">
      {/* Companion Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-600 text-white flex items-center justify-center text-xl shadow-xs">
            🌿
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900 text-base">Prakash</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 text-sage-800 font-semibold uppercase tracking-wider">
                Supportive Companion
              </span>
            </div>
            <p className="text-xs text-gray-500">
              AI reflection guide • Warm, nonjudgmental, low-pressure
            </p>
          </div>
        </div>

        {/* Log Context Sharing Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onToggleAllowLogsContext(!allowLogsContext)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
              allowLogsContext
                ? 'bg-sage-50 border-sage-200 text-sage-800'
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
            title="Toggle whether Prakash can reference your recent mood/sleep logs"
          >
            {allowLogsContext ? (
              <>
                <Eye className="w-3.5 h-3.5 text-sage-600" />
                <span>Logs context: Active</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                <span>Logs context: Hidden</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety & Non-medical notice banner */}
      <div className="px-4 py-2 bg-sage-50/80 border border-sage-200/70 rounded-xl text-[11px] text-sage-900 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sage-700 flex-shrink-0" />
          <span>
            Prakash is an AI companion for reflection, not a clinician. Not monitored by emergency responders.
          </span>
        </div>
        <button
          onClick={onOpenEmergency}
          className="text-rose-700 hover:text-rose-900 font-semibold ml-2 underline whitespace-nowrap"
        >
          Crisis Resources
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-6 overflow-y-auto space-y-4 shadow-2xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
            >
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-sage-700 text-white rounded-tr-xs shadow-xs'
                    : 'bg-gray-50 text-gray-800 border border-gray-200/70 rounded-tl-xs'
                }`}
              >
                {msg.content}
              </div>

              {/* Context Disclosure Badge */}
              {!isUser && msg.contextDisclosed && (
                <div className="text-[10px] text-sage-700 bg-sage-50 px-2 py-0.5 rounded-full border border-sage-100 flex items-center gap-1">
                  <span>Referenced recent log: {msg.contextDisclosed.moodIncluded}</span>
                </div>
              )}

              {/* Suggested Action Pill */}
              {!isUser && msg.suggestedAction && (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      const ex = EXERCISE_LIBRARY.find(e => e.id === msg.suggestedAction?.exerciseId);
                      if (ex) onStartExercise(ex);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-900 text-xs font-semibold border border-sage-200 transition"
                  >
                    <Play className="w-3 h-3 fill-current text-sage-700" />
                    <span>{msg.suggestedAction.label}</span>
                  </button>
                </div>
              )}

              <span className="text-[10px] text-gray-400 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-gray-500 bg-gray-50 rounded-2xl w-fit">
            <span className="w-2 h-2 rounded-full bg-sage-500 animate-ping" />
            <span>Prakash is reflecting...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {sampleStarters.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(starter)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-sage-300 hover:bg-sage-50/50 transition text-left"
            >
              &ldquo;{starter}&rdquo;
            </button>
          ))}
        </div>
      )}

      {errorNotice && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Message Input Box */}
      <div className="bg-white rounded-2xl border border-gray-200 p-2 shadow-sm flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Share a thought, feeling, or question with Prakash..."
          className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputValue.trim() || isLoading}
          className="p-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 text-white disabled:opacity-40 transition shadow-xs"
          aria-label="Send message to Prakash"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

