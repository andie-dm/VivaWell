/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'es';

export type WellnessDomainId =
  | 'physical'
  | 'emotional'
  | 'intellectual'
  | 'social'
  | 'spiritual'
  | 'environmental'
  | 'occupational'
  | 'financial';

export interface WellnessDomain {
  id: WellnessDomainId;
  nameEn: string;
  nameEs: string;
  taglineEn: string;
  taglineEs: string;
  iconName: string;
  accentColor: string;
  surfaceColor: string;
  textColor: string;
  colorLabelEn?: string;
  colorLabelEs?: string;
}

export interface HabitAction {
  id: string;
  domain: WellnessDomainId;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  durationMinutes?: number;
  eligibleForPhysicalSync?: boolean;
  isCustom?: boolean;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  actionId: string;
  domain: WellnessDomainId;
  localDate: string; // YYYY-MM-DD in user's time zone
  timestamp: string; // ISO 8601 string
  isUndone?: boolean;
  source: 'manual' | 'activity_import';
}

export type ScheduleType = 'daily' | 'scheduled_days' | 'weekly_frequency';

export interface EngagementPreferences {
  scheduleType: ScheduleType;
  targetFrequency: number; // e.g., 3, 4, 5 days per week (used for weekly_frequency)
  scheduledDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat (used for scheduled_days)
  restDays: number[]; // Scheduled rest days (0-6)
  isPaused: boolean;
  pauseReason?: string;
  graceDayPreference: boolean; // Optional 1 grace day per calendar week for unexpectedly missed day
  streakVisibility: boolean; // Can hide streaks and celebrations while keeping progress tracking
  celebrationsEnabled: boolean;
  userTimeZone: string;
  autoHabitFromPhysicalActivity: boolean; // Requires explicit opt-in
}

export interface GraceDayRecord {
  weekKey: string; // e.g. "2026-W42"
  localDate: string; // "2026-10-14"
}

export type DayStatus =
  | 'completed'
  | 'rest_day'
  | 'grace_day'
  | 'planned'
  | 'missed'
  | 'unplanned'
  | 'future';

export interface DayCalendarInfo {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  dayNameShort: string;
  isToday: boolean;
  status: DayStatus;
  completionsCount: number;
  domainIds: WellnessDomainId[];
  isRestDay: boolean;
  isGraceDay: boolean;
}

export interface StreakCalculationResult {
  currentStreak: number;
  personalBest: number;
  streakUnit: 'days' | 'weeks';
  weeklyCalendar: DayCalendarInfo[];
  completedDaysThisWeek: number;
  plannedDaysThisWeek: number;
  totalActiveWeeks: number;
  isMissedGoal: boolean;
  graceDaysUsedThisWeek: number;
  isPaused: boolean;
  streakExplanation: string;
}

export type ActivityMeasurementType = 'steps' | 'active_minutes' | 'active_energy';

export type ActivitySource =
  | 'apple_health'
  | 'health_connect'
  | 'garmin'
  | 'fitbit'
  | 'manual_sim';

export type SyncStatus =
  | 'not_connected'
  | 'permission_needed'
  | 'connected'
  | 'sync_delayed'
  | 'data_unavailable';

export interface ActivityRecord {
  id: string;
  userId: string;
  source: ActivitySource;
  sourceRecordId: string;
  measurementType: ActivityMeasurementType;
  unit: string; // 'steps', 'minutes', 'kcal'
  startTime: string;
  endTime: string;
  value: number;
  syncTime: string;
  localDate: string; // YYYY-MM-DD
}

export interface ActivityPreferences {
  isTrackingEnabled: boolean;
  showActiveEnergy: boolean; // Optional and hidden by default
  primarySource: ActivitySource;
  connectionStatus: SyncStatus;
  lastSyncTime?: string;
  dailyStepGoal: number;
  dailyMovementGoalMinutes: number;
}

export type AchievementId =
  | 'first_action'
  | 'first_week_goal'
  | 'three_consistent_weeks'
  | 'returned_after_break'
  | 'weekly_reflection_complete';

export interface Achievement {
  id: AchievementId;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  iconName: string;
  earnedAt?: string;
}

export interface SupportiveReminderConfig {
  enabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "08:00"
  maxDailyNotifications: number; // e.g. 2
  preActivityReminder: boolean;
  weeklyReflectionReminder: boolean;
  gentleReturnReminder: boolean;
  frequency: 'gentle' | 'minimal';
}

export interface WeeklyReflection {
  id: string;
  userId: string;
  weekKey: string;
  date: string;
  moodRating: number; // 1-5
  reflectionNote: string;
  selectedDomains: WellnessDomainId[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  preferredLanguage: Language;
}

export type WellnessResourceType =
  | 'article'
  | 'podcast'
  | 'book'
  | 'video'
  | 'exercise'
  | 'community';

export interface WellnessResource {
  id: string;
  domain: WellnessDomainId;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  type: WellnessResourceType;
  authorOrSource: string;
  url?: string;
  durationMinutes?: number;
  isBookmarked?: boolean;
  isCustom?: boolean;
  createdAt: string;
}
