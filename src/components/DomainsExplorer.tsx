/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { WELLNESS_DOMAINS } from '../data/defaultWellnessData';
import { WellnessDomainId } from '../types/wellness';
import { WellnessWheel } from './WellnessWheel';
import {
  Activity,
  Heart,
  Brain,
  Users,
  Compass,
  TreePine,
  Briefcase,
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
  X,
  PieChart,
  LayoutGrid,
} from 'lucide-react';

const domainIconMap: Record<WellnessDomainId, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  physical: Activity,
  emotional: Heart,
  intellectual: Brain,
  social: Users,
  spiritual: Compass,
  environmental: TreePine,
  occupational: Briefcase,
  financial: DollarSign,
};

export const DomainsExplorer: React.FC = () => {
  const {
    habits,
    toggleHabitCompletion,
    completions,
    todayDate,
    t,
    language,
    addCustomHabit,
  } = useWellness();

  const [selectedDomain, setSelectedDomain] = useState<WellnessDomainId | 'all'>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'wheel'>('cards');

  // Custom habit modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDomain, setNewDomain] = useState<WellnessDomainId>('physical');
  const [newDuration, setNewDuration] = useState(15);

  const filteredHabits = habits.filter((h) => {
    const matchesDomain = selectedDomain === 'all' || h.domain === selectedDomain;
    const title = language === 'es' ? h.titleEs : h.titleEn;
    const desc = language === 'es' ? h.descriptionEs : h.descriptionEn;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomHabit({
      domain: newDomain,
      titleEn: newTitle.trim(),
      titleEs: newTitle.trim(),
      descriptionEn: newDesc.trim() || 'Personal intentional practice.',
      descriptionEs: newDesc.trim() || 'Práctica personal con intención.',
      durationMinutes: newDuration,
    });

    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  return (
    <section className="space-y-5">
      {/* 1. Header & Introduction (Always stacked above controls on all screen sizes) */}
      <div className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
          {t.domains.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          {t.domains.subtitle}
        </p>
      </div>

      {/* 2. Controls Row: List/Wheel toggle & Custom Action button (Wraps gracefully) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
        {/* Toggle between Labeled Domain Cards & Optional Wellness Wheel */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 min-h-[44px] ${
              viewMode === 'cards'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title={language === 'es' ? 'Lista de tarjetas' : 'Labeled list'}
            aria-label={language === 'es' ? 'Lista de tarjetas' : 'Labeled list'}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{language === 'es' ? 'Tarjetas' : 'List'}</span>
          </button>
          <button
            onClick={() => setViewMode('wheel')}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 min-h-[44px] ${
              viewMode === 'wheel'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title={language === 'es' ? 'Rueda visual opcional' : 'Optional wellness wheel'}
            aria-label={language === 'es' ? 'Rueda visual opcional' : 'Optional wellness wheel'}
          >
            <PieChart className="w-4 h-4" />
            <span>{language === 'es' ? 'Rueda' : 'Wheel'}</span>
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white hover:from-sky-600 hover:to-blue-800 transition-colors flex items-center gap-2 shadow-xs min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>{t.domains.customAction}</span>
        </button>
      </div>

      {/* 3. Visual Wheel (Optional) vs 8 Domain Cards Grid (2 columns when fitting comfortably, 1 column on narrow) */}
      {viewMode === 'wheel' ? (
        <WellnessWheel
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {WELLNESS_DOMAINS.map((domain) => {
            const Icon = domainIconMap[domain.id];
            const isSelected = selectedDomain === domain.id;
            const habitCount = habits.filter((h) => h.domain === domain.id).length;
            const completedToday = completions.some(
              (c) => c.domain === domain.id && c.localDate === todayDate && !c.isUndone
            );

            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(selectedDomain === domain.id ? 'all' : domain.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between group min-h-[56px] border-l-4 ${
                  isSelected
                    ? 'bg-white ring-2 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
                style={{
                  borderLeftColor: domain.accentColor,
                  borderColor: isSelected ? domain.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 0 1px ${domain.accentColor}` : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2.5 w-full">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs"
                      style={{
                        backgroundColor: domain.surfaceColor,
                        color: domain.textColor,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Domain Title with Designated Accessible Dark Text Color */}
                        <span
                          className="font-bold text-sm sm:text-base leading-tight block"
                          style={{ color: domain.textColor }}
                        >
                          {language === 'es' ? domain.nameEs : domain.nameEn}
                        </span>
                        {/* Domain Color Token Indicator Badge */}
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: domain.surfaceColor,
                            color: domain.textColor,
                            border: `1px solid ${domain.accentColor}40`,
                          }}
                        >
                          {language === 'es' ? domain.colorLabelEs : domain.colorLabelEn}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {language === 'es' ? domain.taglineEs : domain.taglineEn}
                      </p>
                    </div>
                  </div>

                  {completedToday && (
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                      {language === 'es' ? 'Listo' : 'Done'}
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 w-full">
                  <span className="font-medium">
                    {habitCount} {language === 'es' ? 'acciones' : 'actions'}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: domain.textColor }}>
                    {isSelected
                      ? (language === 'es' ? 'Mostrar todo' : 'Show all')
                      : (language === 'es' ? 'Ver acciones →' : 'View actions →')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Domain Filter Chips & Search Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-2">
        <button
          onClick={() => setSelectedDomain('all')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px] ${
            selectedDomain === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900 hover:bg-stone-50'
          }`}
        >
          {t.domains.all}
        </button>
        {WELLNESS_DOMAINS.map((domain) => {
          const Icon = domainIconMap[domain.id];
          const isSelected = selectedDomain === domain.id;
          const label = language === 'es' ? domain.nameEs : domain.nameEn;
          return (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[44px] ${
                isSelected
                  ? 'shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
              style={{
                backgroundColor: isSelected ? domain.surfaceColor : undefined,
                color: isSelected ? domain.textColor : undefined,
                borderColor: isSelected ? domain.accentColor : undefined,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.domains.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
        />
      </div>

      {/* 5. Habit Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredHabits.map((habit) => {
          const isCompletedToday = completions.some(
            (c) => c.actionId === habit.id && c.localDate === todayDate && !c.isUndone
          );
          const domainConfig = WELLNESS_DOMAINS.find((d) => d.id === habit.domain)!;
          const Icon = domainIconMap[habit.domain];
          const title = language === 'es' ? habit.titleEs : habit.titleEn;
          const desc = language === 'es' ? habit.descriptionEs : habit.descriptionEn;
          const domainLabel = language === 'es' ? domainConfig.nameEs : domainConfig.nameEn;

          return (
            <div
              key={habit.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isCompletedToday
                  ? 'bg-blue-50/50 border-blue-300 ring-1 ring-blue-400/20'
                  : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
            >
              <div>
                {/* Header metadata with Domain Badge in Designated Domain Colors */}
                <div className="flex items-center justify-between text-xs text-stone-500 mb-2.5">
                  <div
                    className="flex items-center gap-1.5 font-semibold px-2.5 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: domainConfig.surfaceColor,
                      color: domainConfig.textColor,
                      border: `1px solid ${domainConfig.accentColor}60`,
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: domainConfig.textColor }} />
                    <span>{domainLabel}</span>
                  </div>
                  {habit.durationMinutes && (
                    <div className="flex items-center gap-1 text-[11px] text-stone-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{habit.durationMinutes} min</span>
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-stone-900 leading-snug">{title}</h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {desc}
                </p>
              </div>

              {/* Action Button with 44px touch target */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
                    isCompletedToday
                      ? 'bg-blue-100 text-blue-900 hover:bg-rose-50 hover:text-rose-700'
                      : 'bg-stone-900 text-white hover:bg-stone-800'
                  }`}
                  aria-label={isCompletedToday ? t.domains.undo : t.domains.markDone}
                >
                  {isCompletedToday ? (
                    <>
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>{t.domains.completedToday} ({t.domains.undo})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.domains.markDone}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Action Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900">
                {t.domains.customActionModalTitle}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="p-5 space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {t.domains.selectDomain}
                </label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value as WellnessDomainId)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white text-stone-800 min-h-[44px]"
                >
                  {WELLNESS_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {language === 'es' ? d.nameEs : d.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {t.domains.actionTitleLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 10 min garden breathwork"
                  className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {t.domains.actionDescLabel}
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Gentle breathing outdoors without digital devices."
                  className="w-full py-2.5 px-3 text-xs sm:text-sm rounded-xl border border-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {language === 'es' ? 'Duración (minutos)' : 'Duration (minutes)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-28 py-2 px-3 text-xs sm:text-sm rounded-xl border border-stone-200 min-h-[44px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs sm:text-sm text-stone-600 hover:text-stone-900 min-h-[44px]"
                >
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-xl shadow-xs transition-colors min-h-[44px]"
                >
                  {t.domains.saveAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
