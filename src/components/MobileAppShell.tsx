/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWellness } from '../context/WellnessContext';
import { VivaWellLogo } from './VivaWellLogo';
import {
  Flame,
  Compass,
  Footprints,
  BookOpen,
  Award,
  Globe,
  Bell,
  Sparkles,
} from 'lucide-react';

interface MobileAppShellProps {
  activeTab: 'rhythm' | 'domains' | 'activity' | 'resources' | 'badges';
  setActiveTab: (tab: 'rhythm' | 'domains' | 'activity' | 'resources' | 'badges') => void;
  onOpenReminders: () => void;
  onOpenProfile: () => void;
  onOpenArch: () => void;
  children: React.ReactNode;
}

export const MobileAppShell: React.FC<MobileAppShellProps> = ({
  activeTab,
  setActiveTab,
  onOpenReminders,
  onOpenProfile,
  onOpenArch,
  children,
}) => {
  const { language, setLanguage, t, currentProfile } = useWellness();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col w-full selection:bg-blue-100 selection:text-blue-900">
      {/* Accessible, Sticky Compact Mobile Header */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="w-full max-w-3xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
          {/* Logo & App Identity */}
          <button
            onClick={() => setActiveTab('rhythm')}
            className="flex items-center gap-2.5 group text-left min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl px-1"
            aria-label={`${t.app.title} - ${t.nav.rhythm}`}
          >
            <VivaWellLogo className="w-8 h-8 shrink-0 drop-shadow-xs transition-transform group-hover:scale-105" />
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg text-stone-900 leading-tight block group-hover:text-blue-800 transition-colors">
                VivaWell
              </span>
              <span className="text-[11px] text-stone-500 font-medium block truncate max-w-[190px] sm:max-w-xs">
                {t.app.tagline}
              </span>
            </div>
          </button>

          {/* Quick Header Controls (all >= 44x44px touch targets) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Supportive Reminders */}
            <button
              onClick={onOpenReminders}
              className="min-h-[44px] min-w-[44px] p-2.5 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title={t.reminders.title}
              aria-label={t.reminders.title}
            >
              <Bell className="w-5 h-5" />
            </button>

            {/* Bilingual Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="min-h-[44px] px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
              title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 text-stone-500" />
              <span>{language === 'en' ? 'ES' : 'EN'}</span>
            </button>

            {/* Profile Avatar / Settings Menu Button */}
            <button
              onClick={onOpenProfile}
              className="min-h-[44px] min-w-[44px] p-1 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
              aria-label={`Profile settings for ${currentProfile.name}`}
              title={currentProfile.name}
            >
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center border border-blue-200 shadow-2xs">
                {currentProfile.avatar}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Screen Content - Pure White Background */}
      <main className="w-full max-w-3xl mx-auto flex-1 px-4 sm:px-6 py-5 pb-28 sm:pb-32 space-y-6 bg-white min-h-[calc(100dvh-4rem)]">
        {children}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar (5 Primary Destinations) */}
      <nav
        aria-label="VivaWell Primary Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-md pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="w-full max-w-3xl mx-auto flex items-center justify-around px-2 pt-1.5">
          {/* Tab 1: Today / Hoy */}
          <button
            onClick={() => setActiveTab('rhythm')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-xl transition-all ${
              activeTab === 'rhythm'
                ? 'text-blue-600 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-current={activeTab === 'rhythm' ? 'page' : undefined}
          >
            <Flame className="w-5 h-5 transition-transform" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
              {t.nav.rhythm}
            </span>
            {activeTab === 'rhythm' ? (
              <div className="w-5 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-0.5" />
            ) : (
              <div className="w-5 h-1 bg-transparent rounded-full mt-0.5" />
            )}
          </button>

          {/* Tab 2: Domains / Dimensiones */}
          <button
            onClick={() => setActiveTab('domains')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-xl transition-all ${
              activeTab === 'domains'
                ? 'text-blue-600 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-current={activeTab === 'domains' ? 'page' : undefined}
          >
            <Compass className="w-5 h-5 transition-transform" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
              {t.nav.domains}
            </span>
            {activeTab === 'domains' ? (
              <div className="w-5 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-0.5" />
            ) : (
              <div className="w-5 h-1 bg-transparent rounded-full mt-0.5" />
            )}
          </button>

          {/* Tab 3: Progress / Progreso */}
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-xl transition-all ${
              activeTab === 'activity'
                ? 'text-blue-600 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-current={activeTab === 'activity' ? 'page' : undefined}
          >
            <Footprints className="w-5 h-5 transition-transform" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
              {t.nav.activity}
            </span>
            {activeTab === 'activity' ? (
              <div className="w-5 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-0.5" />
            ) : (
              <div className="w-5 h-1 bg-transparent rounded-full mt-0.5" />
            )}
          </button>

          {/* Tab 4: Resources / Recursos */}
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-xl transition-all ${
              activeTab === 'resources'
                ? 'text-blue-600 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-current={activeTab === 'resources' ? 'page' : undefined}
          >
            <BookOpen className="w-5 h-5 transition-transform" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
              {t.nav.resources}
            </span>
            {activeTab === 'resources' ? (
              <div className="w-5 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-0.5" />
            ) : (
              <div className="w-5 h-1 bg-transparent rounded-full mt-0.5" />
            )}
          </button>

          {/* Tab 5: Meaningful Badges / Insignias (Replaces Future Native destination completely) */}
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-1 py-1 rounded-xl transition-all ${
              activeTab === 'badges'
                ? 'text-blue-600 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
            aria-current={activeTab === 'badges' ? 'page' : undefined}
          >
            <Award className="w-5 h-5 transition-transform" />
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-full">
              {t.nav.badges}
            </span>
            {activeTab === 'badges' ? (
              <div className="w-5 h-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full mt-0.5" />
            ) : (
              <div className="w-5 h-1 bg-transparent rounded-full mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
};
