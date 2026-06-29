import { NoteItem } from '../types';

// Frequencies for notes
export const NOTE_FREQS: { [key: string]: number } = {
  'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50
};

// Happy Birthday melody in C Major (Notes and beats)
export const HAPPY_BIRTHDAY_MELODY: { note: string; beats: number; lyric?: string }[] = [
  { note: 'G4', beats: 0.5, lyric: 'Hap-' },
  { note: 'G4', beats: 0.5, lyric: 'py' },
  { note: 'A4', beats: 1, lyric: 'Birth-' },
  { note: 'G4', beats: 1, lyric: 'day' },
  { note: 'C5', beats: 1, lyric: 'to' },
  { note: 'B4', beats: 2, lyric: 'you,' },

  { note: 'G4', beats: 0.5, lyric: 'Hap-' },
  { note: 'G4', beats: 0.5, lyric: 'py' },
  { note: 'A4', beats: 1, lyric: 'Birth-' },
  { note: 'G4', beats: 1, lyric: 'day' },
  { note: 'D5', beats: 1, lyric: 'to' },
  { note: 'C5', beats: 2, lyric: 'you,' },

  { note: 'G4', beats: 0.5, lyric: 'Hap-' },
  { note: 'G4', beats: 0.5, lyric: 'py' },
  { note: 'G5', beats: 1, lyric: 'Birth-' },
  { note: 'E5', beats: 1, lyric: 'day' },
  { note: 'C5', beats: 1, lyric: 'dear' },
  { note: 'B4', beats: 1, lyric: 'Sis-' },
  { note: 'A4', beats: 2, lyric: 'ter! 💜' },

  { note: 'F5', beats: 0.5, lyric: 'Hap-' },
  { note: 'F5', beats: 0.5, lyric: 'py' },
  { note: 'E5', beats: 1, lyric: 'Birth-' },
  { note: 'C5', beats: 1, lyric: 'day' },
  { note: 'D5', beats: 1, lyric: 'to' },
  { note: 'C5', beats: 3, lyric: 'you! 🎉' }
];

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private tempo: number = 100; // BPM
  private currentNoteIndex: number = 0;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private onNoteTrigger: ((index: number, noteName: string, lyric: string) => void) | null = null;
  private onFinished: (() => void) | null = null;
  private onDrumTrigger: ((drumId: string) => void) | null = null;
  private instrument: 'musicbox' | 'piano' | 'flute' = 'musicbox';
  private nextNoteTimeout: number | null = null;
  private drumTimeouts: number[] = [];
  private autoDrumBacking: boolean = true;
  private startTime: number = 0;

  constructor() {
    // Lazy initialisation of AudioContext is handled on user gesture
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setTempo(bpm: number) {
    this.tempo = bpm;
  }

  setInstrument(inst: 'musicbox' | 'piano' | 'flute') {
    this.instrument = inst;
  }

  setAutoDrumBacking(enabled: boolean) {
    this.autoDrumBacking = enabled;
  }

  isAutoDrumBackingEnabled(): boolean {
    return this.autoDrumBacking;
  }

  registerCallbacks(
    onTrigger: (index: number, noteName: string, lyric: string) => void,
    onFinished: () => void
  ) {
    this.onNoteTrigger = onTrigger;
    this.onFinished = onFinished;
  }

  registerDrumCallback(onDrum: ((drumId: string) => void) | null) {
    this.onDrumTrigger = onDrum;
  }

  play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.playNextNote();
  }

  pause() {
    this.isPlaying = false;
    if (this.nextNoteTimeout) {
      clearTimeout(this.nextNoteTimeout);
      this.nextNoteTimeout = null;
    }
    this.drumTimeouts.forEach(t => clearTimeout(t));
    this.drumTimeouts = [];
    this.stopAllActiveNotes();
  }

  stop() {
    this.pause();
    this.currentNoteIndex = 0;
  }

  isPlayingSong(): boolean {
    return this.isPlaying;
  }

  getCurrentIndex(): number {
    return this.currentNoteIndex;
  }

  private stopAllActiveNotes() {
    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        osc.stop();
      } catch (e) {}
    });
    this.activeOscillators = [];
  }

  private playNextNote() {
    if (!this.isPlaying || !this.ctx) return;

    if (this.currentNoteIndex >= HAPPY_BIRTHDAY_MELODY.length) {
      // Loop or stop
      this.currentNoteIndex = 0;
      if (this.onFinished) this.onFinished();
      this.playNextNote();
      return;
    }

    const noteInfo = HAPPY_BIRTHDAY_MELODY[this.currentNoteIndex];
    const freq = NOTE_FREQS[noteInfo.note];
    
    // Duration of note in seconds
    const beatDuration = 60 / this.tempo;
    const duration = noteInfo.beats * beatDuration;

    if (freq) {
      this.triggerNote(freq, duration);
    }

    // Trigger synchronized drum accompaniment
    if (this.autoDrumBacking) {
      switch (this.currentNoteIndex) {
        case 0: // G4 "Hap-"
        case 1: // G4 "py"
          this.playHihat();
          break;
        case 2: // A4 "Birth-"
          this.playKick();
          break;
        case 3: // G4 "day"
          this.playSnare();
          this.playHihat();
          break;
        case 4: // C5 "to"
          this.playKick();
          this.playHihat();
          break;
        case 5: // B4 "you," (2.0 beats)
          this.playSnare();
          // Schedule beat 5.0 drum kick
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playKick();
          }, beatDuration * 1000));
          break;
          
        case 6: // G4 "Hap-"
        case 7: // G4 "py"
          this.playHihat();
          break;
        case 8: // A4 "Birth-"
          this.playKick();
          break;
        case 9: // G4 "day"
          this.playSnare();
          this.playHihat();
          break;
        case 10: // D5 "to"
          this.playKick();
          this.playHihat();
          break;
        case 11: // C5 "you," (2.0 beats)
          this.playSnare();
          // Schedule beat 11.0 drum kick
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playKick();
          }, beatDuration * 1000));
          break;
          
        case 12: // G4 "Hap-"
        case 13: // G4 "py"
          this.playHihat();
          break;
        case 14: // G5 "Birth-"
          this.playKick();
          this.playHihat();
          break;
        case 15: // E5 "day"
          this.playSnare();
          this.playHihat();
          break;
        case 16: // C5 "dear"
          this.playKick();
          this.playHihat();
          break;
        case 17: // B4 "Sis-"
          this.playSnare();
          this.playHihat();
          break;
        case 18: // A4 "ter! 💜" (2.0 beats)
          this.playCrash();
          this.playKick();
          // Schedule beat 18.0 snare
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playSnare();
          }, beatDuration * 1000));
          break;
          
        case 19: // F5 "Hap-"
        case 20: // F5 "py"
          this.playHihat();
          break;
        case 21: // E5 "Birth-"
          this.playKick();
          break;
        case 22: // C5 "day"
          this.playSnare();
          this.playHihat();
          break;
        case 23: // D5 "to"
          this.playKick();
          this.playHihat();
          break;
        case 24: // C5 "you! 🎉" (3.0 beats)
          this.playCrash();
          this.playKick();
          // Professional drum fill on long note:
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playTom('high');
          }, beatDuration * 1000));
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playTom('mid');
          }, beatDuration * 1.5 * 1000));
          this.drumTimeouts.push(window.setTimeout(() => {
            this.playTom('low');
          }, beatDuration * 2.0 * 1000));
          break;
          
        default:
          break;
      }
    }

    if (this.onNoteTrigger) {
      this.onNoteTrigger(this.currentNoteIndex, noteInfo.note, noteInfo.lyric || '');
    }

    this.currentNoteIndex++;

    // Schedule next note
    this.nextNoteTimeout = window.setTimeout(() => {
      this.playNextNote();
    }, duration * 1000);
  }

  private triggerNote(frequency: number, duration: number) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Setup feedback delay / reverb effect to give that sweet Music Box resonance
    const delay = this.ctx.createDelay();
    const delayGain = this.ctx.createGain();
    
    delay.delayTime.value = 0.25; // 250ms feedback delay
    delayGain.gain.value = 0.25; // low feedback volume

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Feed gain into delay line
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.ctx.destination);
    // Feedback loop
    delayGain.connect(delay);

    const now = this.ctx.currentTime;

    if (this.instrument === 'musicbox') {
      // Music box: high sweet attack, long chime decay, sine or triangle waves
      osc.type = 'sine';
      
      // Sub-harmonic oscillator for warmth
      const oscSub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(frequency / 2, now);
      oscSub.connect(subGain);
      subGain.connect(gain);
      subGain.gain.setValueAtTime(0.12, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscSub.start(now);
      oscSub.stop(now + duration + 1.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.01); // sharp attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5); // long decay
    } else if (this.instrument === 'piano') {
      // Piano: warm triangle, slightly faster decay, richer harmonics
      osc.type = 'triangle';
      
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(frequency * 2, now);
      overtone.connect(overtoneGain);
      overtoneGain.connect(gain);
      overtoneGain.gain.setValueAtTime(0.15, now);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);
      overtone.start(now);
      overtone.stop(now + duration);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.2);
    } else {
      // Flute: soft sine, low vibrato, slow attack and release
      osc.type = 'sine';
      
      // Vibrato LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 6; // 6 Hz vibrato
      lfoGain.gain.value = 3; // depth
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + duration);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.08); // slow swell
      gain.gain.setValueAtTime(0.3, now + duration - 0.05);
      gain.gain.linearRampToValueAtTime(0.001, now + duration); // smooth decay
    }

    osc.frequency.setValueAtTime(frequency, now);

    osc.start(now);
    osc.stop(now + duration + 1.5); // Keep alive for delay tail

    const oscRef = { osc, gain };
    this.activeOscillators.push(oscRef);
    
    // Cleanup active osc list after play
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(item => item !== oscRef);
    }, (duration + 2) * 1000);
  }

  // Generate white noise for drums
  private getNoiseBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    try {
      const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 seconds of noise
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    } catch (e) {
      return null;
    }
  }

  playKick() {
    if (this.onDrumTrigger) this.onDrumTrigger('kick');
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'sine';
    
    // Pitch envelope: drops rapidly from 150Hz to 30Hz
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.12);

    // Gain envelope: tight decay
    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  playSnare() {
    if (this.onDrumTrigger) this.onDrumTrigger('snare');
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // 1. Oscillator for snappy body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.12);

    // 2. White noise for rattle
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;

      const noiseGain = this.ctx.createGain();
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.start(now);
      noise.stop(now + 0.18);
    }
  }

  playHihat() {
    if (this.onDrumTrigger) this.onDrumTrigger('hihat');
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 8000;
      filter.Q.value = 2;

      const gain = this.ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // ultra-short closed hihat decay

      noise.start(now);
      noise.stop(now + 0.06);
    }
  }

  playCrash() {
    if (this.onDrumTrigger) this.onDrumTrigger('crash');
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const noiseBuffer = this.getNoiseBuffer();
    if (noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2500;

      const gain = this.ctx.createGain();
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8); // longer decay

      noise.start(now);
      noise.stop(now + 0.9);
    }
  }

  playTom(pitch: 'high' | 'mid' | 'low' = 'mid') {
    if (this.onDrumTrigger) {
      this.onDrumTrigger(pitch === 'high' ? 'high-tom' : pitch === 'mid' ? 'mid-tom' : 'floor-tom');
    }
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'triangle';
    
    const startFreq = pitch === 'high' ? 140 : pitch === 'mid' ? 100 : 75;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.25);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  playDrumRoll(durationSec: number = 1.5, onComplete?: () => void) {
    this.initContext();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime;
    const interval = 0.07; // Snare roll speed (70ms)
    const hitsCount = Math.floor(durationSec / interval);

    for (let i = 0; i < hitsCount; i++) {
      const hitTime = startTime + i * interval;
      // Synthesize snare hit inside the roll
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, hitTime);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      
      // Accrescendo: get louder toward the end of the roll!
      const volumeFactor = 0.1 + (i / hitsCount) * 0.25;
      oscGain.gain.setValueAtTime(volumeFactor, hitTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.06);
      
      osc.start(hitTime);
      osc.stop(hitTime + 0.08);

      // Noise component
      const noiseBuffer = this.getNoiseBuffer();
      if (noiseBuffer) {
        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        const noiseGain = this.ctx.createGain();
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        noiseGain.gain.setValueAtTime(volumeFactor * 1.2, hitTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.08);
        noise.start(hitTime);
        noise.stop(hitTime + 0.09);
      }
    }

    // Grand crash and kick at the end!
    const crashTime = startTime + durationSec;
    setTimeout(() => {
      this.playKick();
      this.playCrash();
      if (onComplete) onComplete();
    }, durationSec * 1000);
  }

  // Synthesize sound effects
  playPop() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;
    osc.type = 'triangle';
    
    // Pop frequency sweep
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playSparkle() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.linearRampToValueAtTime(1800, now + 0.15);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playSuccess() {
    this.initContext();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const playTone = (freq: number, start: number, dur: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.start(start);
      osc.stop(start + dur + 0.1);
    };

    // Upward major triad arpeggio
    playTone(523.25, now, 0.15); // C5
    playTone(659.25, now + 0.1, 0.15); // E5
    playTone(783.99, now + 0.2, 0.15); // G5
    playTone(1046.50, now + 0.3, 0.4); // C6
  }
}
