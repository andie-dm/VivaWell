/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, SupportiveReminderConfig } from '../types/wellness';
import { isWithinQuietHours } from '../utils/dateUtils';

export interface SimulatedNotification {
  id: string;
  type: 'pre_activity' | 'weekly_reflection' | 'gentle_return';
  titleEn: string;
  titleEs: string;
  bodyEn: string;
  bodyEs: string;
  scheduledTime: string;
  isSuppressedByQuietHours: boolean;
  status: 'delivered' | 'suppressed' | 'scheduled';
}

/**
 * Generates simulated supportive notifications respecting user's quiet hours and daily limit.
 */
export function generateSimulatedNotifications(
  config: SupportiveReminderConfig,
  lang: Language,
  now: Date = new Date()
): SimulatedNotification[] {
  if (!config.enabled) {
    return [];
  }

  const inQuietHours = isWithinQuietHours(config.quietHoursStart, config.quietHoursEnd, now);

  const notifications: SimulatedNotification[] = [
    {
      id: 'notif_pre_act',
      type: 'pre_activity',
      titleEn: 'A Gentle Invitation',
      titleEs: 'Una Invitación Serena',
      bodyEn: 'When you feel ready today, your mindful pause is here. No rush or performance required.',
      bodyEs: 'Cuando sientas ganas hoy, tu pausa consciente te espera. Sin prisas ni exigencias.',
      scheduledTime: '10:30 AM',
      isSuppressedByQuietHours: inQuietHours,
      status: inQuietHours ? 'suppressed' : 'delivered',
    },
    {
      id: 'notif_reflection',
      type: 'weekly_reflection',
      titleEn: 'Quiet Sunday Reflection',
      titleEs: 'Espacio de Reflexión de Fin de Semana',
      bodyEn: 'How did this week feel for you? A few minutes of compassionate reflection can bring calm.',
      bodyEs: '¿Cómo se sintió esta semana para ti? Unos minutos de reflexión compasiva traen serenidad.',
      scheduledTime: '06:00 PM',
      isSuppressedByQuietHours: false,
      status: 'scheduled',
    },
    {
      id: 'notif_return',
      type: 'gentle_return',
      titleEn: 'Your Space Is Always Here',
      titleEs: 'Tu Espacio Siempre Sigue Aquí',
      bodyEn: 'Welcome back. Your accumulated journey is completely safe. What feels manageable today?',
      bodyEs: 'Qué bueno verte de nuevo. Tu camino acumulado está a salvo. ¿Qué se siente posible hoy?',
      scheduledTime: '02:00 PM',
      isSuppressedByQuietHours: false,
      status: 'scheduled',
    },
  ];

  // Limit to max daily notifications
  return notifications.slice(0, config.maxDailyNotifications);
}
