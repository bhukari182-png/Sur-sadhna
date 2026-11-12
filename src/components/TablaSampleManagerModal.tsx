import React, { useState, useRef } from 'react';
import { X, Volume2, Upload, RotateCcw, CheckCircle2, Music, Sparkles, AlertCircle, Info } from 'lucide-react';
import { AudioEngine } from '../audio/AudioEngine';

interface TablaSampleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayanFineCents: number;
  onDayanFineCentsChange: (cents: number) => void;
  dayanVolume: number;
  onDayanVolumeChange: (vol: number) => void;
  bayanVolume: number;
  onBayanVolumeChange: (vol: number) => void;
  rootSaNote: string;
}

interface BolSampleInfo {
  key: string;
  bol: string;
  name: string;
  drum: 'dayan' | 'bayan' | 'combined';
  desc: string;
}

const BOL_DEFINITIONS: BolSampleInfo[] = [
  { key: 'tabla_dha', bol: 'Dha', name: 'Dha (دھا)', drum: 'combined', desc: 'Concert simultaneous strike: Bayan Ghe + Dayan Na with acoustic micro-flam' },
  { key: 'tabla_dhin', bol: 'Dhin', name: 'Dhin (دھن)', drum: 'combined', desc: 'Resonant combined strike: Bayan Ghe + Dayan Tin' },
  { key: 'dayan_na', bol: 'Na', name: 'Na / Ta (نا / تا)', drum: 'dayan', desc: 'Crisp ringing rim strike on Dayan Chanti (Gajra)' },
  { key: 'dayan_tin', bol: 'Tin', name: 'Tin (تن)', drum: 'dayan', desc: 'Sweet open singing bell stroke on Dayan Maidan' },
  { key: 'dayan_tun', bol: 'Tun', name: 'Tun (تن)', drum: 'dayan', desc: 'Open center ringing strike vibrating the Vijayasar wood shell' },
  { key: 'dayan_ti', bol: 'Ti', name: 'Ti / Te (تی / تے)', drum: 'dayan', desc: 'Closed dry finger cluster slap on Dayan central Syahi' },
  { key: 'dayan_re', bol: 'Re', name: 'Re (رے)', drum: 'dayan', desc: 'Soft secondary index tap with rapid damping' },
  { key: 'bayan_ghe', bol: 'Ghe', name: 'Ghe / Ge (گھے / گے)', drum: 'bayan', desc: 'Deep resonant copper bass with wrist pressure glissando modulation' },
  { key: 'bayan_ke', bol: 'Ke', name: 'Ke / Ka (کے / کا)', drum: 'bayan', desc: 'Muted flat palm slap damping all Bayan vibrations' },
  { key: 'tabla_tirakita', bol: 'Tirakita', name: 'Tirakita (ترکٹ)', drum: 'combined', desc: 'Four-stroke rapid phrase: Ti (Right) -> Re (Right) -> Ki (Left) -> Ta (Right)' },
  { key: 'tabla_dhere', bol: 'Dhere', name: 'Dhere Dhere (دھیرے)', drum: 'combined', desc: 'Two-stroke rolling acoustic finger cluster' },
];

export const TablaSampleManagerModal: React.FC<TablaSampleManagerModalProps> = ({
  isOpen,
  onClose,
  dayanFineCents,
  onDayanFineCentsChange,
  dayanVolume,
  onDayanVolumeChange,
  bayanVolume,
  onBayanVolumeChange,
  rootSaNote,
}) => {
  const audioEngine = AudioEngine.getInstance();
  const [activeTestingBol, setActiveTestingBol] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedUploadKey, setSelectedUploadKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestBol = (bol: string) => {
    setActiveTestingBol(bol);
    audioEngine.initAudio().then(() => {
      audioEngine.playBol(bol);
      setTimeout(() => setActiveTestingBol(null), 350);
    });
  };

  const handleUploadClick = (key: string) => {
    setSelectedUploadKey(key);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUploadKey) return;

    try {
      setUploadMessage(`Processing ${file.name}...`);
      const arrayBuffer = await file.arrayBuffer();
      const success = await audioEngine.loadCustomSample(selectedUploadKey, arrayBuffer);
      if (success) {
        setUploadMessage(`Successfully loaded custom audio for ${selectedUploadKey}!`);
      } else {
        setUploadMessage(`Could not decode audio file. Please ensure it is a valid 44.1kHz WAV/MP3 file.`);
      }
    } catch {
      setUploadMessage(`Error reading audio file.`);
    }
    setTimeout(() => setUploadMessage(null), 4000);
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset all custom recorded samples to authentic studio defaults?')) {
      setUploadMessage('Resetting to authentic studio sample pack...');
      await audioEngine.resetToDefaultSamples();
      setUploadMessage('Restored authentic 44.1kHz studio tabla samples.');
      setTimeout(() => setUploadMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#240a12] via-[#1a060d] to-[#120408] border border-[#d4af37]/40 shadow-2xl p-5 sm:p-7 text-[#f7e7ce]">
        {/* Hidden File Input for Custom Sample Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/wav,audio/mp3,audio/ogg,audio/x-wav,audio/mpeg"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#35101a] hover:bg-[#4d1626] border border-[#d4af37]/40 text-[#ffd700] transition"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Acoustic Sample Engine Active (44.1 kHz PCM)
          </span>
          <span className="text-xs text-[#d4af37]/80 font-serif">طبلہ آڈیو نمونہ جات</span>
        </div>

        <h2 className="font-cinzel text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff1c4] to-[#d4af37] mb-1">
          Acoustic Tabla Sample Studio
        </h2>
        <p className="text-xs text-[#d4af37]/90 font-serif italic mb-5">
          Real acoustic Dayan (Treble) &amp; Bayan (Bass) recordings with separate multi-channel volume, Dayan pitch scaling to Sa, and custom sample loading.
        </p>

        {uploadMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#2e1019] border border-[#ffd700]/50 text-xs text-[#ffd700] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#ffd700] shrink-0" />
            <span>{uploadMessage}</span>
          </div>
        )}

        {/* Real-time Acoustic Balance & Pitch Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#1a050b] border border-[#d4af37]/30 mb-6">
          {/* Dayan Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#ffd700]">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-[#ffd700]" />
                Dayan (Treble Tabla)
              </span>
              <span className="font-mono">{Math.round(dayanVolume * 100)}%</span>
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
            <div className="text-[10px] text-[#d4af37]/70 flex justify-between">
              <span>Chanti &amp; Syahi</span>
              <span>Panned Right (+28%)</span>
            </div>
          </div>

          {/* Bayan Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#ffd700]">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#ffd700]" />
                Bayan (Bass Tabla)
              </span>
              <span className="font-mono">{Math.round(bayanVolume * 100)}%</span>
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
            <div className="text-[10px] text-[#d4af37]/70 flex justify-between">
              <span>Resonant Copper Drum</span>
              <span>Panned Left (-28%)</span>
            </div>
          </div>

          {/* Dayan Pitch Fine Tuning */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#ffd700]">
              <span>Dayan Pitch (Sa: {rootSaNote})</span>
              <span className="font-mono">
                {dayanFineCents > 0 ? `+${dayanFineCents}` : dayanFineCents} ¢
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={dayanFineCents}
              onChange={(e) => onDayanFineCentsChange(Number(e.target.value))}
              className="w-full accent-[#d4af37]"
            />
            <div className="text-[10px] text-[#d4af37]/70 flex justify-between">
              <span>-50 Cents (Flatter)</span>
              <span>+50 Cents (Sharper)</span>
            </div>
          </div>
        </div>

        {/* Authentic Bols Matrix & Sample Audition */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-sm font-bold text-[#ffd700] uppercase tracking-wider">
              Acoustic Bols &amp; Sample Audition
            </h3>
            <span className="text-[11px] text-[#d4af37]/70">
              Tap any bol to audition real acoustic sound
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BOL_DEFINITIONS.map((def) => {
              const isPlaying = activeTestingBol === def.bol;
              return (
                <div
                  key={def.key}
                  className="p-3 rounded-xl bg-[#200910] border border-[#d4af37]/25 hover:border-[#ffd700]/50 transition flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#ffd700] truncate">
                        {def.name}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                          def.drum === 'dayan'
                            ? 'bg-amber-900/40 text-amber-300 border border-amber-600/30'
                            : def.drum === 'bayan'
                            ? 'bg-orange-900/40 text-orange-300 border border-orange-600/30'
                            : 'bg-emerald-900/40 text-emerald-300 border border-emerald-600/30'
                        }`}
                      >
                        {def.drum}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#e6d5c3]/75 leading-tight line-clamp-1">
                      {def.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Play Bol */}
                    <button
                      onClick={() => handleTestBol(def.bol)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        isPlaying
                          ? 'bg-[#ffd700] text-[#140408] scale-105 shadow-md shadow-[#ffd700]/30'
                          : 'bg-[#2f0e17] text-[#ffd700] hover:bg-[#431422] border border-[#d4af37]/30'
                      }`}
                      title={`Play ${def.bol}`}
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Play</span>
                    </button>

                    {/* Upload Custom WAV */}
                    <button
                      onClick={() => handleUploadClick(def.key)}
                      className="p-1.5 rounded-lg bg-[#250a11] hover:bg-[#38111c] text-[#d4af37]/80 hover:text-[#ffd700] border border-[#d4af37]/25 transition"
                      title={`Upload custom WAV/MP3 recording for ${def.bol}`}
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Professional Recording Guide & Instructions */}
        <div className="p-4 rounded-2xl bg-[#17050a] border border-[#d4af37]/30 space-y-2 text-xs text-[#e6d5c3]/85 leading-relaxed mb-5">
          <h4 className="font-cinzel text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
            Guide: Adding Your Own Live Studio Recordings
          </h4>
          <p>
            You can replace any built-in bol with your own live studio recordings (WAV or MP3 format):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#d4af37]/90">
            <li><strong>Dayan (Na, Tin, Tun, Ti, Re)</strong>: Record in 44.1 kHz / 16-bit or 24-bit with a small diaphragm condenser mic positioned 3–4 inches above the Gajra rim, angled 45° towards the Syahi.</li>
            <li><strong>Bayan (Ghe, Ke)</strong>: Position a dynamic or large-diaphragm mic 4–5 inches above the Bayan maidan, slightly off-axis to avoid direct air blast from wrist slides.</li>
            <li><strong>Compound Bols (Dha, Dhin, Tirakita)</strong>: Click the <Upload className="w-3 h-3 inline mx-0.5" /> upload button on any row to import your customized take. Custom audio is automatically saved to browser storage and persists across sessions!</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#d4af37]/25 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#250a11] hover:bg-[#39101d] text-xs text-[#d4af37] border border-[#d4af37]/30 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Studio Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#ffd700] hover:to-[#c49214] text-[#140508] font-bold text-xs shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
