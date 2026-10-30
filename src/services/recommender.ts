import { EXERCISE_LIBRARY } from '../data/exercises';
import { Exercise, MoodEntry, PersonalizedRecommendation, SleepEntry, ExerciseFeedback } from '../types';

export function generateRecommendations(
  moods: MoodEntry[],
  sleepLogs: SleepEntry[],
  feedback: ExerciseFeedback[],
  dismissedIds: string[] = []
): PersonalizedRecommendation[] {
  const unhelpfulSet = new Set(
    feedback.filter(f => !f.helpful).map(f => f.exerciseId)
  );

  const dismissedSet = new Set(dismissedIds);

  const recentMood = moods.length > 0 ? moods[0] : null;
  const recentSleep = sleepLogs.length > 0 ? sleepLogs[0] : null;

  const recommendations: PersonalizedRecommendation[] = [];

  // Check if we have sufficient self-reported history
  const hasHistory = Boolean(recentMood || recentSleep);

  if (!hasHistory) {
    // General non-personalized suggestions
    const generalExercises = EXERCISE_LIBRARY.filter(
      e => !dismissedSet.has(`general-${e.id}`) && !unhelpfulSet.has(e.id)
    ).slice(0, 2);

    return generalExercises.map((exercise, idx) => ({
      id: `general-${exercise.id}`,
      exercise,
      reason: 'A gentle, general pause to support daily balance.',
      informedBy: 'General suggestion (we have not recorded enough check-ins yet to personalize).',
      priority: idx + 1
    }));
  }

  // 1. High Stress or Overwhelm (Mood or Sleep stress level)
  if (
    (recentMood && (recentMood.mood === 'stressed' || recentMood.mood === 'overwhelmed' || recentMood.intensity >= 7)) ||
    (recentSleep && recentSleep.stressLevel >= 4)
  ) {
    const stressExercise = EXERCISE_LIBRARY.find(e => e.id === 'box-breathing') || EXERCISE_LIBRARY[0];
    if (!dismissedSet.has(`rec-stress-${stressExercise.id}`) && !unhelpfulSet.has(stressExercise.id)) {
      recommendations.push({
        id: `rec-stress-${stressExercise.id}`,
        exercise: stressExercise,
        reason: 'A paced 4-4-4-4 rhythm to help soften physiological tension.',
        informedBy: recentMood && recentMood.mood === 'stressed' 
          ? 'Suggested because you logged feeling stressed today.'
          : 'Suggested because you noted elevated stress recently.',
        priority: 1
      });
    }
  }

  // 2. Anxious or Racing Thoughts
  if (recentMood && recentMood.mood === 'anxious') {
    const groundingExercise = EXERCISE_LIBRARY.find(e => e.id === 'grounding-54321');
    if (groundingExercise && !dismissedSet.has(`rec-anxious-${groundingExercise.id}`) && !unhelpfulSet.has(groundingExercise.id)) {
      recommendations.push({
        id: `rec-anxious-${groundingExercise.id}`,
        exercise: groundingExercise,
        reason: 'Engaging physical senses can bring focus gently back to the room.',
        informedBy: 'Suggested because you logged feeling anxious or unsettled.',
        priority: 1
      });
    }
  }

  // 3. Restless or Short Sleep
  if (recentSleep && (recentSleep.quality === 'restless' || recentSleep.quality === 'interrupted' || recentSleep.durationHours < 6.5)) {
    // Choose between 4-7-8 breath or evening unburdening
    const isEvening = new Date().getHours() >= 18;
    const targetId = isEvening ? 'evening-unburdening' : 'breath-478';
    const sleepExercise = EXERCISE_LIBRARY.find(e => e.id === targetId) || EXERCISE_LIBRARY[1];
    
    if (!dismissedSet.has(`rec-sleep-${sleepExercise.id}`) && !unhelpfulSet.has(sleepExercise.id)) {
      recommendations.push({
        id: `rec-sleep-${sleepExercise.id}`,
        exercise: sleepExercise,
        reason: isEvening 
          ? 'Putting thoughts on paper can help quiet bedtime mental replay.'
          : 'Elongated exhalations can help signal restfulness to your body.',
        informedBy: `Suggested because your last logged sleep was ${recentSleep.durationHours} hrs (${recentSleep.quality}).`,
        priority: 2
      });
    }
  }

  // 4. Low Energy or Fatigue
  if (
    (recentMood && (recentMood.mood === 'fatigued' || recentMood.mood === 'low')) ||
    (recentSleep && recentSleep.energyLevel <= 2)
  ) {
    const fatigueExercise = EXERCISE_LIBRARY.find(e => e.id === 'gentle-neck-shoulders') || EXERCISE_LIBRARY.find(e => e.id === 'mindful-walk');
    if (fatigueExercise && !dismissedSet.has(`rec-energy-${fatigueExercise.id}`) && !unhelpfulSet.has(fatigueExercise.id)) {
      recommendations.push({
        id: `rec-energy-${fatigueExercise.id}`,
        exercise: fatigueExercise,
        reason: 'Gentle, low-effort movement to unfreeze tight muscles without depleting energy.',
        informedBy: 'Suggested because you noted low energy or feeling drained.',
        priority: 3
      });
    }
  }

  // 5. Positive / Centered state (Peaceful, Content, Joyful)
  if (recentMood && (recentMood.mood === 'peaceful' || recentMood.mood === 'content' || recentMood.mood === 'joyful')) {
    const joyExercise = EXERCISE_LIBRARY.find(e => e.id === 'micro-joys');
    if (joyExercise && !dismissedSet.has(`rec-joy-${joyExercise.id}`) && !unhelpfulSet.has(joyExercise.id)) {
      recommendations.push({
        id: `rec-joy-${joyExercise.id}`,
        exercise: joyExercise,
        reason: 'Savoring a few quiet moments can gently anchor this sense of ease.',
        informedBy: `Suggested because you logged feeling ${recentMood.mood} today.`,
        priority: 4
      });
    }
  }

  // Fallback: If all specific recommendations were dismissed or filtered out, provide general gentle activities
  if (recommendations.length === 0) {
    const available = EXERCISE_LIBRARY.filter(
      e => !dismissedSet.has(`rec-fallback-${e.id}`) && !unhelpfulSet.has(e.id)
    );
    if (available.length > 0) {
      recommendations.push({
        id: `rec-fallback-${available[0].id}`,
        exercise: available[0],
        reason: 'A gentle pause to support your daily rhythm.',
        informedBy: 'General recommendation based on your library.',
        priority: 5
      });
    }
  }

  return recommendations.slice(0, 3);
}

