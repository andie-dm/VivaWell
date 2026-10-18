/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { generateSimulatedNotifications } from '../services/reminderService';
import {
  X,
  Bell,
  Moon,
  Clock,
  Check,
  Shield,
  Send,
  Sparkles,
} from 'lucide-react';

interface SupportiveRemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportiveRemindersModal: React.FC<SupportiveRemindersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    t,
    language,
    remindersConfig,
    updateRemindersConfig,
  } = useWellness();

  const [enabled, setEnabled] = useState(remindersConfig.enabled);
  const [quietHoursStart, setQuietHoursStart] = useState(remindersConfig.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(remindersConfig.quietHoursEnd);
  const [maxDaily, setMaxDaily] = useState(remindersConfig.maxDailyNotifications);
  const [preActivity, setPreActivity] = useState(remindersConfig.preActivityReminder);
  const [weeklyReflection, setWeeklyReflection] = useState(remindersConfig.weeklyReflectionReminder);
  const [gentleReturn, setGentleReturn] = useState(remindersConfig.gentleReturnReminder);

  if (!isOpen) return null;

  const handleSave = () => {
    updateRemindersConfig({
      enabled,
      quietHoursStart,
      quietHoursEnd,
      maxDailyNotifications: maxDaily,
      preActivityReminder: preActivity,
      weeklyReflectionReminder: weeklyReflection,
      gentleReturnReminder: gentleReturn,
    });
    onClose();
  };

  const simulatedStream = generateSimulatedNotifications(
    {
      enabled,
      quietHoursStart,
      quietHoursEnd,
      maxDailyNotifications: maxDaily,
      preActivityReminder: preActivity,
      weeklyReflectionReminder: weeklyReflection,
      gentleReturnReminder: gentleReturn,
      frequency: 'gentle',
    },
    language
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {t.reminders.title}
              </h3>
              <p className="text-xs text-stone-500">
                {t.reminders.subtitle}
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
            <div>
              <span className="font-semibold text-stone-900 block text-xs">
                {t.reminders.enableReminders}
              </span>
              <span className="text-[11px] text-stone-500">
                {language === 'es' ? 'Notificaciones respetuosas y tranquilas' : 'Quiet, respectful push notifications'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
          </div>

          {/* Quiet Hours */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-stone-900">
              <Moon className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold">{t.reminders.quietHoursTitle}</span>
            </div>
            <p className="text-xs text-stone-500">
              {t.reminders.quietHoursDesc}
            </p>
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {language === 'es' ? 'Desde las' : 'From'}
                </label>
                <input
                  type="time"
                  value={quietHoursStart}
                  onChange={(e) => setQuietHoursStart(e.target.value)}
                  className="py-1.5 px-2.5 text-xs rounded-lg border border-stone-200 bg-stone-50 font-mono"
                />
              </div>
              <span className="text-stone-400 mt-4">—</span>
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  {language === 'es' ? 'Hasta las' : 'Until'}
                </label>
                <input
                  type="time"
                  value={quietHoursEnd}
                  onChange={(e) => setQuietHoursEnd(e.target.value)}
                  className="py-1.5 px-2.5 text-xs rounded-lg border border-stone-200 bg-stone-50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Max Daily Limit */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-stone-700">
                {t.reminders.maxDailyLabel}
              </label>
              <span className="text-xs font-bold text-stone-900 tabular-nums">
                {maxDaily} / {language === 'es' ? 'día' : 'day'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              value={maxDaily}
              onChange={(e) => setMaxDaily(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Reminder Types Checklist */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-stone-700">
              {language === 'es' ? 'Tipos de recordatorio deseados:' : 'Choose which gentle nudges to receive:'}
            </label>

            <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={preActivity}
                onChange={(e) => setPreActivity(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <span>{t.reminders.options.preActivity}</span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={weeklyReflection}
                onChange={(e) => setWeeklyReflection(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <span>{t.reminders.options.weeklyReflection}</span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={gentleReturn}
                onChange={(e) => setGentleReturn(e.target.checked)}
                className="mt-0.5 rounded text-blue-600"
              />
              <span>{t.reminders.options.gentleReturn}</span>
            </label>
          </div>

          {/* Simulated Notification Stream Preview */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-stone-700 block mb-2">
              {t.reminders.previewTitle}
            </span>
            <div className="space-y-2">
              {simulatedStream.map((notif) => {
                const title = language === 'es' ? notif.titleEs : notif.titleEn;
                const body = language === 'es' ? notif.bodyEs : notif.bodyEn;

                return (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl border border-stone-200 bg-stone-50/70 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                      <span className="font-semibold text-stone-700">{title}</span>
                      <span className="font-mono tabular-nums">{notif.scheduledTime}</span>
                    </div>
                    <p className="text-stone-600 text-xs">{body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-xl min-h-[44px] flex items-center justify-center"
          >
            {language === 'es' ? 'Cerrar' : 'Close'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-xl shadow-xs transition-colors min-h-[44px] flex items-center justify-center"
          >
            {t.reminders.savePreferences}
          </button>
        </div>
      </div>
    </div>
  );
};
