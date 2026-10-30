import React, { useState } from 'react';
import { EXERCISE_LIBRARY } from '../../data/exercises';
import { Exercise, ExerciseCategory } from '../../types';
import { BookOpen, Heart, Play, Clock, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface ExerciseLibraryViewProps {
  onStartExercise: (exercise: Exercise) => void;
  favorites: string[];
  onToggleFavorite: (exerciseId: string) => void;
  feedbackMap: Record<string, boolean>;
}

export const ExerciseLibraryView: React.FC<ExerciseLibraryViewProps> = ({
  onStartExercise,
  favorites,
  onToggleFavorite,
  feedbackMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: ExerciseCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Activities' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'grounding', label: 'Grounding' },
    { id: 'movement', label: 'Gentle Movement' },
    { id: 'journaling', label: 'Journaling' },
    { id: 'wind-down', label: 'Sleep Wind-Down' },
  ];

  const filtered = EXERCISE_LIBRARY.filter((ex) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      ex.category === selectedCategory ||
      (selectedCategory === 'wind-down' && (ex.tags.includes('sleep') || ex.tags.includes('wind-down')));

    const matchesSearch =
      searchQuery.trim() === '' ||
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" /> Exercise Library
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Gentle Self-Care & Reflection Practices
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm leading-relaxed">
          Short, accessible, non-clinical exercises to help center your breath, unburden thoughts, and ground your physical senses whenever you need a pause.
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-sage-700 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search exercises or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3.5 pr-4 py-1.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-sage-400 focus:outline-none bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((exercise) => {
          const isFav = favorites.includes(exercise.id);
          const feedback = feedbackMap[exercise.id];

          return (
            <div
              key={exercise.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-5 flex flex-col justify-between hover:shadow-md hover:border-sage-300 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sage-700 bg-sage-50 px-2.5 py-0.5 rounded-full border border-sage-100">
                    {exercise.category}
                  </span>

                  <button
                    onClick={() => onToggleFavorite(exercise.id)}
                    aria-label={isFav ? 'Remove favorite' : 'Add to favorites'}
                    className={`p-1.5 rounded-full transition ${
                      isFav ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                <h3 className="text-base font-bold text-gray-900 mt-3 group-hover:text-sage-800 transition">
                  {exercise.title}
                </h3>

                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {exercise.shortDescription}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {exercise.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>~{exercise.durationMinutes} min</span>
                  {feedback === true && (
                    <span className="ml-1 text-[11px] text-emerald-600 flex items-center gap-0.5">
                      • Helpful
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onStartExercise(exercise)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sage-50 hover:bg-sage-600 text-sage-800 hover:text-white text-xs font-semibold transition border border-sage-200 hover:border-transparent"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Guide</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-gray-700">No exercises found</h3>
          <p className="text-xs text-gray-500 mt-1">Try adjusting your category filter or search keywords.</p>
        </div>
      )}
    </div>
  );
};

