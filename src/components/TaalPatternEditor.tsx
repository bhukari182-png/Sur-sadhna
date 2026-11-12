import React, { useState } from 'react';
import { Taal, BeatInfo, Vibhag } from '../types/music';
import { X, Plus, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';

interface TaalPatternEditorProps {
  taal: Taal;
  onSave: (updatedTaal: Taal) => void;
  onClose: () => void;
  onResetDefault: () => void;
}

const COMMON_BOLS = ['Dha', 'Dhin', 'Tin', 'Ta', 'Na', 'Ge', 'Ghe', 'Kat', 'Ti', 'Te', 'Tu', 'Tirakita', 'KiTe', 'DhaGe', 'GaDi', 'S'];

export const TaalPatternEditor: React.FC<TaalPatternEditorProps> = ({
  taal,
  onSave,
  onClose,
  onResetDefault,
}) => {
  const [name, setName] = useState(taal.name);
  const [urduName, setUrduName] = useState(taal.urduName);
  const [beats, setBeats] = useState<BeatInfo[]>([...taal.beats]);
  const [defaultBpm, setDefaultBpm] = useState(taal.defaultBpm);

  // Update a single beat's bol
  const handleBolChange = (index: number, newBol: string) => {
    const updated = [...beats];
    updated[index] = { ...updated[index], bol: newBol };
    setBeats(updated);
  };

  // Toggle Sam / Tali / Khali type
  const handleTypeChange = (index: number, type: 'sam' | 'tali' | 'khali' | 'regular') => {
    const updated = [...beats];
    const beat = updated[index];

    if (type === 'sam') {
      beat.isSam = true;
      beat.isTali = true;
      beat.isKhali = false;
      beat.sign = 'X';
    } else if (type === 'tali') {
      beat.isSam = false;
      beat.isTali = true;
      beat.isKhali = false;
      beat.sign = '2'; // or prompt
    } else if (type === 'khali') {
      beat.isSam = false;
      beat.isTali = false;
      beat.isKhali = true;
      beat.sign = '0';
    } else {
      beat.isSam = false;
      beat.isTali = false;
      beat.isKhali = false;
      beat.sign = '';
    }

    setBeats(updated);
  };

  // Add a beat
  const handleAddBeat = () => {
    const newMatra = beats.length + 1;
    setBeats([
      ...beats,
      {
        matra: newMatra,
        bol: 'Dha',
        isSam: beats.length === 0,
        isTali: beats.length === 0,
        isKhali: false,
        sign: beats.length === 0 ? 'X' : '',
        vibhagIndex: 0,
      },
    ]);
  };

  // Remove last beat
  const handleRemoveBeat = (index: number) => {
    if (beats.length <= 4) return;
    const filtered = beats.filter((_, i) => i !== index).map((b, i) => ({
      ...b,
      matra: i + 1,
      isSam: i === 0 ? true : b.isSam,
      sign: i === 0 ? 'X' : b.sign,
    }));
    setBeats(filtered);
  };

  const handleSave = () => {
    // Reconstruct vibhags from marks
    const vibhags: Vibhag[] = [];
    let currentVibhagLength = 0;
    let vIndex = 0;

    beats.forEach((b, idx) => {
      currentVibhagLength++;
      if (b.sign === 'X' || b.sign === '0' || b.isTali || idx === beats.length - 1) {
        // mark vibhag
      }
    });

    // Default 1-2 vibhags fallback
    const updatedTaal: Taal = {
      ...taal,
      name,
      urduName,
      matras: beats.length,
      defaultBpm,
      beats,
      isCustomizable: true,
    };

    onSave(updatedTaal);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1b080d] border border-[#d4af37]/40 rounded-2xl p-6 text-[#f5e6d3] shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ffd700]" />
              <h3 className="font-cinzel text-xl font-bold text-[#ffd700]">
                Rhythmic Pattern Editor / تال تالیف
              </h3>
            </div>
            <p className="text-xs text-[#d4af37]/80 mt-1">
              Customize bols, claps (Tali), waves (Khali), and beats for authentic Pakistani &amp; Indian classical compositions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#2a0e15] hover:bg-[#3a1520] text-[#d4af37] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div>
            <label className="text-xs text-[#d4af37] font-medium block mb-1">Taal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#120407] border border-[#d4af37]/30 rounded-lg px-3 py-2 text-sm text-[#ffd700] focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="text-xs text-[#d4af37] font-medium block mb-1">Urdu Title</label>
            <input
              type="text"
              value={urduName}
              onChange={(e) => setUrduName(e.target.value)}
              dir="rtl"
              className="w-full bg-[#120407] border border-[#d4af37]/30 rounded-lg px-3 py-2 text-sm text-[#ffd700] focus:outline-none focus:border-[#ffd700]"
            />
          </div>
          <div>
            <label className="text-xs text-[#d4af37] font-medium block mb-1">Default BPM ({defaultBpm})</label>
            <input
              type="range"
              min="40"
              max="240"
              value={defaultBpm}
              onChange={(e) => setDefaultBpm(Number(e.target.value))}
              className="w-full accent-[#d4af37] mt-2"
            />
          </div>
        </div>

        {/* Beats Matrix */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-[#d4af37] font-semibold">
              Matras Configuration ({beats.length} Beats)
            </span>
            <button
              onClick={handleAddBeat}
              className="flex items-center gap-1 px-3 py-1 bg-[#2f1118] hover:bg-[#431923] border border-[#d4af37]/40 rounded-lg text-xs font-medium text-[#ffd700] transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Beat
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {beats.map((beat, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-[#240b12] border border-[#d4af37]/20 text-xs"
              >
                {/* Matra Number */}
                <span className="w-7 text-center font-mono font-bold text-[#ffd700]">
                  #{beat.matra}
                </span>

                {/* Bol Input / Quick selector */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={beat.bol}
                    onChange={(e) => handleBolChange(index, e.target.value)}
                    className="w-full bg-[#140508] border border-[#d4af37]/30 rounded px-2 py-1 text-sm text-[#ffd700] font-serif focus:outline-none focus:border-[#ffd700]"
                    placeholder="Bol..."
                  />
                </div>

                {/* Common Bol Quick Fill Chips */}
                <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-[180px]">
                  {COMMON_BOLS.slice(0, 6).map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBolChange(index, b)}
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        beat.bol === b
                          ? 'bg-[#d4af37] text-[#140508] font-bold'
                          : 'bg-[#18060a] text-[#d4af37]/70 hover:text-[#ffd700]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {/* Sam / Tali / Khali selector */}
                <div className="flex items-center gap-1 bg-[#150508] p-1 rounded border border-[#d4af37]/20">
                  <button
                    onClick={() => handleTypeChange(index, 'sam')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      beat.isSam ? 'bg-[#ff9800] text-black shadow' : 'text-[#ff9800]/60 hover:text-[#ff9800]'
                    }`}
                    title="Sam (First Beat)"
                  >
                    X (Sam)
                  </button>
                  <button
                    onClick={() => handleTypeChange(index, 'tali')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      beat.isTali && !beat.isSam ? 'bg-[#d4af37] text-black shadow' : 'text-[#d4af37]/60 hover:text-[#d4af37]'
                    }`}
                    title="Tali (Clap)"
                  >
                    Tali
                  </button>
                  <button
                    onClick={() => handleTypeChange(index, 'khali')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      beat.isKhali ? 'bg-[#42a5f5] text-black shadow' : 'text-[#42a5f5]/60 hover:text-[#42a5f5]'
                    }`}
                    title="Khali (Wave)"
                  >
                    0 (Khali)
                  </button>
                  <button
                    onClick={() => handleTypeChange(index, 'regular')}
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      !beat.isSam && !beat.isTali && !beat.isKhali
                        ? 'bg-[#3e1620] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Normal
                  </button>
                </div>

                {/* Delete beat */}
                <button
                  onClick={() => handleRemoveBeat(index)}
                  disabled={beats.length <= 4}
                  className="p-1 rounded text-red-400 hover:bg-red-950/40 disabled:opacity-30 transition"
                  title="Remove Matra"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#d4af37]/20 mt-6">
          <button
            onClick={onResetDefault}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#230910] hover:bg-[#340f18] text-[#d4af37] rounded-lg text-xs font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Authentic Pattern
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#250d14] hover:bg-[#38141e] text-[#e0cfbb] rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-[#d4af37] to-[#aa820a] hover:from-[#ffd700] hover:to-[#c69a1b] text-[#140508] font-bold rounded-lg text-xs shadow-lg transition"
            >
              <Check className="w-4 h-4" />
              Save Taal Pattern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
