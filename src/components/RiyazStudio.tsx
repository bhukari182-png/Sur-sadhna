import React, { useState } from 'react';
import { Raag, IndianSwara, Saptak, LayaSpeed } from '../types/music';
import { ALANKAR_PATTERNS } from '../data/raags';
import { SwaraKeyboard } from './SwaraKeyboard';
import { LivePitchMeter } from './LivePitchMeter';
import { AudioEngine } from '../audio/AudioEngine';
import { Play, Pause, Square, Music, Volume2, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

interface RiyazStudioProps {
  raags: Raag[];
  activeRaag: Raag;
  onSelectRaag: (r: Raag) => void;
  isTanpuraPlaying: boolean;
  onToggleTanpura: () => void;
  isTablaPlaying: boolean;
  onToggleTabla: () => void;
  tablaBpm: number;
  onTablaBpmChange: (bpm: number) => void;
  laya: LayaSpeed;
  onLayaChange: (l: LayaSpeed) => void;
}

export const RiyazStudio: React.FC<RiyazStudioProps> = ({
  raags,
  activeRaag,
  onSelectRaag,
  isTanpuraPlaying,
  onToggleTanpura,
  isTablaPlaying,
  onToggleTabla,
  tablaBpm,
  onTablaBpmChange,
  laya,
  onLayaChange,
}) => {
  const [selectedAlankar, setSelectedAlankar] = useState(ALANKAR_PATTERNS[0]);
  const [activeHarmoniumSwara, setActiveHarmoniumSwara] = useState<{ swara: IndianSwara; saptak: Saptak } | null>(null);
  const [practiceMode, setPracticeMode] = useState<'sargam' | 'aroha_avaroha' | 'alankars'>('sargam');
  const [isGuidingNote, setIsGuidingNote] = useState(false);
  const [guidedNoteIndex, setGuidedNoteIndex] = useState<number | null>(null);

  const audioEngine = AudioEngine.getInstance();

  // Basic Sargam notes
  const sargamNotes: Array<{ swara: IndianSwara; label: string; full: string }> = [
    { swara: 'S', label: 'Sa (سا)', full: 'Shadja' },
    { swara: 'R', label: 'Re (رے)', full: 'Rishabh' },
    { swara: 'G', label: 'Ga (گا)', full: 'Gandhar' },
    { swara: 'm', label: 'Ma (ما)', full: 'Madhyam' },
    { swara: 'P', label: 'Pa (پا)', full: 'Pancham' },
    { swara: 'D', label: 'Dha (دھا)', full: 'Dhaivat' },
    { swara: 'N', label: 'Ni (نی)', full: 'Nishad' },
    { swara: 'S', label: 'Ṡa (سا)', full: 'Tar Shadja' },
  ];

  const handleSwaraDown = (swara: IndianSwara, saptak: Saptak) => {
    setActiveHarmoniumSwara({ swara, saptak });
    audioEngine.startHarmoniumNote(swara, saptak);
  };

  const handleSwaraUp = (swara: IndianSwara, saptak: Saptak) => {
    setActiveHarmoniumSwara(null);
    audioEngine.stopHarmoniumNote(swara, saptak);
  };

  // Play audio note guide for active Raag Aroha
  const handlePlayArohaGuide = () => {
    if (isGuidingNote) return;
    setIsGuidingNote(true);
    const notes = activeRaag.swarmandalNotes.slice(3, 11);

    notes.forEach((item, index) => {
      window.setTimeout(() => {
        setGuidedNoteIndex(index);
        audioEngine.pluckSwarmandalString(item.semitonesFromSa, 0.9);
      }, index * 750);
    });

    window.setTimeout(() => {
      setIsGuidingNote(false);
      setGuidedNoteIndex(null);
    }, notes.length * 750 + 200);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#290c14] via-[#1f0910] to-[#140508] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Vocal Practice Sanctuary / ریاض اسٹوڈیو
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 font-mono">
                Sargam &amp; Alankar Riyaz
              </span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              Riyaz &amp; Voice Culture Studio
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
              Cultivate vocal precision, pitch stability, and breath control with simultaneous Tanpura drone, Tabla theka, and live vocal pitch calibration (Sur Pariksha).
            </p>
          </div>

          {/* Quick Dual Accompaniment Bar */}
          <div className="bg-[#1b070d] border border-[#d4af37]/30 rounded-xl p-3 flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider text-center">
              Accompaniment Controls
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTanpura}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isTanpuraPlaying
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'bg-[#290e15] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#38141e]'
                }`}
              >
                {isTanpuraPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Tanpura Drone
              </button>

              <button
                onClick={onToggleTabla}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isTablaPlaying
                    ? 'bg-[#d4af37] text-black shadow'
                    : 'bg-[#290e15] text-[#d4af37] border border-[#d4af37]/30 hover:bg-[#38141e]'
                }`}
              >
                {isTablaPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Tabla Theka
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Riyaz Practice Mode Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#180509] rounded-xl border border-[#d4af37]/25 overflow-x-auto">
        {[
          { id: 'sargam', label: '1. Sargam Sadhana', sub: 'Single Swara Sustained Intonation' },
          { id: 'aroha_avaroha', label: '2. Aroha & Avaroha', sub: 'Raag Ascent & Descent' },
          { id: 'alankars', label: '3. Alankar Patterns', sub: 'Palta Exercise 1 to 6' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPracticeMode(tab.id as 'sargam' | 'aroha_avaroha' | 'alankars')}
            className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-left transition ${
              practiceMode === tab.id
                ? 'bg-[#3b1520] border border-[#ffd700] text-[#ffd700] shadow'
                : 'text-[#d4af37]/80 hover:bg-[#250a11] hover:text-[#ffd700]'
            }`}
          >
            <div className="font-semibold text-xs leading-none">{tab.label}</div>
            <div className="text-[10px] text-[#d4af37]/60 mt-1 truncate">{tab.sub}</div>
          </button>
        ))}
      </div>

      {/* Main Practice Content Card */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Practice Mode 1: Sargam Single Swaras */}
        {practiceMode === 'sargam' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#ffd700]">
                  Sargam Seven Primary Swaras (س ر گ م پ د ن س)
                </h3>
                <p className="text-xs text-[#d4af37]/70 mt-0.5">
                  Hold each note steady for 1-2 breaths. Match your voice perfectly with the reference pitch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {sargamNotes.map((note, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSwaraDown(note.swara, i === 7 ? 'taar' : 'madhya')}
                  onMouseUp={() => handleSwaraUp(note.swara, i === 7 ? 'taar' : 'madhya')}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleSwaraDown(note.swara, i === 7 ? 'taar' : 'madhya');
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleSwaraUp(note.swara, i === 7 ? 'taar' : 'madhya');
                  }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-b from-[#2a0e16] to-[#1b080d] border border-[#d4af37]/30 hover:border-[#ffd700] hover:scale-105 active:scale-95 transition shadow-lg group"
                >
                  <span className="font-serif text-3xl font-extrabold text-[#ffd700] group-hover:text-white transition">
                    {note.swara}
                  </span>
                  <span className="text-xs font-semibold text-[#f5e6d3] mt-1">
                    {note.label}
                  </span>
                  <span className="text-[9px] text-[#d4af37]/60 font-mono mt-0.5">
                    {note.full}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Practice Mode 2: Aroha & Avaroha */}
        {practiceMode === 'aroha_avaroha' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-cinzel text-base font-bold text-[#ffd700]">
                    Aroha &amp; Avaroha · {activeRaag.name} ({activeRaag.urduName})
                  </h3>
                </div>
                <p className="text-xs text-[#d4af37]/70 mt-0.5">
                  Vadi: <strong className="text-[#ffd700]">{activeRaag.vadi}</strong> · Samvadi: <strong className="text-[#ffd700]">{activeRaag.samvadi}</strong> · Prahar: {activeRaag.time}
                </p>
              </div>

              <button
                onClick={handlePlayArohaGuide}
                disabled={isGuidingNote}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#140508] font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Play Guided Aroha Reference
              </button>
            </div>

            {/* Aroha Banner */}
            <div className="p-4 rounded-xl bg-[#210910] border border-[#d4af37]/25 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-bold block">
                Aroha (Ascending Melodic Path ↗)
              </span>
              <div className="font-serif text-2xl font-bold text-[#ffd700] tracking-widest">
                {activeRaag.aroha}
              </div>
            </div>

            {/* Avaroha Banner */}
            <div className="p-4 rounded-xl bg-[#210910] border border-[#d4af37]/25 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#d4af37] font-bold block">
                Avaroha (Descending Melodic Path ↘)
              </span>
              <div className="font-serif text-2xl font-bold text-[#ffd700] tracking-widest">
                {activeRaag.avaroha}
              </div>
            </div>
          </div>
        )}

        {/* Practice Mode 3: Alankars (Paltas) */}
        {practiceMode === 'alankars' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-base font-bold text-[#ffd700]">
                  Classical Alankars (Paltas) / النکار
                </h3>
                <p className="text-xs text-[#d4af37]/70 mt-0.5">
                  Practicing alankars builds agility, rapid taan execution, and clean interval jumps.
                </p>
              </div>
            </div>

            {/* Alankar Selection Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALANKAR_PATTERNS.map((pat) => {
                const isSelected = selectedAlankar.id === pat.id;
                return (
                  <button
                    key={pat.id}
                    onClick={() => setSelectedAlankar(pat)}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-[#3b141e] border-[#ffd700] text-[#ffd700] shadow-md shadow-[#ffd700]/20'
                        : 'bg-[#20080f] border-[#d4af37]/20 text-[#d4af37]/80 hover:bg-[#2e0e16]'
                    }`}
                  >
                    <div className="font-bold text-xs">{pat.title}</div>
                    <div className="text-[11px] text-[#d4af37]/70 mt-1 line-clamp-2">
                      {pat.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Alankar Display */}
            <div className="p-5 rounded-xl bg-[#210910] border border-[#d4af37]/30 space-y-3">
              <div>
                <span className="text-xs uppercase font-bold text-[#ffd700]">
                  {selectedAlankar.title}
                </span>
                <p className="text-xs text-[#e6d5c3]/80 mt-0.5">
                  {selectedAlankar.description}
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-lg bg-[#150508] border border-[#d4af37]/20">
                  <span className="text-[10px] uppercase font-mono text-[#d4af37]/80 block mb-1">
                    Aroha:
                  </span>
                  <div className="font-serif text-lg font-bold text-[#ffd700] flex flex-wrap gap-2">
                    {selectedAlankar.aroha.map((phrase, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#270b13] border border-[#d4af37]/30 text-sm">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#150508] border border-[#d4af37]/20">
                  <span className="text-[10px] uppercase font-mono text-[#d4af37]/80 block mb-1">
                    Avaroha:
                  </span>
                  <div className="font-serif text-lg font-bold text-[#ffd700] flex flex-wrap gap-2">
                    {selectedAlankar.avaroha.map((phrase, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#270b13] border border-[#d4af37]/30 text-sm">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Vocal Pitch Tuner (Sur Pariksha) */}
        <LivePitchMeter />

        {/* Harmonium Swara Touch Keyboard */}
        <SwaraKeyboard
          onSwaraDown={handleSwaraDown}
          onSwaraUp={handleSwaraUp}
          activeSwara={activeHarmoniumSwara}
        />
      </div>
    </div>
  );
};
