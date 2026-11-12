/**
 * Music data types for Sur Sadhana Classical Music Studio
 */

export type PitchNote = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export type IndianSwara = 
  | 'S'   // Shadja (Sa)
  | 'r'   // Komal Rishabh
  | 'R'   // Shuddh Rishabh
  | 'g'   // Komal Gandhar
  | 'G'   // Shuddh Gandhar
  | 'm'   // Shuddh Madhyam
  | 'M'   // Tivra Madhyam
  | 'P'   // Pancham (Pa)
  | 'd'   // Komal Dhaivat
  | 'D'   // Shuddh Dhaivat
  | 'n'   // Komal Nishad
  | 'N';  // Shuddh Nishad

export type Saptak = 'mandra' | 'madhya' | 'taar'; // Lower, Middle, Higher Octave

export type LayaSpeed = 'vilambit' | 'madhya' | 'drut' | 'ati_drut';

export type TablaPerformanceMode = 'basic' | 'fillers' | 'advanced';

export interface BeatInfo {
  matra: number;          // 1-indexed (e.g., 1 to 16)
  bol: string;            // Tabla Bol (e.g., "Dha", "Dhin", "Tin", "Ta")
  urduBol?: string;       // Urdu script (e.g. دھا , دھن)
  isSam: boolean;         // 1st beat of the taal
  isTali: boolean;        // Clapped beat
  isKhali: boolean;       // Waved/empty beat
  sign: string;           // 'X' (Sam), '2', '3', '4' (Talis), '0' (Khali)
  vibhagIndex: number;    // Which section/bar it belongs to
}

export interface Vibhag {
  index: number;
  length: number;         // Number of matras in this vibhag
  hasTali: boolean;
  hasKhali: boolean;
  sign: string;
}

export interface Taal {
  id: string;
  name: string;
  urduName: string;
  matras: number;
  description: string;
  category: 'classical' | 'semi-classical' | 'sufi_folk' | 'custom';
  vibhags: Vibhag[];
  beats: BeatInfo[];
  fillerBeats?: BeatInfo[];
  advancedBeats?: BeatInfo[];
  defaultBpm: number;
  isCustomizable?: boolean;
}

export interface Raag {
  id: string;
  name: string;
  urduName: string;
  thaat: string;
  aroha: string;          // e.g. "S R G M P D N S'"
  avaroha: string;        // e.g. "S' N D P M G R S"
  vadi: string;
  samvadi: string;
  time: string;           // e.g. "Evening (Prathama Prahar)"
  description: string;
  swarmandalNotes: Array<{
    swara: IndianSwara;
    saptak: Saptak;
    display: string;
    semitonesFromSa: number;
  }>;
}

export interface TanpuraConfig {
  gender: 'male' | 'female';
  pitch: PitchNote;
  firstString: 'Pa' | 'Ma' | 'Ni';
  fineTuneCents: number;   // -50 to +50
  soundTexture: 'miraj' | 'tanjore' | 'electronic';
  volume: number;          // 0 to 1
  speed: number;           // speed multiplier (0.6x to 1.6x)
  isPlaying: boolean;
}

export interface SwarmandalConfig {
  selectedRaagId: string;
  volume: number;
  speedMs: number;         // Delay between plucking strings (50ms - 300ms)
  isRepeating: boolean;
  repeatIntervalSec: number;
  strings: Array<{
    id: number;
    swara: IndianSwara;
    saptak: Saptak;
    display: string;
    semitoneOffset: number;
  }>;
}

export interface AudioRecording {
  id: string;
  title: string;
  blobUrl: string;
  durationFormatted: string;
  durationSeconds: number;
  timestamp: string;
  taalName?: string;
  raagName?: string;
  bpm?: number;
  sizeBytes: number;
}

export interface AlankarPattern {
  id: string;
  title: string;
  aroha: string[];
  avaroha: string[];
  description: string;
}
