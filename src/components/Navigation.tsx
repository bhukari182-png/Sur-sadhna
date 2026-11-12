import React from 'react';
import { Home, Disc3, Music2, Sparkles, Mic, Compass, Sliders, BookOpen } from 'lucide-react';

export type TabId = 'dashboard' | 'tabla' | 'tanpura' | 'swarmandal' | 'riyaz' | 'raag' | 'recording' | 'settings';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  isTablaPlaying: boolean;
  isTanpuraPlaying: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  isTablaPlaying,
  isTanpuraPlaying,
}) => {
  const tabs: Array<{ id: TabId; label: string; urdu: string; icon: React.ReactNode; indicator?: boolean }> = [
    { id: 'dashboard', label: 'Studio', urdu: 'اسٹوڈیو', icon: <Home className="w-4 h-4" /> },
    { id: 'tabla', label: 'Tabla & Taal', urdu: 'طبلہ و تال', icon: <Disc3 className="w-4 h-4" />, indicator: isTablaPlaying },
    { id: 'tanpura', label: 'Tanpura', urdu: 'تانپورہ', icon: <Music2 className="w-4 h-4" />, indicator: isTanpuraPlaying },
    { id: 'swarmandal', label: 'Swarmandal', urdu: 'سورمنڈل', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'riyaz', label: 'Riyaz', urdu: 'ریاض', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'raag', label: 'Raag', urdu: 'راگ', icon: <Compass className="w-4 h-4" /> },
    { id: 'recording', label: 'Record', urdu: 'ریکارڈنگ', icon: <Mic className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', urdu: 'ترتیبات', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop / Tablet Sub-Header Navigation Bar */}
      <nav className="hidden md:block w-full bg-[#160408] border-b border-[#d4af37]/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#35101a] text-[#ffd700] border border-[#d4af37]/50 shadow-md'
                      : 'text-[#d4af37]/75 hover:bg-[#250910] hover:text-[#ffd700]'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="text-[10px] text-[#d4af37]/60 font-serif">{tab.urdu}</span>
                  {tab.indicator && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb zone, >=44px touch hitbox) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#160408]/95 backdrop-blur-lg border-t border-[#d4af37]/30 pb-safe shadow-2xl">
        <div className="grid grid-cols-4 sm:grid-cols-8 items-center h-16">
          {tabs.slice(0, 4).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition relative ${
                  isActive ? 'text-[#ffd700]' : 'text-[#d4af37]/60 hover:text-[#d4af37]'
                }`}
              >
                <div className="relative">
                  {tab.icon}
                  {tab.indicator && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-1 leading-none ${isActive ? 'font-bold' : ''}`}>
                  {tab.label.split(' ')[0]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 w-8 h-0.5 bg-[#ffd700] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        {/* Second row / secondary quick switcher for remaining 4 on mobile */}
        <div className="grid grid-cols-4 items-center h-12 bg-[#120306] border-t border-[#d4af37]/15">
          {tabs.slice(4).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-1 min-h-[44px] text-[11px] font-medium transition ${
                  isActive ? 'text-[#ffd700] font-bold bg-[#280c14]' : 'text-[#d4af37]/60 hover:text-[#d4af37]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
