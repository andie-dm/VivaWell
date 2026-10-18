/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WellnessProvider, useWellness } from './context/WellnessContext';
import { MobileAppShell } from './components/MobileAppShell';
import { RhythmHero } from './components/RhythmHero';
import { RhythmSettingsModal } from './components/RhythmSettingsModal';
import { DomainsExplorer } from './components/DomainsExplorer';
import { ActivityDashboard } from './components/ActivityDashboard';
import { ResourcesExplorer } from './components/ResourcesExplorer';
import { BadgesGallery } from './components/BadgesGallery';
import { FutureNativeSimulator } from './components/FutureNativeSimulator';
import { WeeklyReflectionModal } from './components/WeeklyReflectionModal';
import { SupportiveRemindersModal } from './components/SupportiveRemindersModal';
import { ArchitectureInfoModal } from './components/ArchitectureInfoModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CelebrationModal } from './components/CelebrationModal';
import {
  Compass,
  BookMarked,
  X,
} from 'lucide-react';

function VivaWellApp() {
  const { t, language } = useWellness();
  const [activeTab, setActiveTab] = useState<'rhythm' | 'domains' | 'activity' | 'resources' | 'badges'>('rhythm');

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  return (
    <MobileAppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onOpenReminders={() => setIsRemindersOpen(true)}
      onOpenProfile={() => setIsProfileOpen(true)}
      onOpenArch={() => setIsArchModalOpen(true)}
    >
      {/* 1. Today / Rhythm Tab */}
      {activeTab === 'rhythm' && (
        <div className="space-y-6">
          <RhythmHero
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenReflection={() => setIsReflectionOpen(true)}
          />

          {/* Quick Domain Actions Section */}
          <div className="pt-2" id="today-habit-actions">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>
                  {language === 'es' ? 'Acciones para Hoy' : 'Actions for Today'}
                </span>
              </h3>
              <button
                onClick={() => setIsReflectionOpen(true)}
                className="px-2.5 py-1.5 text-xs font-medium text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1 min-h-[44px]"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>{t.nav.reflection}</span>
              </button>
            </div>

            <DomainsExplorer />
          </div>
        </div>
      )}

      {/* 2. Domains Tab */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          <DomainsExplorer />
        </div>
      )}

      {/* 3. Progress / Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <ActivityDashboard
            onOpenArchModal={() => setIsArchModalOpen(true)}
            onOpenSimulator={() => setIsSimulatorModalOpen(true)}
          />
        </div>
      )}

      {/* 4. Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <ResourcesExplorer />
        </div>
      )}

      {/* 5. Meaningful Badges Tab (Replaced Future Native destination) */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <BadgesGallery />
        </div>
      )}

      {/* Floating Modals */}
      <RhythmSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <WeeklyReflectionModal
        isOpen={isReflectionOpen}
        onClose={() => setIsReflectionOpen(false)}
      />
      <SupportiveRemindersModal
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
      />
      <ArchitectureInfoModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <CelebrationModal />

      {/* Native Simulator Modal (Available via Progress screen, not bottom nav) */}
      {isSimulatorModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">
                {language === 'es' ? 'Simulador de Integración Nativa (HealthKit / Health Connect)' : 'Native Integration Simulator (HealthKit / Health Connect)'}
              </h3>
              <button
                onClick={() => setIsSimulatorModalOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FutureNativeSimulator />
          </div>
        </div>
      )}
    </MobileAppShell>
  );
}

export default function App() {
  return (
    <WellnessProvider>
      <VivaWellApp />
    </WellnessProvider>
  );
}
