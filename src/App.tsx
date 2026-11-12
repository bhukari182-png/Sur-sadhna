/**
 * SUR SADHANA – Classical Music Studio
 * Your Personal Classical Music Riyaz Studio
 */

import React, { useState, useEffect, useRef } from 'react';
import { Taal, Raag, LayaSpeed, PitchNote } from './types/music';
import { INITIAL_TAALS } from './data/taals';
import { CLASSICAL_RAAGS } from './data/raags';
import { AudioEngine } from './audio/AudioEngine';

import { TopBar } from './components/TopBar';
import { Navigation, TabId } from './components/Navigation';
import { DashboardStudio } from './components/DashboardStudio';
import { TablaStudio } from './components/TablaStudio';
import { TanpuraStudio } from './components/TanpuraStudio';
import { SwarmandalStudio } from './components/SwarmandalStudio';
import { RiyazStudio } from './components/RiyazStudio';
import { RaagPracticeStudio } from './components/RaagPracticeStudio';
import { RecordingStudio } from './components/RecordingStudio';
import { SettingsStudio } from './components/SettingsStudio';

const LOCAL_STORAGE_TAALS_KEY = 'sur_sadhana_custom_taals';
const LOCAL_STORAGE_SETTINGS_KEY = 'sur_sadhana_user_settings';

export default function App() {
  const audioEngineRef = useRef<AudioEngine>(AudioEngine.getInstance());
  const audioEngine = audioEngineRef.current;

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Taals & Raags
  const [taals, setTaals] = useState<Taal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TAALS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved taals', e);
    }
    return INITIAL_TAALS;
  });

  const [activeTaalId, setActiveTaalId] = useState<string>('teentaal');
  const activeTaal = taals.find(t => t.id === activeTaalId) || taals[0];

  const [raags] = useState<Raag[]>(CLASSICAL_RAAGS);
  const [activeRaagId, setActiveRaagId] = useState<string>('yaman');
  const activeRaag = raags.find(r => r.id === activeRaagId) || raags[0];

  // Tuning & Scale State
  const [saNote, setSaNote] = useState<PitchNote>('C#');
  const [saGender, setSaGender] = useState<'male' | 'female'>('male');
  const [referenceFreq, setReferenceFreq] = useState<number>(440);
  const [fineTuneCents, setFineTuneCents] = useState<number>(0);

  // Tabla State
  const [isTablaPlaying, setIsTablaPlaying] = useState<boolean>(false);
  const [tablaBpm, setTablaBpm] = useState<number>(108);
  const [currentLaya, setCurrentLaya] = useState<LayaSpeed>('madhya');
  const [currentMatra, setCurrentMatra] = useState<number>(1);
  const [isCurrentSam, setIsCurrentSam] = useState<boolean>(true);

  // Tanpura State
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState<boolean>(false);
  const [tanpuraFirstString, setTanpuraFirstString] = useState<'Pa' | 'Ma' | 'Ni'>('Pa');
  const [tanpuraTexture, setTanpuraTexture] = useState<'miraj' | 'tanjore' | 'electronic'>('miraj');
  const [tanpuraSpeed, setTanpuraSpeed] = useState<number>(1.0);
  const [activeTanpuraString, setActiveTanpuraString] = useState<number>(0);

  // Volume States
  const [masterVolume, setMasterVolume] = useState<number>(0.85);
  const [tablaVolume, setTablaVolume] = useState<number>(0.9);
  const [tanpuraVolume, setTanpuraVolume] = useState<number>(0.75);
  const [swarmandalVolume, setSwarmandalVolume] = useState<number>(0.8);
  const [harmoniumVolume, setHarmoniumVolume] = useState<number>(0.7);

  // Theme Mode (Dark Imperial Maroon vs Warm Classical Parchment)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Sync AudioEngine tuning whenever Sa, gender, cents, or refFreq changes
  useEffect(() => {
    audioEngine.setSaTuning(saNote, saGender, fineTuneCents, referenceFreq);
  }, [saNote, saGender, fineTuneCents, referenceFreq]);

  // Volume synchronizers
  useEffect(() => {
    audioEngine.setMasterVolume(masterVolume);
  }, [masterVolume]);

  useEffect(() => {
    audioEngine.setTablaVolume(tablaVolume);
  }, [tablaVolume]);

  useEffect(() => {
    audioEngine.setTanpuraVolume(tanpuraVolume);
  }, [tanpuraVolume]);

  useEffect(() => {
    audioEngine.setSwarmandalVolume(swarmandalVolume);
  }, [swarmandalVolume]);

  useEffect(() => {
    audioEngine.setHarmoniumVolume(harmoniumVolume);
  }, [harmoniumVolume]);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load user settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.saNote) setSaNote(parsed.saNote);
        if (parsed.saGender) setSaGender(parsed.saGender);
        if (parsed.referenceFreq) setReferenceFreq(parsed.referenceFreq);
        if (parsed.masterVolume !== undefined) setMasterVolume(parsed.masterVolume);
        if (parsed.tablaVolume !== undefined) setTablaVolume(parsed.tablaVolume);
        if (parsed.tanpuraVolume !== undefined) setTanpuraVolume(parsed.tanpuraVolume);
      }
    } catch (e) {
      console.warn('Failed to load user settings', e);
    }
  }, []);

  // Save settings periodically
  useEffect(() => {
    try {
      const settings = {
        saNote,
        saGender,
        referenceFreq,
        masterVolume,
        tablaVolume,
        tanpuraVolume,
        swarmandalVolume,
        harmoniumVolume,
      };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      // storage overflow
    }
  }, [saNote, saGender, referenceFreq, masterVolume, tablaVolume, tanpuraVolume, swarmandalVolume, harmoniumVolume]);

  // =========================================================================
  // TABLA ACTIONS
  // =========================================================================

  const handleStartTabla = () => {
    setIsTablaPlaying(true);
    audioEngine.startTabla(
      activeTaal.beats,
      tablaBpm,
      currentLaya,
      (matra, _bol, isSam) => {
        setCurrentMatra(matra);
        setIsCurrentSam(isSam);
      }
    );
  };

  const handlePauseTabla = () => {
    setIsTablaPlaying(false);
    audioEngine.pauseTabla();
  };

  const handleStopTabla = () => {
    setIsTablaPlaying(false);
    audioEngine.stopTabla();
    setCurrentMatra(1);
    setIsCurrentSam(true);
  };

  const handleResetTabla = () => {
    audioEngine.resetTabla();
    setCurrentMatra(1);
    setIsCurrentSam(true);
  };

  const handleToggleTabla = () => {
    if (isTablaPlaying) {
      handlePauseTabla();
    } else {
      handleStartTabla();
    }
  };

  const handleSelectTaal = (taal: Taal) => {
    setActiveTaalId(taal.id);
    setTablaBpm(taal.defaultBpm);
    if (isTablaPlaying) {
      audioEngine.updateTablaParams(taal.defaultBpm, currentLaya, taal.beats);
      handleResetTabla();
    } else {
      setCurrentMatra(1);
      setIsCurrentSam(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setTablaBpm(newBpm);
    if (isTablaPlaying) {
      audioEngine.updateTablaParams(newBpm, currentLaya);
    }
  };

  const handleLayaChange = (newLaya: LayaSpeed) => {
    setCurrentLaya(newLaya);
    if (isTablaPlaying) {
      audioEngine.updateTablaParams(tablaBpm, newLaya);
    }
  };

  const handleUpdateTaal = (updatedTaal: Taal) => {
    const updatedList = taals.map(t => (t.id === updatedTaal.id ? updatedTaal : t));
    setTaals(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_TAALS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn(e);
    }
    if (isTablaPlaying) {
      audioEngine.updateTablaParams(tablaBpm, currentLaya, updatedTaal.beats);
    }
  };

  const handleResetTaal = (taalId: string) => {
    const original = INITIAL_TAALS.find(t => t.id === taalId);
    if (!original) return;
    const updatedList = taals.map(t => (t.id === taalId ? original : t));
    setTaals(updatedList);
    localStorage.setItem(LOCAL_STORAGE_TAALS_KEY, JSON.stringify(updatedList));
    if (isTablaPlaying) {
      audioEngine.updateTablaParams(tablaBpm, currentLaya, original.beats);
    }
  };

  // =========================================================================
  // TANPURA ACTIONS
  // =========================================================================

  const handleToggleTanpura = () => {
    if (isTanpuraPlaying) {
      audioEngine.stopTanpura();
      setIsTanpuraPlaying(false);
    } else {
      setIsTanpuraPlaying(true);
      audioEngine.startTanpura(
        tanpuraFirstString,
        tanpuraSpeed,
        tanpuraTexture,
        (strIdx) => setActiveTanpuraString(strIdx)
      );
    }
  };

  const handleFirstStringChange = (s: 'Pa' | 'Ma' | 'Ni') => {
    setTanpuraFirstString(s);
    if (isTanpuraPlaying) {
      audioEngine.updateTanpuraParams(s, tanpuraSpeed, tanpuraTexture);
    }
  };

  const handleTextureChange = (t: 'miraj' | 'tanjore' | 'electronic') => {
    setTanpuraTexture(t);
    if (isTanpuraPlaying) {
      audioEngine.updateTanpuraParams(tanpuraFirstString, tanpuraSpeed, t);
    }
  };

  const handleTanpuraSpeedChange = (s: number) => {
    setTanpuraSpeed(s);
    if (isTanpuraPlaying) {
      audioEngine.updateTanpuraParams(tanpuraFirstString, s, tanpuraTexture);
    }
  };

  // 1-Click Launch full riyaz (starts both Tanpura & Tabla)
  const handleStartFullRiyazSession = () => {
    if (!isTanpuraPlaying) {
      handleToggleTanpura();
    }
    if (!isTablaPlaying) {
      handleStartTabla();
    }
  };

  // Preset loader
  const handleLoadPreset = (preset: {
    taalId: string;
    raagId: string;
    bpm: number;
    pitch: PitchNote;
    gender: 'male' | 'female';
  }) => {
    setActiveTaalId(preset.taalId);
    setActiveRaagId(preset.raagId);
    setTablaBpm(preset.bpm);
    setSaNote(preset.pitch);
    setSaGender(preset.gender);

    const taalObj = taals.find(t => t.id === preset.taalId);
    if (taalObj && isTablaPlaying) {
      audioEngine.updateTablaParams(preset.bpm, currentLaya, taalObj.beats);
    }
  };

  // Factory reset
  const handleResetAllSettings = () => {
    if (confirm('Reset all custom settings and taals to authentic factory defaults?')) {
      localStorage.removeItem(LOCAL_STORAGE_TAALS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_SETTINGS_KEY);
      setTaals(INITIAL_TAALS);
      setSaNote('C#');
      setSaGender('male');
      setReferenceFreq(440);
      setMasterVolume(0.85);
      setTablaVolume(0.9);
      setTanpuraVolume(0.75);
      setSwarmandalVolume(0.8);
      setHarmoniumVolume(0.7);
      setTablaBpm(108);
      setCurrentLaya('madhya');
      if (isTablaPlaying) handleStopTabla();
      if (isTanpuraPlaying) handleToggleTanpura();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDarkMode
        ? 'bg-[#140407] text-[#f7e7ce]'
        : 'bg-[#faf4eb] text-[#2c131a]'
    }`}>
      {/* Top Bar (One-row contract, live indicators, quick toggles) */}
      <TopBar
        selectedTaalName={activeTaal.name}
        currentLaya={currentLaya}
        bpm={tablaBpm}
        currentMatra={currentMatra}
        totalMatras={activeTaal.matras}
        isSam={isCurrentSam}
        isTablaPlaying={isTablaPlaying}
        isTanpuraPlaying={isTanpuraPlaying}
        onToggleTabla={handleToggleTabla}
        onToggleTanpura={handleToggleTanpura}
        saNote={saNote}
        saGender={saGender}
        masterVolume={masterVolume}
        onMasterVolumeChange={setMasterVolume}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Navigation Sub-header (Desktop) & Bottom Bar (Mobile) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isTablaPlaying={isTablaPlaying}
        isTanpuraPlaying={isTanpuraPlaying}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-32 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardStudio
            onNavigateTab={setActiveTab}
            activeTaal={activeTaal}
            activeRaag={activeRaag}
            currentLaya={currentLaya}
            bpm={tablaBpm}
            saNote={saNote}
            saGender={saGender}
            isTablaPlaying={isTablaPlaying}
            onToggleTabla={handleToggleTabla}
            isTanpuraPlaying={isTanpuraPlaying}
            onToggleTanpura={handleToggleTanpura}
            onStartFullRiyazSession={handleStartFullRiyazSession}
            currentMatra={currentMatra}
          />
        )}

        {activeTab === 'tabla' && (
          <TablaStudio
            taals={taals}
            activeTaal={activeTaal}
            onSelectTaal={handleSelectTaal}
            onUpdateTaal={handleUpdateTaal}
            onResetTaal={handleResetTaal}
            isPlaying={isTablaPlaying}
            onStart={handleStartTabla}
            onPause={handlePauseTabla}
            onStop={handleStopTabla}
            onReset={handleResetTabla}
            bpm={tablaBpm}
            onBpmChange={handleBpmChange}
            laya={currentLaya}
            onLayaChange={handleLayaChange}
            currentMatra={currentMatra}
            volume={tablaVolume}
            onVolumeChange={setTablaVolume}
          />
        )}

        {activeTab === 'tanpura' && (
          <TanpuraStudio
            isPlaying={isTanpuraPlaying}
            onTogglePlay={handleToggleTanpura}
            pitch={saNote}
            onPitchChange={setSaNote}
            gender={saGender}
            onGenderChange={setSaGender}
            firstString={tanpuraFirstString}
            onFirstStringChange={handleFirstStringChange}
            fineTuneCents={fineTuneCents}
            onFineTuneChange={setFineTuneCents}
            texture={tanpuraTexture}
            onTextureChange={handleTextureChange}
            volume={tanpuraVolume}
            onVolumeChange={setTanpuraVolume}
            speed={tanpuraSpeed}
            onSpeedChange={handleTanpuraSpeedChange}
            activeStringIndex={activeTanpuraString}
          />
        )}

        {activeTab === 'swarmandal' && (
          <SwarmandalStudio
            raags={raags}
            activeRaag={activeRaag}
            onSelectRaag={(r) => setActiveRaagId(r.id)}
            volume={swarmandalVolume}
            onVolumeChange={setSwarmandalVolume}
          />
        )}

        {activeTab === 'riyaz' && (
          <RiyazStudio
            raags={raags}
            activeRaag={activeRaag}
            onSelectRaag={(r) => setActiveRaagId(r.id)}
            isTanpuraPlaying={isTanpuraPlaying}
            onToggleTanpura={handleToggleTanpura}
            isTablaPlaying={isTablaPlaying}
            onToggleTabla={handleToggleTabla}
            tablaBpm={tablaBpm}
            onTablaBpmChange={handleBpmChange}
            laya={currentLaya}
            onLayaChange={handleLayaChange}
          />
        )}

        {activeTab === 'raag' && (
          <RaagPracticeStudio
            raags={raags}
            activeRaag={activeRaag}
            onSelectRaag={(r) => setActiveRaagId(r.id)}
            onGoToRiyaz={() => setActiveTab('riyaz')}
          />
        )}

        {activeTab === 'recording' && (
          <RecordingStudio
            activeTaal={activeTaal}
            activeRaag={activeRaag}
            isTablaPlaying={isTablaPlaying}
            onToggleTabla={handleToggleTabla}
            isTanpuraPlaying={isTanpuraPlaying}
            onToggleTanpura={handleToggleTanpura}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsStudio
            saNote={saNote}
            onSaNoteChange={setSaNote}
            saGender={saGender}
            onSaGenderChange={setSaGender}
            referenceFreq={referenceFreq}
            onReferenceFreqChange={setReferenceFreq}
            masterVolume={masterVolume}
            onMasterVolumeChange={setMasterVolume}
            tablaVolume={tablaVolume}
            onTablaVolumeChange={setTablaVolume}
            tanpuraVolume={tanpuraVolume}
            onTanpuraVolumeChange={setTanpuraVolume}
            swarmandalVolume={swarmandalVolume}
            onSwarmandalVolumeChange={setSwarmandalVolume}
            harmoniumVolume={harmoniumVolume}
            onHarmoniumVolumeChange={setHarmoniumVolume}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
            onResetAllSettings={handleResetAllSettings}
            onLoadPreset={handleLoadPreset}
            currentTaalId={activeTaalId}
            currentRaagId={activeRaagId}
            currentBpm={tablaBpm}
          />
        )}
      </main>
    </div>
  );
}
