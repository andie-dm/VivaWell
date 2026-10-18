/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Achievement,
  ActivityPreferences,
  ActivityRecord,
  EngagementPreferences,
  GraceDayRecord,
  HabitAction,
  HabitCompletion,
  Language,
  StreakCalculationResult,
  SupportiveReminderConfig,
  UserProfile,
  WeeklyReflection,
  WellnessResource,
} from '../types/wellness';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_ACTIVITY_PREFERENCES,
  INITIAL_HABITS,
  INITIAL_PREFERENCES,
  INITIAL_PROFILES,
  INITIAL_REMINDERS_CONFIG,
  INITIAL_RESOURCES,
} from '../data/defaultWellnessData';
import { translations } from '../i18n/translations';
import { getLocalDateString, getWeekKey } from '../utils/dateUtils';
import { calculateWellnessStreak } from '../utils/streakEngine';
import { SimulatedActivityAdapter } from '../services/activityAdapter';

interface WellnessContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
  currentProfile: UserProfile;
  profiles: UserProfile[];
  switchProfile: (profileId: string) => void;
  preferences: EngagementPreferences;
  updatePreferences: (partial: Partial<EngagementPreferences>) => void;
  habits: HabitAction[];
  addCustomHabit: (habit: Omit<HabitAction, 'id' | 'isCustom'>) => void;
  completions: HabitCompletion[];
  toggleHabitCompletion: (actionId: string, targetDate?: string) => void;
  undoCompletion: (completionId: string) => void;
  graceDayRecords: GraceDayRecord[];
  claimGraceDay: (dateStr: string) => void;
  activityPreferences: ActivityPreferences;
  updateActivityPreferences: (partial: Partial<ActivityPreferences>) => void;
  activityRecords: ActivityRecord[];
  simulateActivitySync: () => Promise<void>;
  isSyncingActivity: boolean;
  deleteActivityRecords: () => void;
  disconnectActivity: () => void;
  achievements: Achievement[];
  activeCelebration: Achievement | null;
  dismissCelebration: () => void;
  weeklyReflections: WeeklyReflection[];
  addWeeklyReflection: (refData: { moodRating: number; reflectionNote: string; selectedDomains: any[] }) => void;
  remindersConfig: SupportiveReminderConfig;
  updateRemindersConfig: (partial: Partial<SupportiveReminderConfig>) => void;
  resources: WellnessResource[];
  addResource: (res: Omit<WellnessResource, 'id' | 'createdAt'>) => void;
  toggleBookmarkResource: (id: string) => void;
  deleteResource: (id: string) => void;
  streakResult: StreakCalculationResult;
  todayDate: string;
  resetAllData: () => void;
  exportDataJson: () => string;
}

const WellnessContext = createContext<WellnessContextType | null>(null);

const STORAGE_KEY_PREFIX = 'vivawell_v1_';

export const WellnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}lang`);
    return (saved === 'es' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}lang`, lang);
  };

  const t = translations[language];

  // 2. Profiles
  const [profiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}profile_id`) || INITIAL_PROFILES[0].id;
  });

  const currentProfile = useMemo(() => {
    return profiles.find((p) => p.id === currentProfileId) || profiles[0];
  }, [profiles, currentProfileId]);

  const switchProfile = (profileId: string) => {
    setCurrentProfileId(profileId);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile_id`, profileId);
    const target = profiles.find((p) => p.id === profileId);
    if (target?.preferredLanguage) {
      setLanguage(target.preferredLanguage);
    }
  };

  // 3. User Preferences
  const [preferences, setPreferencesState] = useState<EngagementPreferences>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}prefs`);
      return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
    } catch {
      return INITIAL_PREFERENCES;
    }
  });

  const updatePreferences = (partial: Partial<EngagementPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}prefs`, JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Habits List
  const [habits, setHabitsState] = useState<HabitAction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}habits`);
      return saved ? JSON.parse(saved) : INITIAL_HABITS;
    } catch {
      return INITIAL_HABITS;
    }
  });

  const addCustomHabit = (newHabit: Omit<HabitAction, 'id' | 'isCustom'>) => {
    const fullHabit: HabitAction = {
      ...newHabit,
      id: `custom_${Date.now()}`,
      isCustom: true,
    };
    setHabitsState((prev) => {
      const updated = [fullHabit, ...prev];
      localStorage.setItem(`${STORAGE_KEY_PREFIX}habits`, JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Today Date
  const todayDate = useMemo(() => {
    return getLocalDateString(preferences.userTimeZone);
  }, [preferences.userTimeZone]);

  // 6. Habit Completions (seeded with realistic past data)
  const [completions, setCompletionsState] = useState<HabitCompletion[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}completions`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    // Seed data: Mon, Tue, Wed of current week
    const seed: HabitCompletion[] = [
      {
        id: 'seed_comp_1',
        userId: currentProfile.id,
        actionId: 'act_phys_walk',
        domain: 'physical',
        localDate: '2026-10-12',
        timestamp: '2026-10-12T08:30:00Z',
        source: 'manual',
      },
      {
        id: 'seed_comp_2',
        userId: currentProfile.id,
        actionId: 'act_emot_breath',
        domain: 'emotional',
        localDate: '2026-10-13',
        timestamp: '2026-10-13T09:15:00Z',
        source: 'manual',
      },
      {
        id: 'seed_comp_3',
        userId: currentProfile.id,
        actionId: 'act_intel_read',
        domain: 'intellectual',
        localDate: '2026-10-14',
        timestamp: '2026-10-14T20:00:00Z',
        source: 'manual',
      },
      // Previous week consistent days
      {
        id: 'seed_comp_prev_1',
        userId: currentProfile.id,
        actionId: 'act_spir_gratitude',
        domain: 'spiritual',
        localDate: '2026-10-05',
        timestamp: '2026-10-05T07:45:00Z',
        source: 'manual',
      },
      {
        id: 'seed_comp_prev_2',
        userId: currentProfile.id,
        actionId: 'act_soc_connect',
        domain: 'social',
        localDate: '2026-10-06',
        timestamp: '2026-10-06T12:30:00Z',
        source: 'manual',
      },
      {
        id: 'seed_comp_prev_3',
        userId: currentProfile.id,
        actionId: 'act_env_tidy',
        domain: 'environmental',
        localDate: '2026-10-08',
        timestamp: '2026-10-08T17:15:00Z',
        source: 'manual',
      },
      {
        id: 'seed_comp_prev_4',
        userId: currentProfile.id,
        actionId: 'act_occ_priorities',
        domain: 'occupational',
        localDate: '2026-10-09',
        timestamp: '2026-10-09T08:00:00Z',
        source: 'manual',
      },
    ];
    return seed;
  });

  const saveCompletions = (newCompletions: HabitCompletion[]) => {
    setCompletionsState(newCompletions);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}completions`, JSON.stringify(newCompletions));
  };

  // 7. Grace Day Records
  const [graceDayRecords, setGraceDayRecords] = useState<GraceDayRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}grace_days`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const claimGraceDay = (dateStr: string) => {
    const weekKey = getWeekKey(dateStr);
    // Max 1 per calendar week
    const alreadyUsed = graceDayRecords.some((g) => g.weekKey === weekKey);
    if (alreadyUsed) return;

    const newRecord: GraceDayRecord = { weekKey, localDate: dateStr };
    const updated = [...graceDayRecords, newRecord];
    setGraceDayRecords(updated);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}grace_days`, JSON.stringify(updated));
  };

  // 8. Achievements & Badges
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}achievements`);
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const [activeCelebration, setActiveCelebration] = useState<Achievement | null>(null);

  const dismissCelebration = () => {
    setActiveCelebration(null);
  };

  // 9. Activity Preferences and Records
  const [activityPreferences, setActivityPreferencesState] = useState<ActivityPreferences>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}act_prefs`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_PREFERENCES;
    } catch {
      return INITIAL_ACTIVITY_PREFERENCES;
    }
  });

  const updateActivityPreferences = (partial: Partial<ActivityPreferences>) => {
    setActivityPreferencesState((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}act_prefs`, JSON.stringify(updated));
      return updated;
    });
  };

  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}act_records`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Seed initial simulated records for last 7 days
    return [];
  });

  // Seed initial activity records if empty
  useEffect(() => {
    if (activityRecords.length === 0) {
      const adapter = new SimulatedActivityAdapter();
      adapter.fetchActivityRecords('2026-10-08', '2026-10-15', currentProfile.id, true).then((recs) => {
        setActivityRecords(recs);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}act_records`, JSON.stringify(recs));
      });
    }
  }, []);

  const [isSyncingActivity, setIsSyncingActivity] = useState(false);

  const simulateActivitySync = async () => {
    setIsSyncingActivity(true);
    const adapter = new SimulatedActivityAdapter();
    // Simulate slight network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newRecords = await adapter.fetchActivityRecords('2026-10-09', todayDate, currentProfile.id, true);

    setActivityRecords(newRecords);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}act_records`, JSON.stringify(newRecords));

    const syncTime = new Date().toISOString();
    updateActivityPreferences({
      connectionStatus: 'connected',
      lastSyncTime: syncTime,
    });

    // Check if autoHabitFromPhysicalActivity is explicitly enabled
    if (preferences.autoHabitFromPhysicalActivity) {
      // Find today's steps
      const todayStepRecord = newRecords.find((r) => r.localDate === todayDate && r.measurementType === 'steps');
      if (todayStepRecord && todayStepRecord.value >= activityPreferences.dailyStepGoal) {
        // Complete eligible physical habit if not already done today
        const existingToday = completions.find((c) => c.localDate === todayDate && c.domain === 'physical' && !c.isUndone);
        if (!existingToday) {
          const physicalHabit = habits.find((h) => h.domain === 'physical' && h.eligibleForPhysicalSync);
          if (physicalHabit) {
            const newComp: HabitCompletion = {
              id: `auto_${Date.now()}`,
              userId: currentProfile.id,
              actionId: physicalHabit.id,
              domain: 'physical',
              localDate: todayDate,
              timestamp: syncTime,
              source: 'activity_import',
            };
            saveCompletions([...completions, newComp]);
          }
        }
      }
    }

    setIsSyncingActivity(false);
  };

  const deleteActivityRecords = () => {
    setActivityRecords([]);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}act_records`);
  };

  const disconnectActivity = () => {
    updateActivityPreferences({
      connectionStatus: 'not_connected',
    });
  };

  // 10. Weekly Reflections
  const [weeklyReflections, setWeeklyReflections] = useState<WeeklyReflection[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reflections`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addWeeklyReflection = (refData: { moodRating: number; reflectionNote: string; selectedDomains: any[] }) => {
    const newRef: WeeklyReflection = {
      id: `ref_${Date.now()}`,
      userId: currentProfile.id,
      weekKey: getWeekKey(todayDate),
      date: todayDate,
      moodRating: refData.moodRating,
      reflectionNote: refData.reflectionNote,
      selectedDomains: refData.selectedDomains,
      createdAt: new Date().toISOString(),
    };

    const updated = [newRef, ...weeklyReflections];
    setWeeklyReflections(updated);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}reflections`, JSON.stringify(updated));

    // Unlock Mindful Reflection badge
    unlockBadge('weekly_reflection_complete');
  };

  // 11. Supportive Reminders Config
  const [remindersConfig, setRemindersConfig] = useState<SupportiveReminderConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}reminders`);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS_CONFIG;
    } catch {
      return INITIAL_REMINDERS_CONFIG;
    }
  });

  const updateRemindersConfig = (partial: Partial<SupportiveReminderConfig>) => {
    setRemindersConfig((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reminders`, JSON.stringify(updated));
      return updated;
    });
  };

  // 12. Wellness Resources for Each Domain
  const [resources, setResources] = useState<WellnessResource[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}resources`);
      return saved ? JSON.parse(saved) : (INITIAL_RESOURCES as unknown as WellnessResource[]);
    } catch {
      return INITIAL_RESOURCES as unknown as WellnessResource[];
    }
  });

  const addResource = (res: Omit<WellnessResource, 'id' | 'createdAt'>) => {
    const newRes: WellnessResource = {
      ...res,
      id: `res_custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };
    const updated = [newRes, ...resources];
    setResources(updated);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}resources`, JSON.stringify(updated));
  };

  const toggleBookmarkResource = (id: string) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r
    );
    setResources(updated);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}resources`, JSON.stringify(updated));
  };

  const deleteResource = (id: string) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}resources`, JSON.stringify(updated));
  };

  // Helper to unlock badge and trigger celebration if celebrations enabled
  const unlockBadge = (badgeId: Achievement['id']) => {
    setAchievements((prev) => {
      const target = prev.find((a) => a.id === badgeId);
      if (target && !target.earnedAt) {
        const earned = { ...target, earnedAt: new Date().toISOString() };
        const updated = prev.map((a) => (a.id === badgeId ? earned : a));
        localStorage.setItem(`${STORAGE_KEY_PREFIX}achievements`, JSON.stringify(updated));

        if (preferences.celebrationsEnabled && preferences.streakVisibility) {
          setActiveCelebration(earned);
        }
        return updated;
      }
      return prev;
    });
  };

  // 12. Toggle Habit Completion (with undo support)
  const toggleHabitCompletion = (actionId: string, targetDate: string = todayDate) => {
    const habit = habits.find((h) => h.id === actionId);
    if (!habit) return;

    // Check if there is already an active completion for this habit on this date
    const existingIndex = completions.findIndex(
      (c) => c.actionId === actionId && c.localDate === targetDate && !c.isUndone
    );

    if (existingIndex >= 0) {
      // Toggle off / mark as undone
      const updated = [...completions];
      updated[existingIndex] = { ...updated[existingIndex], isUndone: true };
      saveCompletions(updated);
    } else {
      // Create new completion
      const newCompletion: HabitCompletion = {
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: currentProfile.id,
        actionId,
        domain: habit.domain,
        localDate: targetDate,
        timestamp: new Date().toISOString(),
        source: 'manual',
      };
      const updated = [...completions, newCompletion];
      saveCompletions(updated);

      // Check first action achievement
      unlockBadge('first_action');
    }
  };

  const undoCompletion = (completionId: string) => {
    const updated = completions.map((c) => (c.id === completionId ? { ...c, isUndone: true } : c));
    saveCompletions(updated);
  };

  // 13. Dynamic Streak Calculation (derived purely from completion history)
  const streakResult = useMemo(() => {
    return calculateWellnessStreak({
      completions,
      preferences,
      graceDayRecords,
      todayDate,
      lang: language,
    });
  }, [completions, preferences, graceDayRecords, todayDate, language]);

  // Check week-based achievements
  useEffect(() => {
    if (streakResult.currentStreak >= 1 && streakResult.streakUnit === 'weeks') {
      unlockBadge('first_week_goal');
    }
    if (streakResult.currentStreak >= 3 && streakResult.streakUnit === 'weeks') {
      unlockBadge('three_consistent_weeks');
    }
  }, [streakResult.currentStreak, streakResult.streakUnit]);

  // 14. Reset Data (for testing demo states)
  const resetAllData = () => {
    localStorage.clear();
    setCompletionsState([]);
    setGraceDayRecords([]);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setPreferencesState(INITIAL_PREFERENCES);
    setActivityPreferencesState(INITIAL_ACTIVITY_PREFERENCES);
    setActivityRecords([]);
    setWeeklyReflections([]);
    setRemindersConfig(INITIAL_REMINDERS_CONFIG);
    setResources(INITIAL_RESOURCES as unknown as WellnessResource[]);
  };

  const exportDataJson = () => {
    return JSON.stringify(
      {
        profile: currentProfile,
        preferences,
        habits,
        completions,
        graceDayRecords,
        achievements,
        activityRecords,
        weeklyReflections,
        resources,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  };

  return (
    <WellnessContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentProfile,
        profiles,
        switchProfile,
        preferences,
        updatePreferences,
        habits,
        addCustomHabit,
        completions,
        toggleHabitCompletion,
        undoCompletion,
        graceDayRecords,
        claimGraceDay,
        activityPreferences,
        updateActivityPreferences,
        activityRecords,
        simulateActivitySync,
        isSyncingActivity,
        deleteActivityRecords,
        disconnectActivity,
        achievements,
        activeCelebration,
        dismissCelebration,
        weeklyReflections,
        addWeeklyReflection,
        remindersConfig,
        updateRemindersConfig,
        resources,
        addResource,
        toggleBookmarkResource,
        deleteResource,
        streakResult,
        todayDate,
        resetAllData,
        exportDataJson,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
