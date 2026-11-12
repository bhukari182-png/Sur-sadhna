/**
 * Sur Sadhana Audio Engine
 * High-fidelity Web Audio API engine for Tabla, Tanpura, Swarmandal, Harmonium,
 * Pitch Tracking, and Vocal Recording.
 */

import { PitchNote, IndianSwara, Saptak, LayaSpeed, TablaPerformanceMode, BeatInfo } from '../types/music';

// Frequency calculation tables (A4 = 440Hz baseline)
const NOTE_SEMITONES: Record<PitchNote, number> = {
  'C': -9,
  'C#': -8,
  'D': -7,
  'D#': -6,
  'E': -5,
  'F': -4,
  'F#': -3,
  'G': -2,
  'G#': -1,
  'A': 0,
  'A#': 1,
  'B': 2,
};

export class AudioEngine {
  private static instance: AudioEngine | null = null;
  private ctx: AudioContext | null = null;

  // Master and Channel Gain Nodes
  private masterGain: GainNode | null = null;
  private tablaGain: GainNode | null = null;
  private tanpuraGain: GainNode | null = null;
  private swarmandalGain: GainNode | null = null;
  private harmoniumGain: GainNode | null = null;

  // Global Tuning
  private saNote: PitchNote = 'C#';
  private referenceA4: number = 440; // 440Hz or 432Hz
  private fineTuneCents: number = 0; // -50 to +50 cents
  private saGender: 'male' | 'female' = 'male';

  // Tabla Scheduler State
  private isTablaPlaying: boolean = false;
  private currentMatraIndex: number = 0;
  private tablaBpm: number = 108;
  private tablaLaya: LayaSpeed = 'madhya';
  private tablaPerformanceMode: TablaPerformanceMode = 'fillers';
  private cycleCount: number = 0;
  private schedulerTimerId: number | null = null;
  private nextBeatTime: number = 0;
  private currentTaalBeats: BeatInfo[] = [];
  private currentFillerBeats: BeatInfo[] = [];
  private currentAdvancedBeats: BeatInfo[] = [];
  private onBeatCallback: ((matra: number, bol: string, isSam: boolean, isTali: boolean, isKhali: boolean, vibhagIndex: number) => void) | null = null;

  // Tanpura State
  private isTanpuraPlaying: boolean = false;
  private tanpuraTimerId: number | null = null;
  private tanpuraFirstString: 'Pa' | 'Ma' | 'Ni' = 'Pa';
  private tanpuraSpeed: number = 1.0;
  private tanpuraTexture: 'miraj' | 'tanjore' | 'electronic' = 'miraj';
  private tanpuraStringStep: number = 0;
  private onTanpuraStringCallback: ((stringIndex: number) => void) | null = null;

  // Swarmandal State
  private swarmandalTimerId: number | null = null;

  // Active Harmonium Nodes for sustained playing
  private activeHarmoniumVoices: Map<string, { oscs: OscillatorNode[]; gain: GainNode }> = new Map();

  // Pitch Tracker (Analyser)
  private analyserNode: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  // Recorder State
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording: boolean = false;
  private recordStartTime: number = 0;

  private constructor() {
    // Lazy AudioContext on first touch
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initializes or resumes the AudioContext
   */
  public async initAudio(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass({ latencyHint: 'interactive' });

      // Create audio graph
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.tablaGain = this.ctx.createGain();
      this.tablaGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
      this.tablaGain.connect(this.masterGain);

      this.tanpuraGain = this.ctx.createGain();
      this.tanpuraGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.tanpuraGain.connect(this.masterGain);

      this.swarmandalGain = this.ctx.createGain();
      this.swarmandalGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.swarmandalGain.connect(this.masterGain);

      this.harmoniumGain = this.ctx.createGain();
      this.harmoniumGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.harmoniumGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx;
  }

  public getContext(): AudioContext | null {
    return this.ctx;
  }

  // =========================================================================
  // Pitch & Frequency Calculations
  // =========================================================================

  public setSaTuning(note: PitchNote, gender: 'male' | 'female', fineCents: number = 0, refA4: number = 440) {
    this.saNote = note;
    this.saGender = gender;
    this.fineTuneCents = fineCents;
    this.referenceA4 = refA4;
  }

  public getSaFrequency(): number {
    // Base octave: Male Sa is middle-low (e.g. C#3), Female Sa is higher (e.g. G#3 or A3)
    const octave = this.saGender === 'male' ? 3 : 3; // or female pitch offset
    const semitonesFromA4 = NOTE_SEMITONES[this.saNote] + (octave - 4) * 12;
    const baseFreq = this.referenceA4 * Math.pow(2, semitonesFromA4 / 12);
    // Female shift: usually 5 to 7 semitones higher than male C#
    const genderMultiplier = this.saGender === 'female' ? Math.pow(2, 7 / 12) : 1;
    const fineTuneMultiplier = Math.pow(2, this.fineTuneCents / 1200);
    return baseFreq * genderMultiplier * fineTuneMultiplier;
  }

  public getSwaraFrequency(swara: IndianSwara, saptak: Saptak): number {
    const saFreq = this.getSaFrequency();
    const swaraOffsets: Record<IndianSwara, number> = {
      'S': 0,
      'r': 1,
      'R': 2,
      'g': 3,
      'G': 4,
      'm': 5,
      'M': 6,
      'P': 7,
      'd': 8,
      'D': 9,
      'n': 10,
      'N': 11,
    };

    let semitones = swaraOffsets[swara];
    if (saptak === 'mandra') semitones -= 12;
    if (saptak === 'taar') semitones += 12;

    return saFreq * Math.pow(2, semitones / 12);
  }

  // =========================================================================
  // Volume Controls
  // =========================================================================

  public setMasterVolume(v: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.05);
    }
  }

  public setTablaVolume(v: number) {
    if (this.tablaGain && this.ctx) {
      this.tablaGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.05);
    }
  }

  public setTanpuraVolume(v: number) {
    if (this.tanpuraGain && this.ctx) {
      this.tanpuraGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.05);
    }
  }

  public setSwarmandalVolume(v: number) {
    if (this.swarmandalGain && this.ctx) {
      this.swarmandalGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.05);
    }
  }

  public setHarmoniumVolume(v: number) {
    if (this.harmoniumGain && this.ctx) {
      this.harmoniumGain.gain.setTargetAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime, 0.05);
    }
  }

  // =========================================================================
  // TABLA SOUND SYNTHESIS (Dayan & Bayan Acoustic Physical Modeling)
  // =========================================================================

  /**
   * Dayan Strike: Natural acoustic treble drum with authentic Syahi harmonics
   */
  public playDayan(time: number, type: 'chanti' | 'tin' | 'tun' | 'ti' | 're' | 'tu', intensity: number = 1.0) {
    if (!this.ctx || !this.tablaGain) return;
    const saFreq = this.getSaFrequency();
    // Human micro-velocity variation
    const humanVelocity = intensity * (0.95 + Math.random() * 0.1);

    if (type === 'chanti') {
      // "Ta" / "Na" - Ringing outer rim strike (Chanti) with rich metallic bell overtones
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Fundamental tuned Sa
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(saFreq * 2, time);

      // Symmetrical circular Bessel modes from Syahi paste
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(saFreq * 2 * 2.29, time);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(saFreq * 2 * 3.6, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(saFreq * 2 * 1.15, time);
      filter.Q.setValueAtTime(4.8, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.85 * humanVelocity, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.65);

      osc1.connect(gain);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gain);
      gain.connect(this.tablaGain);

      osc1.start(time);
      osc2.start(time);
      osc3.start(time);
      osc1.stop(time + 0.7);
      osc2.stop(time + 0.7);
      osc3.stop(time + 0.7);

      // Acoustic rim click
      this.playTransientSnap(time, 2200, 0.02, 0.4 * humanVelocity);
    } else if (type === 'tin') {
      // "Tin" - Sweet resonant singing stroke on maidan
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(saFreq * 2, time);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(saFreq * 4, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.75 * humanVelocity, time + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.8);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.2, time);
      osc2.connect(gain2);
      gain2.connect(gain);

      osc1.connect(gain);
      gain.connect(this.tablaGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.85);
      osc2.stop(time + 0.85);

      this.playTransientSnap(time, 1400, 0.025, 0.25 * humanVelocity);
    } else if (type === 'tun' || type === 'tu') {
      // "Tun" / "Tu" - Open resonant singing stroke vibrating entire shell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(saFreq, time);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(saFreq * 2, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.9 * humanVelocity, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.tablaGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 1.15);
      osc2.stop(time + 1.15);
    } else if (type === 'ti') {
      // "Ti" / "Te" - Damped flat finger cluster on central syahi
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(saFreq * 1.6, time);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(850, time);
      filter.Q.setValueAtTime(2.2, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.65 * humanVelocity, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.tablaGain);

      osc.start(time);
      osc.stop(time + 0.06);

      this.playTransientSnap(time, 1100, 0.035, 0.6 * humanVelocity);
    } else if (type === 're') {
      // "Re" - Soft index follow-up tap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(saFreq * 1.4, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.45 * humanVelocity, time + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);

      osc.connect(gain);
      gain.connect(this.tablaGain);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  /**
   * Bayan Strike: Deep modulated bass membrane with natural human palm glissando
   */
  public playBayan(time: number, type: 'ghe' | 'kat' | 'tap', intensity: number = 1.0, pitchBendOffset: number = 0) {
    if (!this.ctx || !this.tablaGain) return;
    const humanVelocity = intensity * (0.94 + Math.random() * 0.12);

    if (type === 'ghe') {
      // "Ge" / "Ghe" - Deep resonant sliding bass with wrist pressure modulation
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      subOsc.type = 'triangle';

      // Authentic live maestro palm pressure: slide from ~68Hz up to ~110Hz and settle
      const startF = 65 + pitchBendOffset;
      const peakF = 105 + pitchBendOffset + (Math.random() * 12 - 6);
      const settleF = 58 + pitchBendOffset;

      osc.frequency.setValueAtTime(startF, time);
      osc.frequency.linearRampToValueAtTime(peakF, time + 0.06);
      osc.frequency.exponentialRampToValueAtTime(settleF, time + 0.45);

      subOsc.frequency.setValueAtTime(startF * 0.5, time);
      subOsc.frequency.linearRampToValueAtTime(peakF * 0.5, time + 0.06);
      subOsc.frequency.exponentialRampToValueAtTime(settleF * 0.5, time + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, time);
      filter.Q.setValueAtTime(1.5, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(1.0 * humanVelocity, time + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.tablaGain);

      osc.start(time);
      subOsc.start(time);
      osc.stop(time + 0.65);
      subOsc.stop(time + 0.65);

      // Low thump transient
      this.playTransientSnap(time, 130, 0.08, 0.45 * humanVelocity);
    } else if (type === 'kat') {
      // "Kat" / "Ka" - Slap flat palm deadening stroke
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(240, time);
      filter.Q.setValueAtTime(2.4, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.85 * humanVelocity, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.tablaGain);

      noise.start(time);
      noise.stop(time + 0.065);
    }
  }

  private playTransientSnap(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.tablaGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + duration);

    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.tablaGain);

    osc.start(time);
    osc.stop(time + duration + 0.01);
  }

  /**
   * Execute authentic Tabla Bol with live human touch and expression
   */
  public playBol(bol: string, time?: number, intensity: number = 1.0) {
    if (!this.ctx) return;
    const t = time ?? this.ctx.currentTime;
    const cleanBol = bol.trim().toLowerCase().replace(/[\s\-_]/g, '');

    switch (cleanBol) {
      case 'dha':
        this.playBayan(t, 'ghe', intensity);
        this.playDayan(t, 'chanti', intensity);
        break;
      case 'dhin':
        this.playBayan(t, 'ghe', intensity);
        this.playDayan(t, 'tin', intensity);
        break;
      case 'dhi':
        this.playBayan(t, 'ghe', intensity * 0.95);
        this.playDayan(t, 'tin', intensity * 0.9);
        break;
      case 'ta':
      case 'na':
        this.playDayan(t, 'chanti', intensity);
        break;
      case 'tin':
      case 'din':
        this.playDayan(t, 'tin', intensity);
        break;
      case 'tun':
        this.playDayan(t, 'tun', intensity);
        break;
      case 'tu':
        this.playDayan(t, 'tu', intensity * 0.95);
        break;
      case 'ge':
      case 'ghe':
        this.playBayan(t, 'ghe', intensity);
        break;
      case 'ke':
      case 'ka':
      case 'kat':
      case 'tak':
        this.playBayan(t, 'kat', intensity);
        break;
      case 'ti':
      case 'te':
        this.playDayan(t, 'ti', intensity);
        break;
      case 're':
        this.playDayan(t, 're', intensity * 0.85);
        break;
      case 'dhage':
        this.playBayan(t, 'ghe', intensity);
        this.playDayan(t, 'chanti', intensity * 0.85);
        this.playBayan(t + 0.08, 'ghe', intensity * 0.75);
        break;
      case 'dhinna':
        this.playBayan(t, 'ghe', intensity);
        this.playDayan(t, 'tin', intensity * 0.85);
        this.playDayan(t + 0.08, 'chanti', intensity * 0.85);
        break;
      case 'nati':
        this.playDayan(t, 'chanti', intensity * 0.9);
        this.playDayan(t + 0.07, 'ti', intensity * 0.8);
        break;
      case 'naka':
        this.playDayan(t, 'chanti', intensity * 0.9);
        this.playBayan(t + 0.07, 'kat', intensity * 0.8);
        break;
      case 'take':
        this.playDayan(t, 'chanti', intensity * 0.85);
        this.playBayan(t + 0.07, 'kat', intensity * 0.8);
        break;
      case 'kite':
      case 'tete':
      case 'titi':
        this.playDayan(t, 'ti', intensity * 0.9);
        this.playDayan(t + 0.07, 'ti', intensity * 0.8);
        break;
      case 'tirakita':
        // Authentic 4-stroke rapid articulation: Ti -> Re -> Ki -> Ta
        this.playDayan(t, 'ti', intensity * 0.95);
        this.playDayan(t + 0.045, 're', intensity * 0.8);
        this.playBayan(t + 0.09, 'kat', intensity * 0.85);
        this.playDayan(t + 0.135, 'chanti', intensity * 0.9);
        break;
      case 'dhageten':
      case 'dhagena':
        this.playBayan(t, 'ghe', intensity);
        this.playDayan(t, 'chanti', intensity * 0.8);
        this.playDayan(t + 0.08, 'tin', intensity * 0.8);
        break;
      case 'gadi':
      case 'gane':
        this.playBayan(t, 'ghe', intensity * 0.9);
        this.playDayan(t + 0.07, 'chanti', intensity * 0.8);
        break;
      case 's':
      case '-':
      case '۔':
        // Musical rest with subtle room resonance
        break;
      default:
        this.playDayan(t, 'chanti', intensity * 0.75);
        break;
    }
  }

  // =========================================================================
  // TABLA SCHEDULER (Precision Web Audio Clock)
  // =========================================================================

  public startTabla(
    beats: BeatInfo[],
    bpm: number,
    laya: LayaSpeed,
    onBeat: (matra: number, bol: string, isSam: boolean, isTali: boolean, isKhali: boolean, vibhagIndex: number) => void,
    performanceMode: TablaPerformanceMode = 'fillers',
    fillerBeats?: BeatInfo[],
    advancedBeats?: BeatInfo[]
  ) {
    this.initAudio().then(() => {
      this.currentTaalBeats = beats;
      this.currentFillerBeats = fillerBeats || [];
      this.currentAdvancedBeats = advancedBeats || [];
      this.tablaPerformanceMode = performanceMode;
      this.tablaBpm = bpm;
      this.tablaLaya = laya;
      this.onBeatCallback = onBeat;
      this.isTablaPlaying = true;
      this.currentMatraIndex = 0;
      this.cycleCount = 0;

      if (!this.ctx) return;
      this.nextBeatTime = this.ctx.currentTime + 0.05;

      // Start high-precision scheduling loop (25ms interval)
      if (this.schedulerTimerId) clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = window.setInterval(() => this.scheduleTablaBeats(), 25);
    });
  }

  public updateTablaParams(
    bpm: number,
    laya: LayaSpeed,
    beats?: BeatInfo[],
    performanceMode?: TablaPerformanceMode,
    fillerBeats?: BeatInfo[],
    advancedBeats?: BeatInfo[]
  ) {
    this.tablaBpm = bpm;
    this.tablaLaya = laya;
    if (beats) this.currentTaalBeats = beats;
    if (performanceMode) this.tablaPerformanceMode = performanceMode;
    if (fillerBeats !== undefined) this.currentFillerBeats = fillerBeats;
    if (advancedBeats !== undefined) this.currentAdvancedBeats = advancedBeats;
  }

  public pauseTabla() {
    this.isTablaPlaying = false;
    if (this.schedulerTimerId) {
      clearInterval(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
  }

  public stopTabla() {
    this.pauseTabla();
    this.currentMatraIndex = 0;
    this.cycleCount = 0;
  }

  public resetTabla() {
    this.currentMatraIndex = 0;
    this.cycleCount = 0;
  }

  private getLayaMultiplier(): number {
    switch (this.tablaLaya) {
      case 'vilambit':
        return 0.5; // Half speed
      case 'madhya':
        return 1.0; // Standard
      case 'drut':
        return 1.75; // Fast
      case 'ati_drut':
        return 2.5; // Very Fast
      default:
        return 1.0;
    }
  }

  private scheduleTablaBeats() {
    if (!this.ctx || !this.isTablaPlaying || this.currentTaalBeats.length === 0) return;

    // Lookahead: schedule beats occurring within the next 100ms
    const lookaheadSec = 0.1;
    const layaMult = this.getLayaMultiplier();
    const beatDurationSec = (60 / this.tablaBpm) / layaMult;

    while (this.nextBeatTime < this.ctx.currentTime + lookaheadSec) {
      // Determine which beat source to use based on performance mode
      let activeBeatArray = this.currentTaalBeats;
      if (this.tablaPerformanceMode === 'advanced' && this.currentAdvancedBeats.length === this.currentTaalBeats.length) {
        activeBeatArray = this.currentAdvancedBeats;
      } else if (this.tablaPerformanceMode === 'fillers' && this.currentFillerBeats.length === this.currentTaalBeats.length) {
        // In fillers mode: Alternate every other avartan (cycle) with professional filler / mohra variations!
        if (this.cycleCount % 2 === 1) {
          activeBeatArray = this.currentFillerBeats;
        } else {
          activeBeatArray = this.currentTaalBeats;
        }
      }

      const beat = activeBeatArray[this.currentMatraIndex] || this.currentTaalBeats[this.currentMatraIndex];
      const scheduledTime = this.nextBeatTime;

      // Audio execution
      this.playBol(beat.bol, scheduledTime);

      // UI synchronization via timeout matched to Web Audio clock
      const delayMs = Math.max(0, (scheduledTime - this.ctx.currentTime) * 1000);
      const beatToNotify = { ...beat };
      window.setTimeout(() => {
        if (this.isTablaPlaying && this.onBeatCallback) {
          this.onBeatCallback(
            beatToNotify.matra,
            beatToNotify.bol,
            beatToNotify.isSam,
            beatToNotify.isTali,
            beatToNotify.isKhali,
            beatToNotify.vibhagIndex
          );
        }
      }, delayMs);

      // Advance to next matra
      this.nextBeatTime += beatDurationSec;
      this.currentMatraIndex = (this.currentMatraIndex + 1) % this.currentTaalBeats.length;
      if (this.currentMatraIndex === 0) {
        this.cycleCount++;
      }
    }
  }

  // =========================================================================
  // TANPURA DRONE SYNTHESIS (Miraj Jawari Thread Buzz Modeling)
  // =========================================================================

  public startTanpura(
    firstString: 'Pa' | 'Ma' | 'Ni',
    speed: number,
    texture: 'miraj' | 'tanjore' | 'electronic',
    onStringPluck?: (stringIdx: number) => void
  ) {
    this.initAudio().then(() => {
      this.tanpuraFirstString = firstString;
      this.tanpuraSpeed = speed;
      this.tanpuraTexture = texture;
      this.onTanpuraStringCallback = onStringPluck ?? null;
      this.isTanpuraPlaying = true;
      this.tanpuraStringStep = 0;

      this.scheduleNextTanpuraString();
    });
  }

  public updateTanpuraParams(firstString: 'Pa' | 'Ma' | 'Ni', speed: number, texture: 'miraj' | 'tanjore' | 'electronic') {
    this.tanpuraFirstString = firstString;
    this.tanpuraSpeed = speed;
    this.tanpuraTexture = texture;
  }

  public stopTanpura() {
    this.isTanpuraPlaying = false;
    if (this.tanpuraTimerId) {
      clearTimeout(this.tanpuraTimerId);
      this.tanpuraTimerId = null;
    }
  }

  private scheduleNextTanpuraString() {
    if (!this.isTanpuraPlaying || !this.ctx) return;

    // Sequence of 4 strings:
    // 0: First string (Pa, Ma, or Ni in Mandra)
    // 1: Second string (Sa)
    // 2: Third string (Sa)
    // 3: Fourth string (Kharaj Sa - Low Mandra)
    const stringIdx = this.tanpuraStringStep;
    this.pluckTanpuraString(stringIdx);

    if (this.onTanpuraStringCallback) {
      this.onTanpuraStringCallback(stringIdx);
    }

    // Interval between strings: approx 1.1s standard, divided by speed
    // 4th string has slightly longer sustain pause before repeating
    let stepDelayMs = (1100 / this.tanpuraSpeed);
    if (stringIdx === 3) {
      stepDelayMs = (1650 / this.tanpuraSpeed); // Rest before cycling back to Pa
    }

    this.tanpuraStringStep = (this.tanpuraStringStep + 1) % 4;
    this.tanpuraTimerId = window.setTimeout(() => this.scheduleNextTanpuraString(), stepDelayMs);
  }

  private pluckTanpuraString(stringIdx: number) {
    if (!this.ctx || !this.tanpuraGain) return;
    const now = this.ctx.currentTime;
    const saFreq = this.getSaFrequency();

    let stringFreq = saFreq;
    if (stringIdx === 0) {
      // First string: Pa (3/2 = 7 semitones down or Mandra Pa)
      if (this.tanpuraFirstString === 'Pa') {
        stringFreq = saFreq * Math.pow(2, -5 / 12); // Mandra Pa
      } else if (this.tanpuraFirstString === 'Ma') {
        stringFreq = saFreq * Math.pow(2, -7 / 12); // Mandra Ma (Shuddh)
      } else {
        stringFreq = saFreq * Math.pow(2, -1 / 12); // Mandra Ni (Shuddh)
      }
    } else if (stringIdx === 1 || stringIdx === 2) {
      // Middle paired Sa strings (Madhya Sa)
      // Subtle micro-detuning between string 2 & 3 for natural acoustic chorus shimmer!
      const detuneCents = stringIdx === 1 ? -2 : 2;
      stringFreq = saFreq * Math.pow(2, detuneCents / 1200);
    } else if (stringIdx === 3) {
      // Kharaj Sa (low octave Mandra Sa)
      stringFreq = saFreq * 0.5;
    }

    // Harmonic synthesis recreating Jawari thread resonance
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    if (this.tanpuraTexture === 'miraj') {
      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(stringFreq * 7, now);
      filter.frequency.exponentialRampToValueAtTime(stringFreq * 2.5, now + 3.5);
      filter.Q.setValueAtTime(3.0, now); // Resonant body formant
    } else if (this.tanpuraTexture === 'tanjore') {
      osc.type = 'triangle';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(stringFreq * 4, now);
      filter.Q.setValueAtTime(2.0, now);
    } else {
      // Electronic swar peti
      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(stringFreq * 5, now);
    }

    osc.frequency.setValueAtTime(stringFreq, now);

    // Tanpura natural envelope: soft finger pluck, gradual swell, rich singing sustain
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.tanpuraGain);

    osc.start(now);
    osc.stop(now + 5.0);
  }

  // =========================================================================
  // SWARMANDAL ENGINE (Acoustic Plucked Zither Harp)
  // =========================================================================

  public pluckSwarmandalString(semitoneOffset: number, intensity: number = 1.0) {
    if (!this.ctx || !this.swarmandalGain) return;
    const now = this.ctx.currentTime;
    const saFreq = this.getSaFrequency();
    const stringFreq = saFreq * Math.pow(2, semitoneOffset / 12);

    // Plucked string acoustic modeling (metallic attack + sparkling decay)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(stringFreq, now);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(stringFreq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(10000, stringFreq * 6), now);
    filter.frequency.exponentialRampToValueAtTime(stringFreq * 1.5, now + 1.8);

    // Instant pluck attack + exponential decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.6 * intensity, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.swarmandalGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.6);
    osc2.stop(now + 2.6);
  }

  /**
   * Sweeps across all strings (Glissando)
   */
  public sweepSwarmandal(
    strings: Array<{ semitoneOffset: number }>,
    direction: 'aroha' | 'avaroha' | 'both' = 'aroha',
    delayPerStringMs: number = 70
  ) {
    this.initAudio().then(() => {
      let notesToPlay = [...strings];
      if (direction === 'avaroha') {
        notesToPlay.reverse();
      } else if (direction === 'both') {
        notesToPlay = [...strings, ...[...strings].reverse()];
      }

      notesToPlay.forEach((item, idx) => {
        window.setTimeout(() => {
          this.pluckSwarmandalString(item.semitoneOffset, 0.85);
        }, idx * delayPerStringMs);
      });
    });
  }

  // =========================================================================
  // HARMONIUM ENGINE (Dual-reed organ for Riyaz guidance)
  // =========================================================================

  public startHarmoniumNote(swara: IndianSwara, saptak: Saptak) {
    this.initAudio().then(() => {
      if (!this.ctx || !this.harmoniumGain) return;
      const key = `${swara}_${saptak}`;
      if (this.activeHarmoniumVoices.has(key)) return;

      const freq = this.getSwaraFrequency(swara, saptak);
      const now = this.ctx.currentTime;

      // Dual reeds: primary reed + octave reed with slight chorus detune
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc2.detune.setValueAtTime(5, now); // slight chorus

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.harmoniumGain);

      osc1.start(now);
      osc2.start(now);

      this.activeHarmoniumVoices.set(key, { oscs: [osc1, osc2], gain });
    });
  }

  public stopHarmoniumNote(swara: IndianSwara, saptak: Saptak) {
    if (!this.ctx) return;
    const key = `${swara}_${saptak}`;
    const voice = this.activeHarmoniumVoices.get(key);
    if (!voice) return;

    const now = this.ctx.currentTime;
    voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
    voice.oscs.forEach(osc => osc.stop(now + 0.09));
    this.activeHarmoniumVoices.delete(key);
  }

  public stopAllHarmoniumNotes() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.activeHarmoniumVoices.forEach(voice => {
      voice.gain.gain.linearRampToValueAtTime(0.0001, now + 0.04);
      voice.oscs.forEach(osc => osc.stop(now + 0.05));
    });
    this.activeHarmoniumVoices.clear();
  }

  // =========================================================================
  // PITCH TRACKER (Live Vocal Pitch Analyzer for Riyaz)
  // =========================================================================

  public async startPitchTracker(onPitchDetected: (data: {
    hz: number;
    nearestSwara: IndianSwara;
    saptak: Saptak;
    noteName: string;
    centsDeviation: number;
    volume: number;
  }) => void): Promise<boolean> {
    try {
      await this.initAudio();
      if (!this.ctx) return false;

      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.micSource = this.ctx.createMediaStreamSource(this.micStream);
      this.analyserNode = this.ctx.createAnalyser();
      this.analyserNode.fftSize = 2048;

      this.micSource.connect(this.analyserNode);

      const buffer = new Float32Array(this.analyserNode.fftSize);

      const detectPitchLoop = () => {
        if (!this.analyserNode || !this.ctx) return;
        this.analyserNode.getFloatTimeDomainData(buffer);

        // Calculate RMS volume
        let sumSquares = 0;
        for (let i = 0; i < buffer.length; i++) {
          sumSquares += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sumSquares / buffer.length);

        if (rms > 0.02) {
          // Autocorrelation pitch detection
          const detectedHz = this.autoCorrelate(buffer, this.ctx.sampleRate);
          if (detectedHz > 60 && detectedHz < 1200) {
            const mapped = this.mapFrequencyToSwara(detectedHz);
            onPitchDetected({
              hz: Math.round(detectedHz * 10) / 10,
              nearestSwara: mapped.swara,
              saptak: mapped.saptak,
              noteName: mapped.noteName,
              centsDeviation: Math.round(mapped.cents),
              volume: Math.min(1, rms * 5),
            });
          }
        }

        if (this.micStream && this.micStream.active) {
          requestAnimationFrame(detectPitchLoop);
        }
      };

      requestAnimationFrame(detectPitchLoop);
      return true;
    } catch (e) {
      console.warn('Microphone access unavailable or denied', e);
      return false;
    }
  }

  public stopPitchTracker() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.micSource) {
      this.micSource.disconnect();
      this.micSource = null;
    }
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const size = buffer.length;
    let r1 = 0, r2 = size - 1;
    const thres = 0.2;

    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buffer[size - i]) < thres) {
        r2 = size - i;
        break;
      }
    }

    const trimmed = buffer.slice(r1, r2);
    const c = new Array(trimmed.length).fill(0);

    for (let i = 0; i < trimmed.length; i++) {
      for (let j = 0; j < trimmed.length - i; j++) {
        c[i] = c[i] + trimmed[j] * trimmed[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < trimmed.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    if (maxpos > 0 && maxpos < trimmed.length - 1) {
      const x1 = c[maxpos - 1], x2 = c[maxpos], x3 = c[maxpos + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = maxpos - b / (2 * a);
    }

    return sampleRate / T0;
  }

  private mapFrequencyToSwara(freq: number): {
    swara: IndianSwara;
    saptak: Saptak;
    noteName: string;
    cents: number;
  } {
    const saFreq = this.getSaFrequency();
    const semitonesFromSa = 12 * Math.log2(freq / saFreq);
    const roundedSemitones = Math.round(semitonesFromSa);
    const cents = (semitonesFromSa - roundedSemitones) * 100;

    let mod12 = ((roundedSemitones % 12) + 12) % 12;
    const saptakShift = Math.floor(roundedSemitones / 12);

    const swarasByMod: IndianSwara[] = ['S', 'r', 'R', 'g', 'G', 'm', 'M', 'P', 'd', 'D', 'n', 'N'];
    const swara = swarasByMod[mod12];

    let saptak: Saptak = 'madhya';
    if (saptakShift < 0) saptak = 'mandra';
    if (saptakShift > 0) saptak = 'taar';

    // Western note calculation
    const semitonesFromA4 = 12 * Math.log2(freq / this.referenceA4);
    const noteIndex = Math.round(semitonesFromA4) % 12;
    const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    const westernNote = noteNames[(noteIndex + 12) % 12];

    return {
      swara,
      saptak,
      noteName: westernNote,
      cents,
    };
  }

  // =========================================================================
  // AUDIO RECORDER STUDIO
  // =========================================================================

  public async startRecording(): Promise<boolean> {
    try {
      await this.initAudio();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      this.recordedChunks = [];

      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.start(200);
      this.isRecording = true;
      this.recordStartTime = Date.now();
      return true;
    } catch (e) {
      console.warn('Unable to start audio recording', e);
      return false;
    }
  }

  public async stopRecording(): Promise<{ blobUrl: string; durationSec: number; sizeBytes: number } | null> {
    if (!this.mediaRecorder || !this.isRecording) return null;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);
        const durationSec = Math.max(1, Math.round((Date.now() - this.recordStartTime) / 1000));

        // Stop mic tracks
        this.mediaRecorder?.stream.getTracks().forEach(t => t.stop());
        this.isRecording = false;

        resolve({
          blobUrl,
          durationSec,
          sizeBytes: blob.size,
        });
      };

      this.mediaRecorder.stop();
    });
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }
}
