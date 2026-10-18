/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WELLNESS_DOMAINS } from '../data/defaultWellnessData';
import { WellnessDomainId } from '../types/wellness';
import { useWellness } from '../context/WellnessContext';
import {
  Activity,
  Heart,
  BookOpen,
  Users,
  Compass,
  Leaf,
  Briefcase,
  PiggyBank,
} from 'lucide-react';

const domainIconMap: Record<WellnessDomainId, React.FC<{ className?: string }>> = {
  physical: Activity,
  emotional: Heart,
  intellectual: BookOpen,
  social: Users,
  spiritual: Compass,
  environmental: Leaf,
  occupational: Briefcase,
  financial: PiggyBank,
};

interface WellnessWheelProps {
  selectedDomain: WellnessDomainId | 'all';
  onSelectDomain: (id: WellnessDomainId | 'all') => void;
}

export const WellnessWheel: React.FC<WellnessWheelProps> = ({
  selectedDomain,
  onSelectDomain,
}) => {
  const { language, completions, todayDate } = useWellness();

  // 8 sectors evenly distributed (45 degrees each)
  const angleStep = 360 / 8;
  const radius = 135;
  const innerRadius = 55;
  const cx = 175;
  const cy = 175;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
      <div className="text-center mb-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {language === 'es' ? 'Rueda Visual de Bienestar' : 'Visual Wellness Wheel'}
        </h4>
        <p className="text-[11px] text-stone-400 mt-0.5">
          {language === 'es'
            ? 'Toca un pétalo para explorar o filtrar hábitos de esa dimensión'
            : 'Tap any petal to explore or filter habits in that dimension'}
        </p>
      </div>

      <div className="relative w-[310px] h-[310px] flex items-center justify-center">
        <svg viewBox="0 0 350 350" className="w-full h-full drop-shadow-xs">
          {WELLNESS_DOMAINS.map((domain, index) => {
            const startAngle = index * angleStep - 90;
            const endAngle = startAngle + angleStep;
            const isSelected = selectedDomain === domain.id;

            // Geometry calculations for sector
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const midRad = ((startAngle + angleStep / 2) * Math.PI) / 180;

            const x1 = cx + radius * Math.cos(startRad);
            const y1 = cy + radius * Math.sin(startRad);
            const x2 = cx + radius * Math.cos(endRad);
            const y2 = cy + radius * Math.sin(endRad);

            const ix1 = cx + innerRadius * Math.cos(startRad);
            const iy1 = cy + innerRadius * Math.sin(startRad);
            const ix2 = cx + innerRadius * Math.cos(endRad);
            const iy2 = cy + innerRadius * Math.sin(endRad);

            const pathD = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1} Z`;

            // Label positions
            const labelRadius = (radius + innerRadius) / 2;
            const labelX = cx + labelRadius * Math.cos(midRad);
            const labelY = cy + labelRadius * Math.sin(midRad);

            // Check if user completed an action in this domain today
            const hasCompletedToday = completions.some(
              (c) => c.domain === domain.id && c.localDate === todayDate && !c.isUndone
            );

            return (
              <g
                key={domain.id}
                onClick={() => onSelectDomain(selectedDomain === domain.id ? 'all' : domain.id)}
                className="cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={`${language === 'es' ? domain.nameEs : domain.nameEn} domain`}
              >
                <path
                  d={pathD}
                  fill={domain.accentColor}
                  fillOpacity={isSelected ? 0.95 : 0.72}
                  stroke={isSelected ? '#0F172A' : '#FFFFFF'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-all duration-200"
                />
                {hasCompletedToday && (
                  <circle
                    cx={cx + (radius - 12) * Math.cos(midRad)}
                    cy={cy + (radius - 12) * Math.sin(midRad)}
                    r="4"
                    fill="#FFFFFF"
                    stroke={domain.accentColor}
                    strokeWidth="1.5"
                  />
                )}
                {/* Sector text or label point */}
                <text
                  x={labelX}
                  y={labelY}
                  fill={domain.textColor}
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none drop-shadow-xs"
                >
                  {(language === 'es' ? domain.nameEs : domain.nameEn).slice(0, 4)}
                </text>
              </g>
            );
          })}

          {/* Central Hub Button to reset or show 'All' */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius - 4}
            fill="#FFFFFF"
            stroke="#E2E8F0"
            strokeWidth="2"
            className="cursor-pointer transition-colors hover:fill-blue-50"
            onClick={() => onSelectDomain('all')}
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fontWeight="bold"
            fill="#0F172A"
            className="pointer-events-none select-none"
          >
            {selectedDomain === 'all'
              ? language === 'es'
                ? 'Todos'
                : 'All'
              : (WELLNESS_DOMAINS.find((d) => d.id === selectedDomain)?.nameEn || '')}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="#64748B"
            className="pointer-events-none select-none"
          >
            {language === 'es' ? '8 pétalos' : '8 petals'}
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-xs">
        {WELLNESS_DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          return (
            <button
              key={domain.id}
              onClick={() => onSelectDomain(isSelected ? 'all' : domain.id)}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                isSelected
                  ? 'border-stone-900 shadow-xs'
                  : 'border-transparent opacity-85 hover:opacity-100'
              }`}
              style={{
                backgroundColor: domain.surfaceColor,
                color: domain.textColor,
              }}
            >
              {language === 'es' ? domain.nameEs : domain.nameEn}
            </button>
          );
        })}
      </div>
    </div>
  );
};
