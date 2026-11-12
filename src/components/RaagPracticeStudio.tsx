import React from 'react';
import { Raag } from '../types/music';
import { AudioEngine } from '../audio/AudioEngine';
import { Sparkles, Music, Clock, Compass, ArrowRight, Play } from 'lucide-react';

interface RaagPracticeStudioProps {
  raags: Raag[];
  activeRaag: Raag;
  onSelectRaag: (r: Raag) => void;
  onGoToRiyaz: () => void;
}

export const RaagPracticeStudio: React.FC<RaagPracticeStudioProps> = ({
  raags,
  activeRaag,
  onSelectRaag,
  onGoToRiyaz,
}) => {
  const audioEngine = AudioEngine.getInstance();

  const handlePlayRaagGlissando = (raag: Raag) => {
    onSelectRaag(raag);
    const formatted = raag.swarmandalNotes.map((s) => ({ semitoneOffset: s.semitonesFromSa }));
    audioEngine.sweepSwarmandal(formatted, 'aroha', 70);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#290c14] via-[#1e080f] to-[#120407] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Melodic System / راگ پریکٹس
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40 font-mono">
              Classical &amp; Sufi Scales
            </span>
          </div>
          <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
            Classical Raag Repertoire
          </h2>
          <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
            Master the soul and architecture of North Indian and Pakistani classical Raags. Study Vadi-Samvadi sonance, prahar (time of performance), and signature melodic movements.
          </p>
        </div>
      </div>

      {/* Raag Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {raags.map((raag) => {
          const isSelected = raag.id === activeRaag.id;
          return (
            <div
              key={raag.id}
              onClick={() => onSelectRaag(raag)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-[#3b141e] to-[#250910] border-[#ffd700] shadow-xl shadow-[#ffd700]/15'
                  : 'bg-[#18060a] border-[#d4af37]/25 hover:border-[#d4af37]/50 hover:bg-[#220910]'
              }`}
            >
              <div>
                {/* Title & Urdu Tag */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-[#ffd700]">
                      {raag.name}
                    </h3>
                    <div className="text-xs text-[#d4af37]/80 font-serif">
                      Thaat: <span className="font-semibold text-white">{raag.thaat}</span>
                    </div>
                  </div>
                  <span className="font-serif text-2xl font-bold text-[#ffd700]/90">
                    {raag.urduName}
                  </span>
                </div>

                <p className="text-xs text-[#e6d5c3]/85 leading-relaxed my-2">
                  {raag.description}
                </p>

                {/* Aroha & Avaroha */}
                <div className="space-y-1.5 my-3 bg-[#130407] p-3 rounded-xl border border-[#d4af37]/20 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-[#d4af37]/70 w-16">
                      Aroha:
                    </span>
                    <span className="font-serif font-bold text-[#ffd700] tracking-wider">
                      {raag.aroha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono text-[#d4af37]/70 w-16">
                      Avaroha:
                    </span>
                    <span className="font-serif font-bold text-[#ffd700] tracking-wider">
                      {raag.avaroha}
                    </span>
                  </div>
                </div>

                {/* Vadi, Samvadi, Time */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#d4af37]/80 pt-1">
                  <span>Vadi: <strong className="text-[#ffd700]">{raag.vadi}</strong></span>
                  <span>·</span>
                  <span>Samvadi: <strong className="text-[#ffd700]">{raag.samvadi}</strong></span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    {raag.time}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#d4af37]/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayRaagGlissando(raag);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#270b13] hover:bg-[#38111c] border border-[#d4af37]/40 text-xs font-semibold text-[#ffd700] transition"
                >
                  <Play className="w-3 h-3 fill-current" />
                  Audition Swaras
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRaag(raag);
                    onGoToRiyaz();
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-[#ffd700] hover:text-white transition"
                >
                  <span>Practice in Riyaz Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
