# MindCare 🌿 — Mental Wellness & Daily Reflection

MindCare is a polished, responsive mental wellness and reflection web application designed to help users gently observe their mood, sleep, and wellbeing, and receive supportive self-care suggestions through its AI companion, **Prakash**.

---

## ⚠️ Important Purpose and Boundaries

- **Non-Medical / Non-Clinical Tool:** MindCare is a self-reflection and personal wellness platform. It is **not** a medical device, diagnostic system, or therapy service, and does not replace qualified physicians, psychologists, or licensed mental health professionals.
- **Photo Facial Expression Uncertainty:** Facial expressions do not reliably reveal how a person actually feels. Face photo analysis is **strictly optional** and labeled only as a tentative, expression-based estimate. Users have full control to confirm, adjust, or completely ignore the suggestion. Images are processed in-memory and discarded immediately without persistent storage.
- **Crisis Response & Safety:** MindCare and Prakash are automated AI tools not monitored by emergency personnel. If someone is experiencing severe distress or considering self-harm, MindCare displays verified crisis contacts immediately (such as **988** in the US/Canada, **14416** Tele-MANAS in India, **111/999** in the UK, and international directories).

---

## Key Features

1. **Welcome & Onboarding:**
   - Multi-step orientation clearly explaining MindCare's role and non-medical boundaries.
   - Explicit consent toggles for AI reflection conversations, log context sharing, and photo expression estimation.
   - Clear explanation of data ownership and one-click data deletion.

2. **Home Dashboard:**
   - Friendly, time-aware greeting and daily reflection prompt (*"What are you noticing today?"*).
   - Quick action shortcuts: *Log my mood*, *Reflect with Prakash*, *Try an exercise*.
   - **Personalized "Suggested for you" cards:** Dynamically generated from user-recorded mood, sleep duration, and stress levels with transparent explanations (*"Suggested because you logged restless sleep last night"*).
   - Easy one-click dismissal and helpfulness rating (👍 / 👎) to train future recommendations.

3. **Mood Check-in:**
   - 10 distinct mood descriptors with calm colors, gentle definitions, and emoji.
   - Intensity slider (1 to 10) with gentle descriptive anchors.
   - Common context tags (Work, Sleep, Quiet Time, Outdoors, etc.) plus custom tag creation.
   - Optional photo upload with Gemini vision analysis, clearly framed as an uncertain expression guess.
   - Full manual logging remains 100% available offline or if AI services are unavailable.

4. **Mood History & Insights:**
   - Chronological reflection timeline and 7-day SVG trend charts for mood intensity and sleep hours.
   - Cautious pattern summaries avoiding causal claims (*"You logged lower moods on some nights with less sleep. Note: These reflect co-occurring self-reports, not direct cause-and-effect"*).
   - Export all data as JSON or delete all records with confirmation.

5. **Sleep & Wellbeing Log:**
   - Bedtime and wake-time pickers with auto-calculated duration.
   - Sleep quality categorization (*Deep, Restful, Fair, Restless, Interrupted*).
   - Energy (1-5) and Stress (1-5) rating sliders.
   - List of recent sleep logs with edit/delete support.

6. **Exercise Library & Interactive Guides:**
   - Evidence-based, low-risk activities across 5 categories: *Breathing*, *Grounding*, *Gentle Movement*, *Journaling*, and *Sleep Wind-down*.
   - Interactive guided experiences:
     - **Box Breathing (4-4-4-4):** Animated breathing ring with inhale, hold, exhale, and rest timers.
     - **4-7-8 Calming Breath:** Elongated exhale pacer.
     - **5-4-3-2-1 Sensory Grounding:** Step-by-step interactive countdown.
     - **Progressive Muscle Relaxation & Gentle Movement:** Paced physical tension release.
     - **Evening Thought Unburdening:** Reflective mental parking lot.
   - Favorite pinning and helpfulness ratings.

7. **Prakash AI Companion:**
   - Warm, respectful, nonjudgmental conversational partner.
   - Listens first, asks one question at a time, and never pressures or promises clinical cures.
   - Transparent log context disclosure badge (user can toggle log sharing on or off anytime).
   - One-click exercise launching directly from chat suggestions.
   - Crisis safety protocol with persistent emergency hotline dialogs.

8. **Settings & Privacy:**
   - Toggle AI chat, photo analysis, and context-sharing permissions.
   - Real-time backend status and Gemini model information.
   - Instant JSON data export and permanent data wipe.

---

## Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Vite, Canvas-Confetti
- **Backend:** Node.js, Express, `@google/genai` (official Google GenAI SDK), CORS, Dotenv
- **Data Storage:** Client-side LocalStorage for user privacy, in-memory zero-storage image processing

---

## Getting Started

### 1. Configure Environment Variables

Create a `.env` file in the project root (you can copy `.env.example`):

```bash
# In your terminal or file explorer
cp .env.example .env
```

Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/):

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
GEMINI_MODEL=gemini-3.8-flash
```

> **Security Note:** The `.env` file and API keys are included in `.gitignore` and are strictly loaded on the Node.js server. The API key is never exposed to frontend code or client browser storage.

### 2. Run in Development Mode

Run both the Express backend and the Vite frontend concurrently:

```bash
npm run dev
```

- **Frontend:** `http://localhost:3000` (Vite dev server with automatic `/api` proxy)
- **Backend:** `http://localhost:3001` (Express API)

### 3. Build & Run in Production

Build the client assets and start the unified Express server:

```bash
npm run build
npm start
```

Open `http://localhost:3001` in your browser.

