import React, { useState } from 'react';
import { Taal, LayaSpeed, TablaPerformanceMode } from '../types/music';
import { VisualBeatCircle } from './VisualBeatCircle';
import { TaalPatternEditor } from './TaalPatternEditor';
import { TablaSampleManagerModal } from './TablaSampleManagerModal';
import { Play, Pause, Square, RotateCcw, Sliders, Volume2, Sparkles, HelpCircle, Zap, Disc3, Music } from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';
import tablaImage from '../assets/images/tabla_pair_studio_1794450440438.jpg';

interface TablaStudioProps {
  taals: Taal[];
  activeTaal: Taal;
  onSelectTaal: (taal: Taal) => void;
  onUpdateTaal: (updatedTaal: Taal) => void;
  onResetTaal: (taalId: string) => void;
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  laya: LayaSpeed;
  onLayaChange: (laya: LayaSpeed) => void;
  performanceMode: TablaPerformanceMode;
  onPerformanceModeChange: (mode: TablaPerformanceMode) => void;
  currentMatra: number;
  volume: number;
  onVolumeChange: (v: number) => void;
  dayanVolume: number;
  onDayanVolumeChange: (v: number) => void;
  bayanVolume: number;
  onBayanVolumeChange: (v: number) => void;
  dayanFineCents: number;
  onDayanFineCentsChange: (cents: number) => void;
  rootSaNote: string;
}

export const TablaStudio: React.FC<TablaStudioProps> = ({
  taals,
  activeTaal,
  onSelectTaal,
  onUpdateTaal,
  onResetTaal,
  isPlaying,
  onStart,
  onPause,
  onStop,
  onReset,
  bpm,
  onBpmChange,
  laya,
  onLayaChange,
  performanceMode,
  onPerformanceModeChange,
  currentMatra,
  volume,
  onVolumeChange,
  dayanVolume,
  onDayanVolumeChange,
  bayanVolume,
  onBayanVolumeChange,
  dayanFineCents,
  onDayanFineCentsChange,
  rootSaNote,
}) => {
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [showSampleManager, setShowSampleManager] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const audioEngine = AudioEngine.getInstance();

  // Tap tempo handler
  const handleTapTempo = () => {
    const now = Date.now();
    const recent = tapTimes.filter(t => now - t < 3000);
    const updated = [...recent, now];
    setTapTimes(updated);

    if (updated.length >= 2) {
      const intervals = [];
      for (let i = 1; i < updated.length; i++) {
        intervals.push(updated[i] - updated[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 20 && calculatedBpm <= 400) {
        onBpmChange(calculatedBpm);
      }
    }
  };

  const handleTestBol = (bol: string) => {
    audioEngine.initAudio().then(() => {
      audioEngine.playBol(bol);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Instrument Introduction */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2a0c14] via-[#1f090f] to-[#120407] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Rhythm &amp; Percussion Module / طبلہ و تال
              </span>
              {activeTaal.isCustomizable && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff9800]/20 text-[#ff9800] border border-[#ff9800]/40 font-medium">
                  Custom Pattern Supported
                </span>
              )}
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              {activeTaal.name} · <span className="font-serif">{activeTaal.urduName}</span>
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
              {activeTaal.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-[#d4af37]/80">
                Matras: <strong className="text-[#ffd700]">{activeTaal.matras} Beats</strong>
              </span>
              <span className="text-xs text-[#d4af37]/80">
                Divisions: <strong className="text-[#ffd700]">{activeTaal.vibhags.map(v => v.length).join('+')}</strong>
              </span>
              <span className="text-xs text-[#d4af37]/80">
                Category: <strong className="text-[#ffd700] capitalize">{activeTaal.category.replace('_', ' ')}</strong>
              </span>
            </div>
          </div>

          {/* Instrument Thumbnail */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-2xl shrink-0">
            <img
              src={tablaImage}
              alt="Artisan Tabla Pair"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
              <span className="text-[10px] text-[#ffd700] font-medium tracking-wide">
                Dayan &amp; Bayan Acoustic Pair
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Taal Selection Carousel / Grid */}
      <div className="bg-[#18050a] border border-[#d4af37]/25 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
            Select Taal ({taals.length} Authentic Classical &amp; Sufi Patterns)
          </span>
          <span className="text-xs text-[#d4af37]/70">
            {activeTaal.matras} Matras Active · {activeTaal.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
          {taals.map((t) => {
            const isSelected = t.id === activeTaal.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTaal(t)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#3d131e] to-[#250911] border-[#ffd700] text-[#ffd700] shadow-md shadow-[#ffd700]/20 scale-105'
                    : 'bg-[#1e070c] border-[#d4af37]/20 text-[#d4af37]/80 hover:bg-[#2b0e15] hover:text-[#ffd700]'
                }`}
              >
                <span className="font-serif font-bold text-xs tracking-tight truncate w-full">
                  {t.name}
                </span>
                <span className="text-[10px] opacity-80 font-serif">
                  {t.urduName}
                </span>
                <span className="text-[9px] text-[#d4af37]/60 font-mono mt-0.5">
                  {t.matras}M
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Workspace: Metronome Circle & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Metronome & Beat Counter */}
        <div className="lg:col-span-5 bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl">
          <VisualBeatCircle
            beats={activeTaal.beats}
            currentMatra={currentMatra}
            isPlaying={isPlaying}
            bpm={bpm}
          />

          {/* Quick Playback Transport */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={isPlaying ? onPause : onStart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#ffd700] hover:to-[#c49214] text-[#140508] font-bold text-sm shadow-lg shadow-[#d4af37]/25 transition active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Theka</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Theka</span>
                </>
              )}
            </button>

            <button
              onClick={onStop}
              className="p-3 rounded-xl bg-[#2b0e14] hover:bg-[#3d141e] text-[#d4af37] border border-[#d4af37]/30 transition"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onReset}
              className="p-3 rounded-xl bg-[#2b0e14] hover:bg-[#3d141e] text-[#d4af37] border border-[#d4af37]/30 transition"
              title="Reset to Sam"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Laya, BPM, Pattern Editor trigger, and Bol Timeline */}
        <div className="lg:col-span-7 bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 flex flex-col justify-between shadow-xl space-y-6">
          {/* Tabla Playing Style / Performance Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ffd700]" />
                Playing Style &amp; Fillers / اندازِ طبلہ
              </span>
              <span className="text-xs text-[#ffd700] font-semibold">
                {performanceMode === 'basic' && '1. Basic Theka'}
                {performanceMode === 'fillers' && '2. Theka with Professional Fillers'}
                {performanceMode === 'advanced' && '3. Advanced Performance'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'basic', label: '1. Basic Theka', sub: 'Traditional steady canonical theka' },
                { id: 'fillers', label: '2. With Fillers', sub: 'Cycle-ending mohras & authentic tihais' },
                { id: 'advanced', label: '3. Advanced Performance', sub: 'Virtuosic relas & concert accompaniment' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => onPerformanceModeChange(style.id as TablaPerformanceMode)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    performanceMode === style.id
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#140508] font-bold border-[#ffd700] shadow-md shadow-[#d4af37]/25'
                      : 'bg-[#21090f] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#2e0e16]'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{style.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5 line-clamp-1">{style.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Laya (Speed Category) Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
                Laya / لے (Speed Setting)
              </span>
              <span className="text-xs text-[#ffd700] capitalize font-medium">
                {laya === 'vilambit' && 'Vilambit (Slow)'}
                {laya === 'madhya' && 'Madhya (Medium)'}
                {laya === 'drut' && 'Drut (Fast)'}
                {laya === 'ati_drut' && 'Ati Drut (Very Fast)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'vilambit', label: 'Vilambit', sub: 'Slow / ولنبت (0.5x)' },
                { id: 'madhya', label: 'Madhya', sub: 'Medium / مدھیا (1.0x)' },
                { id: 'drut', label: 'Drut', sub: 'Fast / درت (1.75x)' },
                { id: 'ati_drut', label: 'Ati Drut', sub: 'Very Fast / درت ترین (2.5x)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onLayaChange(item.id as LayaSpeed)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    laya === item.id
                      ? 'bg-[#d4af37] text-[#140508] font-bold border-[#ffd700] shadow-md'
                      : 'bg-[#21090f] text-[#d4af37] border-[#d4af37]/25 hover:bg-[#2e0e16]'
                  }`}
                >
                  <div className="text-xs font-semibold leading-tight">{item.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5 truncate">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* BPM Adjustment Slider & Numeric Stepper */}
          <div className="bg-[#20080f] p-4 rounded-xl border border-[#d4af37]/25 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#ffd700]" />
                <span className="text-xs font-semibold text-[#ffd700]">
                  Tempo / رفتار (20 – 400 BPM)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTapTempo}
                  className="px-2.5 py-1 rounded bg-[#2e0f17] hover:bg-[#421521] border border-[#d4af37]/40 text-xs font-mono text-[#ffd700] active:scale-95 transition"
                >
                  Tap Tempo
                </button>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="20"
                    max="400"
                    value={bpm}
                    onChange={(e) => onBpmChange(Math.max(20, Math.min(400, Number(e.target.value))))}
                    className="w-16 bg-[#120306] border border-[#d4af37]/40 rounded-lg px-2 py-1 text-center font-mono font-bold text-sm text-[#ffd700] focus:outline-none focus:border-[#ffd700]"
                  />
                  <span className="text-xs text-[#d4af37]/70 ml-1.5">BPM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[#d4af37]/70">20</span>
              <input
                type="range"
                min="20"
                max="400"
                value={bpm}
                onChange={(e) => onBpmChange(Number(e.target.value))}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#d4af37]/70">400</span>
            </div>
          </div>

          {/* Multi-Channel Acoustic Drum Balance & Pitch Tuning */}
          <div className="bg-[#20080f] p-4 rounded-xl border border-[#d4af37]/25 space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#d4af37]/15">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#ffd700]" />
                <span className="text-xs font-bold text-[#ffd700] uppercase tracking-wider">
                  Acoustic Drum Mix &amp; Stereo Stage
                </span>
              </div>

              {/* Sample Engine Status & Studio Launcher */}
              <button
                onClick={() => setShowSampleManager(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-[11px] font-bold text-emerald-300 transition shadow-sm"
                title="Manage Acoustic Samples & Custom Uploads"
              >
                <Disc3 className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>44.1kHz Acoustic Samples · Studio</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Dayan (Treble Tabla) Volume */}
              <div className="space-y-1 bg-[#18050a] p-2.5 rounded-lg border border-[#d4af37]/20">
                <div className="flex items-center justify-between text-xs text-[#ffd700]">
                  <span className="font-semibold flex items-center gap-1">
                    <Music className="w-3 h-3 text-[#ffd700]" />
                    Dayan (Right Treble)
                  </span>
                  <span className="font-mono tabular-nums">{Math.round(dayanVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={dayanVolume}
                  onChange={(e) => onDayanVolumeChange(Number(e.target.value))}
                  className="w-full accent-[#d4af37]"
                />
                <div className="flex items-center justify-between text-[10px] text-[#d4af37]/70">
                  <span>Chanti &amp; Syahi</span>
                  <span>Pan: Right (+28%)</span>
                </div>
              </div>

              {/* Bayan (Bass Tabla) Volume */}
              <div className="space-y-1 bg-[#18050a] p-2.5 rounded-lg border border-[#d4af37]/20">
                <div className="flex items-center justify-between text-xs text-[#ffd700]">
                  <span className="font-semibold flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-[#ffd700]" />
                    Bayan (Left Bass)
                  </span>
                  <span className="font-mono tabular-nums">{Math.round(bayanVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bayanVolume}
                  onChange={(e) => onBayanVolumeChange(Number(e.target.value))}
                  className="w-full accent-[#d4af37]"
                />
                <div className="flex items-center justify-between text-[10px] text-[#d4af37]/70">
                  <span>Modulated Copper</span>
                  <span>Pan: Left (-28%)</span>
                </div>
              </div>
            </div>

            {/* Master Tabla & Dayan Fine Pitch */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {/* Master Tabla Volume */}
              <div className="flex items-center justify-between bg-[#18050a] px-3 py-2 rounded-lg border border-[#d4af37]/20">
                <span className="text-xs font-semibold text-[#ffd700]">Master Tabla</span>
                <div className="flex items-center gap-2 w-32">
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

              {/* Dayan Pitch Fine Tuning */}
              <div className="flex items-center justify-between bg-[#18050a] px-3 py-2 rounded-lg border border-[#d4af37]/20">
                <span className="text-xs font-semibold text-[#ffd700]">
                  Dayan Pitch <span className="text-[10px] opacity-75 font-mono">({rootSaNote})</span>
                </span>
                <div className="flex items-center gap-2 w-36">
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={dayanFineCents}
                    onChange={(e) => onDayanFineCentsChange(Number(e.target.value))}
                    className="w-full accent-[#d4af37]"
                    title="Fine-tune Dayan pitch in cents"
                  />
                  <span className="font-mono text-xs text-[#d4af37] tabular-nums w-10 text-right">
                    {dayanFineCents > 0 ? `+${dayanFineCents}` : dayanFineCents}¢
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pattern Customization & Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-[#d4af37]/80">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tap any bol below to test individual Dayan &amp; Bayan strikes</span>
            </div>

            <button
              onClick={() => setShowPatternEditor(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2b0e14] hover:bg-[#3d141e] border border-[#d4af37]/50 rounded-lg text-xs font-bold text-[#ffd700] transition shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              Edit Authentic Pattern
            </button>
          </div>
        </div>
      </div>

      {/* Theka Bol Strip / Matra Timeline */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
            Theka Bol Matrix ({activeTaal.matras} Matras)
          </span>
          <span className="text-xs text-[#d4af37]/70">
            X = Sam · 0 = Khali · 2,3,4 = Tali
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-16 gap-2">
          {activeTaal.beats.map((b) => {
            const isActive = isPlaying && b.matra === currentMatra;
            return (
              <button
                key={b.matra}
                onClick={() => handleTestBol(b.bol)}
                className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-[#ffd700] border-[#ffd700] text-black font-extrabold shadow-lg shadow-[#ffd700]/30 scale-105'
                    : b.isSam
                    ? 'bg-[#2f1017] border-[#ff9800]/50 text-[#ff9800] hover:bg-[#3b151e]'
                    : b.isKhali
                    ? 'bg-[#181124] border-[#90caf9]/40 text-[#90caf9] hover:bg-[#221832]'
                    : b.isTali
                    ? 'bg-[#290e15] border-[#d4af37]/40 text-[#ffd700] hover:bg-[#34121b]'
                    : 'bg-[#1a070c] border-[#d4af37]/20 text-[#d4af37]/80 hover:bg-[#270b13]'
                }`}
                title={`Matra ${b.matra}: ${b.bol} (${b.sign || 'Regular'})`}
              >
                {/* Beat Sign */}
                <span className={`text-[10px] font-mono font-bold leading-none ${
                  isActive ? 'text-black' : b.isSam ? 'text-[#ff9800]' : b.isKhali ? 'text-[#90caf9]' : 'text-[#d4af37]/70'
                }`}>
                  {b.sign || '·'}
                </span>

                {/* Bol text */}
                <span className="font-serif text-base font-bold my-1">
                  {b.bol}
                </span>

                {/* Matra # */}
                <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-black/80' : 'text-[#d4af37]/60'}`}>
                  {b.matra}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern Editor Modal */}
      {showPatternEditor && (
        <TaalPatternEditor
          taal={activeTaal}
          onSave={(updated) => {
            onUpdateTaal(updated);
            setShowPatternEditor(false);
          }}
          onClose={() => setShowPatternEditor(false)}
          onResetDefault={() => {
            onResetTaal(activeTaal.id);
            setShowPatternEditor(false);
          }}
        />
      )}

      {/* Acoustic Tabla Sample Manager Modal */}
      <TablaSampleManagerModal
        isOpen={showSampleManager}
        onClose={() => setShowSampleManager(false)}
        dayanFineCents={dayanFineCents}
        onDayanFineCentsChange={onDayanFineCentsChange}
        dayanVolume={dayanVolume}
        onDayanVolumeChange={onDayanVolumeChange}
        bayanVolume={bayanVolume}
        onBayanVolumeChange={onBayanVolumeChange}
        rootSaNote={rootSaNote}
      />
    </div>
  );
};
