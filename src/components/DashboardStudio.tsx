import React from 'react';
import { Taal, Raag, LayaSpeed, PitchNote } from '../types/music';
import { TabId } from './Navigation';
import { Play, Square, Sparkles, Mic, Activity, ArrowRight, Disc3, Music2, Sliders, Volume2 } from 'lucide-react';
import heroBanner from '../assets/images/sur_sadhana_hero_banner_1794450439677.jpg';

interface DashboardStudioProps {
  onNavigateTab: (tabId: TabId) => void;
  activeTaal: Taal;
  activeRaag: Raag;
  currentLaya: LayaSpeed;
  bpm: number;
  saNote: PitchNote;
  saGender: 'male' | 'female';
  isTablaPlaying: boolean;
  onToggleTabla: () => void;
  isTanpuraPlaying: boolean;
  onToggleTanpura: () => void;
  onStartFullRiyazSession: () => void;
  currentMatra: number;
}

export const DashboardStudio: React.FC<DashboardStudioProps> = ({
  onNavigateTab,
  activeTaal,
  activeRaag,
  currentLaya,
  bpm,
  saNote,
  saGender,
  isTablaPlaying,
  onToggleTabla,
  isTanpuraPlaying,
  onToggleTanpura,
  onStartFullRiyazSession,
  currentMatra,
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2c0c16] via-[#1f070f] to-[#120306] border border-[#d4af37]/35 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3c121e] border border-[#d4af37]/40 text-xs font-semibold text-[#ffd700]">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>Your Personal Classical Music Riyaz Studio</span>
            </div>

            <div className="space-y-1">
              <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#f7e7ce] to-[#d4af37] tracking-tight leading-tight">
                SUR SADHANA
              </h1>
              <div className="font-serif text-xl sm:text-2xl text-[#ffd700]/90">
                سر سادھنا — کلاسیکی موسیقی ریاض اسٹوڈیو
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#e6d5c3]/90 leading-relaxed max-w-xl">
              Professional acoustic accompaniment inspired by traditional gharanas. Featuring authentic <strong>Tabla</strong> physical modeling with 9 traditional Taals (including Punjabi Dhamar, Pakistani Sulfakhta &amp; Kilwada), continuous <strong>Tanpura</strong> drone with Jawari thread resonance, <strong>Swarmandal</strong> harp zither, <strong>Harmonium</strong> guide, and live <strong>Sur Pariksha</strong> vocal pitch tracking.
            </p>

            {/* Quick 1-Click Launch Button */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onStartFullRiyazSession}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold text-sm shadow-xl shadow-[#d4af37]/30 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Quick Start Full Riyaz (Tanpura + Tabla)</span>
              </button>

              <button
                onClick={() => onNavigateTab('riyaz')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#2b0e15] hover:bg-[#3d141e] border border-[#d4af37]/40 text-[#ffd700] font-bold text-xs transition"
              >
                <Activity className="w-4 h-4 text-[#ffd700]" />
                <span>Live Vocal Pitch Tuner</span>
              </button>
            </div>

            {/* Current Session Snapshot Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#d4af37]/80">
              <span>Taal: <strong className="text-white">{activeTaal.name}</strong> ({bpm} BPM)</span>
              <span>·</span>
              <span>Raag: <strong className="text-white">{activeRaag.name}</strong></span>
              <span>·</span>
              <span>Sa: <strong className="text-white">{saNote} ({saGender})</strong></span>
            </div>
          </div>

          {/* Hero Instrument Artwork */}
          <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[300px]">
            <img
              src={heroBanner}
              alt="Traditional Indian Classical Instruments"
              className="w-full h-full object-cover lg:rounded-r-3xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-right w-full">
                <span className="text-[11px] text-[#ffd700] font-serif tracking-wider drop-shadow-md">
                  Artisan Sheesham Tanpura, Tabla &amp; Swarmandal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Studio Module Portals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-xl font-bold text-[#ffd700]">
            Studio Modules / اسٹوڈیو شعبہ جات
          </h2>
          <span className="text-xs text-[#d4af37]/70">
            Dedicated practice environments
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Tabla & Taal Studio */}
          <div
            onClick={() => onNavigateTab('tabla')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Primary Rhythm
                </span>
                <span className="text-xs font-mono text-[#ffd700]">
                  {isTablaPlaying ? `Matra ${currentMatra}/${activeTaal.matras}` : 'Theka Idle'}
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Tabla &amp; Taal Studio
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">طبلہ و تال اسٹوڈیو</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                9 authentic Taals (Keharwa, Dhruv, Deepchandi, Punjabi Dhamar, Pakistani Sulfakhta, Teentaal, Ektaal, Jhoomra, Kilwada). Custom pattern editor and 4 Laya speeds.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isTablaPlaying ? 'bg-green-400 animate-ping' : 'bg-[#d4af37]/40'}`} />
                {activeTaal.name} · {bpm} BPM
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Card 2: Tanpura Studio */}
          <div
            onClick={() => onNavigateTab('tanpura')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Acoustic Drone
                </span>
                <span className="text-xs font-mono text-[#ffd700]">
                  {isTanpuraPlaying ? 'Drone Active' : 'Drone Muted'}
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Tanpura Studio
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">تانپورہ اسٹوڈیو</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                Continuous drone with realistic Miraj &amp; Tanjore Jawari thread buzz. Male and female pitch ranges, fine tuning in cents, and Pa/Ma/Ni string configurations.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isTanpuraPlaying ? 'bg-green-400 animate-ping' : 'bg-[#d4af37]/40'}`} />
                Sa: {saNote} ({saGender})
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Card 3: Swarmandal Studio */}
          <div
            onClick={() => onNavigateTab('swarmandal')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Zither Harp
                </span>
                <span className="text-xs font-mono text-[#ffd700]">
                  15 Strings
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Swarmandal Studio
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">سورمنڈل اسٹوڈیو</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                15-string plucked acoustic harp tuned automatically to the active Raag. Manual string tapping, automated glissando sweeps (Aroha/Avaroha), and repeat intervals.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="text-[#d4af37]/80">
                Raag {activeRaag.name.split(' ')[0]}
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Card 4: Riyaz & Sargam Studio */}
          <div
            onClick={() => onNavigateTab('riyaz')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Vocal Training
                </span>
                <span className="text-xs font-mono text-[#ffd700]">
                  Sur Pariksha
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Riyaz Studio &amp; Alankars
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">ریاض و النکار اسٹوڈیو</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                Sargam single-note holding, guided Aroha/Avaroha, 6 classic Palta alankars, touch harmonium keyboard, and real-time vocal pitch detection with cent needle.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="text-[#d4af37]/80">
                S-R-G-M-P-D-N-Ṡ
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Card 5: Raag Practice */}
          <div
            onClick={() => onNavigateTab('raag')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Melodic Repertoire
                </span>
                <span className="text-xs font-mono text-[#ffd700]">
                  8 Classical Raags
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Raag Practice
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">راگ پریکٹس و معلومات</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                Explore Yaman, Bhimpalasi, Darbari Kanada, Bhairavi, Kafi, Puriya Dhanashri, Malkauns, and Bageshri with thaat, vadi, samvadi, and prahar timings.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="text-[#d4af37]/80">
                Current: {activeRaag.name}
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>

          {/* Card 6: Audio Recording Studio */}
          <div
            onClick={() => onNavigateTab('recording')}
            className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-b from-[#240a11] to-[#160508] border border-[#d4af37]/30 hover:border-[#ffd700] transition-all cursor-pointer shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d4af37] bg-[#2e0e16] px-2.5 py-1 rounded-full border border-[#d4af37]/30">
                  Voice Capture
                </span>
                <span className="text-xs font-mono text-red-400">
                  Mic Ready
                </span>
              </div>

              <h3 className="font-cinzel text-lg font-bold text-[#ffd700] group-hover:text-white transition">
                Audio Recording Studio
              </h3>
              <div className="text-xs text-[#d4af37]/70 font-serif mb-2">آڈیو ریکارڈنگ اسٹوڈیو</div>

              <p className="text-xs text-[#e6d5c3]/80 leading-relaxed mb-4">
                Record your singing live with simultaneous Tabla and Tanpura accompaniment. Replay saved takes, evaluate vocal nuance, and export audio in WAV format.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#d4af37]/20 text-xs font-bold text-[#ffd700]">
              <span className="text-[#d4af37]/80">
                WAV / WebM Export
              </span>
              <span className="group-hover:translate-x-1 transition-transform flex items-center">
                Open Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
