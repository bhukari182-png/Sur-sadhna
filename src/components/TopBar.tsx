import React from 'react';
import { LayaSpeed, PitchNote } from '../types/music';
import { Volume2, VolumeX, Moon, Sun, Play, Square, Music } from 'lucide-react';

interface TopBarProps {
  selectedTaalName: string;
  currentLaya: LayaSpeed;
  bpm: number;
  currentMatra: number;
  totalMatras: number;
  isSam: boolean;
  isTablaPlaying: boolean;
  isTanpuraPlaying: boolean;
  onToggleTabla: () => void;
  onToggleTanpura: () => void;
  saNote: PitchNote;
  saGender: 'male' | 'female';
  masterVolume: number;
  onMasterVolumeChange: (v: number) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAbout?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  selectedTaalName,
  currentLaya,
  bpm,
  currentMatra,
  totalMatras,
  isSam,
  isTablaPlaying,
  isTanpuraPlaying,
  onToggleTabla,
  onToggleTanpura,
  saNote,
  saGender,
  masterVolume,
  onMasterVolumeChange,
  isDarkMode,
  onToggleTheme,
  onOpenAbout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#180509]/95 backdrop-blur-md border-b border-[#d4af37]/25 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#5a1827] flex items-center justify-center shadow-lg border border-[#ffd700]/40">
            <Music className="w-5 h-5 text-[#140508]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-sm sm:text-base md:text-lg font-black tracking-wider text-[#ffd700] whitespace-nowrap">
                ZAWAR HUSSAIN – SUR SADHNA
              </span>
              {onOpenAbout && (
                <button
                  onClick={onOpenAbout}
                  className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37]/25 to-[#ffd700]/10 border border-[#ffd700]/40 text-[10px] text-[#ffd700] font-bold hover:bg-[#d4af37]/40 transition"
                  title="About Ustad Zawar Hussain"
                >
                  Ustad Zawar Hussain
                </button>
              )}
            </div>
            <span className="text-[10px] text-[#d4af37]/80 tracking-tight hidden sm:inline font-medium">
              Professional Indian Classical Music Practice Studio
            </span>
          </div>
        </div>

        {/* Live Status Indicators & Quick Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {/* Matra Counter Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#250a11] border border-[#d4af37]/30 text-xs">
            <span className="text-[10px] uppercase text-[#d4af37]/70 font-medium">Matra</span>
            <span className={`font-mono font-bold tabular-nums ${isSam ? 'text-[#ff9800] scale-110' : 'text-[#ffd700]'}`}>
              {currentMatra}/{totalMatras}
            </span>
            {isSam && (
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#ff9800] text-black font-extrabold animate-pulse">
                SAM
              </span>
            )}
          </div>

          {/* Current Taal & Laya */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#250a11] border border-[#d4af37]/30 text-xs text-[#ffd700]">
            <span className="font-serif font-bold">{selectedTaalName}</span>
            <span className="text-[#d4af37]/50">·</span>
            <span className="capitalize text-[#d4af37]/90">{currentLaya}</span>
            <span className="text-[#d4af37]/50">·</span>
            <span className="font-mono tabular-nums">{bpm} BPM</span>
          </div>

          {/* Sa Pitch Tag */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#250a11] border border-[#d4af37]/30 text-xs text-[#d4af37]">
            <span className="text-[10px] uppercase text-[#d4af37]/70">Sa:</span>
            <span className="font-bold text-[#ffd700]">{saNote}</span>
            <span className="text-[10px] opacity-75">({saGender})</span>
          </div>

          {/* Tabla Quick Toggle */}
          <button
            onClick={onToggleTabla}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-sm ${
              isTablaPlaying
                ? 'bg-[#d4af37] text-[#140508] shadow-md shadow-[#d4af37]/30'
                : 'bg-[#280c14] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#39121d]'
            }`}
          >
            {isTablaPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>Tabla</span>
          </button>

          {/* Tanpura Quick Toggle */}
          <button
            onClick={onToggleTanpura}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-sm ${
              isTanpuraPlaying
                ? 'bg-[#d4af37] text-[#140508] shadow-md shadow-[#d4af37]/30'
                : 'bg-[#280c14] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#39121d]'
            }`}
          >
            {isTanpuraPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            <span>Tanpura</span>
          </button>
        </div>

        {/* Action Zone: Volume & Theme */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Master Volume Quick Slider */}
          <div className="hidden sm:flex items-center gap-2 bg-[#250a11] px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
            {masterVolume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-[#d4af37]/60" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
              className="w-16 h-1 accent-[#d4af37]"
              title="Master Volume"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-[#250a11] hover:bg-[#38111c] text-[#ffd700] border border-[#d4af37]/30 transition"
            title={isDarkMode ? 'Switch to Parchment Mode' : 'Switch to Imperial Maroon Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
