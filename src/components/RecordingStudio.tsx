import React, { useState, useEffect } from 'react';
import { AudioRecording, Taal, Raag } from '../types/music';
import { AudioEngine } from '../audio/AudioEngine';
import { Mic, Square, Play, Pause, Download, Trash2, Volume2, Music, Sparkles } from 'lucide-react';

interface RecordingStudioProps {
  activeTaal: Taal;
  activeRaag: Raag;
  isTablaPlaying: boolean;
  onToggleTabla: () => void;
  isTanpuraPlaying: boolean;
  onToggleTanpura: () => void;
}

const LOCAL_STORAGE_RECORDINGS_KEY = 'sur_sadhana_recordings';

export const RecordingStudio: React.FC<RecordingStudioProps> = ({
  activeTaal,
  activeRaag,
  isTablaPlaying,
  onToggleTabla,
  isTanpuraPlaying,
  onToggleTanpura,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordings, setRecordings] = useState<AudioRecording[]>([]);
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [playbackAudio, setPlaybackAudio] = useState<HTMLAudioElement | null>(null);

  const audioEngine = AudioEngine.getInstance();

  // Load recordings from localStorage metadata
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RECORDINGS_KEY);
      if (saved) {
        setRecordings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load recordings', e);
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    let timer: number;
    if (isRecording) {
      setRecordSeconds(0);
      timer = window.setInterval(() => {
        setRecordSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecord = async () => {
    const ok = await audioEngine.startRecording();
    if (ok) {
      setIsRecording(true);
    }
  };

  const handleStopRecord = async () => {
    const result = await audioEngine.stopRecording();
    setIsRecording(false);

    if (result) {
      const minutes = Math.floor(result.durationSec / 60);
      const seconds = result.durationSec % 60;
      const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      const newTake: AudioRecording = {
        id: `take_${Date.now()}`,
        title: `Riyaz Take ${recordings.length + 1} (${activeRaag.name})`,
        blobUrl: result.blobUrl,
        durationFormatted: formattedDuration,
        durationSeconds: result.durationSec,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        taalName: activeTaal.name,
        raagName: activeRaag.name,
        sizeBytes: result.sizeBytes,
      };

      const updated = [newTake, ...recordings];
      setRecordings(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_RECORDINGS_KEY, JSON.stringify(updated.map(r => ({
          ...r,
          blobUrl: '', // blob URLs cannot be persisted directly to localStorage
        }))));
      } catch (e) {
        // storage overflow
      }
    }
  };

  const handleTogglePlayTake = (take: AudioRecording) => {
    if (!take.blobUrl) {
      alert('Recording audio session has expired. New takes recorded in this session can be replayed and exported.');
      return;
    }

    if (activePlaybackId === take.id) {
      if (playbackAudio) {
        playbackAudio.pause();
        setActivePlaybackId(null);
      }
    } else {
      if (playbackAudio) {
        playbackAudio.pause();
      }
      const audio = new Audio(take.blobUrl);
      audio.onended = () => setActivePlaybackId(null);
      audio.play();
      setPlaybackAudio(audio);
      setActivePlaybackId(take.id);
    }
  };

  const handleDeleteTake = (id: string) => {
    if (activePlaybackId === id && playbackAudio) {
      playbackAudio.pause();
      setActivePlaybackId(null);
    }
    const filtered = recordings.filter(r => r.id !== id);
    setRecordings(filtered);
    localStorage.setItem(LOCAL_STORAGE_RECORDINGS_KEY, JSON.stringify(filtered));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#290c14] via-[#1e080f] to-[#120407] border border-[#d4af37]/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Audio Recording Studio / ریکارڈنگ اسٹوڈیو
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-500/40 font-mono">
                Live Mic Capture
              </span>
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-extrabold text-[#ffd700]">
              Riyaz &amp; Vocal Take Recorder
            </h2>
            <p className="text-xs md:text-sm text-[#e6d5c3]/90 leading-relaxed">
              Capture your vocal performance with authentic Tabla and Tanpura accompaniment. Replay your takes to evaluate vocal pitch, gamak, and layakaari.
            </p>
          </div>

          {/* Accompaniment Status */}
          <div className="flex flex-col gap-2 bg-[#1b070d] p-3 rounded-xl border border-[#d4af37]/30 shrink-0 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-[#d4af37] tracking-wider text-center">
              Active Accompaniment
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleTanpura}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold ${
                  isTanpuraPlaying ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#290e15] text-[#d4af37]/80'
                }`}
              >
                Tanpura: {isTanpuraPlaying ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={onToggleTabla}
                className={`flex-1 py-1.5 px-3 rounded text-xs font-semibold ${
                  isTablaPlaying ? 'bg-[#d4af37] text-black font-bold' : 'bg-[#290e15] text-[#d4af37]/80'
                }`}
              >
                Tabla: {isTablaPlaying ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Recording Console */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xl space-y-6">
        {/* Live Recording Pulsing Circle */}
        <div className="relative flex flex-col items-center justify-center">
          <div
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-900/60 border-4 border-red-500 shadow-2xl shadow-red-500/50 animate-pulse'
                : 'bg-[#250d14] border-2 border-[#d4af37]/40 shadow-inner'
            }`}
          >
            {isRecording ? (
              <>
                <div className="w-4 h-4 rounded-full bg-red-500 animate-ping mb-2" />
                <span className="font-mono text-3xl font-extrabold text-white tabular-nums tracking-wide">
                  {formatTimer(recordSeconds)}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-red-300 font-bold mt-1">
                  RECORDING RIYAZ
                </span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 text-[#ffd700] mb-2" />
                <span className="font-cinzel text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
                  Ready to Capture
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isRecording ? (
            <button
              onClick={handleStopRecord}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold text-sm shadow-xl shadow-red-700/40 transition active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Stop &amp; Save Recording / ریکارڈنگ مکمل کریں</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecord}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa820a] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold text-sm shadow-xl shadow-[#d4af37]/30 transition active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>Start Vocal Recording / نیا ریکارڈنگ شروع کریں</span>
            </button>
          )}
        </div>

        <p className="text-xs text-[#d4af37]/70 max-w-md">
          Tip: You can leave the Tanpura drone and Tabla theka playing in the background while recording your vocal riyaz.
        </p>
      </div>

      {/* Recorded Takes List */}
      <div className="bg-[#18060a] border border-[#d4af37]/25 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold tracking-wider text-[#d4af37]">
            Saved Vocal Takes ({recordings.length})
          </span>
          <span className="text-xs text-[#d4af37]/70">
            Export WAV / Replay Takes
          </span>
        </div>

        {recordings.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#d4af37]/60 italic bg-[#1e070c] rounded-xl border border-[#d4af37]/15">
            No recordings yet. Press "Start Vocal Recording" above to record your first riyaz take.
          </div>
        ) : (
          <div className="space-y-2.5">
            {recordings.map((take) => {
              const isPlayingTake = activePlaybackId === take.id;
              return (
                <div
                  key={take.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#210910] border border-[#d4af37]/20 hover:border-[#d4af37]/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleTogglePlayTake(take)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow ${
                        isPlayingTake
                          ? 'bg-[#ffd700] text-black'
                          : 'bg-[#2f1018] text-[#ffd700] border border-[#d4af37]/40 hover:bg-[#3d1520]'
                      }`}
                    >
                      {isPlayingTake ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#ffd700]">
                        {take.title}
                      </div>
                      <div className="text-[11px] text-[#d4af37]/70 flex items-center gap-2 mt-0.5">
                        <span>{take.timestamp}</span>
                        <span>·</span>
                        <span>{take.durationFormatted}</span>
                        {take.raagName && (
                          <>
                            <span>·</span>
                            <span>{take.raagName}</span>
                          </>
                        )}
                        {take.taalName && (
                          <>
                            <span>·</span>
                            <span>{take.taalName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {take.blobUrl && (
                      <a
                        href={take.blobUrl}
                        download={`${take.title.replace(/\s+/g, '_')}.webm`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2c0e15] hover:bg-[#3d141e] border border-[#d4af37]/30 text-xs font-medium text-[#ffd700] transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Export
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteTake(take.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-950/40 transition"
                      title="Delete Take"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
