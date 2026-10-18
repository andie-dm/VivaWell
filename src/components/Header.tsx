/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWellness } from '../context/WellnessContext';
import { VivaWellLogo } from './VivaWellLogo';
import { Globe, User, Bell, HelpCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReminders: () => void;
  onOpenProfile: () => void;
  onOpenArch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReminders,
  onOpenProfile,
  onOpenArch,
}) => {
  const { language, setLanguage, t, currentProfile } = useWellness();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('rhythm')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <VivaWellLogo className="w-9 h-9 shrink-0 drop-shadow-xs transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-blue-800 transition-colors">
                  VivaWell
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Single-line Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('rhythm')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'rhythm'
                  ? 'text-blue-950 bg-blue-50 border border-blue-200/70 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.nav.rhythm}
            </button>
            <button
              onClick={() => setActiveTab('domains')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'domains'
                  ? 'text-blue-950 bg-blue-50 border border-blue-200/70 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.nav.domains}
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'activity'
                  ? 'text-blue-950 bg-blue-50 border border-blue-200/70 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.nav.activity}
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'resources'
                  ? 'text-blue-950 bg-blue-50 border border-blue-200/70 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.nav.resources}
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'text-blue-950 bg-blue-50 border border-blue-200/70 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t.nav.badges}
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-blue-800 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 hover:from-blue-100 hover:to-sky-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{language === 'es' ? 'Simulador Nativo' : 'Native Simulator'}</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Language toggle, Reminders trigger, Profile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenReminders}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-xs flex items-center gap-1.5"
              title={t.reminders.title}
              aria-label={t.reminders.title}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-medium">{t.nav.reminders}</span>
            </button>

            <button
              onClick={onOpenArch}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="Architecture info"
              aria-label="Architecture info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'en' ? 'Español' : 'English'}</span>
            </button>

            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 text-xs font-medium text-stone-800 hover:bg-stone-100 rounded-full transition-colors border border-blue-200 shadow-xs"
              aria-label="User Profile"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                {currentProfile.avatar}
              </div>
              <span className="hidden lg:inline">{currentProfile.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
