/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWellness } from '../context/WellnessContext';
import {
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  HeartHandshake,
  BookMarked,
  Lock,
  CheckCircle2,
} from 'lucide-react';

const badgeIconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  HeartHandshake,
  BookMarked,
};

export const BadgesGallery: React.FC = () => {
  const { achievements, t, language } = useWellness();

  return (
    <section className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-snug">
          {t.badges.title}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-2xl leading-relaxed">
          {t.badges.subtitle}
        </p>
      </div>

      {/* Ethical Discipline Note (Clean White Card) */}
      <div className="p-4 rounded-xl bg-white border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">{t.badges.antiSlopNote}</span>
      </div>

      {/* Badges Grid (Clean White Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {achievements.map((badge) => {
          const isEarned = Boolean(badge.earnedAt);
          const Icon = badgeIconMap[badge.iconName] || Sparkles;
          const title = language === 'es' ? badge.titleEs : badge.titleEn;
          const desc = language === 'es' ? badge.descriptionEs : badge.descriptionEn;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between bg-white ${
                isEarned
                  ? 'border-blue-300 ring-1 ring-blue-400/20 shadow-xs'
                  : 'border-stone-200 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isEarned
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-stone-100 text-stone-400'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-blue-700" />
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                      isEarned
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}
                  >
                    {isEarned ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        {language === 'es' ? 'Alcanzada' : 'Earned'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-stone-400" />
                        {t.badges.notEarnedYet}
                      </span>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug">{title}</h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 text-[11px] text-stone-500 font-medium">
                {isEarned && badge.earnedAt ? (
                  <span>
                    {t.badges.earnedOn}{' '}
                    {new Date(badge.earnedAt).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                ) : (
                  <span className="text-stone-400">
                    {language === 'es'
                      ? 'Desbloquea cultivando tu ritmo personal.'
                      : 'Unlocks naturally through your gentle rhythm.'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
