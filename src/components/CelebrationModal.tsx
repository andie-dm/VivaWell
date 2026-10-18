/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useWellness } from '../context/WellnessContext';
import { Sparkles, X, Check, Award } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { activeCelebration, dismissCelebration, t, language } = useWellness();

  useEffect(() => {
    if (!activeCelebration) return;
    // Auto-dismiss after 6 seconds if not manually dismissed
    const timer = setTimeout(() => {
      dismissCelebration();
    }, 6000);
    return () => clearTimeout(timer);
  }, [activeCelebration, dismissCelebration]);

  if (!activeCelebration) return null;

  const title = language === 'es' ? activeCelebration.titleEs : activeCelebration.titleEn;
  const desc = language === 'es' ? activeCelebration.descriptionEs : activeCelebration.descriptionEn;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 relative overflow-hidden transition-transform animate-in fade-in duration-200">
        {/* Soft background aura */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-sky-100/60 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={dismissCelebration}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Dismiss celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4">
          <Award className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">
          {t.celebration.title}
        </span>
        <h3 className="text-xl font-bold text-stone-900 mb-2">{title}</h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto mb-6">
          {desc}
        </p>

        <button
          onClick={dismissCelebration}
          className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
        >
          {t.celebration.dismiss}
        </button>

        <p className="text-[10px] text-stone-400 mt-3">
          {t.celebration.reducedMotionNotice}
        </p>
      </div>
    </div>
  );
};
