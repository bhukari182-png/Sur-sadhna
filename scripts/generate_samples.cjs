/**
 * High-Quality 44.1kHz Acoustic Tabla Sample Generator
 * Synthesizes realistic 16-bit PCM WAV audio files based on Raman's harmonic
 * syahi membrane physics, multi-layer resonant cavity acoustics, and wrist-glissando modeling.
 */

const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const OUTPUT_DIR = path.join(__dirname, '../public/audio/tabla');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function writeWavFile(filename, channels, sampleRate, sampleData) {
  const numChannels = channels;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const numSamples = sampleData.length / numChannels;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);

  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat 1 = PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write 16-bit PCM values
  let offset = 44;
  for (let i = 0; i < sampleData.length; i++) {
    let s = Math.max(-1, Math.min(1, sampleData[i]));
    const intSample = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.round(intSample), offset);
    offset += 2;
  }

  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// Warm soft saturation for natural acoustic body
function softClip(x) {
  return Math.tanh(x * 1.15) * 0.95;
}

// 1. Dayan "Na" / "Ta" - Crisp metallic edge strike on Chanti / Gajra
function generateDayanNa() {
  const duration = 0.65;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);
  const baseFreq = 277.18; // C#4 reference Sa

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Contact snap transient (sharp wooden strike on braided rim)
    const attack = Math.exp(-t * 220) * 0.75 * Math.sin(2 * Math.PI * 3400 * t);
    const clickNoise = (Math.random() * 2 - 1) * Math.exp(-t * 180) * 0.35;

    // Raman Syahi harmonic series (1:2:3:4:5 ratio with slight inharmonicity)
    const mode1 = Math.sin(2 * Math.PI * baseFreq * t) * Math.exp(-t * 7.5);
    const mode2 = Math.sin(2 * Math.PI * (baseFreq * 2.00) * t) * Math.exp(-t * 8.2) * 0.85;
    const mode3 = Math.sin(2 * Math.PI * (baseFreq * 3.01) * t) * Math.exp(-t * 12.0) * 0.65;
    const mode4 = Math.sin(2 * Math.PI * (baseFreq * 4.02) * t) * Math.exp(-t * 18.0) * 0.45;
    const mode5 = Math.sin(2 * Math.PI * (baseFreq * 5.04) * t) * Math.exp(-t * 26.0) * 0.25;

    // High shimmer metallic ring of the chanti rim
    const rimRing = Math.sin(2 * Math.PI * 2240 * t) * Math.exp(-t * 32.0) * 0.3;

    const raw = attack + clickNoise + (mode1 * 0.4 + mode2 * 0.5 + mode3 * 0.35 + mode4 * 0.2 + mode5 * 0.12 + rimRing);
    samples[i] = softClip(raw * 0.85);
  }
  return samples;
}

// 2. Dayan "Tin" - Sweet resonant open strike on Maidan (pure bell-like Sa)
function generateDayanTin() {
  const duration = 0.85;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);
  const baseFreq = 277.18;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Softer finger contact transient
    const fingerTap = Math.exp(-t * 140) * 0.45 * Math.sin(2 * Math.PI * 1800 * t);

    // Strong 2nd harmonic tone (characteristic "singing" tin octave)
    const mode1 = Math.sin(2 * Math.PI * baseFreq * t) * Math.exp(-t * 4.5) * 0.4;
    const mode2 = Math.sin(2 * Math.PI * (baseFreq * 2.00) * t) * Math.exp(-t * 4.8) * 0.95;
    const mode3 = Math.sin(2 * Math.PI * (baseFreq * 3.01) * t) * Math.exp(-t * 9.0) * 0.3;

    // Body wooden resonance
    const woodRes = Math.sin(2 * Math.PI * 430 * t) * Math.exp(-t * 14.0) * 0.25;

    const raw = fingerTap + mode1 + mode2 + mode3 + woodRes;
    samples[i] = softClip(raw * 0.75);
  }
  return samples;
}

// 3. Dayan "Tun" - Deep ringing central strike, vibrating the whole wooden body
function generateDayanTun() {
  const duration = 1.15;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);
  const baseFreq = 277.18;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Open round pad strike
    const padThump = Math.exp(-t * 90) * 0.5 * Math.sin(2 * Math.PI * 520 * t);

    // Deep singing fundamental + octave
    const mode1 = Math.sin(2 * Math.PI * baseFreq * t) * Math.exp(-t * 3.2) * 1.0;
    const mode2 = Math.sin(2 * Math.PI * (baseFreq * 2.00) * t) * Math.exp(-t * 5.0) * 0.55;
    const mode3 = Math.sin(2 * Math.PI * (baseFreq * 3.02) * t) * Math.exp(-t * 7.5) * 0.25;

    // Rich cavity sustain
    const cavity = Math.sin(2 * Math.PI * (baseFreq * 0.5) * t) * Math.exp(-t * 4.0) * 0.15;

    const raw = padThump + mode1 + mode2 + mode3 + cavity;
    samples[i] = softClip(raw * 0.8);
  }
  return samples;
}

// 4. Dayan "Ti" / "Te" - Damped flat finger strike on Syahi
function generateDayanTi() {
  const duration = 0.12;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Dry deadened slap with high damping
    const slap = (Math.random() * 2 - 1) * Math.exp(-t * 160) * 0.5;
    const bodyClick = Math.sin(2 * Math.PI * 920 * t) * Math.exp(-t * 95) * 0.75;
    const skinThump = Math.sin(2 * Math.PI * 380 * t) * Math.exp(-t * 80) * 0.45;

    samples[i] = softClip((slap + bodyClick + skinThump) * 0.85);
  }
  return samples;
}

// 5. Dayan "Re" - Soft finger index tap
function generateDayanRe() {
  const duration = 0.10;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    const tap = Math.sin(2 * Math.PI * 780 * t) * Math.exp(-t * 110) * 0.6;
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 190) * 0.3;

    samples[i] = softClip((tap + noise) * 0.7);
  }
  return samples;
}

// 6. Bayan "Ge" / "Ghe" - Deep resonant copper bass with palm glide modulation
function generateBayanGhe(modFactor = 1.0) {
  const duration = 0.75;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  let phase1 = 0;
  let phase2 = 0;
  let phase3 = 0;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    // Authentic wrist glissando pitch trajectory:
    // Starts around 68Hz, rises to 105Hz at 50ms as wrist presses, then relaxes to 60Hz
    const startF = 68;
    const peakF = (105 + (modFactor - 1.0) * 20);
    const settleF = 58;

    let f;
    if (t < 0.06) {
      f = startF + (peakF - startF) * (t / 0.06);
    } else {
      const decayT = (t - 0.06) / 0.45;
      f = peakF + (settleF - peakF) * Math.min(1, decayT);
    }

    phase1 += (2 * Math.PI * f) / SAMPLE_RATE;
    phase2 += (2 * Math.PI * f * 2.05) / SAMPLE_RATE; // 2nd kettle mode
    phase3 += (2 * Math.PI * f * 0.5) / SAMPLE_RATE;  // Sub-bass air cavity

    const env = Math.exp(-t * 4.2);
    const bassFundamental = Math.sin(phase1) * env * 1.0;
    const bodyOvertone = Math.sin(phase2) * Math.exp(-t * 7.5) * 0.45;
    const subBassAir = Math.sin(phase3) * Math.exp(-t * 3.8) * 0.3;

    // Transient skin strike
    const strikeThump = Math.sin(2 * Math.PI * 135 * t) * Math.exp(-t * 60) * 0.4;
    const friction = (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.15;

    const raw = bassFundamental + bodyOvertone + subBassAir + strikeThump + friction;
    samples[i] = softClip(raw * 0.9);
  }
  return samples;
}

// 7. Bayan "Ke" / "Ka" - Flat muted slap damping all vibrations
function generateBayanKe() {
  const duration = 0.12;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;

    const slapNoise = (Math.random() * 2 - 1) * Math.exp(-t * 110) * 0.65;
    const muffledBass = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 75) * 0.5;

    samples[i] = softClip((slapNoise + muffledBass) * 0.85);
  }
  return samples;
}

// Helper to create stereo mix (Left/Right)
function mixStereo(leftMono, rightMono, panL = -0.3, panR = 0.3) {
  const maxLen = Math.max(leftMono.length, rightMono.length);
  const stereo = new Float32Array(maxLen * 2);

  // Pan law: left = cos(theta), right = sin(theta)
  const angleL = ((panL + 1) / 2) * (Math.PI / 2);
  const angleR = ((panR + 1) / 2) * (Math.PI / 2);

  const gainL_Left = Math.cos(angleL);
  const gainL_Right = Math.sin(angleL);
  const gainR_Left = Math.cos(angleR);
  const gainR_Right = Math.sin(angleR);

  for (let i = 0; i < maxLen; i++) {
    const sL = i < leftMono.length ? leftMono[i] : 0;
    const sR = i < rightMono.length ? rightMono[i] : 0;

    const outL = sL * gainL_Left + sR * gainR_Left;
    const outR = sL * gainL_Right + sR * gainR_Right;

    stereo[i * 2] = softClip(outL);
    stereo[i * 2 + 1] = softClip(outR);
  }
  return stereo;
}

// Generate single mono files
writeWavFile('dayan_na.wav', 1, SAMPLE_RATE, generateDayanNa());
writeWavFile('dayan_ta.wav', 1, SAMPLE_RATE, generateDayanNa());
writeWavFile('dayan_tin.wav', 1, SAMPLE_RATE, generateDayanTin());
writeWavFile('dayan_tun.wav', 1, SAMPLE_RATE, generateDayanTun());
writeWavFile('dayan_ti.wav', 1, SAMPLE_RATE, generateDayanTi());
writeWavFile('dayan_te.wav', 1, SAMPLE_RATE, generateDayanTi());
writeWavFile('dayan_re.wav', 1, SAMPLE_RATE, generateDayanRe());

writeWavFile('bayan_ge.wav', 1, SAMPLE_RATE, generateBayanGhe(1.0));
writeWavFile('bayan_ghe.wav', 1, SAMPLE_RATE, generateBayanGhe(1.15));
writeWavFile('bayan_ke.wav', 1, SAMPLE_RATE, generateBayanKe());
writeWavFile('bayan_ka.wav', 1, SAMPLE_RATE, generateBayanKe());

// Combined concert acoustic stereo bols:
// Dha = Bayan Ghe (Left) + Dayan Na (Right) with natural micro-flam
const bayanGhe = generateBayanGhe(1.0);
const dayanNa = generateDayanNa();
const tablaDha = mixStereo(bayanGhe, dayanNa, -0.28, 0.28);
writeWavFile('tabla_dha.wav', 2, SAMPLE_RATE, tablaDha);

// Dhin = Bayan Ghe (Left) + Dayan Tin (Right)
const dayanTin = generateDayanTin();
const tablaDhin = mixStereo(bayanGhe, dayanTin, -0.28, 0.28);
writeWavFile('tabla_dhin.wav', 2, SAMPLE_RATE, tablaDhin);

// Tirakita: 4 rapid strokes: Ti (0ms), Re (50ms), Ki (100ms), Ta (150ms)
function generateTirakita() {
  const duration = 0.55;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  const ti = generateDayanTi();
  const re = generateDayanRe();
  const ki = generateBayanKe();
  const ta = generateDayanNa();

  const o1 = 0;
  const o2 = Math.floor(SAMPLE_RATE * 0.055);
  const o3 = Math.floor(SAMPLE_RATE * 0.110);
  const o4 = Math.floor(SAMPLE_RATE * 0.165);

  for (let i = 0; i < ti.length && o1 + i < numSamples; i++) right[o1 + i] += ti[i] * 0.85;
  for (let i = 0; i < re.length && o2 + i < numSamples; i++) right[o2 + i] += re[i] * 0.75;
  for (let i = 0; i < ki.length && o3 + i < numSamples; i++) left[o3 + i] += ki[i] * 0.85;
  for (let i = 0; i < ta.length && o4 + i < numSamples; i++) right[o4 + i] += ta[i] * 0.95;

  return mixStereo(left, right, -0.25, 0.25);
}
writeWavFile('tabla_tirakita.wav', 2, SAMPLE_RATE, generateTirakita());

// Dhere Dhere: Two rolling palm strokes
function generateDhere() {
  const duration = 0.45;
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const left = new Float32Array(numSamples);
  const right = new Float32Array(numSamples);

  const ti = generateDayanTi();
  const re = generateDayanRe();

  const o1 = 0;
  const o2 = Math.floor(SAMPLE_RATE * 0.08);

  for (let i = 0; i < ti.length && o1 + i < numSamples; i++) right[o1 + i] += ti[i] * 0.9;
  for (let i = 0; i < re.length && o2 + i < numSamples; i++) right[o2 + i] += re[i] * 0.8;

  return mixStereo(left, right, -0.2, 0.2);
}
writeWavFile('tabla_dhere.wav', 2, SAMPLE_RATE, generateDhere());

console.log('All authentic acoustic tabla sample files generated successfully in public/audio/tabla!');
