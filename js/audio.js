/**
 * Phase 8: Cinematic Music & Audio Experience Engine
 * 
 * Features:
 * 1. Strictly respects browser autoplay policies (no autoplay on initial landing).
 * 2. Primes and fades in smoothly over 3.5s on successful DOB unlock.
 * 3. Dual Engine: Custom audio file support with seamless procedural Web Audio API fallback.
 * 4. Procedural Cinematic Soundscape:
 *    - Ambient Pads: Warm lowpass-filtered analog chord swells (Dmaj9, Bm9, Gmaj7, Asus4/A).
 *    - Soft Piano: Sparse physical-modeling piano notes with percussive hammer strike and exponential decay.
 *    - Subtle Strings: Gentle high-register bowing shimmer.
 *    - Zero harsh percussion.
 * 5. Discreet UI Controller with Live, Muted, and Activation states.
 * 6. Scene-aware sonic shifts (Hero reveal, Kavithai chamber, Constellation chimes, Finale climax).
 */

import { contentData } from '../data/content.js';

class CinematicAudioEngine {
  constructor() {
    this.isPlaying = false;
    this.isMuted = false;
    this.isInitialized = false;
    this.audioElement = null;
    this.hasCustomFile = false;

    // Web Audio API Elements
    this.ctx = null;
    this.masterGain = null;
    this.masterFilter = null;
    this.padGain = null;
    this.pianoGain = null;
    this.chimeGain = null;

    // Pad Voice State
    this.padOscillators = [];
    this.chordIndex = 0;
    this.chordInterval = null;
    this.pianoTimer = null;

    // UI DOM Elements
    this.controllerEl = null;
    this.labelEl = null;

    // Cinematic Chord Progressions in D Major / B Minor (Expansive, Wistful, Tender)
    // Frequencies in Hz: [Bass, 5th/Root, 3rd, 7th/9th]
    this.chordProgressions = [
      [73.42, 110.00, 146.83, 220.00, 277.18], // Dmaj9 (D2, A2, D3, A3, C#4)
      [61.74, 92.50, 146.83, 185.00, 277.18],  // Bm9   (B1, F#2, D3, F#3, C#4)
      [49.00, 73.42, 123.47, 185.00, 293.66],  // Gmaj7 (G1, D2, B2, F#3, D4)
      [55.00, 82.41, 138.59, 164.81, 246.94]   // Asus4 (A1, E2, C#3, E3, B3)
    ];

    // Sparse Piano Pentatonic Notes (Hz)
    this.pianoNotes = [
      587.33, // D5
      659.25, // E5
      739.99, // F#5
      880.00, // A5
      987.77, // B5
      1174.66 // D6
    ];
  }

  /**
   * Initializes the audio subsystem, checks for custom files, and binds DOM controls
   */
  init() {
    this.controllerEl = document.getElementById('audio-controller');
    this.labelEl = document.getElementById('audio-label');

    this.bindControllerEvents();
    this.probeCustomAudioFile();

    // Listen for vault unlock event to prime and start playback
    window.addEventListener('vault:unlocked', () => {
      this.handleVaultUnlocked();
    });

    // Handle tab visibility change to conserve resources
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying) {
        if (this.ctx && this.ctx.state === 'running') {
          this.fadeMasterVolume(0.0001, 1.0);
        }
      } else if (!document.hidden && this.isPlaying) {
        if (this.ctx && this.ctx.state === 'running') {
          this.fadeMasterVolume(0.32, 2.0);
        }
      }
    });

    console.log('[AudioEngine] Engine initialized in stand-by state (autoplay safe).');
  }

  /**
   * Probes whether a user-provided soundtrack MP3 file is available
   */
  probeCustomAudioFile() {
    const primaryPath = (contentData && contentData.audio && contentData.audio.soundtrackPath)
      || 'assets/music/kannana-kanne.mp3';
    const fallbackPath = (contentData && contentData.audio && contentData.audio.fallbackPath)
      || 'assets/music/kannana kanne.mp3';

    const testAudio = new Audio();
    testAudio.preload = 'metadata';

    testAudio.addEventListener('canplaythrough', () => {
      this.hasCustomFile = true;
      this.audioElement = testAudio;
      this.audioElement.loop = true;
      this.audioElement.volume = 0;
      console.log(`[AudioEngine] Custom soundtrack found: ${testAudio.src}. Soundtrack active.`);
    }, { once: true });

    testAudio.addEventListener('error', () => {
      // If primary path failed and we haven't tried fallback yet, try fallback
      if (testAudio.src && !testAudio.src.includes(encodeURI(fallbackPath)) && testAudio.src !== fallbackPath) {
        testAudio.src = fallbackPath;
        return;
      }
      this.hasCustomFile = false;
      this.audioElement = null;
      console.log('[AudioEngine] No custom audio file detected. Procedural synthesizer active.');
    }, { once: true });

    testAudio.src = primaryPath;
  }

  /**
   * Binds user interaction to the discreet floating controller widget
   */
  bindControllerEvents() {
    if (!this.controllerEl) return;

    this.controllerEl.addEventListener('click', () => {
      this.togglePlayback();
    });

    this.controllerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.togglePlayback();
      }
    });
  }

  /**
   * Triggers upon successful DOB entry in the Gatekeeper
   */
  handleVaultUnlocked() {
    // Delay slightly to synchronize with the vault flash and dissolution
    setTimeout(() => {
      this.playVaultOpeningChime();
      this.startPlayback(true);
    }, 450);
  }

  /**
   * Toggles audio between playing and muted states
   */
  togglePlayback() {
    if (this.isPlaying) {
      this.stopPlayback();
    } else {
      this.startPlayback(false);
    }
  }

  /**
   * Starts playback with a smooth gradual fade-in
   */
  async startPlayback(isAutoUnlock = false) {
    // 1. Initialize Web Audio Context if needed
    if (!this.ctx) {
      this.initWebAudioGraph();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('[AudioEngine] Context resume prevented by browser:', err);
        this.setActivationState();
        return;
      }
    }

    // 2. Play Custom File if present
    if (this.hasCustomFile && this.audioElement) {
      try {
        await this.audioElement.play();
        this.fadeAudioElementVolume(this.audioElement, 0.45, 3500);
      } catch (err) {
        console.warn('[AudioEngine] Audio element play prevented. Falling back to synth:', err);
        this.startProceduralSynth();
      }
    } else {
      // 3. Start Procedural Web Audio Synth
      this.startProceduralSynth();
    }

    this.isPlaying = true;
    this.isMuted = false;
    this.updateUI(true);
  }

  /**
   * Stops playback with a smooth gradual fade-out
   */
  stopPlayback() {
    if (this.audioElement) {
      this.fadeAudioElementVolume(this.audioElement, 0.0001, 1000, () => {
        this.audioElement.pause();
      });
    }

    if (this.masterGain && this.ctx) {
      this.fadeMasterVolume(0.0001, 1.2);
    }

    this.isPlaying = false;
    this.isMuted = true;
    this.updateUI(false);
  }

  /**
   * Builds the Web Audio graph: Oscillators -> Filters -> Master Gain -> Destination
   */
  initWebAudioGraph() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      // Warm Theatrical Lowpass Filter
      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.setValueAtTime(440, this.ctx.currentTime);
      this.masterFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Sub-buses
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.pianoGain = this.ctx.createGain();
      this.pianoGain.gain.setValueAtTime(0.55, this.ctx.currentTime);

      this.chimeGain = this.ctx.createGain();
      this.chimeGain.gain.setValueAtTime(0.65, this.ctx.currentTime);

      // Connect graph
      this.padGain.connect(this.masterFilter);
      this.pianoGain.connect(this.masterFilter);
      this.chimeGain.connect(this.masterFilter);

      this.masterFilter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('[AudioEngine] Web Audio API unsupported in this browser.', e);
    }
  }

  /**
   * Starts the procedural ambient pad and sparse piano loops
   */
  startProceduralSynth() {
    if (!this.ctx) return;

    // Fade in master gain smoothly over 3.5 seconds
    this.fadeMasterVolume(0.32, 3.5);

    // Start pad chord cycling
    this.playChord(this.chordProgressions[this.chordIndex]);
    if (!this.chordInterval) {
      this.chordInterval = setInterval(() => {
        if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
          this.chordIndex = (this.chordIndex + 1) % this.chordProgressions.length;
          this.playChord(this.chordProgressions[this.chordIndex]);
        }
      }, 8500);
    }

    // Start sparse contemplative piano notes
    if (!this.pianoTimer) {
      this.scheduleNextPianoNote();
    }
  }

  /**
   * Smoothly crossfades pad chords
   */
  playChord(frequencies) {
    if (!this.ctx || !this.padGain) return;
    const now = this.ctx.currentTime;

    // Fade out prior oscillators
    this.padOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.linearRampToValueAtTime(0.0001, now + 3.0);
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        }, 3200);
      } catch (e) {}
    });
    this.padOscillators = [];

    // Spawn new soothing harmonic oscillators
    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine for root/bass, triangle for warm upper harmonics
      osc.type = idx === 0 ? 'sine' : (idx % 2 === 0 ? 'sine' : 'triangle');
      osc.frequency.setValueAtTime(freq, now);

      // Delicate detune for warm analog chorus width
      const detuneCents = (idx - 2) * 3.5;
      osc.detune.setValueAtTime(detuneCents, now);

      // Individual voice gain
      const voiceTarget = 0.085 / Math.sqrt(frequencies.length);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(voiceTarget, now + 3.2);

      osc.connect(gain);
      gain.connect(this.padGain);

      osc.start();
      this.padOscillators.push({ osc, gain });
    });
  }

  /**
   * Synthesizes a single soft, contemplative piano note with physical-modeling decay
   */
  playPianoNote(freq, intensity = 0.18) {
    if (!this.ctx || !this.pianoGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;

    // Fundamental tone
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // 2nd Harmonic (subtle warmth)
    const harmonicOsc = this.ctx.createOscillator();
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(freq * 2, now);

    // Felt-hammer click noise filter
    const hammerGain = this.ctx.createGain();
    hammerGain.gain.setValueAtTime(intensity * 0.4, now);
    hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    // Note Envelope (8ms attack, long 3.2s exponential decay)
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(intensity, now + 0.012);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

    const harmonicGain = this.ctx.createGain();
    harmonicGain.gain.setValueAtTime(0.0001, now);
    harmonicGain.gain.linearRampToValueAtTime(intensity * 0.28, now + 0.015);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    osc.connect(noteGain);
    harmonicOsc.connect(harmonicGain);

    noteGain.connect(this.pianoGain);
    harmonicGain.connect(this.pianoGain);

    osc.start(now);
    harmonicOsc.start(now);

    const stopTime = now + 3.8;
    osc.stop(stopTime);
    harmonicOsc.stop(stopTime);
  }

  /**
   * Schedules random sparse piano notes in natural musical phrasing
   */
  scheduleNextPianoNote() {
    if (this.pianoTimer) clearTimeout(this.pianoTimer);

    // Interval between 4.2s and 7.5s for contemplative stillness
    const delay = 4200 + Math.random() * 3300;

    this.pianoTimer = setTimeout(() => {
      if (this.isPlaying && this.ctx && this.ctx.state === 'running') {
        const randomNote = this.pianoNotes[Math.floor(Math.random() * this.pianoNotes.length)];
        this.playPianoNote(randomNote, 0.14 + Math.random() * 0.08);
      }
      this.scheduleNextPianoNote();
    }, delay);
  }

  /**
   * Plays a 3-note ascending chime when the DOB vault is unlocked
   */
  playVaultOpeningChime() {
    if (!this.ctx) this.initWebAudioGraph();
    if (!this.ctx) return;

    const notes = [440.00, 554.37, 739.99]; // A4, C#5, F#5 (Bright, joyful, regal)
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playCelestialChime(freq, 0.22);
      }, idx * 160);
    });
  }

  /**
   * Micro celestial chime for Constellation star unlocks
   */
  playCelestialChime(freq = 880.00, vol = 0.18) {
    if (!this.ctx || !this.chimeGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.chimeGain);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  /**
   * Synchronizes sound character with active scene
   */
  syncScene(sceneId) {
    if (!this.ctx || !this.masterFilter) return;
    const now = this.ctx.currentTime;
    const rampFilterTo = (targetHz, duration) => {
      this.masterFilter.frequency.cancelScheduledValues(now);
      this.masterFilter.frequency.setValueAtTime(Math.max(20, this.masterFilter.frequency.value), now);
      this.masterFilter.frequency.exponentialRampToValueAtTime(targetHz, now + duration);
    };

    switch (sceneId) {
      case 'scene-hero':
        // Swell filter open as hero image becomes sharp
        rampFilterTo(640, 2.0);
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.45, 2000);
        }
        break;

      case 'scene-kavithai':
        // Intimate, deep, warm poetry sanctuary
        rampFilterTo(390, 2.5);
        this.playPianoNote(659.25, 0.2); // E5 contemplative chime
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.35, 2000);
        }
        break;

      case 'scene-memories':
      case 'scene-interactive':
        // Balanced ambient open warmth
        rampFilterTo(520, 2.0);
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.42, 2000);
        }
        break;

      case 'scene-letter':
        // Intimate stillness
        rampFilterTo(420, 2.5);
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.32, 2000);
        }
        break;

      case 'scene-finale':
        // Expansive cinematic presence for the 21 milestone
        rampFilterTo(780, 3.0);
        if (this.masterGain && this.isPlaying) {
          this.masterGain.gain.linearRampToValueAtTime(0.38, now + 3.0);
        }
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.52, 2500);
        }
        break;

      default:
        rampFilterTo(440, 2.0);
        if (this.hasCustomFile && this.audioElement && this.isPlaying) {
          this.fadeAudioElementVolume(this.audioElement, 0.42, 2000);
        }
        break;
    }
  }

  /**
   * Smooth volume ramping for Web Audio master gain
   */
  fadeMasterVolume(targetVal, durationSec) {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(0.0001, this.masterGain.gain.value), now);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetVal), now + durationSec);
  }

  /**
   * Smooth volume ramping for HTML5 audio element
   */
  fadeAudioElementVolume(audio, targetVal, durationMs, onComplete) {
    const startVol = audio.volume;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      audio.volume = startVol + (targetVal - startVol) * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(step);
  }

  /**
   * Updates the floating audio controller UI
   */
  updateUI(playing) {
    if (!this.controllerEl) return;

    this.controllerEl.classList.remove('needs-activation');

    if (playing) {
      this.controllerEl.classList.add('is-playing');
      this.controllerEl.classList.remove('is-muted');
      this.controllerEl.setAttribute('aria-pressed', 'true');
      this.controllerEl.setAttribute('aria-label', 'Soundtrack playing. Press to mute ambient sound.');
      if (this.labelEl) this.labelEl.textContent = 'Sound // Live';
    } else {
      this.controllerEl.classList.remove('is-playing');
      this.controllerEl.classList.add('is-muted');
      this.controllerEl.setAttribute('aria-pressed', 'false');
      this.controllerEl.setAttribute('aria-label', 'Soundtrack muted. Press to play ambient sound.');
      if (this.labelEl) this.labelEl.textContent = 'Sound // Muted';
    }
  }

  /**
   * Sets UI to activation prompt state if browser autoplay blocked playback
   */
  setActivationState() {
    if (!this.controllerEl) return;
    this.controllerEl.classList.add('needs-activation');
    this.controllerEl.setAttribute('aria-label', 'Press to enable soundtrack.');
    if (this.labelEl) this.labelEl.textContent = 'Sound // Enable';
  }
}

// Global Singleton Instance
export const audioEngine = new CinematicAudioEngine();

export function initAudio() {
  audioEngine.init();
}

export function syncAudioScene(sceneId) {
  audioEngine.syncScene(sceneId);
}

export function playCelestialChime(freq, vol) {
  audioEngine.playCelestialChime(freq, vol);
}

export function primeAudioContext() {
  if (!audioEngine.ctx) {
    audioEngine.initWebAudioGraph();
  }
  if (audioEngine.ctx && audioEngine.ctx.state === 'suspended') {
    audioEngine.ctx.resume().catch(() => {});
  }
}
