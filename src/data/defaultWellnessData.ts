/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Achievement,
  ActivityPreferences,
  EngagementPreferences,
  HabitAction,
  SupportiveReminderConfig,
  UserProfile,
  WellnessDomain,
} from '../types/wellness';

export const WELLNESS_DOMAINS: WellnessDomain[] = [
  {
    id: 'physical',
    nameEn: 'Physical',
    nameEs: 'Física',
    taglineEn: 'Caring for your body, movement, rest, and vitality.',
    taglineEs: 'Cuidar tu cuerpo, movimiento, descanso reparador y vitalidad.',
    iconName: 'Activity',
    accentColor: '#38BDF8', // Light blue
    surfaceColor: '#E0F2FE', // Light background
    textColor: '#075985', // Dark text
    colorLabelEn: 'Light blue',
    colorLabelEs: 'Azul claro',
  },
  {
    id: 'emotional',
    nameEn: 'Emotional',
    nameEs: 'Emocional',
    taglineEn: 'Understanding feelings, managing stress, and self-compassion.',
    taglineEs: 'Comprender emociones, gestionar estrés y cultivar autocompasión.',
    iconName: 'Heart',
    accentColor: '#EC4899', // Pink
    surfaceColor: '#FCE7F3', // Light background
    textColor: '#9D174D', // Dark text
    colorLabelEn: 'Pink',
    colorLabelEs: 'Rosa',
  },
  {
    id: 'intellectual',
    nameEn: 'Intellectual',
    nameEs: 'Intelectual',
    taglineEn: 'Stimulating curiosity, learning, and creative expression.',
    taglineEs: 'Estimular curiosidad, aprendizaje y expresión creativa.',
    iconName: 'BookOpen',
    accentColor: '#A855F7', // Purple
    surfaceColor: '#F3E8FF', // Light background
    textColor: '#6B21A8', // Dark text
    colorLabelEn: 'Purple',
    colorLabelEs: 'Púrpura',
  },
  {
    id: 'social',
    nameEn: 'Social',
    nameEs: 'Social',
    taglineEn: 'Fostering genuine connection, community, and belonging.',
    taglineEs: 'Fomentar vínculos genuinos, comunidad y sentido de pertenencia.',
    iconName: 'Users',
    accentColor: '#FACC15', // Yellow
    surfaceColor: '#FEF9C3', // Light background
    textColor: '#713F12', // Dark text
    colorLabelEn: 'Yellow',
    colorLabelEs: 'Amarillo',
  },
  {
    id: 'spiritual',
    nameEn: 'Spiritual',
    nameEs: 'Espiritual',
    taglineEn: 'Finding purpose, mindfulness, values, and inner peace.',
    taglineEs: 'Conectar con propósitos, valores, presencia y paz interior.',
    iconName: 'Compass',
    accentColor: '#2563EB', // Electric blue
    surfaceColor: '#DBEAFE', // Light background
    textColor: '#1E3A8A', // Dark text
    colorLabelEn: 'Electric blue',
    colorLabelEs: 'Azul eléctrico',
  },
  {
    id: 'environmental',
    nameEn: 'Environmental',
    nameEs: 'Ambiental',
    taglineEn: 'Connecting with nature and creating nourishing spaces.',
    taglineEs: 'Convivir con la naturaleza y crear espacios acogedores.',
    iconName: 'Leaf',
    accentColor: '#A3E635', // Lime green
    surfaceColor: '#ECFCCB', // Light background
    textColor: '#3F6212', // Dark text
    colorLabelEn: 'Lime green',
    colorLabelEs: 'Verde lima',
  },
  {
    id: 'occupational',
    nameEn: 'Occupational',
    nameEs: 'Ocupacional',
    taglineEn: 'Balancing work, personal growth, and fulfilling contributions.',
    taglineEs: 'Equilibrar labor, crecimiento personal y aportes con sentido.',
    iconName: 'Briefcase',
    accentColor: '#F97316', // Orange
    surfaceColor: '#FFEDD5', // Light background
    textColor: '#9A3412', // Dark text
    colorLabelEn: 'Orange',
    colorLabelEs: 'Naranja',
  },
  {
    id: 'financial',
    nameEn: 'Financial',
    nameEs: 'Financiera',
    taglineEn: 'Mindful budgeting, peace of mind, and responsible planning.',
    taglineEs: 'Presupuesto consciente, tranquilidad y decisiones responsables.',
    iconName: 'PiggyBank',
    accentColor: '#22C55E', // Green
    surfaceColor: '#DCFCE7', // Light background
    textColor: '#166534', // Dark text
    colorLabelEn: 'Green',
    colorLabelEs: 'Verde',
  },
];

export const INITIAL_HABITS: HabitAction[] = [
  // Physical
  {
    id: 'act_phys_walk',
    domain: 'physical',
    titleEn: 'Mindful Outdoor Walk',
    titleEs: 'Caminata Consciente al Aire Libre',
    descriptionEn: 'Take a gentle 15-20 min walk without rush or performance pressure.',
    descriptionEs: 'Camina 15-20 min con calma, disfrutando del movimiento sin exigencias.',
    durationMinutes: 20,
    eligibleForPhysicalSync: true,
  },
  {
    id: 'act_phys_stretch',
    domain: 'physical',
    titleEn: 'Gentle Body Stretch',
    titleEs: 'Estiramiento Suave del Cuerpo',
    descriptionEn: 'Release neck, spine, and hip tension with slow fluid stretches.',
    descriptionEs: 'Alivia la tensión de cuello, espalda y caderas con estiramientos lentos.',
    durationMinutes: 10,
    eligibleForPhysicalSync: false,
  },
  {
    id: 'act_phys_hydration',
    domain: 'physical',
    titleEn: 'Hydration & Restful Wind-down',
    titleEs: 'Hidratación y Pausa Reparadora',
    descriptionEn: 'Drink a glass of water and disconnect screens 20 minutes before rest.',
    descriptionEs: 'Toma un vaso de agua y desconecta pantallas 20 minutos antes de dormir.',
    durationMinutes: 10,
    eligibleForPhysicalSync: false,
  },

  // Emotional
  {
    id: 'act_emot_breath',
    domain: 'emotional',
    titleEn: '5-Minute Compassionate Breathing',
    titleEs: '5 Minutos de Respiración Compasiva',
    descriptionEn: 'Place a hand over your heart and take slow, comforting breaths.',
    descriptionEs: 'Lleva una mano al pecho y realiza respiraciones profundas y amables.',
    durationMinutes: 5,
  },
  {
    id: 'act_emot_journal',
    domain: 'emotional',
    titleEn: 'Emotion Check-in Note',
    titleEs: 'Reconocimiento de Emociones',
    descriptionEn: 'Write down 3 feelings without judgment or attempting to fix them.',
    descriptionEs: 'Escribe 3 emociones presentes sin juzgarlas ni intentar cambiarlas.',
    durationMinutes: 10,
  },

  // Intellectual
  {
    id: 'act_intel_read',
    domain: 'intellectual',
    titleEn: 'Curious Reading',
    titleEs: 'Lectura con Curiosidad',
    descriptionEn: 'Read a chapter of an inspiring book or thoughtful article.',
    descriptionEs: 'Lee un capítulo de un libro inspirador o un artículo enriquecedor.',
    durationMinutes: 15,
  },
  {
    id: 'act_intel_learn',
    domain: 'intellectual',
    titleEn: 'Learn One New Idea',
    titleEs: 'Aprender una Nueva Idea',
    descriptionEn: 'Explore a fascinating concept in science, art, or history.',
    descriptionEs: 'Explora un concepto fascinante sobre ciencia, arte o historia.',
    durationMinutes: 15,
  },

  // Social
  {
    id: 'act_soc_connect',
    domain: 'social',
    titleEn: 'Warm Message to a Friend',
    titleEs: 'Mensaje Cálido a una Amistad',
    descriptionEn: 'Send a genuine greeting or note of appreciation to someone you cherish.',
    descriptionEs: 'Envía un saludo sincero o nota de gratitud a alguien que valoras.',
    durationMinutes: 5,
  },
  {
    id: 'act_soc_presence',
    domain: 'social',
    titleEn: 'Distraction-Free Conversation',
    titleEs: 'Conversación sin Distracciones',
    descriptionEn: 'Have a 10-minute conversation with full attention, eyes, and presence.',
    descriptionEs: 'Comparte 10 minutos de charla manteniendo plena presencia y escucha.',
    durationMinutes: 10,
  },

  // Spiritual
  {
    id: 'act_spir_mindful',
    domain: 'spiritual',
    titleEn: 'Quiet Mindfulness Pause',
    titleEs: 'Pausa de Silencio y Presencia',
    descriptionEn: 'Sit quietly for 10 minutes observing the present moment with kindness.',
    descriptionEs: 'Permanece en silencio durante 10 minutos observando el momento presente.',
    durationMinutes: 10,
  },
  {
    id: 'act_spir_gratitude',
    domain: 'spiritual',
    titleEn: 'Three Simple Gratitudes',
    titleEs: 'Tres Gratitudes Sencillas',
    descriptionEn: 'Reflect on three small joys or blessings from today.',
    descriptionEs: 'Reconoce tres pequeñas alegrías o bendiciones del día de hoy.',
    durationMinutes: 5,
  },

  // Environmental
  {
    id: 'act_env_nature',
    domain: 'environmental',
    titleEn: 'Connect with Fresh Air or Nature',
    titleEs: 'Contacto con Aire Fresco o Naturaleza',
    descriptionEn: 'Breathe outdoor air or spend a few moments observing trees and sky.',
    descriptionEs: 'Respira aire fresco o contempla unos instantes el cielo y la vegetación.',
    durationMinutes: 10,
  },
  {
    id: 'act_env_tidy',
    domain: 'environmental',
    titleEn: 'Nourishing Space Refresh',
    titleEs: 'Renovar tu Espacio Inmediato',
    descriptionEn: 'Clear one surface or organize a corner to create calm in your environment.',
    descriptionEs: 'Ordena una mesa o despeja un rincón para infundir calma en tu entorno.',
    durationMinutes: 10,
  },

  // Occupational
  {
    id: 'act_occ_priorities',
    domain: 'occupational',
    titleEn: 'Clarify 3 Manageable Priorities',
    titleEs: 'Clarificar 3 Prioridades Viables',
    descriptionEn: 'Choose three essential tasks and release unnecessary urgency.',
    descriptionEs: 'Elige tres tareas esenciales para hoy y suelta la urgencia ficticia.',
    durationMinutes: 5,
  },
  {
    id: 'act_occ_boundary',
    domain: 'occupational',
    titleEn: 'End-of-Work Transition Ritual',
    titleEs: 'Ritual de Cierre de Jornada',
    descriptionEn: 'Close work tabs deliberately, note next day priorities, and unplug.',
    descriptionEs: 'Cierra ventanas laborales, anota pendientes para mañana y desconéctate.',
    durationMinutes: 5,
  },

  // Financial
  {
    id: 'act_fin_mindful',
    domain: 'financial',
    titleEn: 'Mindful Spending Pause',
    titleEs: 'Pausa Consciente antes de Comprar',
    descriptionEn: 'Wait 24 hours before non-essential purchases to check alignment.',
    descriptionEs: 'Espera 24 horas antes de compras no esenciales para reflexionar con calma.',
    durationMinutes: 5,
  },
  {
    id: 'act_fin_calm',
    domain: 'financial',
    titleEn: 'Calm Budget Check-in',
    titleEs: 'Revisión Serena del Presupuesto',
    descriptionEn: 'Look at accounts with clarity and appreciation rather than anxiety.',
    descriptionEs: 'Revisa tus cuentas con claridad y tranquilidad, sin autojuicios.',
    durationMinutes: 10,
  },
];

export const INITIAL_PREFERENCES: EngagementPreferences = {
  scheduleType: 'scheduled_days',
  targetFrequency: 4, // 4 days per week if frequency mode
  scheduledDays: [1, 2, 4, 5], // Monday, Tuesday, Thursday, Friday
  restDays: [0, 6], // Sunday, Saturday as scheduled rest days
  isPaused: false,
  graceDayPreference: true, // 1 grace day allowed per calendar week
  streakVisibility: true,
  celebrationsEnabled: true,
  userTimeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York',
  autoHabitFromPhysicalActivity: false, // Explicit opt-in required
};

export const INITIAL_ACTIVITY_PREFERENCES: ActivityPreferences = {
  isTrackingEnabled: true,
  showActiveEnergy: false, // Optional and hidden by default
  primarySource: 'manual_sim',
  connectionStatus: 'connected', // Connected via simulated demo
  lastSyncTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  dailyStepGoal: 7000,
  dailyMovementGoalMinutes: 30,
};

export const INITIAL_REMINDERS_CONFIG: SupportiveReminderConfig = {
  enabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  maxDailyNotifications: 2,
  preActivityReminder: true,
  weeklyReflectionReminder: true,
  gentleReturnReminder: true,
  frequency: 'gentle',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_action',
    titleEn: 'First Step',
    titleEs: 'Primer Paso',
    descriptionEn: 'Completed your first accepted wellness action across any domain.',
    descriptionEs: 'Completaste tu primera acción de bienestar en cualquiera de los dominios.',
    iconName: 'Sparkles',
    earnedAt: '2026-10-10T14:30:00Z',
  },
  {
    id: 'first_week_goal',
    titleEn: 'Weekly Rhythm Met',
    titleEs: 'Ritmo Semanal Alcanzado',
    descriptionEn: 'Achieved your chosen frequency for a full calendar week.',
    descriptionEs: 'Lograste tu meta de frecuencia elegida durante una semana completa.',
    iconName: 'CalendarCheck',
    earnedAt: '2026-10-12T19:00:00Z',
  },
  {
    id: 'three_consistent_weeks',
    titleEn: 'Three Weeks of Harmony',
    titleEs: 'Tres Semanas de Armonía',
    descriptionEn: 'Maintained steady consistency across three consecutive weeks.',
    descriptionEs: 'Sostuviste tu constancia durante tres semanas consecutivas.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'returned_after_break',
    titleEn: 'Gentle Return',
    titleEs: 'Retorno Amable',
    descriptionEn: 'Returned to your wellness practice after time away. Welcome back!',
    descriptionEs: 'Regresaste a tu práctica de bienestar tras una pausa. ¡Qué bueno tenerte de vuelta!',
    iconName: 'HeartHandshake',
    earnedAt: '2026-10-14T09:00:00Z',
  },
  {
    id: 'weekly_reflection_complete',
    titleEn: 'Mindful Reflection',
    titleEs: 'Reflexión Consciente',
    descriptionEn: 'Took time to pause and reflect on your emotional and physical week.',
    descriptionEs: 'Dedicaste tiempo a reflexionar sobre tu estado emocional y corporal de la semana.',
    iconName: 'BookMarked',
  },
];

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user_elena',
    name: 'Elena Morales',
    avatar: 'EM',
    preferredLanguage: 'es',
  },
  {
    id: 'user_mateo',
    name: 'Mateo Chen',
    avatar: 'MC',
    preferredLanguage: 'en',
  },
];

export const INITIAL_RESOURCES = [
  // Physical
  {
    id: 'res_phys_1',
    domain: 'physical' as const,
    titleEn: 'The Walking Reset: Nervous System Calm',
    titleEs: 'El Reset de la Caminata: Calma del Sistema Nervioso',
    descriptionEn: 'Why 20 minutes of gentle, unhurried outdoor movement reduces cortisol and stabilizes energy better than high-intensity bursts.',
    descriptionEs: 'Por qué 20 minutos de caminata tranquila al aire libre reducen el cortisol y estabilizan la energía sin presiones de rendimiento.',
    type: 'article' as const,
    authorOrSource: 'VivaWell Health Institute',
    url: 'https://example.com/walking-reset',
    durationMinutes: 6,
    isBookmarked: true,
    createdAt: '2026-10-10T08:00:00Z',
  },
  {
    id: 'res_phys_2',
    domain: 'physical' as const,
    titleEn: 'Sleep Wind-Down & Circadian Restoration',
    titleEs: 'Desconexión Nocturna y Restauración Circadiana',
    descriptionEn: 'A practical routine for dimming evening blue light, soothing restless legs, and entering deep restorative sleep.',
    descriptionEs: 'Una rutina práctica para atenuar luces azules vespertinas, relajar piernas cansadas y propiciar un sueño profundo y reparador.',
    type: 'guide' as any,
    authorOrSource: 'Circadian Biology Lab',
    url: 'https://example.com/sleep-restoration',
    durationMinutes: 8,
    isBookmarked: false,
    createdAt: '2026-10-11T19:00:00Z',
  },

  // Emotional
  {
    id: 'res_emot_1',
    domain: 'emotional' as const,
    titleEn: 'Self-Compassion in Challenging Moments',
    titleEs: 'Autocompasión en Momentos de Tensión',
    descriptionEn: 'Shifting from self-criticism to a warm, supportive inner voice during stressful days and unexpected setbacks.',
    descriptionEs: 'Cómo pasar de la autocrítica severa a una voz interna cálida y comprensiva en días difíciles y pausas no planeadas.',
    type: 'podcast' as const,
    authorOrSource: 'Mindful Living Series',
    url: 'https://example.com/self-compassion-audio',
    durationMinutes: 14,
    isBookmarked: true,
    createdAt: '2026-10-12T14:30:00Z',
  },
  {
    id: 'res_emot_2',
    domain: 'emotional' as const,
    titleEn: '5-Minute Grounding Breath for Overwhelm',
    titleEs: 'Respiración de 5 Minutos para la Sobrecarga',
    descriptionEn: 'Physiological sigh technique: double inhale through the nose and slow exhale through the mouth to quickly drop heart rate.',
    descriptionEs: 'Técnica de suspiro fisiológico: doble inhalación nasal y exhalación bucal prolongada para desacelerar el ritmo cardíaco.',
    type: 'exercise' as const,
    authorOrSource: 'Somatic Breathwork Guide',
    url: 'https://example.com/physiological-sigh',
    durationMinutes: 5,
    isBookmarked: false,
    createdAt: '2026-10-13T11:00:00Z',
  },

  // Intellectual
  {
    id: 'res_intel_1',
    domain: 'intellectual' as const,
    titleEn: 'Cultivating Curious Reading Rituals',
    titleEs: 'Cultivar Rituales de Lectura con Curiosidad',
    descriptionEn: 'Rediscover the joy of reading 10-15 minutes a day without testing, quotas, or social media book tracking.',
    descriptionEs: 'Redescubre el placer de leer 10 a 15 minutos al día sin cuotas forzadas ni presiones de rendimiento en redes sociales.',
    type: 'article' as const,
    authorOrSource: 'Slow Literature Review',
    url: 'https://example.com/slow-reading',
    durationMinutes: 7,
    isBookmarked: false,
    createdAt: '2026-10-10T16:00:00Z',
  },

  // Social
  {
    id: 'res_soc_1',
    domain: 'social' as const,
    titleEn: 'The Art of Gentle, Low-Pressure Reconnection',
    titleEs: 'El Arte de Reconectar con Cariño y sin Presión',
    descriptionEn: 'How to reach out to old friends when you have been out of touch without guilt, over-apologizing, or social exhaustion.',
    descriptionEs: 'Cómo escribirle a amistades queridas tras semanas de ausencia sin pedir disculpas excesivas ni fatiga social.',
    type: 'guide' as any,
    authorOrSource: 'Belonging & Connection Journal',
    url: 'https://example.com/gentle-reconnection',
    durationMinutes: 5,
    isBookmarked: true,
    createdAt: '2026-10-09T18:00:00Z',
  },

  // Spiritual
  {
    id: 'res_spir_1',
    domain: 'spiritual' as const,
    titleEn: 'Morning Mindfulness & Daily Purpose Anchor',
    titleEs: 'Atención Plena Matutina y Ancla de Sentido',
    descriptionEn: 'Connecting with your deepest values before the morning rush begins. A 10-minute contemplation audio session.',
    descriptionEs: 'Conecta con tus valores esenciales antes de que comience el ajetreo matutino. Sesión de audio de 10 minutos.',
    type: 'exercise' as const,
    authorOrSource: 'Contemplative Living Institute',
    url: 'https://example.com/morning-stillness',
    durationMinutes: 10,
    isBookmarked: false,
    createdAt: '2026-10-12T07:15:00Z',
  },

  // Environmental
  {
    id: 'res_env_1',
    domain: 'environmental' as const,
    titleEn: 'Biophilic Spaces: Bringing Nature Indoors',
    titleEs: 'Espacios Biofílicos: Integrar la Naturaleza en Casa',
    descriptionEn: 'Simple, budget-friendly ways to add natural textures, daylight, and house plants to reduce cognitive fatigue.',
    descriptionEs: 'Estrategias accesibles para incorporar luz natural, ventilación y plantas para aliviar la fatiga mental.',
    type: 'article' as const,
    authorOrSource: 'Living Ecology Collective',
    url: 'https://example.com/biophilic-living',
    durationMinutes: 6,
    isBookmarked: false,
    createdAt: '2026-10-14T10:00:00Z',
  },

  // Occupational
  {
    id: 'res_occ_1',
    domain: 'occupational' as const,
    titleEn: 'Workday Closure Ritual: Unplugging with Peace',
    titleEs: 'Ritual de Cierre Laboral: Desconectar con Serenidad',
    descriptionEn: 'Step-by-step 5-minute shutdown checklist to leave work at work and protect your evening restorative time.',
    descriptionEs: 'Lista de verificación de 5 minutos para cerrar pendientes, apagar notificaciones y cuidar tus horas personales.',
    type: 'exercise' as const,
    authorOrSource: 'Sustainable Work Ethics',
    url: 'https://example.com/workday-shutdown',
    durationMinutes: 5,
    isBookmarked: true,
    createdAt: '2026-10-13T17:30:00Z',
  },

  // Financial
  {
    id: 'res_fin_1',
    domain: 'financial' as const,
    titleEn: 'Calm Money: Mindful Budgeting Without Anxiety',
    titleEs: 'Dinero Sereno: Presupuesto Consciente sin Ansiedad',
    descriptionEn: 'Viewing your bank statement as an emotional compass rather than a scorecard. Practical non-judgmental habits.',
    descriptionEs: 'Cómo mirar tus cuentas como una brújula de prioridades y no como un examen. Hábitos amables de administración.',
    type: 'article' as const,
    authorOrSource: 'Mindful Finance Guide',
    url: 'https://example.com/calm-money',
    durationMinutes: 8,
    isBookmarked: false,
    createdAt: '2026-10-11T12:00:00Z',
  },
];
