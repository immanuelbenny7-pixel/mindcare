import { Exercise } from '../types';

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing (4-4-4-4)',
    category: 'breathing',
    durationMinutes: 3,
    shortDescription: 'Equalized 4-second breath cycles to settle an overstimulated nervous system.',
    interactiveType: 'box-breathing',
    tags: ['stress', 'anxiety', 'focus', 'quick'],
    isLowRisk: true,
    detailedGuide: [
      'Find an upright, comfortable posture with your shoulders dropped.',
      'Follow the animated circle: inhale for 4 seconds, hold gently for 4 seconds, exhale smoothly for 4 seconds, and rest empty for 4 seconds.',
      'Repeat for 3 to 4 full cycles or whenever you feel ready to pause.'
    ],
    steps: [
      { title: 'Inhale', instruction: 'Breathe in slowly through your nose...', durationSeconds: 4, type: 'inhale' },
      { title: 'Hold', instruction: 'Hold your breath gently without straining...', durationSeconds: 4, type: 'hold' },
      { title: 'Exhale', instruction: 'Release all air smoothly through your mouth...', durationSeconds: 4, type: 'exhale' },
      { title: 'Rest', instruction: 'Pause gently at the bottom of the breath...', durationSeconds: 4, type: 'hold' }
    ]
  },
  {
    id: 'breath-478',
    title: '4-7-8 Calming Breath',
    category: 'breathing',
    durationMinutes: 4,
    shortDescription: 'Elongated exhale technique designed to activate relaxation and prepare for sleep.',
    interactiveType: '4-7-8',
    tags: ['sleep', 'wind-down', 'restless', 'night'],
    isLowRisk: true,
    detailedGuide: [
      'Empty your lungs completely through your mouth with a soft whoosh sound.',
      'Close your mouth and inhale quietly through your nose to a mental count of 4.',
      'Hold your breath comfortably for a count of 7.',
      'Exhale completely through your mouth with an audible whoosh for a count of 8.'
    ],
    steps: [
      { title: 'Inhale', instruction: 'Inhale quietly through your nose for 4 counts', durationSeconds: 4, type: 'inhale' },
      { title: 'Hold', instruction: 'Hold breath gently for 7 counts', durationSeconds: 7, type: 'hold' },
      { title: 'Exhale', instruction: 'Exhale slowly and completely through mouth for 8 counts', durationSeconds: 8, type: 'exhale' }
    ]
  },
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Sensory Grounding',
    category: 'grounding',
    durationMinutes: 5,
    shortDescription: 'Reconnect with your physical environment by gently engaging all five senses.',
    interactiveType: 'grounding-54321',
    tags: ['anxiety', 'overwhelmed', 'racing-thoughts', 'present-moment'],
    isLowRisk: true,
    detailedGuide: [
      'Take one gentle, unhurried breath.',
      'Look around and name 5 things you can see.',
      'Notice 4 things you can physically touch or feel (e.g. fabric on skin, chair beneath you).',
      'Listen for 3 distinct sounds around you or in the distance.',
      'Identify 2 subtle scents in the air.',
      'Notice 1 taste or sensation in your mouth.'
    ],
    steps: [
      { title: '5 Things You Can See', instruction: 'Notice 5 distinct visual details around you: shadows, colors, or textures.', type: 'reflect' },
      { title: '4 Things You Can Feel', instruction: 'Notice 4 physical sensations: your feet on the floor, clothing against your skin, or temperature.', type: 'reflect' },
      { title: '3 Things You Can Hear', instruction: 'Listen carefully for 3 subtle sounds: birds, distant hum, or your own breathing.', type: 'reflect' },
      { title: '2 Things You Can Smell', instruction: 'Notice 2 scents in the air, or recall a favorite comforting fragrance.', type: 'reflect' },
      { title: '1 Thing You Can Taste', instruction: 'Notice the lingering taste of tea, toothpaste, or simply fresh water.', type: 'reflect' }
    ]
  },
  {
    id: 'gentle-neck-shoulders',
    title: 'Gentle Neck & Shoulder Release',
    category: 'movement',
    durationMinutes: 4,
    shortDescription: 'Light, seated mobility movements to unburden physical tension stored in the upper body.',
    interactiveType: 'guided-steps',
    tags: ['fatigue', 'tension', 'desk-work', 'movement'],
    isLowRisk: true,
    detailedGuide: [
      'Sit comfortably and let both arms rest naturally at your sides.',
      'Perform slow, non-straining neck rolls and shoulder shrugs.',
      'Never force a stretch or push into discomfort; stop if anything feels tight or strained.'
    ],
    steps: [
      { title: 'Shoulder Rolls', instruction: 'Roll shoulders slowly backward 5 times, then forward 5 times.', durationSeconds: 45, type: 'move' },
      { title: 'Side Neck Tilt', instruction: 'Gently lower your right ear toward your right shoulder without forcing. Hold 20s, then switch.', durationSeconds: 45, type: 'move' },
      { title: 'Chest Open & Soft Fold', instruction: 'Inhale while clasping hands behind your back, then gently exhale and soften your spine.', durationSeconds: 45, type: 'move' }
    ]
  },
  {
    id: 'evening-unburdening',
    title: 'Evening Thought Unburdening',
    category: 'journaling',
    durationMinutes: 6,
    shortDescription: 'Write down lingering thoughts, to-dos, and mental clutter so your mind can rest.',
    interactiveType: 'journaling',
    tags: ['sleep', 'reflection', 'night', 'journaling'],
    isLowRisk: true,
    detailedGuide: [
      'Take 5 minutes with no expectations of neatness or complete sentences.',
      'Write down: 1) What is occupying your headspace right now? 2) What is one thing you can safely leave for tomorrow? 3) One gentle reminder to yourself.'
    ],
    steps: [
      { title: 'The Brain Dump', instruction: 'Write whatever is swirling in your mind. No filter, no judgment.', type: 'reflect' },
      { title: 'Parking Lot', instruction: 'Identify anything that cannot be resolved tonight and consciously park it for tomorrow.', type: 'reflect' },
      { title: 'A Kind Closing Note', instruction: 'Write one kind sentence acknowledging that you did enough today.', type: 'reflect' }
    ]
  },
  {
    id: 'mindful-walk',
    title: '5-Minute Mindful Walk',
    category: 'movement',
    durationMinutes: 5,
    shortDescription: 'Slow down and notice the sensation of each step connecting with the ground.',
    interactiveType: 'guided-steps',
    tags: ['energy', 'fatigue', 'outdoors', 'mindfulness'],
    isLowRisk: true,
    detailedGuide: [
      'Walk at a gentle, unhurried pace either outdoors or around your room.',
      'Notice the heel-to-toe contact with the floor.',
      'Feel the air on your face and look up toward the horizon.'
    ],
    steps: [
      { title: 'Ground Connection', instruction: 'Walk at normal pace, feeling the physical contact of each footstep.', durationSeconds: 90, type: 'move' },
      { title: 'Sensory Observation', instruction: 'Notice 3 things in your environment you normally walk past without seeing.', durationSeconds: 120, type: 'reflect' },
      { title: 'Gentle Deep Breath', instruction: 'Conclude with 3 deep, steady breaths as you come to a soft stop.', durationSeconds: 90, type: 'move' }
    ]
  },
  {
    id: 'micro-joys',
    title: 'Three Micro-Joys Reflection',
    category: 'journaling',
    durationMinutes: 4,
    shortDescription: 'A gentle journaling prompt centered on small, everyday moments of ease or beauty.',
    interactiveType: 'journaling',
    tags: ['mood', 'low', 'gratitude', 'perspective'],
    isLowRisk: true,
    detailedGuide: [
      'Rather than big achievements, tune into 3 small sensory comforts: the warmth of a mug, sunlight on a wall, or a soft blanket.',
      'Record them in your notes.'
    ],
    steps: [
      { title: 'Micro-Joy 1', instruction: 'What was a small sensory pleasure you noticed today?', type: 'reflect' },
      { title: 'Micro-Joy 2', instruction: 'What was a moment of ease, quiet, or relief?', type: 'reflect' },
      { title: 'Micro-Joy 3', instruction: 'What is something simple you are looking forward to, however small?', type: 'reflect' }
    ]
  },
  {
    id: 'progressive-relaxation',
    title: 'Progressive Muscle Relaxation',
    category: 'grounding',
    durationMinutes: 6,
    shortDescription: 'Sequentially tighten and release muscles to cultivate somatic awareness and physical ease.',
    interactiveType: 'guided-steps',
    tags: ['stress', 'tension', 'restless', 'body'],
    isLowRisk: true,
    detailedGuide: [
      'Lie down or sit supported.',
      'Gently tense a muscle group for 5 seconds without straining, then release completely for 10 seconds, noticing the sensation of warmth and release.'
    ],
    steps: [
      { title: 'Feet & Calves', instruction: 'Curl your toes and tighten calf muscles gently for 5 seconds... then release and let them go heavy.', durationSeconds: 40, type: 'move' },
      { title: 'Hands & Arms', instruction: 'Make gentle fists and tighten forearms for 5 seconds... then exhale and soften completely.', durationSeconds: 40, type: 'move' },
      { title: 'Face & Jaw', instruction: 'Gently scrunch your face, then let your jaw drop slack and forehead smooth out.', durationSeconds: 40, type: 'move' }
    ]
  }
];

