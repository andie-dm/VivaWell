/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { getDayOfWeek, parseLocalDate } from '../utils/dateUtils';
import {
  Flame,
  Award,
  Calendar,
  PauseCircle,
  PlayCircle,
  Sliders,
  CheckCircle2,
  Coffee,
  Info,
  HeartHandshake,
  ArrowDownCircle,
  Sparkles,
  Feather,
  Check,
} from 'lucide-react';

interface RhythmHeroProps {
  onOpenSettings: () => void;
  onOpenReflection: () => void;
}

export const RhythmHero: React.FC<RhythmHeroProps> = ({
  onOpenSettings,
  onOpenReflection,
}) => {
  const {
    t,
    preferences,
    updatePreferences,
    streakResult,
    todayDate,
    language,
    currentProfile,
    completions,
    addWeeklyReflection,
  } = useWellness();

  const {
    currentStreak,
    personalBest,
    streakUnit,
    weeklyCalendar,
    completedDaysThisWeek,
    plannedDaysThisWeek,
    totalActiveWeeks,
    isMissedGoal,
    isPaused,
    streakExplanation,
  } = streakResult;

  // Gentle inline note state
  const [inlineNote, setInlineNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const togglePause = () => {
    updatePreferences({ isPaused: !preferences.isPaused });
  };

  // Rest day calculations for today
  const todayDayOfWeek = getDayOfWeek(todayDate);
  const isTodayRestDay = preferences.restDays.includes(todayDayOfWeek);

  const toggleTodayRestDay = () => {
    if (isTodayRestDay) {
      updatePreferences({
        restDays: preferences.restDays.filter((d) => d !== todayDayOfWeek),
      });
    } else {
      updatePreferences({
        restDays: [...preferences.restDays, todayDayOfWeek],
      });
    }
  };

  const handleSaveInlineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineNote.trim()) return;

    addWeeklyReflection({
      moodRating: 4,
      reflectionNote: inlineNote.trim(),
      selectedDomains: ['physical', 'emotional'],
    });

    setNoteSaved(true);
    setTimeout(() => {
      setNoteSaved(false);
      setInlineNote('');
    }, 2500);
  };

  const scrollToHabits = () => {
    const el = document.getElementById('today-habit-actions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const firstName = currentProfile.name.split(' ')[0];
  const todayCompletedCount = completions.filter(
    (c) => c.localDate === todayDate && !c.isUndone
  ).length;

  // Format date gracefully without splitting into awkward fragments
  const formattedFriendlyDate = parseLocalDate(todayDate).toLocaleDateString(
    language === 'es' ? 'es-ES' : 'en-US',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );

  return (
    <section className="space-y-5">
      {/* 1. Personalized Greeting & Primary Action Card (Clean White Surface) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Subtle decorative pastel accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/40 via-blue-50/20 to-transparent pointer-events-none rounded-bl-full" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Top Date Badge & Greeting Section (Full width above buttons) */}
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {language === 'es' ? 'Hoy' : 'Today'}
              </span>
              <span className="text-xs text-stone-600 font-medium">
                {formattedFriendlyDate}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
              {language === 'es' ? `¡Hola, ${firstName}!` : `Welcome, ${firstName}!`}
            </h1>
            <p className="text-sm text-stone-600 mt-1.5 leading-relaxed max-w-xl">
              {language === 'es'
                ? '¿Qué se siente posible hoy? Da un pequeño paso sin prisa.'
                : 'What feels manageable today? Take it one gentle step at a time.'}
            </p>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col gap-2.5 w-full pt-1">
            {/* Primary Action Button - Full width on phones */}
            <button
              onClick={scrollToHabits}
              className="w-full sm:w-auto self-start px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white hover:from-sky-600 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-xs min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Sparkles className="w-4 h-4 text-sky-200 shrink-0" />
              <span>
                {language === 'es' ? 'Elige una pequeña acción' : 'Choose a small action'}
              </span>
              <ArrowDownCircle className="w-4 h-4 opacity-80 shrink-0 ml-1" />
            </button>

            {/* Rest-day control on a separate row below it */}
            <div className="w-full sm:w-auto self-start">
              <button
                onClick={toggleTodayRestDay}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  isTodayRestDay
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isTodayRestDay
                    ? language === 'es'
                      ? 'Día de descanso activo (Racha protegida)'
                      : 'Rest day active (Streak protected)'
                    : language === 'es'
                    ? 'Tomar día de descanso'
                    : 'Take a rest day'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Supportive Status Summary - Readable and wraps naturally */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-start sm:items-center gap-1.5 min-w-0">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">
              {language === 'es'
                ? 'Los días de descanso y gracia protegen tu racha. La constancia amable es sostenible.'
                : 'Rest days and grace days preserve your momentum. Gentle consistency stays sustainable.'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 shrink-0 self-start sm:self-auto">
            {todayCompletedCount > 0
              ? language === 'es'
                ? `${todayCompletedCount} acción(es) completada(s) hoy`
                : `${todayCompletedCount} action(s) completed today`
              : language === 'es'
              ? 'Listo para tu acción de hoy'
              : 'Ready for today’s action'}
          </span>
        </div>
      </div>

      {/* 2. My Wellness Rhythm Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Header & Controls - Heading above controls on narrow screens */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-stone-900">
              {t.rhythm.title}
            </h2>
            {isPaused && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                {language === 'es' ? 'En Pausa' : 'Paused'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={togglePause}
              className={`flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center justify-center gap-1.5 min-h-[44px] ${
                isPaused
                  ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {isPaused ? (
                <>
                  <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.rhythm.resumePlan}</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>{t.rhythm.pausePlan}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs min-h-[44px]"
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>{t.rhythm.adjustRhythm}</span>
            </button>
          </div>
        </div>

        {/* Paused Plan Banner */}
        {isPaused && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{t.rhythm.planPausedBanner}</p>
          </div>
        )}

        {/* Supportive Return Message - Stacked above its action button */}
        {isMissedGoal && !isPaused && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-950 text-xs flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <HeartHandshake className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-bold text-sm text-blue-950">
                  {t.rhythm.welcomeBackTitle}
                </p>
                <p className="text-blue-900/90 text-xs mt-1 leading-relaxed">
                  {t.rhythm.welcomeBackSubtitle}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={onOpenSettings}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-xl transition-colors shadow-xs min-h-[44px] flex items-center justify-center gap-1.5"
              >
                {t.rhythm.adjustGoalCta}
              </button>
            </div>
          </div>
        )}

        {/* Metrics Row - 2 columns on phones, 4 columns on tablets/desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
          {preferences.streakVisibility ? (
            <>
              {/* Current Streak */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">
                  <Flame className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {t.rhythm.currentStreak}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                    {currentStreak}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {streakUnit === 'weeks' ? t.rhythm.weeks : t.rhythm.days}
                  </span>
                </div>
              </div>

              {/* Personal Best */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">
                  <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {t.rhythm.personalBest}
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                    {personalBest}
                  </span>
                  <span className="text-xs font-medium text-stone-500">
                    {streakUnit === 'weeks' ? t.rhythm.weeks : t.rhythm.days}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
              <span className="text-xs font-semibold text-stone-700">
                {language === 'es' ? 'Práctica Serena Diaria' : 'Mindful Daily Practice'}
              </span>
              <div className="mt-1 text-xs text-stone-500 leading-relaxed">
                {language === 'es'
                  ? 'Contadores de racha ocultos para una experiencia sin presiones.'
                  : 'Streak numbers hidden for pressure-free personal growth.'}
              </div>
            </div>
          )}

          {/* Active Weeks */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              {t.rhythm.totalActiveWeeks}
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                {totalActiveWeeks}
              </span>
              <span className="text-xs font-medium text-stone-500">
                {t.rhythm.weeks}
              </span>
            </div>
          </div>

          {/* Completed vs Planned */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between">
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {t.rhythm.completedVsPlanned}
            </span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-stone-900 tabular-nums">
                {completedDaysThisWeek} / {plannedDaysThisWeek}
              </span>
              <span className="text-xs font-medium text-stone-500">
                {t.rhythm.days}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Calendar Strip */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-semibold text-stone-800">
              {language === 'es' ? 'Ritmo Semanal' : 'Weekly Rhythm'}
            </span>
            <div className="flex items-center gap-2.5 text-[10px] text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {t.rhythm.legend.completed}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-300" />
                {t.rhythm.legend.rest}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weeklyCalendar.map((day) => {
              const isToday = day.date === todayDate;
              let bgClass = 'bg-stone-50 border-stone-200 text-stone-600';
              let badgeText = '';

              if (day.status === 'completed') {
                bgClass = 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-400/30';
                badgeText = t.rhythm.legend.completed;
              } else if (day.status === 'grace_day') {
                bgClass = 'bg-purple-50 border-purple-200 text-purple-900';
                badgeText = t.rhythm.legend.grace;
              } else if (day.status === 'rest_day') {
                bgClass = 'bg-stone-100/80 border-stone-200 text-stone-500';
                badgeText = t.rhythm.legend.rest;
              } else if (day.status === 'planned') {
                bgClass = isToday
                  ? 'bg-amber-50/90 border-amber-300 text-amber-900 ring-2 ring-amber-400/40'
                  : 'bg-stone-50 border-stone-200/80 text-stone-600';
                badgeText = isToday ? (language === 'es' ? 'Hoy' : 'Today') : t.rhythm.legend.planned;
              } else if (day.status === 'missed') {
                bgClass = 'bg-rose-50/60 border-rose-200 text-rose-800';
                badgeText = language === 'es' ? 'Omitido' : 'Missed';
              }

              return (
                <div
                  key={day.date}
                  className={`p-1.5 sm:p-2 rounded-xl border flex flex-col items-center justify-between text-center min-h-[56px] sm:min-h-[64px] transition-all ${bgClass}`}
                >
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase">
                    {day.dayName}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-medium">
                    {day.date.slice(8)}
                  </span>
                  <span className="text-[9px] font-medium truncate max-w-full leading-none">
                    {badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status explanation footer - wraps naturally */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
          <div className="flex items-start sm:items-center gap-1.5 min-w-0">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">{streakExplanation}</span>
          </div>
          <span className="text-[11px] text-stone-400 shrink-0">
            {t.rhythm.dailyActionsNote}
          </span>
        </div>
      </div>

      {/* 3. Mindful Reflection / Intention Prompt */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleSaveInlineNote} className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold text-stone-800 flex items-center gap-1.5">
              <Feather className="w-4 h-4 text-blue-600 shrink-0" />
              {language === 'es'
                ? 'Nota o intención apacible para hoy'
                : 'Gentle reflection or mindful intention for today'}
            </span>
            <button
              type="button"
              onClick={onOpenReflection}
              className="text-xs text-purple-700 hover:text-purple-900 underline font-medium"
            >
              {language === 'es' ? 'Abrir reflexión semanal' : 'Open weekly reflection'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={inlineNote}
              onChange={(e) => setInlineNote(e.target.value)}
              placeholder={
                language === 'es'
                  ? '¿Cómo te sientes en este momento? (opcional)'
                  : 'How are you feeling right now? (optional)'
              }
              className="flex-1 py-2.5 px-3.5 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!inlineNote.trim()}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-stone-900 text-white disabled:opacity-40 hover:bg-stone-800 transition-colors shrink-0 min-h-[44px] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {noteSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'es' ? 'Guardada' : 'Saved'}</span>
                </>
              ) : (
                <span>{language === 'es' ? 'Anotar' : 'Record'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
