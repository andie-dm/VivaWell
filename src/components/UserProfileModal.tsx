/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useWellness } from '../context/WellnessContext';
import { X, User, Globe, RotateCcw, Download, Check } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentProfile,
    profiles,
    switchProfile,
    preferences,
    resetAllData,
    exportDataJson,
    t,
    language,
  } = useWellness();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vivawell_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm(language === 'es' ? '¿Restablecer datos a los valores iniciales de demostración?' : 'Reset all data to clean demo state?')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-stone-900">
              {t.profile.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-sm">
          {/* Active Profile Info */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 via-blue-600 to-blue-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {currentProfile.avatar}
            </div>
            <div>
              <h4 className="font-bold text-stone-900">{currentProfile.name}</h4>
              <p className="text-xs text-stone-500">
                {language === 'es' ? 'Cuenta local de prueba' : 'Local demo profile'}
              </p>
            </div>
          </div>

          {/* Switch Profile */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.profile.switchProfile}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {profiles.map((p) => {
                const isSelected = p.id === currentProfile.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => switchProfile(p.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-colors ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-medium ring-1 ring-blue-500/20'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-800 text-xs font-bold flex items-center justify-center">
                      {p.avatar}
                    </div>
                    <span className="text-xs truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Zone Display */}
          <div className="p-3 rounded-xl border border-stone-100 bg-stone-50/70 flex items-center justify-between text-xs text-stone-600">
            <span className="font-medium flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              {t.profile.currentTimezone}:
            </span>
            <span className="font-mono text-stone-800">{preferences.userTimeZone}</span>
          </div>

          {/* Export & Reset Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Download className="w-4 h-4" />}
              <span>{t.profile.exportData}</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2.5 px-3 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.profile.resetData}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 rounded-xl min-h-[44px] flex items-center justify-center"
          >
            {t.profile.close}
          </button>
        </div>
      </div>
    </div>
  );
};
