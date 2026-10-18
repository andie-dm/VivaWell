/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useWellness } from '../context/WellnessContext';
import { BACKGROUND_TRACKING_DISCLOSURE } from '../services/activityAdapter';
import { X, ShieldCheck, Smartphone, Server, Cpu, AlertTriangle } from 'lucide-react';

interface ArchitectureInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureInfoModal: React.FC<ArchitectureInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useWellness();
  const info = BACKGROUND_TRACKING_DISCLOSURE[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {info.title}
            </h3>
            <p className="text-xs text-stone-500">
              {info.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-stone-700">
          {/* Prototype reality check */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {language === 'es' ? 'Aviso del Prototipo Lovable' : 'Prototype Status Notice'}
              </p>
              <p className="mt-1 leading-relaxed text-amber-900/90">
                {language === 'es'
                  ? 'Esta versión es un prototipo interactivo con datos de actividad ficticios claramente etiquetados. No hay ninguna conexión activa con dispositivos ni sensores reales.'
                  : 'This prototype runs on clearly labeled simulated activity data. No real device sensor or background operating-system connection is active in this browser tab.'}
              </p>
            </div>
          </div>

          {/* Section 1: Why Closed Web Tabs Cannot Count Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-rose-600" />
              {language === 'es' ? '1. ¿Por qué los navegadores no cuentan pasos en segundo plano?' : '1. Why Closed Browsers Cannot Track Steps'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {info.whyWebCannot}
            </p>
          </div>

          {/* Section 2: Native Platform Health Services Requirement */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-600" />
              {language === 'es' ? '2. Requisitos de Plataforma Nativa' : '2. Native Platform Requirements'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {info.nativeRequirement}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                <span className="font-bold text-stone-900 block mb-1">iOS (Apple HealthKit)</span>
                <span className="text-stone-500 text-[11px] leading-snug block">
                  {language === 'es'
                    ? 'Requiere binario nativo en Swift/Obj-C, permiso de lectura HKQuantityTypeIdentifierStepCount y entrega en segundo plano con límites de frecuencia del SO.'
                    : 'Requires native Swift binary, HKQuantityTypeIdentifierStepCount read entitlement, and background observer query constraints.'}
                </span>
              </div>
              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                <span className="font-bold text-stone-900 block mb-1">Android (Health Connect)</span>
                <span className="text-stone-500 text-[11px] leading-snug block">
                  {language === 'es'
                    ? 'Requiere cliente SDK de Health Connect, declaración de permisos en el Manifest y sincronización periódica mediante WorkManager autorizada por el usuario.'
                    : 'Requires Health Connect SDK, AndroidManifest declarations, and user-authorized periodic WorkManager synchronization.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Backend Synchronization Role */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              {language === 'es' ? '3. Rol del Servidor y Base de Datos' : '3. Server Architecture & Sync Role'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {info.backendRole}
            </p>
          </div>

          {/* Section 4: Privacy & Anti-Calorie Commitment */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
            <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {language === 'es' ? 'Compromiso Ético y de Privacidad' : 'Privacy & Ethical Wellness Commitment'}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {info.privacyCommitment}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
          >
            {t.architecture.close}
          </button>
        </div>
      </div>
    </div>
  );
};
