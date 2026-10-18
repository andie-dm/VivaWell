/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { ScheduleType } from '../types/wellness';
import { X, Check, ShieldCheck, EyeOff, Sliders } from 'lucide-react';
import { getShortDayName } from '../utils/dateUtils';

interface RhythmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RhythmSettingsModal: React.FC<RhythmSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, updatePreferences, t, language } = useWellness();

  const [scheduleType, setScheduleType] = useState<ScheduleType>(preferences.scheduleType);
  const [targetFrequency, setTargetFrequency] = useState<number>(preferences.targetFrequency);
  const [scheduledDays, setScheduledDays] = useState<number[]>(preferences.scheduledDays);
  const [restDays, setRestDays] = useState<number[]>(preferences.restDays);
  const [graceDayPreference, setGraceDayPreference] = useState<boolean>(preferences.graceDayPreference);
  const [streakVisibility, setStreakVisibility] = useState<boolean>(preferences.streakVisibility);
  const [autoHabitFromPhysicalActivity, setAutoHabitFromPhysicalActivity] = useState<boolean>(
    preferences.autoHabitFromPhysicalActivity
  );

  if (!isOpen) return null;

  const toggleScheduledDay = (day: number) => {
    if (scheduledDays.includes(day)) {
      if (scheduledDays.length > 1) {
        setScheduledDays(scheduledDays.filter((d) => d !== day));
      }
    } else {
      setScheduledDays([...scheduledDays, day]);
      // Remove from rest days if was in rest days
      setRestDays(restDays.filter((d) => d !== day));
    }
  };

  const toggleRestDay = (day: number) => {
    if (restDays.includes(day)) {
      setRestDays(restDays.filter((d) => d !== day));
    } else {
      setRestDays([...restDays, day]);
      // Remove from scheduled days if was scheduled
      setScheduledDays(scheduledDays.filter((d) => d !== day));
    }
  };

  const handleSave = () => {
    updatePreferences({
      scheduleType,
      targetFrequency,
      scheduledDays,
      restDays,
      graceDayPreference,
      streakVisibility,
      autoHabitFromPhysicalActivity,
    });
    onClose();
  };

  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0]; // Mon to Sun order

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {t.rhythm.settingsModalTitle}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {t.rhythm.settingsModalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* 1. Schedule Type */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              {t.rhythm.scheduleTypeLabel}
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  scheduleType === 'daily'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value="daily"
                  checked={scheduleType === 'daily'}
                  onChange={() => setScheduleType('daily')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold block">{t.rhythm.dailyOption}</span>
                  <span className="text-xs text-stone-500">
                    {language === 'es'
                      ? 'Ideal para quienes disfrutan de un ancla diaria suave.'
                      : 'Best for creating a daily anchoring ritual.'}
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  scheduleType === 'scheduled_days'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value="scheduled_days"
                  checked={scheduleType === 'scheduled_days'}
                  onChange={() => setScheduleType('scheduled_days')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold block">{t.rhythm.scheduledDaysOption}</span>
                  <span className="text-xs text-stone-500">
                    {language === 'es'
                      ? 'Elige qué días de la semana practicar. Los días de descanso protegen tu racha.'
                      : 'Choose specific days of the week. Rest days protect your streak.'}
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  scheduleType === 'weekly_frequency'
                    ? 'border-blue-500 bg-blue-50/50 text-blue-950'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <input
                  type="radio"
                  name="scheduleType"
                  value="weekly_frequency"
                  checked={scheduleType === 'weekly_frequency'}
                  onChange={() => setScheduleType('weekly_frequency')}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-semibold block">{t.rhythm.weeklyFrequencyOption}</span>
                  <span className="text-xs text-stone-500">
                    {language === 'es'
                      ? 'Flexibilidad total: cumple una cuota de días por semana a tu elección.'
                      : 'Total flexibility: reach your chosen days per week on any days you choose.'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional Days Selector for Scheduled Days */}
          {scheduleType === 'scheduled_days' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                {t.rhythm.selectScheduledDays}
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {daysOfWeek.map((day) => {
                  const isSelected = scheduledDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleScheduledDay(day)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {getShortDayName(day, language)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Conditional Slider for Weekly Frequency */}
          {scheduleType === 'weekly_frequency' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-stone-700">
                  {t.rhythm.targetFrequencyLabel}
                </label>
                <span className="text-sm font-bold text-blue-700">
                  {targetFrequency} {language === 'es' ? 'días / sem' : 'days / wk'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={targetFrequency}
                onChange={(e) => setTargetFrequency(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 {language === 'es' ? 'día' : 'day'}</span>
                <span>3 {language === 'es' ? 'días' : 'days'}</span>
                <span>6 {language === 'es' ? 'días' : 'days'}</span>
              </div>
            </div>
          )}

          {/* 2. Scheduled Rest Days */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {t.rhythm.restDaysLabel}
            </label>
            <p className="text-xs text-stone-500 mb-2">
              {language === 'es'
                ? 'Días dedicados al descanso y recuperación. No rompen las rachas.'
                : 'Days reserved for recovery and restoration. They never break your streak.'}
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {daysOfWeek.map((day) => {
                const isRest = restDays.includes(day);
                return (
                  <button
                    key={`rest_${day}`}
                    type="button"
                    onClick={() => toggleRestDay(day)}
                    className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-colors ${
                      isRest
                        ? 'bg-stone-800 text-white border-stone-800'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {getShortDayName(day, language)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Grace Day Preference */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="font-semibold text-xs text-stone-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {t.rhythm.graceDayTitle}
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.rhythm.graceDayDesc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={graceDayPreference}
              onChange={(e) => setGraceDayPreference(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* 4. Streak Visibility (Zero Guilt) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="font-semibold text-xs text-stone-900 block flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-stone-600" />
                {t.rhythm.streakVisibilityTitle}
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.rhythm.streakVisibilityDesc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={streakVisibility}
              onChange={(e) => setStreakVisibility(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* 5. Auto-Habit Opt-in */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 flex items-start justify-between gap-3">
            <div className="flex-1">
              <span className="font-semibold text-xs text-stone-900 block flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                {t.rhythm.autoHabitSyncTitle}
              </span>
              <p className="text-xs text-stone-500 mt-0.5">
                {t.rhythm.autoHabitSyncDesc}
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoHabitFromPhysicalActivity}
              onChange={(e) => setAutoHabitFromPhysicalActivity(e.target.checked)}
              className="mt-1 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl min-h-[44px] flex items-center justify-center"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
          >
            {t.rhythm.saveSettings}
          </button>
        </div>
      </div>
    </div>
  );
};
