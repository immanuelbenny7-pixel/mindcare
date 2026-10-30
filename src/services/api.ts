export interface ChatContextPayload {
  mood?: string;
  intensity?: number;
  sleepDuration?: number;
  sleepQuality?: string;
  recentTags?: string[];
}

export interface PrakashChatResponse {
  reply: string;
  isCrisisSafetyAlert?: boolean;
  source: 'gemini' | 'local-fallback' | 'safety-rule' | 'error-fallback';
  modelUsed?: string;
  notice?: string;
}

export interface PhotoExpressionResponse {
  success: boolean;
  expressionObserved: string;
  tentativeSuggestion: string;
  confidenceNote: string;
  disclaimer: string;
  error?: string;
}

export const ApiService = {
  async getHealth(): Promise<{ status: string; geminiConfigured: boolean; model: string }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'offline', geminiConfigured: false, model: 'unavailable' };
    }
  },

  async sendPrakashMessage(
    message: string,
    history: { role: 'user' | 'assistant'; content: string }[],
    userConsent: boolean,
    contextData?: ChatContextPayload | null
  ): Promise<PrakashChatResponse> {
    const res = await fetch('/api/prakash/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        userConsent,
        contextData,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${res.status}`);
    }

    return await res.json();
  },

  async analyzePhotoExpression(
    imageBase64: string,
    mimeType: string,
    userConsent: boolean
  ): Promise<PhotoExpressionResponse> {
    const res = await fetch('/api/gemini/photo-expression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64,
        mimeType,
        userConsent,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to analyze facial expression.');
    }

    return await res.json();
  },
};

