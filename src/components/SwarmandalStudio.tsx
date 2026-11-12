import React, { useState, useEffect } from 'react';
import { Raag, IndianSwara, Saptak } from '../types/music';
import { AudioEngine } from '../audio/AudioEngine';
import { Play, RotateCcw, Volume2, Sparkles, Sliders, RefreshCw, Music } from 'lucide-react';
import swarmandalImage from '../assets/images/swarmandal_zither_studio_1794450442057.jpg';

interface SwarmandalStudioProps {
  raags: Raag[];
  activeRaag: Raag;
  onSelectRaag: (raag: Raag) => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}

export const SwarmandalStudio: React.FC<SwarmandalStudioProps> = ({
  raags,
  activeRaag,
  onSelectRaag,
  volume,
  onVolumeChange,
}) => {
  const [strings, setStrings] = useState(activeRaag.swarmandalNotes);
  const [glissandoSpeedMs, setGlissandoSpeedMs] = useState(65);
  const [activePluckedIndex, setActivePluckedIndex] = useState<number | null>(null);
  const [isAutoRepeat, setIsAutoRepeat] = useState(false);
  const [repeatIntervalSec, setRepeatIntervalSec] = useState(12);

  const audioEngine = AudioEngine.getInstance();

  // Sync strings when raag changes
  useEffect(() => {
    setStrings(activeRaag.swarmandalNotes);
  }, [activeRaag]);

  // Pluck a single string
  const handlePluckString = (index: number, semitones: number) => {
    setActivePluckedIndex(index);
    audioEngine.initAudio().then(() => {
      audioEngine.pluckSwarmandalString(semitones);
    });
    window.setTimeout(() => setActivePluckedIndex(null), 300);
  };

  // Full glissando sweep
  const handleGlissando = (direction: 'aroha' | 'avaroha' | 'both' = 'aroha') => {
    const formatted = strings.map((s) => ({ semitoneOffset: s.semitonesFromSa }));
    audioEngine.sweepSwarmandal(formatted, direction, glissandoSpeedMs);

    // Animate visual strings sequentially
    let sequence = strings.map((_, i) => i);
    if (direction === 'avaroha') sequence.reverse();
    if (direction === 'both') sequence = [...sequence, ...[...sequence].reverse()];

    sequence.forEach((strIdx, step) => {
      window.setTimeout(() => {
        setActivePluckedIndex(strIdx);
      }, step * glissandoSpeedMs);
    });

    window.setTimeout(() => {
      setActivePluckedIndex(null);
    }, sequence.length * glissandoSpeedMs + 200);
  };

  // Auto-repeat sweep loop
  useEffect(() => {
    if (!isAutoRepeat) return;
    const interval = setInterval(() => {
      handleGlissando('aroha');
    }, repeatIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [isAutoRepeat, repeatIntervalSec, strings, glissandoSpeedMs]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#280c14] via-[#1d080f] to-[#120407] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Plucked Zither Harp / سورمنڈل
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 font-mono">
                15-String Raag Tuning
              </span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              Swarmandal Studio · {activeRaag.name}
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
              Classical vocalists pluck the Swarmandal before launching into improvisation, cascading the signature notes of the Raag with glistening harmonic resonance.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-[#d4af37]/80">
              <span>Thaat: <strong className="text-[#ffd700]">{activeRaag.thaat}</strong></span>
              <span>·</span>
              <span>Aroha: <strong className="text-[#ffd700] font-serif">{activeRaag.aroha}</strong></span>
              <span>·</span>
              <span>Avaroha: <strong className="text-[#ffd700] font-serif">{activeRaag.avaroha}</strong></span>
            </div>
          </div>

          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl shrink-0">
            <img
              src={swarmandalImage}
              alt="Swarmandal Zither"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] text-[#ffd700] font-medium tracking-wide">
                Carved Teak Soundbox
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Raag Selection Tabs */}
      <div className="bg-[#18050a] border border-[#d4af37]/25 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
            Select Raag Scale (Auto-Tunes All 15 Strings)
          </span>
          <span className="text-xs text-[#d4af37]/70 font-serif">
            {activeRaag.urduName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {raags.map((r) => {
            const isSelected = r.id === activeRaag.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRaag(r)}
                className={`p-2.5 rounded-xl border text-center transition ${
                  isSelected
                    ? 'bg-[#3b141e] border-[#ffd700] text-[#ffd700] shadow-md shadow-[#ffd700]/20'
                    : 'bg-[#1e070c] border-[#d4af37]/20 text-[#d4af37]/80 hover:bg-[#2b0e15]'
                }`}
              >
                <div className="font-serif font-bold text-xs truncate">{r.name.split(' ')[0]}</div>
                <div className="text-[10px] text-[#d4af37]/70 font-serif">{r.urduName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Swarmandal Strings Board */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[#ffd700]">
              15 Plucked Strings Harp
            </h3>
            <p className="text-xs text-[#d4af37]/70 mt-0.5">
              Tap or drag across strings to strum manually, or trigger automated glissando sweeps below.
            </p>
          </div>

          {/* Glissando Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGlissando('aroha')}
              className="px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ascending Glissando (Aroha ↗)
            </button>
            <button
              onClick={() => handleGlissando('avaroha')}
              className="px-4 py-2 bg-[#2b0e15] hover:bg-[#3d1520] border border-[#d4af37]/40 text-[#ffd700] font-bold text-xs rounded-xl transition active:scale-95"
            >
              Descending (Avaroha ↘)
            </button>
          </div>
        </div>

        {/* The 15 Acoustic Strings Graphic */}
        <div className="relative bg-gradient-to-b from-[#290d15] to-[#160508] border-2 border-[#d4af37]/30 rounded-2xl p-4 sm:p-6 shadow-inner">
          <div className="flex items-stretch justify-between gap-1 sm:gap-2 h-64 sm:h-72 select-none overflow-x-auto">
            {strings.map((str, idx) => {
              const isPlucked = activePluckedIndex === idx;
              // Height taper mimicking real harp zither (longer bass strings on left, shorter treble on right)
              const heightPercent = 98 - idx * 2.5;

              return (
                <div
                  key={idx}
                  onClick={() => handlePluckString(idx, str.semitonesFromSa)}
                  className="flex-1 flex flex-col items-center justify-end group cursor-pointer"
                >
                  {/* Pluck point indicator */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full mb-1 transition-all flex items-center justify-center ${
                      isPlucked
                        ? 'bg-[#ffd700] shadow-md shadow-[#ffd700] scale-125'
                        : 'bg-[#d4af37]/20 group-hover:bg-[#d4af37]/60'
                    }`}
                  >
                    {isPlucked && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>

                  {/* Steel String Graphic */}
                  <div
                    className={`relative w-1.5 rounded-full transition-all ${
                      isPlucked
                        ? 'bg-gradient-to-t from-[#ffd700] via-white to-[#ffd700] shadow-lg shadow-[#ffd700]'
                        : 'bg-gradient-to-t from-[#8a7238] via-[#e2c77d] to-[#8a7238] group-hover:bg-[#ffd700]/70'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  {/* Swara Label Card at Bridge Bottom */}
                  <div className="mt-2 text-center">
                    <span className="font-serif font-bold text-xs text-[#ffd700] block leading-none">
                      {str.display}
                    </span>
                    <span className="text-[9px] text-[#d4af37]/60 block font-mono mt-0.5">
                      #{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls: Speed, Auto-Repeat, and Volume */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Glissando Speed */}
          <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#ffd700]">Strumming Speed</span>
              <span className="font-mono text-[#ffd700]">{glissandoSpeedMs} ms/string</span>
            </div>
            <input
              type="range"
              min="35"
              max="150"
              value={glissandoSpeedMs}
              onChange={(e) => setGlissandoSpeedMs(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
            <div className="flex justify-between text-[10px] text-[#d4af37]/60">
              <span>Fast (35ms)</span>
              <span>Slow (150ms)</span>
            </div>
          </div>

          {/* Auto Repeat Mode */}
          <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#ffd700]">Auto-Glissando Loop</span>
              <button
                onClick={() => setIsAutoRepeat(!isAutoRepeat)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isAutoRepeat ? 'bg-green-700 text-white' : 'bg-[#130406] text-[#d4af37]/70'
                }`}
              >
                {isAutoRepeat ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#d4af37]/80">Repeat every</span>
              <input
                type="number"
                min="5"
                max="60"
                value={repeatIntervalSec}
                onChange={(e) => setRepeatIntervalSec(Math.max(5, Math.min(60, Number(e.target.value))))}
                className="w-14 bg-[#140508] border border-[#d4af37]/30 rounded px-2 py-0.5 text-center text-xs text-[#ffd700]"
              />
              <span className="text-[11px] text-[#d4af37]/80">seconds</span>
            </div>
          </div>

          {/* Volume */}
          <div className="bg-[#20080f] p-3.5 rounded-xl border border-[#d4af37]/25 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#ffd700]">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Swarmandal Volume</span>
              </div>
              <span className="font-mono text-[#ffd700]">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
