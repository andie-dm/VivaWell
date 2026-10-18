/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface VivaWellLogoProps {
  className?: string;
  size?: number;
}

export const VivaWellLogo: React.FC<VivaWellLogoProps> = ({
  className = 'w-8 h-8',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="VivaWell Logo"
    >
      <defs>
        {/* Petal 1: Top Magenta/Pink */}
        <linearGradient id="vw-magenta" x1="250" y1="40" x2="250" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>

        {/* Petal 2: Top-Right Gradient Blue (User's Favorite Petal) */}
        <linearGradient id="vw-blue-petal" x1="320" y1="100" x2="420" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        {/* Petal 3: Right Cyan/Teal */}
        <linearGradient id="vw-cyan" x1="470" y1="280" x2="350" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Petal 4: Bottom-Right Green */}
        <linearGradient id="vw-green" x1="410" y1="390" x2="300" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Petal 5: Bottom Lime */}
        <linearGradient id="vw-lime" x1="250" y1="470" x2="250" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A3E635" />
          <stop offset="100%" stopColor="#65A30D" />
        </linearGradient>

        {/* Petal 6: Bottom-Left Amber/Yellow */}
        <linearGradient id="vw-amber" x1="90" y1="390" x2="200" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Petal 7: Left Orange */}
        <linearGradient id="vw-orange" x1="30" y1="280" x2="160" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        {/* Petal 8: Top-Left Purple/Violet */}
        <linearGradient id="vw-purple" x1="80" y1="130" x2="180" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Inner Figure Purple Gradient Accent */}
        <linearGradient id="vw-inner-figure" x1="250" y1="170" x2="250" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Group of 8 Outer Petals */}
      <g id="petals">
        {/* 1. Top Petal (Magenta) */}
        <path
          d="M 250 35 C 295 85 305 155 270 185 C 255 170 245 170 230 185 C 195 155 205 85 250 35 Z"
          fill="url(#vw-magenta)"
        />

        {/* 2. Top-Right Petal (The iconic Blue Gradient Petal) */}
        <path
          d="M 405 105 C 430 165 405 235 345 235 C 335 210 320 185 300 165 C 330 120 375 90 405 105 Z"
          fill="url(#vw-blue-petal)"
        />

        {/* 3. Right Petal (Cyan / Aqua) */}
        <path
          d="M 475 265 C 455 325 390 350 335 315 C 330 285 320 260 300 240 C 355 230 435 220 475 265 Z"
          fill="url(#vw-cyan)"
        />

        {/* 4. Bottom-Right Petal (Green) */}
        <path
          d="M 410 425 C 350 455 285 415 280 355 C 300 340 315 320 330 295 C 375 320 415 375 410 425 Z"
          fill="url(#vw-green)"
        />

        {/* 5. Bottom Petal (Lime) */}
        <path
          d="M 250 485 C 205 435 195 365 230 335 C 245 350 255 350 270 335 C 305 365 295 435 250 485 Z"
          fill="url(#vw-lime)"
        />

        {/* 6. Bottom-Left Petal (Warm Amber) */}
        <path
          d="M 90 425 C 85 375 125 320 170 295 C 185 320 200 340 220 355 C 215 415 150 455 90 425 Z"
          fill="url(#vw-amber)"
        />

        {/* 7. Left Petal (Warm Orange) */}
        <path
          d="M 25 265 C 65 220 145 230 200 240 C 180 260 170 285 165 315 C 110 350 45 325 25 265 Z"
          fill="url(#vw-orange)"
        />

        {/* 8. Top-Left Petal (Violet / Purple) */}
        <path
          d="M 95 105 C 125 90 170 120 200 165 C 180 185 165 210 155 235 C 95 235 70 165 95 105 Z"
          fill="url(#vw-purple)"
        />
      </g>

      {/* Central Joyful Human Silhouette (Arms reaching upwards like blossoming leaves) */}
      <g id="human-blossom-center">
        {/* Head */}
        <circle cx="250" cy="190" r="24" fill="#FFFFFF" />

        {/* Inner Shading behind head / chest for depth */}
        <path
          d="M 230 205 Q 250 245 270 205 Q 260 270 250 275 Q 240 270 230 205 Z"
          fill="url(#vw-inner-figure)"
          opacity="0.85"
        />

        {/* White Silhouette: Joyful Human Body with Outstretched Arms */}
        <path
          d="M 250 240
             C 240 220 190 185 155 170
             C 175 210 220 250 238 275
             C 244 285 242 335 240 375
             C 247 365 253 365 260 375
             C 258 335 256 285 262 275
             C 280 250 325 210 345 170
             C 310 185 260 220 250 240 Z"
          fill="#FFFFFF"
        />
      </g>
    </svg>
  );
};
