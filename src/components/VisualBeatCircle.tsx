import React from 'react';
import { BeatInfo } from '../types/music';

interface VisualBeatCircleProps {
  beats: BeatInfo[];
  currentMatra: number;
  isPlaying: boolean;
  bpm: number;
}

export const VisualBeatCircle: React.FC<VisualBeatCircleProps> = ({
  beats,
  currentMatra,
  isPlaying,
  bpm,
}) => {
  const totalBeats = beats.length;
  const radius = 95;
  const center = 120;

  const currentBeat = beats.find(b => b.matra === currentMatra) || beats[0];

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* Circular SVG Beat Ring */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 240 240">
          {/* Subtle outer track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(212, 175, 55, 0.12)"
            strokeWidth="8"
          />

          {/* Golden active arc */}
          {isPlaying && (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#d4af37"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * radius}
              strokeDashoffset={2 * Math.PI * radius * (1 - currentMatra / totalBeats)}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          )}

          {/* Individual Beat Nodes */}
          {beats.map((beat, i) => {
            const angle = (i / totalBeats) * 2 * Math.PI;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            const isActive = isPlaying && beat.matra === currentMatra;

            let nodeColor = 'rgba(212, 175, 55, 0.4)';
            let nodeRadius = 5;

            if (beat.isSam) {
              nodeColor = isActive ? '#ffd700' : '#e65100'; // Sam is highlighted
              nodeRadius = isActive ? 10 : 7;
            } else if (beat.isTali) {
              nodeColor = isActive ? '#ffd700' : '#d4af37';
              nodeRadius = isActive ? 8 : 6;
            } else if (beat.isKhali) {
              nodeColor = isActive ? '#90caf9' : '#5c6bc0';
              nodeRadius = isActive ? 7 : 5;
            } else if (isActive) {
              nodeColor = '#ffd700';
              nodeRadius = 7;
            }

            return (
              <g key={beat.matra}>
                <circle
                  cx={x}
                  cy={y}
                  r={nodeRadius}
                  fill={nodeColor}
                  className="transition-all duration-100"
                />
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeRadius + 4}
                    fill="none"
                    stroke="#ffd700"
                    strokeWidth="2"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-xs uppercase tracking-widest text-[#d4af37]/70 font-medium">
            {currentBeat?.isSam ? '★ SAM / سم' : currentBeat?.isKhali ? 'KHALI / خالی' : currentBeat?.isTali ? 'TALI / تالی' : 'MATRA'}
          </span>
          <span className="font-cinzel text-5xl font-extrabold text-[#ffd700] tracking-tight my-0.5 tabular-nums drop-shadow-md">
            {currentMatra}
            <span className="text-xl font-normal text-[#d4af37]/60">/{totalBeats}</span>
          </span>
          <span className="font-serif text-2xl font-bold text-[#fff2cc] tracking-wide">
            {currentBeat?.bol}
          </span>
          {currentBeat?.urduBol && (
            <span className="text-sm text-[#d4af37]/80 -mt-0.5">
              {currentBeat.urduBol}
            </span>
          )}
        </div>
      </div>

      {/* Vibhag Sign & Matra Tagline */}
      <div className="flex items-center gap-3 mt-1 text-xs text-[#d4af37]/80">
        <span className="px-2 py-0.5 rounded bg-[#2b0d14] border border-[#d4af37]/30 font-mono">
          Sign: {currentBeat?.sign || '—'}
        </span>
        <span className="font-medium">
          Division {currentBeat ? currentBeat.vibhagIndex + 1 : 1}
        </span>
        <span>·</span>
        <span className="font-mono tabular-nums">{bpm} BPM</span>
      </div>
    </div>
  );
};
