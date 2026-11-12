import React from 'react';
import { IndianSwara, Saptak } from '../types/music';

interface SwaraKeyboardProps {
  onSwaraDown: (swara: IndianSwara, saptak: Saptak) => void;
  onSwaraUp: (swara: IndianSwara, saptak: Saptak) => void;
  activeSwara?: { swara: IndianSwara; saptak: Saptak } | null;
}

interface KeyConfig {
  swara: IndianSwara;
  saptak: Saptak;
  label: string;
  subLabel: string;
  isBlack: boolean;
}

export const SwaraKeyboard: React.FC<SwaraKeyboardProps> = ({
  onSwaraDown,
  onSwaraUp,
  activeSwara,
}) => {
  // 2-octave range: Mandra Pa to Taar Ga
  const keys: KeyConfig[] = [
    // Mandra
    { swara: 'P', saptak: 'mandra', label: 'P̣', subLabel: 'Pa', isBlack: false },
    { swara: 'd', saptak: 'mandra', label: 'ḍ', subLabel: 'komal dha', isBlack: true },
    { swara: 'D', saptak: 'mandra', label: 'Ḍ', subLabel: 'Dha', isBlack: false },
    { swara: 'n', saptak: 'mandra', label: 'ṉ', subLabel: 'komal ni', isBlack: true },
    { swara: 'N', saptak: 'mandra', label: 'Ṇ', subLabel: 'Ni', isBlack: false },

    // Madhya (Middle)
    { swara: 'S', saptak: 'madhya', label: 'S', subLabel: 'Sa', isBlack: false },
    { swara: 'r', saptak: 'madhya', label: 'r', subLabel: 'komal re', isBlack: true },
    { swara: 'R', saptak: 'madhya', label: 'R', subLabel: 'Re', isBlack: false },
    { swara: 'g', saptak: 'madhya', label: 'g', subLabel: 'komal ga', isBlack: true },
    { swara: 'G', saptak: 'madhya', label: 'G', subLabel: 'Ga', isBlack: false },
    { swara: 'm', saptak: 'madhya', label: 'm', subLabel: 'shuddh ma', isBlack: false },
    { swara: 'M', saptak: 'madhya', label: "M'", subLabel: 'tivra ma', isBlack: true },
    { swara: 'P', saptak: 'madhya', label: 'P', subLabel: 'Pa', isBlack: false },
    { swara: 'd', saptak: 'madhya', label: 'd', subLabel: 'komal dha', isBlack: true },
    { swara: 'D', saptak: 'madhya', label: 'D', subLabel: 'Dha', isBlack: false },
    { swara: 'n', saptak: 'madhya', label: 'n', subLabel: 'komal ni', isBlack: true },
    { swara: 'N', saptak: 'madhya', label: 'N', subLabel: 'Ni', isBlack: false },

    // Taar (Higher)
    { swara: 'S', saptak: 'taar', label: 'Ṡ', subLabel: 'Tar Sa', isBlack: false },
    { swara: 'r', saptak: 'taar', label: 'ṙ', subLabel: 'Tar komal re', isBlack: true },
    { swara: 'R', saptak: 'taar', label: 'Ṙ', subLabel: 'Tar Re', isBlack: false },
    { swara: 'g', saptak: 'taar', label: 'ġ', subLabel: 'Tar komal ga', isBlack: true },
    { swara: 'G', saptak: 'taar', label: 'Ġ', subLabel: 'Tar Ga', isBlack: false },
    { swara: 'm', saptak: 'taar', label: 'ṁ', subLabel: 'Tar Ma', isBlack: false },
  ];

  return (
    <div className="w-full bg-[#18060a] border border-[#d4af37]/30 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3 text-xs text-[#d4af37]/80">
        <span className="font-semibold uppercase tracking-wider">
          Harmonium Swara Guide / کی بورڈ
        </span>
        <span className="text-[11px] text-[#ffd700]/70">
          Touch or click keys to sound pitch
        </span>
      </div>

      {/* Horizontal Scrollable Keys */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-stretch gap-1 min-w-[700px] h-32 select-none">
          {keys.map((k, i) => {
            const isActive =
              activeSwara?.swara === k.swara && activeSwara?.saptak === k.saptak;

            return (
              <button
                key={i}
                onMouseDown={() => onSwaraDown(k.swara, k.saptak)}
                onMouseUp={() => onSwaraUp(k.swara, k.saptak)}
                onMouseLeave={() => onSwaraUp(k.swara, k.saptak)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  onSwaraDown(k.swara, k.saptak);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  onSwaraUp(k.swara, k.saptak);
                }}
                className={`flex-1 rounded-b-lg flex flex-col justify-end items-center pb-2 transition-all active:scale-95 ${
                  k.isBlack
                    ? isActive
                      ? 'bg-[#d4af37] text-black shadow-lg shadow-[#ffd700]/40'
                      : 'bg-[#2b0e14] text-[#ffd700] border-t-4 border-[#ff9800] hover:bg-[#3d141e]'
                    : isActive
                    ? 'bg-[#ffe082] text-black shadow-lg shadow-[#ffd700]/40'
                    : 'bg-[#f7ebdb] text-[#331118] hover:bg-[#fff9e6]'
                }`}
              >
                <span className="font-serif font-bold text-base leading-none">
                  {k.label}
                </span>
                <span className="text-[9px] opacity-75 mt-0.5 font-medium truncate">
                  {k.swara}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
