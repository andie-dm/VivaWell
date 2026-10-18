/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ActivityMeasurementType,
  ActivityPreferences,
  ActivityRecord,
  ActivitySource,
  SyncStatus,
} from '../types/wellness';
import { addDays, getLocalDateString } from '../utils/dateUtils';

/**
 * Interface representing an external activity source provider.
 * Follows a clean adapter pattern so real Apple HealthKit or Health Connect
 * native bridges can replace the mock/simulator in production.
 */
export interface IActivitySourceAdapter {
  sourceName: ActivitySource;
  displayName: string;
  isBackgroundSupportedOnPlatform: boolean;
  getConnectionStatus(): Promise<SyncStatus>;
  requestPermissions(): Promise<boolean>;
  fetchActivityRecords(startDate: string, endDate: string): Promise<ActivityRecord[]>;
  disconnect(): Promise<void>;
}

/**
 * Simulated Activity Source Adapter for prototype demonstration.
 * Generates realistic, deduplicated, clearly marked fictional activity records.
 */
export class SimulatedActivityAdapter implements IActivitySourceAdapter {
  sourceName: ActivitySource = 'manual_sim';
  displayName: string = 'Simulated Mobile Sensor (Demo)';
  isBackgroundSupportedOnPlatform: boolean = false; // Discloses no real background tracking

  async getConnectionStatus(): Promise<SyncStatus> {
    return 'connected';
  }

  async requestPermissions(): Promise<boolean> {
    return true;
  }

  async disconnect(): Promise<void> {
    // No-op for demo
  }

  /**
   * Generates realistic, deduplicated mock records for the given date range.
   * If a day has no activity, it remains undefined/missing (handled as 'data_unavailable', NOT 0).
   */
  async fetchActivityRecords(
    startDate: string,
    endDate: string,
    userId: string = 'user_default',
    includeEnergy: boolean = true
  ): Promise<ActivityRecord[]> {
    const records: ActivityRecord[] = [];
    const syncTime = new Date().toISOString();

    // Sample data distribution for the last 7-14 days
    const baseDate = startDate;
    let cur = baseDate;

    // Seeded realistic daily values
    const sampleVariations = [
      { steps: 6420, minutes: 42, energy: 245 },
      { steps: 8150, minutes: 58, energy: 310 },
      { steps: 4890, minutes: 30, energy: 190 },
      { steps: 9420, minutes: 65, energy: 360 },
      { steps: null, minutes: null, energy: null }, // Deliberately unavailable data day!
      { steps: 7230, minutes: 48, energy: 275 },
      { steps: 5610, minutes: 36, energy: 215 },
      { steps: 8940, minutes: 62, energy: 340 },
    ];

    let i = 0;
    while (cur.localeCompare(endDate) <= 0) {
      const variation = sampleVariations[i % sampleVariations.length];
      i++;

      // If data is unavailable, we do NOT inject zero records! Missing data must be represented as absence of records.
      if (variation.steps !== null) {
        // Steps record
        records.push({
          id: `sim_step_${cur}_${userId}`,
          userId,
          source: 'manual_sim',
          sourceRecordId: `src_rec_steps_${cur}`,
          measurementType: 'steps',
          unit: 'steps',
          startTime: `${cur}T07:00:00Z`,
          endTime: `${cur}T21:00:00Z`,
          value: variation.steps,
          syncTime,
          localDate: cur,
        });

        // Active movement minutes record
        records.push({
          id: `sim_min_${cur}_${userId}`,
          userId,
          source: 'manual_sim',
          sourceRecordId: `src_rec_min_${cur}`,
          measurementType: 'active_minutes',
          unit: 'minutes',
          startTime: `${cur}T08:30:00Z`,
          endTime: `${cur}T19:30:00Z`,
          value: variation.minutes!,
          syncTime,
          localDate: cur,
        });

        // Optional active energy estimate (strictly distinguished from total TDEE)
        if (includeEnergy && variation.energy !== null) {
          records.push({
            id: `sim_energy_${cur}_${userId}`,
            userId,
            source: 'manual_sim',
            sourceRecordId: `src_rec_energy_${cur}`,
            measurementType: 'active_energy',
            unit: 'kcal (estimate)',
            startTime: `${cur}T08:30:00Z`,
            endTime: `${cur}T19:30:00Z`,
            value: variation.energy,
            syncTime,
            localDate: cur,
          });
        }
      }

      cur = addDays(cur, 1);
    }

    return records;
  }
}

/**
 * Deduplicates activity records to prevent overlapping phone and wearable data.
 * If multiple records exist for the same day and measurement type, takes the primary source or the deduplicated maximum.
 */
export function deduplicateActivityRecords(records: ActivityRecord[], preferredSource?: ActivitySource): Map<string, { steps?: number; minutes?: number; activeEnergy?: number }> {
  const dailyMap = new Map<string, { steps?: number; minutes?: number; activeEnergy?: number }>();

  for (const record of records) {
    const existing = dailyMap.get(record.localDate) || {};

    if (record.measurementType === 'steps') {
      // Deduplicate: avoid summing duplicate phone + watch step records
      existing.steps = Math.max(existing.steps ?? 0, record.value);
    } else if (record.measurementType === 'active_minutes') {
      existing.minutes = Math.max(existing.minutes ?? 0, record.value);
    } else if (record.measurementType === 'active_energy') {
      existing.activeEnergy = Math.max(existing.activeEnergy ?? 0, record.value);
    }

    dailyMap.set(record.localDate, existing);
  }

  return dailyMap;
}

/**
 * Technical architectural disclosure explaining why native mobile bridges are required
 * and why closed web browsers cannot count steps.
 */
export const BACKGROUND_TRACKING_DISCLOSURE = {
  en: {
    title: 'Background Activity Tracking Architecture',
    subtitle: 'Transparent Technical Explanation & Native Roadmap',
    whyWebCannot:
      'Web browsers (including Safari, Chrome, and installed PWAs) are sandbox-isolated for battery life and privacy. When a browser tab is closed or in the background, operating systems suspend execution and do not provide continuous accelerometer or pedometer access.',
    nativeRequirement:
      'Real background step and movement tracking requires a native iOS application (using Apple HealthKit) or Android application (using Android Health Connect). The native OS manages sensor collection efficiently without draining battery.',
    backendRole:
      'In a future production version, native apps will sync encrypted authorized samples to the VivaWell backend API, which calculates daily summaries and dispatches permitted supportive reminders.',
    privacyCommitment:
      'Calorie values are optional estimates only. We never sell health data, use it for ads, or mandate physical movement to maintain wellness streaks. Other wellness domains earn the exact same streaks.',
  },
  es: {
    title: 'Arquitectura de Seguimiento de Actividad en Segundo Plano',
    subtitle: 'Explicación Técnica Transparente y Hoja de Ruta Nativa',
    whyWebCannot:
      'Los navegadores web (incluidos Safari, Chrome y las PWA instaladas) están aislados en un entorno protegido (sandbox) por motivos de batería y privacidad. Cuando la pestaña se cierra o queda en segundo plano, el sistema operativo suspende la ejecución y no permite acceso continuo a podómetros o acelerómetros.',
    nativeRequirement:
      'El seguimiento real de pasos y movimiento en segundo plano requiere una aplicación nativa para iOS (mediante Apple HealthKit) o Android (mediante Health Connect). El sistema operativo nativo recopila datos de sensores eficientemente sin agotar la batería.',
    backendRole:
      'En una versión futura para producción, las apps nativas sincronizarán registros autorizados y encriptados con el backend de VivaWell, el cual calculará resúmenes diarios y enviará recordatorios respetuosos.',
    privacyCommitment:
      'Las calorías son solo estimaciones opcionales. Nunca vendemos datos de salud, ni los usamos para publicidad, ni obligamos a hacer ejercicio para mantener rachas. Todos los dominios de bienestar tienen el mismo valor.',
  },
};
