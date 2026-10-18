/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import {
  Smartphone,
  ShieldCheck,
  Cpu,
  Layers,
  BatteryCharging,
  Wifi,
  Signal,
  Check,
  RefreshCw,
  Plus,
  Footprints,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Award,
} from 'lucide-react';

export const FutureNativeSimulator: React.FC = () => {
  const { t, language, streakResult, preferences } = useWellness();
  const simT = t.nativeSimulator;

  // Platform state: 'ios' | 'android'
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  // Screen View state: 'device' | 'permissions' | 'background' | 'dedup'
  const [activeScreen, setActiveScreen] = useState<'device' | 'permissions' | 'background' | 'dedup'>('device');

  // Simulated Device State
  const [simSteps, setSimSteps] = useState(6450);
  const [simActiveMinutes, setSimActiveMinutes] = useState(42);
  const [simLastSyncMinutesAgo, setSimLastSyncMinutesAgo] = useState(14);
  const [permissionGranted, setPermissionGranted] = useState(true);

  // Permission toggles inside native sheet
  const [permSteps, setPermSteps] = useState(true);
  const [permDistance, setPermDistance] = useState(true);
  const [permEnergy, setPermEnergy] = useState(false); // Optional active energy

  // Background sync animation state
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);
  const [batchLog, setBatchLog] = useState<string[]>([]);

  // Add 500 steps simulation
  const handleAddSteps = () => {
    setSimSteps((prev) => prev + 500);
    setSimActiveMinutes((prev) => prev + 6);
    setSimLastSyncMinutesAgo(0);
  };

  // Trigger 6-hour background sync simulation
  const handleTriggerBackgroundBatch = () => {
    setIsSimulatingBatch(true);
    setBatchLog([
      platform === 'ios'
        ? 'iOS healthd triggered HKObserverQuery background delivery...'
        : 'Android WorkManager initiated periodic HealthConnect sync...',
      'Secure Enclave sensor deltas collected: +1,240 steps.',
      'Deduplicating overlapping phone and watch samples...',
      'Encrypted delta transmitted to VivaWell API.',
      'Wellness rhythm streak verified at midnight boundary.',
    ]);

    setTimeout(() => {
      setSimSteps((prev) => prev + 1240);
      setSimActiveMinutes((prev) => prev + 15);
      setSimLastSyncMinutesAgo(1);
      setIsSimulatingBatch(false);
    }, 1800);
  };

  const handleReset = () => {
    setSimSteps(6450);
    setSimActiveMinutes(42);
    setSimLastSyncMinutesAgo(14);
    setPermissionGranted(true);
    setPermSteps(true);
    setPermDistance(true);
    setPermEnergy(false);
    setBatchLog([]);
    setActiveScreen('device');
  };

  return (
    <div className="space-y-8">
      {/* Judges Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30 uppercase tracking-wider">
              {simT.navBadge}
            </span>
            <span className="text-xs text-stone-300">
              {platform === 'ios' ? 'iOS 18 · HealthKit Framework' : 'Android 15 · Health Connect API'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {simT.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            {simT.subtitle}
          </p>
        </div>

        {/* Platform Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-800/90 rounded-xl border border-stone-700/80 shrink-0">
          <button
            onClick={() => setPlatform('ios')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              platform === 'ios'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Apple iOS</span>
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              platform === 'android'
                ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Phone Device Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Phone Bezel */}
          <div className="w-[340px] sm:w-[360px] h-[680px] bg-stone-950 rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 relative flex flex-col overflow-hidden">
            {/* Phone Screen Area */}
            <div className="w-full h-full bg-stone-50 rounded-[38px] flex flex-col overflow-hidden relative select-none">
              {/* Status Bar */}
              <div className="h-10 px-6 pt-3 flex items-center justify-between text-[11px] font-semibold text-stone-900 z-30 shrink-0">
                <span>9:41</span>
                {/* Dynamic Island or Camera Hole */}
                <div
                  className={
                    platform === 'ios'
                      ? 'w-24 h-5 bg-black rounded-full mx-auto'
                      : 'w-3.5 h-3.5 bg-black rounded-full mx-auto'
                  }
                />
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <BatteryCharging className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Sub-view switcher inside device */}
              <div className="px-3 pt-1 pb-2 bg-white border-b border-stone-200 flex items-center justify-between text-[10px] font-medium text-stone-500 shrink-0">
                <span className="font-bold text-stone-800 truncate">
                  {platform === 'ios' ? 'VivaWell iOS Native' : 'VivaWell Android'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {permissionGranted ? 'Live Health Link' : 'No Permission'}
                </span>
              </div>

              {/* Screen Content Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* VIEW 1: Native Mobile App Dashboard */}
                {activeScreen === 'device' && (
                  <div className="space-y-4">
                    {/* Native App Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                          {language === 'es' ? 'Mi Ritmo Diario' : 'Daily Rhythm'}
                        </span>
                        <h4 className="text-base font-bold text-stone-900">
                          VivaWell
                        </h4>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                        EM
                      </div>
                    </div>

                    {/* Streak Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#1D4ED8] text-white shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium opacity-90">
                          {t.rhythm.currentStreak}
                        </span>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                          {language === 'es' ? '4 días / sem' : '4 days / wk'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold tabular-nums">
                          {streakResult.currentStreak}
                        </span>
                        <span className="text-xs opacity-80">
                          {streakResult.streakUnit === 'weeks' ? t.rhythm.weeks : t.rhythm.days}
                        </span>
                      </div>
                    </div>

                    {/* Native Provider Sync Card */}
                    <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <Footprints className="w-4 h-4 text-blue-600" />
                          {t.activity.stepsTitle}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {platform === 'ios' ? 'HealthKit' : 'Health Connect'}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-stone-900 tabular-nums">
                          {simSteps.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-stone-500">
                          / 7,000 {t.activity.stepsUnit}
                        </span>
                      </div>

                      <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.round((simSteps / 7000) * 100))}%` }}
                        />
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400">
                        <span>
                          {t.activity.movementTitle}: {simActiveMinutes} min
                        </span>
                        <span>
                          {simLastSyncMinutesAgo === 0
                            ? (language === 'es' ? 'Sincronizado ahora' : 'Synced just now')
                            : `${simLastSyncMinutesAgo}m ago`}
                        </span>
                      </div>
                    </div>

                    {/* Today's 1-Tap Wellness Habit */}
                    <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-800">
                          {language === 'es' ? 'Acción de Hoy' : 'Today’s Gentle Action'}
                        </span>
                        <span className="text-[10px] text-stone-400">Physical</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-snug">
                        {language === 'es'
                          ? 'Caminata Consciente al Aire Libre (20 min)'
                          : 'Mindful Outdoor Walk (20 min)'}
                      </p>
                      <div className="pt-1">
                        <div className="p-2 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-900 text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>
                            {language === 'es'
                              ? 'Califica para tu ritmo de bienestar'
                              : 'Counts toward your wellness rhythm'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: Native OS Permission Sheet */}
                {activeScreen === 'permissions' && (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                      <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                          {platform === 'ios' ? '' : 'G'}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-stone-900">
                            {platform === 'ios' ? simT.osSheet.appleHeader : simT.osSheet.androidHeader}
                          </h5>
                          <span className="text-[10px] text-stone-500">
                            {platform === 'ios' ? 'HealthKit Security Dialog' : 'Health Connect Permission'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        {platform === 'ios' ? simT.osSheet.applePrompt : simT.osSheet.androidPrompt}
                      </p>

                      {/* Permissions toggles */}
                      <div className="space-y-2 pt-1 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                          <span className="text-stone-800 font-medium text-[11px]">
                            {platform === 'ios' ? simT.osSheet.appleSteps : simT.osSheet.androidSteps}
                          </span>
                          <input
                            type="checkbox"
                            checked={permSteps}
                            onChange={(e) => setPermSteps(e.target.checked)}
                            className="rounded text-blue-600"
                          />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                          <span className="text-stone-800 font-medium text-[11px]">
                            {platform === 'ios' ? simT.osSheet.appleMovement : simT.osSheet.androidMovement}
                          </span>
                          <input
                            type="checkbox"
                            checked={permDistance}
                            onChange={(e) => setPermDistance(e.target.checked)}
                            className="rounded text-blue-600"
                          />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                          <div>
                            <span className="text-stone-800 font-medium text-[11px] block">
                              {platform === 'ios' ? simT.osSheet.appleEnergy : simT.osSheet.androidEnergy}
                            </span>
                            <span className="text-[9px] text-stone-400">
                              {language === 'es' ? 'Opcional / Desactivado' : 'Optional / Off by default'}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={permEnergy}
                            onChange={(e) => setPermEnergy(e.target.checked)}
                            className="rounded text-blue-600"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-400 leading-snug">
                        {platform === 'ios'
                          ? simT.osSheet.applePrivacyNotice
                          : simT.osSheet.androidPrivacyNotice}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setPermissionGranted(false);
                            setActiveScreen('device');
                          }}
                          className="flex-1 py-1.5 text-[11px] font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg text-center"
                        >
                          {simT.osSheet.deny}
                        </button>
                        <button
                          onClick={() => {
                            setPermissionGranted(true);
                            setActiveScreen('device');
                          }}
                          className="flex-1 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 hover:from-sky-600 hover:to-blue-800 rounded-lg text-center shadow-xs"
                        >
                          {simT.osSheet.allow}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 3: OS Background Daemon Pipeline */}
                {activeScreen === 'background' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <h5 className="font-bold text-stone-900 text-xs">
                          {platform === 'ios' ? 'iOS healthd Daemon' : 'Android WorkManager Engine'}
                        </h5>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        {platform === 'ios'
                          ? 'App is currently CLOSED. The hardware coprocessor measures step pulses without running JavaScript.'
                          : 'App is terminated. Android Sensor Core batches step events in hardware buffer.'}
                      </p>

                      {/* Status indicator */}
                      <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-[11px] flex items-center justify-between">
                        <span>Background Observer:</span>
                        <span className="font-bold text-blue-700">Active (Passive Mode)</span>
                      </div>
                    </div>

                    {/* Batch Log stream */}
                    {batchLog.length > 0 && (
                      <div className="p-3 rounded-xl bg-stone-900 text-stone-200 font-mono text-[10px] space-y-1.5 shadow-inner">
                        <div className="text-sky-400 font-bold border-b border-stone-800 pb-1 flex items-center justify-between">
                          <span>SYNC LOG</span>
                          <span>COMPLETED</span>
                        </div>
                        {batchLog.map((log, idx) => (
                          <div key={idx} className="leading-snug">
                            &gt; {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW 4: Multi-Device Sensor Deduplication */}
                {activeScreen === 'dedup' && (
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-3">
                      <h5 className="font-bold text-stone-900 text-xs">
                        {simT.dedup.title}
                      </h5>
                      <p className="text-[11px] text-stone-500 leading-snug">
                        {simT.dedup.subtitle}
                      </p>

                      <div className="space-y-2 pt-1 text-[11px]">
                        <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
                          <span className="text-stone-700 font-medium">
                            {simT.dedup.phoneLabel}
                          </span>
                          <span className="font-mono font-bold text-stone-900">
                            6,200
                          </span>
                        </div>

                        <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
                          <span className="text-stone-700 font-medium">
                            {simT.dedup.watchLabel}
                          </span>
                          <span className="font-mono font-bold text-stone-900">
                            6,450
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-300 text-blue-950 flex items-center justify-between">
                          <span className="font-bold">
                            {simT.dedup.mergedLabel}
                          </span>
                          <span className="font-mono font-extrabold text-sm text-blue-800">
                            6,450 steps
                          </span>
                        </div>
                      </div>

                      <p className="text-[10px] text-stone-500 leading-relaxed border-t border-stone-100 pt-2">
                        {simT.dedup.dedupExplanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Native Bottom Navigation Bar */}
              <div className="h-14 bg-white/95 border-t border-stone-200 grid grid-cols-4 items-center px-2 shrink-0">
                <button
                  onClick={() => setActiveScreen('device')}
                  className={`flex flex-col items-center justify-center py-1 ${
                    activeScreen === 'device' ? 'text-blue-700 font-bold' : 'text-stone-400'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Rhythm</span>
                </button>
                <button
                  onClick={() => setActiveScreen('permissions')}
                  className={`flex flex-col items-center justify-center py-1 ${
                    activeScreen === 'permissions' ? 'text-blue-700 font-bold' : 'text-stone-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Access</span>
                </button>
                <button
                  onClick={() => setActiveScreen('background')}
                  className={`flex flex-col items-center justify-center py-1 ${
                    activeScreen === 'background' ? 'text-blue-700 font-bold' : 'text-stone-400'
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Daemon</span>
                </button>
                <button
                  onClick={() => setActiveScreen('dedup')}
                  className={`flex flex-col items-center justify-center py-1 ${
                    activeScreen === 'dedup' ? 'text-blue-700 font-bold' : 'text-stone-400'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-[9px] mt-0.5">Dedup</span>
                </button>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="h-4 bg-white flex items-center justify-center shrink-0">
                <div className="w-32 h-1 bg-stone-300 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Simulation Control Center & Architectural Blueprint (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Controls Panel */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                {simT.currentViewLabel}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveScreen('device')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    activeScreen === 'device'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {simT.views.device}
                </button>
                <button
                  onClick={() => setActiveScreen('permissions')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    activeScreen === 'permissions'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {simT.views.permissions}
                </button>
                <button
                  onClick={() => setActiveScreen('background')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    activeScreen === 'background'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {simT.views.background}
                </button>
                <button
                  onClick={() => setActiveScreen('dedup')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                    activeScreen === 'dedup'
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {simT.views.dedup}
                </button>
              </div>
            </div>

            {/* Simulation Action Triggers */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-700 block mb-2.5">
                {language === 'es' ? 'Acciones Interactivas para Jueces:' : 'Interactive Live Triggers:'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={handleAddSteps}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white hover:from-sky-600 hover:to-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{simT.simActions.addSteps}</span>
                </button>

                <button
                  onClick={handleTriggerBackgroundBatch}
                  disabled={isSimulatingBatch}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingBatch ? 'animate-spin' : ''}`} />
                  <span>{simT.simActions.triggerBackgroundBatch}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  {simT.simActions.reset}
                </button>
              </div>
            </div>
          </div>

          {/* Three Architecture Pillars Explained */}
          <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {simT.daemon.title}
            </h3>
            <p className="text-xs text-stone-600">
              {simT.daemon.subtitle}
            </p>

            <div className="space-y-3 pt-1">
              {/* Pillar 1 */}
              <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {simT.daemon.step1Title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {simT.daemon.step1Desc}
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {simT.daemon.step2Title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {simT.daemon.step2Desc}
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 rounded-xl border border-stone-200/90 bg-stone-50/60 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">
                    {simT.daemon.step3Title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {simT.daemon.step3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Judges Architecture Note */}
          <div className="p-4 rounded-xl bg-stone-100/70 border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-900 block mb-0.5">
                {simT.judgesNote.badge}
              </span>
              <p className="leading-relaxed">
                {simT.judgesNote.body}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
