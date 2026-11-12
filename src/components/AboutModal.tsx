import React from 'react';
import { X, Award, Music, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import heroBanner from '../assets/images/sur_sadhana_hero_banner_1794450439677.jpg';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#240a11] via-[#1a060d] to-[#120408] border border-[#d4af37]/40 shadow-2xl p-6 sm:p-8 text-[#f7e7ce]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#35101a] hover:bg-[#4d1626] border border-[#d4af37]/40 text-[#ffd700] transition"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-xs font-semibold text-[#ffd700] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
            Patron &amp; Master Artist
          </span>
          <span className="text-xs text-[#d4af37]/70 font-serif">استاد زوار حسین</span>
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#fff0c2] to-[#d4af37] mb-1">
          Ustad Zawar Hussain
        </h2>
        <p className="text-sm text-[#d4af37] font-serif italic mb-6">
          Zawar Hussain – Sur Sadhna · Professional Indian Classical Music Practice Studio
        </p>

        {/* Banner Artwork */}
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#d4af37]/30 shadow-lg mb-6">
          <img
            src={heroBanner}
            alt="Ustad Zawar Hussain Classical Studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140408] via-transparent to-black/30 flex items-end p-4">
            <div className="text-xs text-[#ffd700] font-medium tracking-wide">
              Traditional Riyaz Accompaniment · Tabla, Tanpura &amp; Swarmandal
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="space-y-4 text-xs sm:text-sm text-[#e6d5c3]/90 leading-relaxed">
          <p>
            Welcome to <strong className="text-[#ffd700]">Zawar Hussain – Sur Sadhna</strong>, envisioned by 
            <strong className="text-[#ffd700]"> Ustad Zawar Hussain</strong> as a sanctuary for vocalists, instrumentalists, 
            and music students of Indian and Pakistani classical traditions.
          </p>

          <p>
            Classical Indian music riyaz requires unwavering pitch foundation and authentic rhythmic breathing. 
            This studio delivers a complete acoustic environment replicating the warmth and presence of a live guru and accompanists:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            <div className="p-3.5 rounded-xl bg-[#2d0e17] border border-[#d4af37]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs">
                <Music className="w-4 h-4 text-[#ffd700]" />
                Realistic Live Tabla
              </div>
              <p className="text-[11px] text-[#e6d5c3]/80">
                Natural resonant Bayan bass with pitch-bend modulation and singing Dayan treble overtones across 12 authentic classical Taals.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2d0e17] border border-[#d4af37]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs">
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                Professional Fillers &amp; Relas
              </div>
              <p className="text-[11px] text-[#e6d5c3]/80">
                Switch seamlessly between Basic Theka, Theka with Live Fillers/Mohras, and virtuosic Advanced Tabla Performance.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2d0e17] border border-[#d4af37]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs">
                <BookOpen className="w-4 h-4 text-[#ffd700]" />
                Miraj Jawari Tanpura
              </div>
              <p className="text-[11px] text-[#e6d5c3]/80">
                Acoustic thread-buzz simulation with Pa, Ma, and Ni tuning presets for both male and female vocal pitch registers.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#2d0e17] border border-[#d4af37]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#ffd700] font-bold text-xs">
                <Award className="w-4 h-4 text-[#ffd700]" />
                Sur Pariksha Pitch Tracking
              </div>
              <p className="text-[11px] text-[#e6d5c3]/80">
                Microtonal shruti tuner and real-time cent deviation meter to cultivate flawless intonation on every swara.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1b050b] border border-[#d4af37]/40 space-y-2">
            <h4 className="text-xs font-bold text-[#ffd700] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Dedication &amp; Lineage
            </h4>
            <p className="text-xs text-[#e6d5c3]/85">
              Dedicated to the preservation and daily practice of classical Hindustani and Sufi repertoire under the guidance of Ustad Zawar Hussain. May this studio elevate your daily riyaz and deepen your mastery of Sur and Laya.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#d4af37]/25 flex items-center justify-between">
          <span className="text-[11px] text-[#d4af37]/70 font-mono">
            Version 2.0 · Professional Studio Edition
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#ffd700] hover:to-[#c49214] text-[#140508] font-bold text-xs shadow-md transition"
          >
            Enter Studio
          </button>
        </div>
      </div>
    </div>
  );
};
