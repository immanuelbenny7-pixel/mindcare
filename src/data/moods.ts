import { MoodConfig, MoodType } from '../types';

export const MOOD_DEFINITIONS: Record<MoodType, MoodConfig> = {
  peaceful: {
    type: 'peaceful',
    label: 'Peaceful',
    emoji: '🌿',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    description: 'Feeling centered, calm, and present in the moment.'
  },
  content: {
    type: 'content',
    label: 'Content',
    emoji: '☀️',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    description: 'Satisfied and comfortable with where things are right now.'
  },
  joyful: {
    type: 'joyful',
    label: 'Joyful',
    emoji: '✨',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    description: 'Experiencing lightness, gratitude, or uplifting energy.'
  },
  reflective: {
    type: 'reflective',
    label: 'Reflective',
    emoji: '🌊',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50 border-sky-200',
    description: 'Pensive, noticing your inner world, or contemplating.'
  },
  energized: {
    type: 'energized',
    label: 'Energized',
    emoji: '⚡',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    description: 'Feeling active, engaged, or motivated to take on tasks.'
  },
  fatigued: {
    type: 'fatigued',
    label: 'Fatigued',
    emoji: '🌙',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'Low physical or mental energy; feeling drained or heavy.'
  },
  anxious: {
    type: 'anxious',
    label: 'Anxious',
    emoji: '🍃',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50 border-violet-200',
    description: 'Restless mind, fluttery chest, or anticipation of worries.'
  },
  stressed: {
    type: 'stressed',
    label: 'Stressed',
    emoji: '🌪️',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
    description: 'Feeling pressured, tight shoulders, or stretched thin.'
  },
  overwhelmed: {
    type: 'overwhelmed',
    label: 'Overwhelmed',
    emoji: '🌧️',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
    description: 'Too much stimulus or demands piling on all at once.'
  },
  low: {
    type: 'low',
    label: 'Low / Flat',
    emoji: '🍂',
    color: 'text-stone-700',
    bgColor: 'bg-stone-100 border-stone-200',
    description: 'Subdued, quiet, or feeling a sense of emotional heaviness.'
  }
};

export const COMMON_TAGS = [
  'Work',
  'Family',
  'Sleep',
  'Quiet Time',
  'Outdoors',
  'Exercise',
  'Social',
  'Study',
  'Creative',
  'Screen time',
  'Health',
  'Transit'
];

