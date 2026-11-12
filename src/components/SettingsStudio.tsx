import React, { useState, useEffect } from 'react';
import { PitchNote } from '../types/music';
import { Sliders, Volume2, RotateCcw, Bookmark, Save, Sparkles, Moon, Sun, Download } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Preset {
  id: string;
  name: string;
  taalId: string;
  raagId: string;
  bpm: number;
  pitch: PitchNote;
  gender: 'male' | 'female';
}

interface SettingsStudioProps {
  saNote: PitchNote;
  onSaNoteChange: (n: PitchNote) => void;
  saGender: 'male' | 'female';
  onSaGenderChange: (g: 'male' | 'female') => void;
  referenceFreq: number;
  onReferenceFreqChange: (f: number) => void;
  masterVolume: number;
  onMasterVolumeChange: (v: number) => void;
  tablaVolume: number;
  onTablaVolumeChange: (v: number) => void;
  tanpuraVolume: number;
  onTanpuraVolumeChange: (v: number) => void;
  swarmandalVolume: number;
  onSwarmandalVolumeChange: (v: number) => void;
  harmoniumVolume: number;
  onHarmoniumVolumeChange: (v: number) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onResetAllSettings: () => void;
  onLoadPreset: (preset: Preset) => void;
  currentTaalId: string;
  currentRaagId: string;
  currentBpm: number;
}

const LOCAL_STORAGE_PRESETS_KEY = 'sur_sadhana_presets';

export const SettingsStudio: React.FC<SettingsStudioProps> = ({
  saNote,
  onSaNoteChange,
  saGender,
  onSaGenderChange,
  referenceFreq,
  onReferenceFreqChange,
  masterVolume,
  onMasterVolumeChange,
  tablaVolume,
  onTablaVolumeChange,
  tanpuraVolume,
  onTanpuraVolumeChange,
  swarmandalVolume,
  onSwarmandalVolumeChange,
  harmoniumVolume,
  onHarmoniumVolumeChange,
  isDarkMode,
  onToggleTheme,
  onResetAllSettings,
  onLoadPreset,
  currentTaalId,
  currentRaagId,
  currentBpm,
}) => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');

  const CHROMATIC_NOTES: PitchNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESETS_KEY);
      if (saved) {
        setPresets(JSON.parse(saved));
      } else {
        // Initial sample presets
        const initial: Preset[] = [
          {
            id: 'preset_1',
            name: 'Morning Bhairavi Sadhana (Teentaal)',
            taalId: 'teentaal',
            raagId: 'bhairavi',
            bpm: 108,
            pitch: 'C#',
            gender: 'male',
          },
          {
            id: 'preset_2',
            name: 'Evening Yaman Riyaz (Keharwa)',
            taalId: 'keharwa',
            raagId: 'yaman',
            bpm: 120,
            pitch: 'D',
            gender: 'male',
          },
          {
            id: 'preset_3',
            name: 'Sufi Qawwali Sulfakhta (5 Matra)',
            taalId: 'sulfakhta_pakistani',
            raagId: 'kafi',
            bpm: 96,
            pitch: 'C#',
            gender: 'male',
          },
        ];
        setPresets(initial);
        localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    const newPreset: Preset = {
      id: `preset_${Date.now()}`,
      name: newPresetName.trim(),
      taalId: currentTaalId,
      raagId: currentRaagId,
      bpm: currentBpm,
      pitch: saNote,
      gender: saGender,
    };
    const updated = [newPreset, ...presets];
    setPresets(updated);
    localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(updated));
    setNewPresetName('');
  };

  const handleDeletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(LOCAL_STORAGE_PRESETS_KEY, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#290c14] via-[#1e080f] to-[#120407] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Preferences &amp; Calibration / ترتیبات
            </span>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              My Favourite Settings
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90">
              Customize master tuning, multi-channel instrument volumes, and store favourite practice presets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PWAInstallButton />
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#280c14] hover:bg-[#39121d] border border-[#d4af37]/30 text-xs font-bold text-[#ffd700] transition"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDarkMode ? 'Parchment Mode' : 'Imperial Maroon Mode'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Tuning & Mixer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Pitch & Reference Frequency */}
        <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="font-cinzel text-base font-bold text-[#ffd700] flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Global Sa Tuning &amp; Scale
          </h3>

          {/* Sa Selector */}
          <div>
            <label className="text-xs text-[#d4af37] font-semibold block mb-2">
              Default Sa Pitch (بنیادی سر)
            </label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {CHROMATIC_NOTES.map((n) => (
                <button
                  key={n}
                  onClick={() => onSaNoteChange(n)}
                  className={`py-2 rounded-lg font-mono font-bold text-xs border text-center transition ${
                    saNote === n
                      ? 'bg-[#d4af37] text-black border-[#ffd700]'
                      : 'bg-[#220910] text-[#d4af37] border-[#d4af37]/20 hover:bg-[#2d0e17]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Vocal Gender Range */}
          <div>
            <label className="text-xs text-[#d4af37] font-semibold block mb-2">
              Vocal Register (صوتی پیمانہ)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSaGenderChange('male')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                  saGender === 'male'
                    ? 'bg-[#d4af37] text-black border-[#ffd700]'
                    : 'bg-[#220910] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#2e0e17]'
                }`}
              >
                Male Range (C#3 – D#3 Standard)
              </button>
              <button
                onClick={() => onSaGenderChange('female')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                  saGender === 'female'
                    ? 'bg-[#d4af37] text-black border-[#ffd700]'
                    : 'bg-[#220910] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#2e0e17]'
                }`}
              >
                Female Range (G#3 – A#3 Standard)
              </button>
            </div>
          </div>

          {/* Standard A4 Reference Frequency (440Hz vs 432Hz) */}
          <div className="bg-[#20080f] p-4 rounded-xl border border-[#d4af37]/25 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#ffd700]">Concert Reference A4</span>
              <span className="font-mono text-[#ffd700] font-bold">{referenceFreq} Hz</span>
            </div>
            <input
              type="range"
              min="420"
              max="450"
              value={referenceFreq}
              onChange={(e) => onReferenceFreqChange(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
            <div className="flex items-center justify-between text-[11px] text-[#d4af37]/70">
              <button onClick={() => onReferenceFreqChange(432)} className="hover:text-[#ffd700] underline">
                Verdi 432 Hz
              </button>
              <button onClick={() => onReferenceFreqChange(440)} className="hover:text-[#ffd700] underline font-bold">
                Concert Standard 440 Hz
              </button>
              <button onClick={() => onReferenceFreqChange(442)} className="hover:text-[#ffd700] underline">
                Symphonic 442 Hz
              </button>
            </div>
          </div>
        </div>

        {/* Multi-Channel Audio Mixer */}
        <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="font-cinzel text-base font-bold text-[#ffd700] flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Studio Multi-Channel Volume Mixer
          </h3>

          <div className="space-y-4">
            {/* Master */}
            <div className="bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
              <div className="flex justify-between text-xs font-bold text-[#ffd700] mb-1.5">
                <span>Master Volume</span>
                <span className="font-mono">{Math.round(masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVolume}
                onChange={(e) => onMasterVolumeChange(Number(e.target.value))}
                className="w-full accent-[#ffd700]"
              />
            </div>

            {/* Tabla */}
            <div className="bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
              <div className="flex justify-between text-xs font-semibold text-[#ffd700] mb-1.5">
                <span>Tabla &amp; Taal Volume</span>
                <span className="font-mono">{Math.round(tablaVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={tablaVolume}
                onChange={(e) => onTablaVolumeChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
            </div>

            {/* Tanpura */}
            <div className="bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
              <div className="flex justify-between text-xs font-semibold text-[#ffd700] mb-1.5">
                <span>Tanpura Drone Volume</span>
                <span className="font-mono">{Math.round(tanpuraVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={tanpuraVolume}
                onChange={(e) => onTanpuraVolumeChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
            </div>

            {/* Swarmandal */}
            <div className="bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
              <div className="flex justify-between text-xs font-semibold text-[#ffd700] mb-1.5">
                <span>Swarmandal Zither Volume</span>
                <span className="font-mono">{Math.round(swarmandalVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={swarmandalVolume}
                onChange={(e) => onSwarmandalVolumeChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
            </div>

            {/* Harmonium */}
            <div className="bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
              <div className="flex justify-between text-xs font-semibold text-[#ffd700] mb-1.5">
                <span>Harmonium Guide Volume</span>
                <span className="font-mono">{Math.round(harmoniumVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={harmoniumVolume}
                onChange={(e) => onHarmoniumVolumeChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Favourite Presets Section */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-cinzel text-base font-bold text-[#ffd700] flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              Saved Practice Presets
            </h3>
            <p className="text-xs text-[#d4af37]/70 mt-0.5">
              Save your current combination of Taal, Raag, BPM, and Sa Pitch for 1-click loading.
            </p>
          </div>

          {/* Save Current as New Preset Form */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Preset name (e.g., Night Darbari)..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="bg-[#140508] border border-[#d4af37]/30 rounded-lg px-3 py-1.5 text-xs text-[#ffd700] focus:outline-none focus:border-[#ffd700] w-full sm:w-60"
            />
            <button
              onClick={handleSavePreset}
              className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold text-xs rounded-lg shadow shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        </div>

        {/* Presets List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl bg-[#210910] border border-[#d4af37]/25 hover:border-[#ffd700]/50 transition flex flex-col justify-between"
            >
              <div>
                <h4 className="font-serif font-bold text-sm text-[#ffd700]">
                  {preset.name}
                </h4>
                <div className="text-xs text-[#d4af37]/80 mt-1 space-y-0.5">
                  <div>Taal: <strong className="text-white capitalize">{preset.taalId.replace('_', ' ')}</strong></div>
                  <div>Raag: <strong className="text-white capitalize">{preset.raagId.replace('_', ' ')}</strong></div>
                  <div>Tempo: <strong className="text-white font-mono">{preset.bpm} BPM</strong> · Sa: {preset.pitch}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#d4af37]/20">
                <button
                  onClick={() => onLoadPreset(preset)}
                  className="text-xs font-bold text-[#ffd700] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Preset
                </button>

                <button
                  onClick={() => handleDeletePreset(preset.id)}
                  className="text-[11px] text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reset All Settings Button */}
        <div className="pt-4 border-t border-[#d4af37]/20 flex justify-end">
          <button
            onClick={onResetAllSettings}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#250d14] hover:bg-[#38131e] text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Settings to Factory Defaults
          </button>
        </div>
      </div>

      {/* About Ustad Zawar Hussain Tribute Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#240a12] via-[#1a060d] to-[#140409] border border-[#d4af37]/35 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffd700]" />
            <h3 className="font-cinzel text-base font-bold text-[#ffd700]">
              Zawar Hussain – Sur Sadhna
            </h3>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-[#ffd700] bg-[#330f19] px-2.5 py-0.5 rounded-full border border-[#d4af37]/40 font-semibold">
            Ustad Zawar Hussain Edition
          </span>
        </div>
        <p className="text-xs text-[#e6d5c3]/85 leading-relaxed">
          Artistic direction and classical riyaz accompaniment designed under the guidance of <strong className="text-[#ffd700]">Ustad Zawar Hussain</strong>. Featuring 12 authentic classical Taals, live theka variations with fillers and virtuosic relas, acoustic Miraj Jawari Tanpura drone, Swarmandal harp zither, Harmonium, and microtonal vocal pitch detection.
        </p>
        <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#d4af37]/70">
          <span>Platform: Progressive Web Application (PWA) / Android Mobile Optimized</span>
          <span>Repository: bhukari182-png / Sur-sadhna</span>
        </div>
      </div>
    </div>
  );
};
