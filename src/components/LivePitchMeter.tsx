import React, { useEffect, useState } from 'react';
import { AudioEngine } from '../audio/AudioEngine';
import { IndianSwara, Saptak } from '../types/music';
import { Mic, MicOff, Activity } from 'lucide-react';

export const LivePitchMeter: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitchData, setPitchData] = useState<{
    hz: number;
    nearestSwara: IndianSwara;
    saptak: Saptak;
    noteName: string;
    centsDeviation: number;
    volume: number;
  } | null>(null);

  const audioEngine = AudioEngine.getInstance();

  const toggleMic = async () => {
    if (isListening) {
      audioEngine.stopPitchTracker();
      setIsListening(false);
      setPitchData(null);
    } else {
      const ok = await audioEngine.startPitchTracker((data) => {
        setPitchData(data);
      });
      if (ok) setIsListening(true);
    }
  };

  useEffect(() => {
    return () => {
      audioEngine.stopPitchTracker();
    };
  }, []);

  const cents = pitchData?.centsDeviation ?? 0;
  const isInTune = Math.abs(cents) <= 8;

  return (
    <div className="w-full bg-[#1c080d] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#ffd700]" />
          <h4 className="font-cinzel text-sm font-bold text-[#ffd700]">
            Sur Pariksha (Live Vocal Pitch Tuner) / سر پرکھ
          </h4>
        </div>
        <button
          onClick={toggleMic}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isListening
              ? 'bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-500/50'
              : 'bg-[#2b0e14] hover:bg-[#3b151e] text-[#ffd700] border border-[#d4af37]/40'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-3.5 h-3.5" />
              Stop Tuner
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5" />
              Enable Mic Tuner
            </>
          )}
        </button>
      </div>

      {isListening ? (
        <div className="flex flex-col items-center justify-center py-2">
          {pitchData ? (
            <div className="w-full flex flex-col items-center">
              {/* Swara Display */}
              <div className="flex items-baseline gap-3 my-1">
                <span className="font-serif text-5xl font-extrabold text-[#ffd700] tracking-wide drop-shadow">
                  {pitchData.nearestSwara}
                </span>
                <span className="font-mono text-sm text-[#d4af37]/90 bg-[#2b0e14] px-2 py-0.5 rounded border border-[#d4af37]/30">
                  {pitchData.noteName} · {pitchData.hz} Hz
                </span>
                <span className="text-xs uppercase text-[#d4af37]/70">
                  {pitchData.saptak} Saptak
                </span>
              </div>

              {/* Intonation Needle Bar */}
              <div className="w-full max-w-xs mt-3">
                <div className="flex justify-between text-[10px] text-[#d4af37]/70 font-mono mb-1">
                  <span>-50¢ (Flat)</span>
                  <span className={isInTune ? 'text-green-400 font-bold' : ''}>PERFECT SUR (0¢)</span>
                  <span>+50¢ (Sharp)</span>
                </div>
                <div className="relative w-full h-3 bg-[#110306] rounded-full overflow-hidden border border-[#d4af37]/30">
                  {/* Center Target */}
                  <div className="absolute top-0 bottom-0 left-1/2 -ml-0.5 w-1 bg-green-500/60 z-10" />

                  {/* Indicator needle */}
                  <div
                    className={`absolute top-0 bottom-0 w-2.5 rounded-full transition-all duration-75 ${
                      isInTune ? 'bg-green-400 shadow-md shadow-green-400/80' : cents < 0 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{
                      left: `calc(${50 + (cents / 50) * 45}% - 5px)`,
                    }}
                  />
                </div>
                <div className="text-center text-xs mt-1.5 font-mono">
                  <span className={isInTune ? 'text-green-400 font-bold' : 'text-[#ffd700]'}>
                    {cents > 0 ? `+${cents} cents` : `${cents} cents`}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#d4af37]/70 py-4 italic">
              Sing or hum into microphone... Listening for fundamental Sur...
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-[#d4af37]/60 py-2">
          Turn on your microphone to see your exact pitch intonation (cents), nearest classical Swara, and frequency in real time during your riyaz.
        </p>
      )}
    </div>
  );
};
