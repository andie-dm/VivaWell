/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { WELLNESS_DOMAINS } from '../data/defaultWellnessData';
import { WellnessDomainId } from '../types/wellness';
import { X, Heart, Smile, Sparkles, BookMarked, Check } from 'lucide-react';

interface WeeklyReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReflectionModal: React.FC<WeeklyReflectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    t,
    language,
    weeklyReflections,
    addWeeklyReflection,
  } = useWellness();

  const [moodRating, setMoodRating] = useState<number>(4);
  const [selectedDomains, setSelectedDomains] = useState<WellnessDomainId[]>(['physical', 'emotional']);
  const [reflectionNote, setReflectionNote] = useState('');

  if (!isOpen) return null;

  const toggleDomain = (id: WellnessDomainId) => {
    if (selectedDomains.includes(id)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== id));
    } else {
      setSelectedDomains([...selectedDomains, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWeeklyReflection({
      moodRating,
      reflectionNote: reflectionNote.trim() || (language === 'es' ? 'Semana de equilibrio y autocuidado.' : 'A week of quiet self-care.'),
      selectedDomains,
    });
    onClose();
  };

  const moods = t.reflection.moods;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t.reflection.modalTitle}
              </h3>
              <p className="text-xs text-stone-500">
                {t.reflection.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Question 1: Mood */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.reflection.moodQuestion}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((val, idx) => {
                const isSelected = moodRating === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMoodRating(val)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold ring-1 ring-purple-500/20'
                        : 'border-stone-200 bg-stone-50/60 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-base font-bold tabular-nums">{val}</span>
                    <span className="text-[10px] leading-tight truncate w-full">
                      {moods[idx]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2: Selected Domains */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.reflection.domainFocusLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {WELLNESS_DOMAINS.map((domain) => {
                const isSelected = selectedDomains.includes(domain.id);
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-xl border text-left transition-colors flex items-center justify-between min-h-[44px] ${
                      isSelected
                        ? 'shadow-2xs ring-1 ring-offset-1'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                    style={{
                      backgroundColor: isSelected ? domain.surfaceColor : undefined,
                      color: isSelected ? domain.textColor : undefined,
                      borderColor: isSelected ? domain.accentColor : undefined,
                    }}
                  >
                    <span>{language === 'es' ? domain.nameEs : domain.nameEn}</span>
                    {isSelected && <Check className="w-4 h-4 shrink-0" style={{ color: domain.textColor }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Notes / Intentions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.reflection.notesLabel}
            </label>
            <textarea
              rows={3}
              value={reflectionNote}
              onChange={(e) => setReflectionNote(e.target.value)}
              placeholder={t.reflection.notesPlaceholder}
              className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          {/* Past reflections count note */}
          {weeklyReflections.length > 0 && (
            <div className="pt-2 border-t border-stone-100">
              <span className="text-xs text-stone-500 font-medium">
                {t.reflection.completedHistoryTitle}: {weeklyReflections.length} {language === 'es' ? 'reflexiones registradas' : 'reflections recorded'}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 min-h-[44px] flex items-center justify-center rounded-xl"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
            >
              {t.reflection.submitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
