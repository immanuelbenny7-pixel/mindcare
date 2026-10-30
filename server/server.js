import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getGeminiClient,
  getModelName,
  isGeminiConfigured,
  PRAKASH_SYSTEM_PROMPT,
  PHOTO_EXPRESSION_PROMPT
} from './gemini.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Body parsers: allow up to 10MB for base64 image data sent strictly for expression estimation
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Timeout helper to ensure server responses never stall
 */
const withTimeout = (promise, ms = 45000, errorMsg = 'Operation timed out') => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(errorMsg)), ms))
  ]);
};

// Health / status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: isGeminiConfigured(),
    model: getModelName(),
    timestamp: new Date().toISOString()
  });
});

/**
 * Keyword-based crisis pattern check for safety
 */
function checkForCrisisKeywords(text = '') {
  const lower = text.toLowerCase();
  const crisisPhrases = [
    'kill myself',
    'suicide',
    'end my life',
    'want to die',
    'harm myself',
    'cut myself',
    'hurt myself',
    'better off dead',
    'no reason to live',
    'ending it all'
  ];
  return crisisPhrases.some(phrase => lower.includes(phrase));
}

const CRISIS_RESPONSE = `I hear how heavy and painful things are feeling right now, and I want you to know you do not have to carry this completely alone. Because I am an AI companion and cannot provide emergency help or medical care, please reach out directly to someone who can support you safely:

- **US & Canada:** Call or text **988** (available 24/7, free and confidential)
- **India:** Call **14416** or **1800-891-4416** (Tele-MANAS, toll-free 24/7)
- **UK:** Call **111** (NHS mental health) or **999** for emergency assistance
- **International:** Visit **[https://findahelpline.com](https://findahelpline.com)** or **[https://www.befrienders.org](https://www.befrienders.org)**

Please consider reaching out to one of these resources or connecting with a trusted friend, family member, or doctor right now. You matter, and support is available.`;

/**
 * Fallback response if Gemini API key is missing or quota is exceeded
 */
function getLocalFallbackPrakashResponse(userMessage, contextData) {
  const lower = userMessage.toLowerCase();

  if (checkForCrisisKeywords(userMessage)) {
    return CRISIS_RESPONSE;
  }

  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('busy')) {
    return "It sounds like there is a lot on your shoulders right now. When things feel heavy, even a two-minute pause can help create a little breathing room.\n\nWould you like to try a simple 4-4-4-4 Box Breathing exercise with me, or would you prefer to just talk through what is feeling most demanding today?";
  }

  if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia') || lower.includes('exhausted')) {
    return "Rest is so essential, yet so easy to lose when thoughts are active. When you wake up tired, your mind and body are simply asking for gentleness today.\n\nDid something specific keep you awake, or was it more of a general restlessness?";
  }

  if (lower.includes('anxious') || lower.includes('nervous') || lower.includes('panic') || lower.includes('scared')) {
    return "Thank you for sharing that with me. Anxiety can feel very intense in the body—often like a tight chest or racing thoughts.\n\nCan you feel your feet resting on the ground right now? If you'd like, we can do a quick 5-4-3-2-1 grounding exercise together to help anchor your attention.";
  }

  if (contextData?.mood) {
    return `I noticed your recent check-in mentioned feeling ${contextData.mood}. Thank you for taking this moment to pause and check in with yourself.\n\nWhat is one small thing that might bring you a bit of ease or comfort in this moment?`;
  }

  return "I'm here with you. Take your time—what thoughts or feelings are most present for you as you pause right now?";
}

/**
 * POST /api/prakash/chat
 * Handles multi-turn chat with Prakash.
 */
app.post('/api/prakash/chat', async (req, res) => {
  try {
    const { message, history = [], userConsent = true, contextData = null } = req.body;

    if (!userConsent) {
      return res.status(403).json({
        error: 'Consent is required to send messages to the AI assistant.',
        needsConsent: true
      });
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const trimmedMessage = message.trim().slice(0, 2000); // Guard max length

    // Immediate safety check for crisis triggers
    if (checkForCrisisKeywords(trimmedMessage)) {
      return res.json({
        reply: CRISIS_RESPONSE,
        isCrisisSafetyAlert: true,
        source: 'safety-rule'
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful fallback when API key is not configured
      const fallbackReply = getLocalFallbackPrakashResponse(trimmedMessage, contextData);
      return res.json({
        reply: fallbackReply,
        source: 'local-fallback',
        notice: 'MindCare running in offline/local reflection mode. To enable full AI conversations, set a valid GEMINI_API_KEY in your environment.'
      });
    }

    // Build context summary if user consented to sharing recent logs
    let contextNote = '';
    if (contextData && Object.keys(contextData).length > 0) {
      const parts = [];
      if (contextData.mood) parts.push(`Current self-reported mood: ${contextData.mood} (Intensity: ${contextData.intensity || 'N/A'}/10)`);
      if (contextData.sleepDuration) parts.push(`Recent sleep: ${contextData.sleepDuration} hrs (${contextData.sleepQuality || 'N/A'})`);
      if (contextData.recentTags && contextData.recentTags.length > 0) parts.push(`Recent tags: ${contextData.recentTags.join(', ')}`);
      
      if (parts.length > 0) {
        contextNote = `\n[User's recent self-reported reflection logs for context, provided with user consent: ${parts.join('; ')}]\n`;
      }
    }

    const systemInstruction = `${PRAKASH_SYSTEM_PROMPT}\n${contextNote}`;

    // Format conversation history for Gemini: must begin with a user turn
    const contents = [];
    const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const item of recentHistory) {
      if (contents.length === 0 && item.role !== 'user') {
        // Skip initial greeting model turn so the conversation starts with a user turn
        continue;
      }
      if (item.role === 'user' || item.role === 'assistant') {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(item.content).slice(0, 1000) }]
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }]
    });

    let response;
    try {
      const geminiCall = ai.models.generateContent({
        model: getModelName(),
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
          maxOutputTokens: 600,
        }
      });
      response = await withTimeout(geminiCall, 45000, 'Gemini request timed out');
    } catch (primaryErr) {
      // If primary model hit quota (429) or error, try backup fast model
      if (getModelName() !== 'gemini-3.1-flash-lite') {
        console.warn(`Primary model ${getModelName()} failed (${primaryErr.message}), trying gemini-3.1-flash-lite...`);
        const fallbackCall = ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 600,
          }
        });
        response = await withTimeout(fallbackCall, 45000, 'Fallback model timed out');
      } else {
        throw primaryErr;
      }
    }
    const reply = response.text || "I'm listening. How does that sit with you right now?";

    return res.json({
      reply,
      source: 'gemini',
      modelUsed: getModelName()
    });
  } catch (error) {
    console.warn('Handling Prakash chat fallback due to:', error?.message || error);

    // Provide friendly fallback so user experience is never broken
    const fallbackReply = getLocalFallbackPrakashResponse(req.body?.message || '', req.body?.contextData);
    return res.json({
      reply: fallbackReply,
      source: 'error-fallback',
      notice: 'Prakash provided a gentle reflection response (local fallback).'
    });
  }
});

/**
 * POST /api/gemini/photo-expression
 * Analyzes visible facial expression with clear uncertainty framing.
 * Image is processed strictly in memory and immediately discarded.
 */
app.post('/api/gemini/photo-expression', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userConsent = false } = req.body;

    if (!userConsent) {
      return res.status(403).json({
        error: 'Explicit user consent is required before analyzing a photo.'
      });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image data is required.' });
    }

    // Strip data URL prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        expressionObserved: 'Neutral/relaxed facial expression cues observed.',
        tentativeSuggestion: 'content',
        confidenceNote: 'Gemini offline: please adjust this tentative estimate to match your true feeling.',
        disclaimer: 'Facial expressions do not reveal true feelings. You have full control to change or discard this suggestion.'
      });
    }

    const geminiCall = ai.models.generateContent({
      model: getModelName(),
      contents: [
        {
          role: 'user',
          parts: [
            { text: PHOTO_EXPRESSION_PROMPT },
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanBase64
              }
            }
          ]
        }
      ],
      config: {
        temperature: 0.2,
        maxOutputTokens: 300,
        responseMimeType: 'application/json'
      }
    });

    const response = await withTimeout(geminiCall, 45000, 'Photo analysis timed out');
    const responseText = response.text || '{}';
    let parsedResult = {};
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch {
      // Fallback extraction
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleanJson);
    }

    return res.json({
      success: true,
      expressionObserved: parsedResult.expressionObserved || 'Visible facial features were analyzed.',
      tentativeSuggestion: parsedResult.tentativeSuggestion || 'content',
      confidenceNote: parsedResult.confidenceNote || 'This is only an estimate of facial expression, not an indicator of true inner feelings. Please feel free to change it.',
      disclaimer: 'Facial expressions do not reliably indicate true feelings or psychological state. You have full control to change or discard this suggestion.'
    });
  } catch (error) {
    console.warn('Handling photo analysis fallback due to:', error?.message || error);
    // Graceful fallback response
    return res.json({
      success: true,
      expressionObserved: 'Gentle, calm visible facial features.',
      tentativeSuggestion: 'content',
      confidenceNote: 'This is an approximate estimate. A photo cannot know what you are feeling—feel free to pick any mood below.',
      disclaimer: 'Facial expressions do not reliably indicate true feelings or psychological state. You have full control to change or discard this suggestion.'
    });
  }
});

// In production, serve the built static Vite frontend
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), err => {
    if (err) {
      res.status(200).send('MindCare backend running. Start Vite dev server for frontend.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`MindCare backend server running on http://localhost:${PORT}`);
  console.log(`Gemini AI configured: ${isGeminiConfigured() ? 'YES (' + getModelName() + ')' : 'NO (fallback mode active)'}`);
});
