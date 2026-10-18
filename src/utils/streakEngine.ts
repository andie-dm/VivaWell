/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EngagementPreferences,
  GraceDayRecord,
  HabitCompletion,
  StreakCalculationResult,
  DayCalendarInfo,
  DayStatus,
  Language,
} from '../types/wellness';
import {
  addDays,
  compareDates,
  diffDays,
  getDayOfWeek,
  getLocalDateString,
  getShortDayName,
  getWeekDates,
  getWeekKey,
  parseLocalDate,
} from './dateUtils';

interface CalculateStreakParams {
  completions: HabitCompletion[];
  preferences: EngagementPreferences;
  graceDayRecords: GraceDayRecord[];
  todayDate: string; // YYYY-MM-DD
  lang: Language;
}

/**
 * Derives user's wellness streak and weekly status purely from habit completion history.
 * Does not rely on a naive incrementing counter.
 */
export function calculateWellnessStreak({
  completions,
  preferences,
  graceDayRecords,
  todayDate,
  lang,
}: CalculateStreakParams): StreakCalculationResult {
  const {
    scheduleType,
    targetFrequency,
    scheduledDays,
    restDays,
    isPaused,
    graceDayPreference,
  } = preferences;

  // Filter valid, non-undone completions
  const validCompletions = completions.filter((c) => !c.isUndone);

  // Group completions by localDate (one day counts at most once)
  const completionsByDate = new Map<string, HabitCompletion[]>();
  for (const comp of validCompletions) {
    const list = completionsByDate.get(comp.localDate) || [];
    list.push(comp);
    completionsByDate.set(comp.localDate, list);
  }

  // Grace days mapped by date
  const graceDaysByDate = new Set(graceDayRecords.map((g) => g.localDate));

  // Determine weekly calendar for the current week (Monday through Sunday)
  const currentWeekDates = getWeekDates(todayDate);
  const currentWeekKey = getWeekKey(todayDate);
  const graceDaysUsedThisWeek = graceDayRecords.filter((g) => g.weekKey === currentWeekKey).length;

  let completedDaysThisWeek = 0;
  let plannedDaysThisWeek = 0;

  const weeklyCalendar: DayCalendarInfo[] = currentWeekDates.map((dateStr) => {
    const dayOfWeek = getDayOfWeek(dateStr);
    const dateCompletions = completionsByDate.get(dateStr) || [];
    const isToday = dateStr === todayDate;
    const isPast = compareDates(dateStr, todayDate) < 0;
    const isFuture = compareDates(dateStr, todayDate) > 0;
    const isRestDay = restDays.includes(dayOfWeek);
    const isGrace = graceDaysByDate.has(dateStr);
    const hasCompleted = dateCompletions.length > 0;

    // Is this day planned according to scheduleType?
    let isPlanned = false;
    if (scheduleType === 'daily') {
      isPlanned = !isRestDay;
    } else if (scheduleType === 'scheduled_days') {
      isPlanned = scheduledDays.includes(dayOfWeek) && !isRestDay;
    } else {
      // weekly_frequency: all non-rest days are potential action days
      isPlanned = !isRestDay;
    }

    if (isPlanned && !isFuture) {
      plannedDaysThisWeek++;
    }
    if (hasCompleted) {
      completedDaysThisWeek++;
    }

    let status: DayStatus = 'unplanned';
    if (hasCompleted) {
      status = 'completed';
    } else if (isGrace) {
      status = 'grace_day';
    } else if (isRestDay) {
      status = 'rest_day';
    } else if (isFuture) {
      status = isPlanned ? 'planned' : 'future';
    } else if (isToday) {
      status = isPlanned ? 'planned' : 'unplanned';
    } else if (isPast) {
      status = isPlanned ? 'missed' : 'unplanned';
    }

    const domainIds = Array.from(new Set(dateCompletions.map((c) => c.domain)));

    return {
      date: dateStr,
      dayOfWeek,
      dayNameShort: getShortDayName(dayOfWeek, lang),
      isToday,
      status,
      completionsCount: dateCompletions.length,
      domainIds,
      isRestDay,
      isGraceDay: isGrace,
    };
  });

  // Calculate Streak based on Schedule Type:
  // 1. Weekly Frequency: streak is counted in consecutive WEEKS
  // 2. Daily / Scheduled Days: streak is counted in qualifying DAYS (where scheduled rest days do not break streak)
  let currentStreak = 0;
  let personalBest = 0;
  let totalActiveWeeks = 0;
  let isMissedGoal = false;
  const streakUnit: 'days' | 'weeks' = scheduleType === 'weekly_frequency' ? 'weeks' : 'days';

  if (scheduleType === 'weekly_frequency') {
    // Collect all unique week keys in reverse order from today back to earliest completion
    const weekStats = computeWeeklyFrequencyHistory(
      completionsByDate,
      graceDaysByDate,
      todayDate,
      targetFrequency,
      restDays
    );

    totalActiveWeeks = weekStats.totalMetWeeks;
    currentStreak = weekStats.currentConsecutiveWeeks;
    personalBest = weekStats.bestConsecutiveWeeks;
    isMissedGoal = weekStats.isMissedGoal;
  } else {
    // 'daily' or 'scheduled_days'
    const dayStats = computeScheduledDaysHistory(
      completionsByDate,
      graceDaysByDate,
      todayDate,
      scheduleType,
      scheduledDays,
      restDays,
      graceDayPreference
    );

    currentStreak = dayStats.currentStreak;
    personalBest = dayStats.personalBest;
    totalActiveWeeks = dayStats.totalActiveWeeks;
    isMissedGoal = dayStats.isMissedGoal;
  }

  // Generate clear explanation
  const streakExplanation =
    lang === 'es'
      ? scheduleType === 'weekly_frequency'
        ? `Meta: ${targetFrequency} días por semana. Cada día con al menos 1 acción de bienestar cuenta para la semana.`
        : scheduleType === 'scheduled_days'
          ? `Meta: Días seleccionados (${scheduledDays.length} días/sem). Los días de descanso no rompen la racha.`
          : 'Meta: Cada día. Completar al menos 1 acción de bienestar en cualquier dominio mantiene tu ritmo.'
      : scheduleType === 'weekly_frequency'
        ? `Goal: ${targetFrequency} days per week. Any day with at least 1 completed wellness action qualifies.`
        : scheduleType === 'scheduled_days'
          ? `Goal: Scheduled days (${scheduledDays.length} days/wk). Scheduled rest days do not break your streak.`
          : 'Goal: Daily consistency. Completing at least 1 action in any wellness domain sustains your rhythm.';

  return {
    currentStreak: isPaused ? Math.max(0, currentStreak) : currentStreak,
    personalBest: Math.max(personalBest, currentStreak),
    streakUnit,
    weeklyCalendar,
    completedDaysThisWeek,
    plannedDaysThisWeek: scheduleType === 'weekly_frequency' ? targetFrequency : plannedDaysThisWeek,
    totalActiveWeeks,
    isMissedGoal: isMissedGoal && !isPaused,
    graceDaysUsedThisWeek,
    isPaused,
    streakExplanation,
  };
}

/**
 * Computes weekly frequency streak (e.g. 3 days per week)
 */
function computeWeeklyFrequencyHistory(
  completionsByDate: Map<string, HabitCompletion[]>,
  graceDaysByDate: Set<string>,
  todayDate: string,
  targetFrequency: number,
  restDays: number[]
) {
  // Find date range
  let earliestDate = todayDate;
  completionsByDate.forEach((_, date) => {
    if (compareDates(date, earliestDate) < 0) {
      earliestDate = date;
    }
  });

  const startMonday = getWeekDates(earliestDate)[0];
  const currentWeekMonday = getWeekDates(todayDate)[0];

  let currentMonday = startMonday;
  const weeklyResults: { weekKey: string; met: boolean; completedDays: number; isCurrentWeek: boolean }[] = [];

  while (compareDates(currentMonday, currentWeekMonday) <= 0) {
    const weekDates = getWeekDates(currentMonday);
    const weekKey = getWeekKey(currentMonday);
    const isCurrentWeek = currentMonday === currentWeekMonday;

    let activeDaysCount = 0;
    for (const d of weekDates) {
      const hasAction = (completionsByDate.get(d) || []).length > 0;
      const hasGrace = graceDaysByDate.has(d);
      if (hasAction || hasGrace) {
        activeDaysCount++;
      }
    }

    const met = activeDaysCount >= targetFrequency;
    weeklyResults.push({ weekKey, met, completedDays: activeDaysCount, isCurrentWeek });
    currentMonday = addDays(currentMonday, 7);
  }

  let totalMetWeeks = 0;
  let bestConsecutiveWeeks = 0;
  let runningConsecutive = 0;

  for (const w of weeklyResults) {
    if (w.met) {
      totalMetWeeks++;
      runningConsecutive++;
      if (runningConsecutive > bestConsecutiveWeeks) {
        bestConsecutiveWeeks = runningConsecutive;
      }
    } else if (!w.isCurrentWeek) {
      runningConsecutive = 0;
    }
  }

  // Current streak (looking backwards from last completed week or current week if already met)
  let currentConsecutiveWeeks = 0;
  let isMissedGoal = false;

  const currentWeek = weeklyResults[weeklyResults.length - 1];
  const previousWeek = weeklyResults.length > 1 ? weeklyResults[weeklyResults.length - 2] : null;

  if (currentWeek?.met) {
    // Current week has already reached target!
    currentConsecutiveWeeks = 1;
    for (let i = weeklyResults.length - 2; i >= 0; i--) {
      if (weeklyResults[i].met) {
        currentConsecutiveWeeks++;
      } else {
        break;
      }
    }
  } else if (previousWeek) {
    // Current week is in progress. Streak is inherited from previous weeks unless previous week missed.
    if (previousWeek.met) {
      currentConsecutiveWeeks = 0;
      for (let i = weeklyResults.length - 2; i >= 0; i--) {
        if (weeklyResults[i].met) {
          currentConsecutiveWeeks++;
        } else {
          break;
        }
      }
    } else {
      isMissedGoal = true;
    }
  }

  return {
    totalMetWeeks,
    currentConsecutiveWeeks,
    bestConsecutiveWeeks,
    isMissedGoal,
  };
}

/**
 * Computes scheduled days history (daily or chosen days of week)
 */
function computeScheduledDaysHistory(
  completionsByDate: Map<string, HabitCompletion[]>,
  graceDaysByDate: Set<string>,
  todayDate: string,
  scheduleType: 'daily' | 'scheduled_days',
  scheduledDays: number[],
  restDays: number[],
  graceDayPreference: boolean
) {
  let earliestDate = todayDate;
  completionsByDate.forEach((_, date) => {
    if (compareDates(date, earliestDate) < 0) {
      earliestDate = date;
    }
  });

  // Calculate day-by-day starting from earliestDate up to todayDate
  let currentStreak = 0;
  let personalBest = 0;
  let runningStreak = 0;
  let totalActiveDays = 0;
  let isMissedGoal = false;

  const activeDates = new Set<string>();
  completionsByDate.forEach((list, date) => {
    if (list.length > 0) activeDates.add(date);
  });

  // Check from today going backwards
  let checkDate = todayDate;
  let breakFound = false;
  const todayDayOfWeek = getDayOfWeek(todayDate);
  const todayIsRest = restDays.includes(todayDayOfWeek);
  const todayIsScheduled = scheduleType === 'daily' ? !todayIsRest : scheduledDays.includes(todayDayOfWeek) && !todayIsRest;
  const todayCompleted = (completionsByDate.get(todayDate) || []).length > 0;

  // If today is scheduled and completed, count today in current streak
  if (todayCompleted) {
    currentStreak++;
    checkDate = addDays(todayDate, -1);
  } else if (!todayIsScheduled || todayIsRest) {
    // Today is rest day; start scanning from yesterday without penalty
    checkDate = addDays(todayDate, -1);
  } else {
    // Today is scheduled but not completed yet. It's not missed yet if day is ongoing!
    checkDate = addDays(todayDate, -1);
  }

  // Scan backwards up to 365 days
  let daysScanned = 0;
  while (daysScanned < 365) {
    daysScanned++;
    const dow = getDayOfWeek(checkDate);
    const isRest = restDays.includes(dow);
    const isScheduled = scheduleType === 'daily' ? !isRest : scheduledDays.includes(dow) && !isRest;
    const completed = (completionsByDate.get(checkDate) || []).length > 0;
    const isGrace = graceDaysByDate.has(checkDate);

    if (completed) {
      currentStreak++;
    } else if (isGrace) {
      // Grace day preserves streak, doesn't increment count as action
      // Continue without break
    } else if (isRest || !isScheduled) {
      // Rest or unscheduled day does not break streak
      // Continue
    } else {
      // Scheduled day missed!
      if (!breakFound) {
        // Did user miss yesterday?
        if (diffDays(checkDate, todayDate) <= 2) {
          isMissedGoal = true;
        }
        breakFound = true;
      }
      break;
    }

    checkDate = addDays(checkDate, -1);
  }

  // Compute personal best by scanning forward from earliest date to today
  let scanForwardDate = earliestDate;
  let best = 0;
  let curRun = 0;

  while (compareDates(scanForwardDate, todayDate) <= 0) {
    const dow = getDayOfWeek(scanForwardDate);
    const isRest = restDays.includes(dow);
    const isScheduled = scheduleType === 'daily' ? !isRest : scheduledDays.includes(dow) && !isRest;
    const completed = (completionsByDate.get(scanForwardDate) || []).length > 0;
    const isGrace = graceDaysByDate.has(scanForwardDate);

    if (completed) {
      curRun++;
      if (curRun > best) best = curRun;
    } else if (isGrace || isRest || !isScheduled) {
      // Continue
    } else {
      curRun = 0;
    }
    scanForwardDate = addDays(scanForwardDate, 1);
  }

  personalBest = Math.max(best, currentStreak);

  // Approximate total active weeks (weeks with >= 1 completion)
  const activeWeeks = new Set<string>();
  activeDates.forEach((d) => activeWeeks.add(getWeekKey(d)));

  return {
    currentStreak,
    personalBest,
    totalActiveWeeks: activeWeeks.size,
    isMissedGoal,
  };
}
