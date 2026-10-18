/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWellness } from '../context/WellnessContext';
import {
  Footprints,
  Timer,
  Flame,
  RefreshCw,
  Eye,
  EyeOff,
  Trash2,
  Unplug,
  Info,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { deduplicateActivityRecords } from '../services/activityAdapter';
import { getShortDayName, getWeekDates } from '../utils/dateUtils';

interface ActivityDashboardProps {
  onOpenArchModal: () => void;
  onOpenSimulator?: () => void;
}

export const ActivityDashboard: React.FC<ActivityDashboardProps> = ({
  onOpenArchModal,
  onOpenSimulator,
}) => {
  const {
    activityPreferences,
    updateActivityPreferences,
    activityRecords,
    simulateActivitySync,
    isSyncingActivity,
    deleteActivityRecords,
    disconnectActivity,
    todayDate,
    t,
    language,
  } = useWellness();

  const {
    showActiveEnergy,
    connectionStatus,
    lastSyncTime,
    dailyStepGoal,
    dailyMovementGoalMinutes,
    primarySource,
  } = activityPreferences;

  // Deduplicate records map
  const dailyMap = deduplicateActivityRecords(activityRecords, primarySource);

  // Today's stats
  const todayStats = dailyMap.get(todayDate);
  const stepsToday = todayStats?.steps;
  const minutesToday = todayStats?.minutes;
  const energyToday = todayStats?.activeEnergy;

  // 7-day trend dates
  const weekDates = getWeekDates(todayDate);

  const toggleShowEnergy = () => {
    updateActivityPreferences({ showActiveEnergy: !showActiveEnergy });
  };

  const formattedLastSync = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : t.activity.neverSynced;

  return (
    <section className="space-y-5">
      {/* Header & Simulated Sync Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
            {t.activity.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
            {t.activity.subtitle}
          </p>
        </div>

        {/* Working Simulate Sync Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={simulateActivitySync}
            disabled={isSyncingActivity}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white hover:from-sky-600 hover:to-blue-800 disabled:opacity-60 transition-colors flex items-center gap-2 shadow-xs shrink-0 min-h-[44px]"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingActivity ? 'animate-spin' : ''}`} />
            <span>{isSyncingActivity ? t.activity.simulating : t.activity.simulateSyncButton}</span>
          </button>
        </div>
      </div>

      {/* Movement goals optional reminder (Pure White Card Surface) */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5 shadow-2xs">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{t.activity.bannerNote}</span>
      </div>

      {/* Connection & Status Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                {t.activity.dataSource}:
              </span>
              <span className="text-xs text-stone-700 font-medium">
                {primarySource === 'manual_sim'
                  ? (language === 'es' ? 'Simulador Móvil (Ficticio para Demo)' : 'Mobile Simulator (Demo Fictional)')
                  : primarySource}
              </span>
            </div>
            <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-1.5">
              <span>{t.activity.lastSynced}:</span>
              <span className="tabular-nums font-mono text-stone-700 font-medium">{formattedLastSync}</span>
              <span>·</span>
              <span className="font-semibold text-blue-700">
                {t.activity.connectionStatusLabels[connectionStatus]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenSimulator && (
            <button
              onClick={onOpenSimulator}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'es' ? 'Simular Integración' : 'Simulate Integration'}</span>
            </button>
          )}
          <button
            onClick={onOpenArchModal}
            className="text-xs text-stone-500 hover:text-stone-800 underline font-medium p-1 min-h-[44px] flex items-center"
          >
            {t.activity.archModalTrigger}
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid (Clean White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Metric 1: Daily Steps */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Footprints className="w-4 h-4 text-blue-600 shrink-0" />
              {t.activity.stepsTitle}
            </span>
            <span className="text-[11px] text-stone-400">
              {language === 'es' ? `Meta: ${dailyStepGoal.toLocaleString()}` : `Goal: ${dailyStepGoal.toLocaleString()}`}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            {stepsToday !== undefined ? (
              <>
                <span className="text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
                  {stepsToday.toLocaleString()}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {t.activity.stepsUnit}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-stone-400 italic">
                {t.activity.connectionStatusLabels.data_unavailable}
              </span>
            )}
          </div>

          {/* Simple progress bar */}
          {stepsToday !== undefined && (
            <div className="mt-4">
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((stepsToday / dailyStepGoal) * 100))}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-stone-500 font-medium">
                <span>{Math.round((stepsToday / dailyStepGoal) * 100)}%</span>
                <span>{dailyStepGoal.toLocaleString()} {t.activity.stepsUnit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Metric 2: Active Movement Minutes */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-blue-600 shrink-0" />
              {t.activity.movementTitle}
            </span>
            <span className="text-[11px] text-stone-400">
              {language === 'es' ? `Meta: ${dailyMovementGoalMinutes}m` : `Goal: ${dailyMovementGoalMinutes}m`}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            {minutesToday !== undefined ? (
              <>
                <span className="text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
                  {minutesToday}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {t.activity.movementUnit}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-stone-400 italic">
                {t.activity.connectionStatusLabels.data_unavailable}
              </span>
            )}
          </div>

          {minutesToday !== undefined && (
            <div className="mt-4">
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((minutesToday / dailyMovementGoalMinutes) * 100))}%` }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-stone-500 font-medium">
                <span>{Math.round((minutesToday / dailyMovementGoalMinutes) * 100)}%</span>
                <span>{dailyMovementGoalMinutes} {t.activity.movementUnit}</span>
              </div>
            </div>
          )}
        </div>

        {/* Metric 3: Estimated Active Energy (Hidden by default, strictly optional) */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-600 shrink-0" />
              {t.activity.activeEnergyTitle}
            </span>
            <button
              onClick={toggleShowEnergy}
              className="text-stone-500 hover:text-stone-800 p-1.5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={showActiveEnergy ? t.activity.hideEnergyToggle : t.activity.showEnergyToggle}
              aria-label={showActiveEnergy ? t.activity.hideEnergyToggle : t.activity.showEnergyToggle}
            >
              {showActiveEnergy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {showActiveEnergy ? (
            <div>
              <div className="flex items-baseline gap-2 mt-1">
                {energyToday !== undefined ? (
                  <>
                    <span className="text-3xl font-bold tracking-tight text-stone-900 tabular-nums">
                      {energyToday}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      {t.activity.activeEnergyUnit}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-stone-400 italic">
                    {t.activity.connectionStatusLabels.data_unavailable}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {t.activity.activeEnergySubtitle}
              </p>
            </div>
          ) : (
            <div className="py-2 text-center">
              <p className="text-xs text-stone-500 mb-2 leading-relaxed">
                {language === 'es'
                  ? 'Oculto por defecto para protegerte de presiones alimentarias.'
                  : 'Hidden by default to protect against dietary and calorie pressure.'}
              </p>
              <button
                onClick={toggleShowEnergy}
                className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors min-h-[44px]"
              >
                {t.activity.showEnergyToggle}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Trend Chart & Accessible Text Summary */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
            {t.activity.weeklyTrendTitle}
          </h3>
          <span className="text-xs text-stone-500">
            {t.activity.missingDataNote}
          </span>
        </div>

        {/* Visual Bar chart */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3 pt-2">
          {weekDates.map((dateStr) => {
            const data = dailyMap.get(dateStr);
            const steps = data?.steps;
            const isToday = dateStr === todayDate;
            const dayName = getShortDayName(new Date(dateStr + 'T12:00:00Z').getDay(), language);
            const heightPercent = steps !== undefined ? Math.min(100, Math.round((steps / dailyStepGoal) * 100)) : 0;

            return (
              <div key={dateStr} className="flex flex-col items-center">
                <div
                  className="w-full h-32 bg-stone-50 rounded-xl flex flex-col justify-end p-1 relative border border-stone-200"
                  aria-label={`${dayName}: ${steps !== undefined ? `${steps} steps` : 'no data'}`}
                >
                  {steps !== undefined ? (
                    <div
                      className={`w-full rounded-lg transition-all duration-300 ${
                        isToday ? 'bg-gradient-to-t from-blue-700 to-blue-500' : 'bg-sky-400 hover:bg-sky-500'
                      }`}
                      style={{ height: `${Math.max(12, heightPercent)}%` }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-[10px] text-stone-400 -rotate-90 select-none">
                        N/A
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <span className={`text-[11px] font-semibold block ${isToday ? 'text-blue-700 font-bold' : 'text-stone-700'}`}>
                    {dayName}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-stone-500">
                    {steps !== undefined ? `${(steps / 1000).toFixed(1)}k` : '—'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accessible Text Summary for Screen Readers & Mobile Scanning */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800">
              {language === 'es' ? 'Resumen Accesible de Actividad' : 'Accessible Activity Summary'}
            </span>
            <span className="text-[11px] text-stone-400">
              {language === 'es' ? 'Detalle diario' : 'Daily breakdown'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                  <th className="py-2 px-2 font-semibold">{language === 'es' ? 'Día' : 'Day'}</th>
                  <th className="py-2 px-2 font-semibold">{t.activity.stepsTitle}</th>
                  <th className="py-2 px-2 font-semibold">{t.activity.movementTitle}</th>
                  <th className="py-2 px-2 font-semibold">{language === 'es' ? 'Meta' : 'Goal'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {weekDates.map((dateStr) => {
                  const data = dailyMap.get(dateStr);
                  const isToday = dateStr === todayDate;
                  const dayName = getShortDayName(new Date(dateStr + 'T12:00:00Z').getDay(), language);
                  const steps = data?.steps;
                  const minutes = data?.minutes;
                  const metGoal = steps !== undefined && steps >= dailyStepGoal;

                  return (
                    <tr key={dateStr} className={isToday ? 'bg-blue-50/50 font-semibold' : ''}>
                      <td className="py-2 px-2">
                        <span>{dayName}</span>
                        {isToday && (
                          <span className="ml-1 text-[10px] text-blue-700">({language === 'es' ? 'Hoy' : 'Today'})</span>
                        )}
                      </td>
                      <td className="py-2 px-2 font-mono tabular-nums">
                        {steps !== undefined ? steps.toLocaleString() : '—'}
                      </td>
                      <td className="py-2 px-2 font-mono tabular-nums">
                        {minutes !== undefined ? `${minutes}m` : '—'}
                      </td>
                      <td className="py-2 px-2">
                        {metGoal ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {language === 'es' ? 'Alcanzada' : 'Achieved'}
                          </span>
                        ) : steps !== undefined ? (
                          <span className="text-[11px] text-stone-500">
                            {Math.round((steps / dailyStepGoal) * 100)}%
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Privacy and Control Section (Pure White Surface) */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            {t.activity.privacyTitle}
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
            {t.activity.privacyText}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={deleteActivityRecords}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.activity.deleteRecordsButton}</span>
          </button>
          <button
            onClick={disconnectActivity}
            className="px-3.5 py-2 text-xs font-semibold text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px]"
          >
            <Unplug className="w-4 h-4" />
            <span>{t.activity.disconnectButton}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
