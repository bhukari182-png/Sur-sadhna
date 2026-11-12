import React, { useState } from 'react';
import { PitchNote } from '../types/music';
import { Play, Square, Sliders, Volume2, Sparkles, Music } from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';

interface TanpuraStudioProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  pitch: PitchNote;
  onPitchChange: (p: PitchNote) => void;
  gender: 'male' | 'female';
  onGenderChange: (g: 'male' | 'female') => void;
  firstString: 'Pa' | 'Ma' | 'Ni';
  onFirstStringChange: (s: 'Pa' | 'Ma' | 'Ni') => void;
  fineTuneCents: number;
  onFineTuneChange: (cents: number) => void;
  texture: 'miraj' | 'tanjore' | 'electronic';
  onTextureChange: (t: 'miraj' | 'tanjore' | 'electronic') => void;
  volume: number;
  onVolumeChange: (v: number) => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  activeStringIndex: number;
}

const CHROMATIC_NOTES: PitchNote[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TanpuraStudio: React.FC<TanpuraStudioProps> = ({
  isPlaying,
  onTogglePlay,
  pitch,
  onPitchChange,
  gender,
  onGenderChange,
  firstString,
  onFirstStringChange,
  fineTuneCents,
  onFineTuneChange,
  texture,
  onTextureChange,
  volume,
  onVolumeChange,
  speed,
  onSpeedChange,
  activeStringIndex,
}) => {
  const audioEngine = AudioEngine.getInstance();
  const currentSaHz = Math.round(audioEngine.getSaFrequency() * 10) / 10;

  // The 4 strings descriptions
  const stringNames = [
    {
      idx: 0,
      name: `String 1: ${firstString === 'Pa' ? 'Pancham (Pa)' : firstString === 'Ma' ? 'Madhyam (Ma)' : 'Nishad (Ni)'}`,
      urdu: firstString === 'Pa' ? 'پنچم (پ)' : firstString === 'Ma' ? 'مدھم (م)' : 'نکھاد (ن)',
      role: 'Mandra Saptak Anchor',
    },
    {
      idx: 1,
      name: 'String 2: Jod Sa (Middle)',
      urdu: 'جوڑ سا (مدھیا)',
      role: 'Unison Resonator 1',
    },
    {
      idx: 2,
      name: 'String 3: Jod Sa (Middle)',
      urdu: 'جوڑ سا (مدھیا)',
      role: 'Unison Resonator 2 (Shimmer)',
    },
    {
      idx: 3,
      name: 'String 4: Kharaj Sa (Bass)',
      urdu: 'خرج سا (مندرا)',
      role: 'Deep Sub-Bass Foundation',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2c0c16] via-[#200911] to-[#140508] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Drone Accompaniment / تانپورہ اسٹوڈیو
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 font-mono">
                Continuous Background Drone
              </span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              Digital Acoustic Tanpura
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
              Provides authentic acoustic drone with realistic Jawari thread buzz, tuned specifically to your vocal range. Continues playing across all modules for uninterrupted riyaz practice.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs text-[#d4af37]">
                Current Sa: <strong className="text-[#ffd700] font-mono">{pitch} ({currentSaHz} Hz)</strong>
              </span>
              <span className="text-xs text-[#d4af37]">
                Tuning: <strong className="text-[#ffd700]">{firstString}-Sa-Sa-Sa</strong>
              </span>
            </div>
          </div>

          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl shrink-0">
            <img
              src="/src/assets/images/tanpura_acoustic_studio_1794450442796.jpg"
              alt="Miraj Tanpura"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] text-[#ffd700] font-medium tracking-wide">
                Miraj Jawari Bridge
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 4-String Visualizer & Drone Switch */}
        <div className="lg:col-span-5 bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                4 Acoustic Strings Cycle
              </span>
              <span className="text-xs text-[#d4af37]/70 font-mono">
                {isPlaying ? 'Plucking...' : 'Stopped'}
              </span>
            </div>

            {/* Visual Strings Column */}
            <div className="space-y-3 py-2">
              {stringNames.map((s) => {
                const isPlucked = isPlaying && activeStringIndex === s.idx;
                return (
                  <div
                    key={s.idx}
                    className={`relative flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isPlucked
                        ? 'bg-[#3b151f] border-[#ffd700] shadow-lg shadow-[#ffd700]/25 translate-x-1'
                        : 'bg-[#1e070d] border-[#d4af37]/20 opacity-80'
                    }`}
                  >
                    {/* Glowing String line */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-l-xl transition-all ${
                        isPlucked ? 'bg-[#ffd700] shadow-sm' : 'bg-[#d4af37]/30'
                      }`}
                    />

                    <div className="pl-2">
                      <div className="text-xs font-bold text-[#ffd700]">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-[#d4af37]/70">
                        {s.role} · {s.urdu}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {isPlucked ? (
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffd700]"></span>
                        </span>
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37]/30" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Master Start / Stop Drone Button */}
          <div className="pt-6">
            <button
              onClick={onTogglePlay}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl transition active:scale-98 ${
                isPlaying
                  ? 'bg-gradient-to-r from-red-800 to-red-950 text-red-100 hover:from-red-700 hover:to-red-900 border border-red-500/40'
                  : 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] text-[#140508] hover:from-[#ffd700] hover:to-[#c69a1b]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Tanpura Drone</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Tanpura Drone / تانپورہ شروع کریں</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Pitch Selection, Gender, First String, Textures & Fine Tuning */}
        <div className="lg:col-span-7 bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 space-y-5 shadow-xl">
          {/* Sa Pitch Selection (Chromatic C to B) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                Base Sa Pitch / بنیادی سر
              </span>
              <span className="text-xs font-mono text-[#ffd700]">
                Active: {pitch} ({currentSaHz} Hz)
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
              {CHROMATIC_NOTES.map((note) => (
                <button
                  key={note}
                  onClick={() => onPitchChange(note)}
                  className={`py-2 rounded-lg border text-center font-mono font-bold text-xs transition ${
                    pitch === note
                      ? 'bg-[#d4af37] text-[#140508] border-[#ffd700] shadow'
                      : 'bg-[#21090f] text-[#d4af37] border-[#d4af37]/20 hover:bg-[#2f0e16]'
                  }`}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Gender & First String Tuning */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vocal Pitch Range (Male vs Female) */}
            <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
              <span className="text-xs font-semibold text-[#ffd700] block">
                Vocal Register (آواز کی حد)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onGenderChange('male')}
                  className={`py-2 rounded-lg text-xs font-bold transition border ${
                    gender === 'male'
                      ? 'bg-[#d4af37] text-[#140508] border-[#ffd700]'
                      : 'bg-[#180509] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#280c14]'
                  }`}
                >
                  Male (مردانہ)
                </button>
                <button
                  onClick={() => onGenderChange('female')}
                  className={`py-2 rounded-lg text-xs font-bold transition border ${
                    gender === 'female'
                      ? 'bg-[#d4af37] text-[#140508] border-[#ffd700]'
                      : 'bg-[#180509] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#280c14]'
                  }`}
                >
                  Female (زنانی)
                </button>
              </div>
            </div>

            {/* 1st String Tuning (Pa vs Ma vs Ni) */}
            <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
              <span className="text-xs font-semibold text-[#ffd700] block">
                1st String Tuning (پہلا تار)
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'Pa', label: 'Pa (پنچم)', desc: 'Standard Raags' },
                  { id: 'Ma', label: 'Ma (مدھم)', desc: 'Malkauns / Bageshri' },
                  { id: 'Ni', label: 'Ni (نکھاد)', desc: 'Marwa / Puriya' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onFirstStringChange(item.id as 'Pa' | 'Ma' | 'Ni')}
                    className={`py-1.5 px-1 rounded-lg text-xs font-bold transition border text-center ${
                      firstString === item.id
                        ? 'bg-[#d4af37] text-[#140508] border-[#ffd700]'
                        : 'bg-[#180509] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#280c14]'
                    }`}
                  >
                    <div>{item.id}</div>
                    <div className="text-[9px] opacity-75 font-normal">{item.label.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Textures */}
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37] block mb-2">
              Tanpura Sound Texture
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'miraj', title: 'Miraj Traditional', desc: 'Deep Jawari thread buzz' },
                { id: 'tanjore', title: 'Tanjore Wood', desc: 'Warm south wood acoustic' },
                { id: 'electronic', title: 'Swar Peti Box', desc: 'Electronic practice box' },
              ].map((tex) => (
                <button
                  key={tex.id}
                  onClick={() => onTextureChange(tex.id as 'miraj' | 'tanjore' | 'electronic')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    texture === tex.id
                      ? 'bg-[#3b141e] border-[#ffd700] text-[#ffd700]'
                      : 'bg-[#20080f] border-[#d4af37]/20 text-[#d4af37]/80 hover:bg-[#2d0e17]'
                  }`}
                >
                  <div className="text-xs font-bold">{tex.title}</div>
                  <div className="text-[10px] text-[#d4af37]/70 mt-0.5">{tex.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Fine Tuning Slider (Cents) & Speed Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Fine Tune */}
            <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#ffd700]">Fine Pitch (Cents)</span>
                <span className="font-mono text-[#ffd700]">
                  {fineTuneCents > 0 ? `+${fineTuneCents}¢` : `${fineTuneCents}¢`}
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={fineTuneCents}
                onChange={(e) => onFineTuneChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
              <div className="flex justify-between text-[10px] text-[#d4af37]/60 font-mono">
                <span>-50¢</span>
                <button onClick={() => onFineTuneChange(0)} className="hover:text-[#ffd700]">
                  Center (0¢)
                </button>
                <span>+50¢</span>
              </div>
            </div>

            {/* Pluck Speed Multiplier */}
            <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#ffd700]">Pluck Speed</span>
                <span className="font-mono text-[#ffd700]">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.1"
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
              <div className="flex justify-between text-[10px] text-[#d4af37]/60 font-mono">
                <span>Slow (0.6x)</span>
                <button onClick={() => onSpeedChange(1.0)} className="hover:text-[#ffd700]">
                  Normal (1.0x)
                </button>
                <span>Fast (1.6x)</span>
              </div>
            </div>
          </div>

          {/* Tanpura Volume */}
          <div className="flex items-center justify-between bg-[#20080f] p-3 rounded-xl border border-[#d4af37]/25">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#ffd700]" />
              <span className="text-xs font-semibold text-[#ffd700]">Tanpura Volume</span>
            </div>
            <div className="flex items-center gap-3 w-44">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full accent-[#d4af37]"
              />
              <span className="font-mono text-xs text-[#d4af37] tabular-nums w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
