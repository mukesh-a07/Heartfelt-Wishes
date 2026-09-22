/**
 * Cinematic 21st Birthday Website
 * Master Application Orchestrator
 */

import { memoriesData } from '../data/memories.js';
import { poetryData } from '../data/poetry.js';
import { initGatekeeper } from './gatekeeper.js';
import { initHero } from './hero.js';
import { initKavithai } from './kavithai.js';
import { initTimeline } from './timeline.js';
import { initMotion } from './motion.js';
import { initConstellation } from './constellation.js';
import { initPersonalLetter } from './letter.js';
import { initFinale } from './finale.js';
import { initAudio, syncAudioScene } from './audio.js';

export const AppState = {
  phase: 11,
  isUnlocked: false,
  audioPlaying: false,
  activeScene: 'scene-gatekeeper'
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ [Cinematic 21] Phase 11: Personalization & Final Content Pass initialized.');

  // Initialize Phase 1: The Gatekeeper DOB Experience
  initGatekeeper({
    onUnlock: () => {
      AppState.isUnlocked = true;
      AppState.activeScene = 'scene-hero';
      console.log('✨ [Cinematic 21] Gatekeeper unlocked successfully.');
      
      // Dispatch event for subsequent phases
      window.dispatchEvent(new CustomEvent('vault:unlocked'));
    }
  });

  // Initialize Phase 2: Cinematic Hero Reveal & Parallax
  initHero();

  // Initialize Phase 3: Kavithai / Tamil Poetry Experience
  initKavithai();

  // Initialize Phase 4: Nostalgia Timeline Memory Archive
  initTimeline();

  // Initialize Phase 5: Advanced Motion System (Cursor, Dust, Standardized Reveals)
  initMotion();

  // Initialize Phase 6: Memory Interactions, Constellation & Easter Eggs
  initConstellation();

  // Initialize Phase 7: The Personal Letter Section
  initPersonalLetter();

  // Initialize Phase 10: Birthday Finale Climax & Replay Loop
  initFinale();

  // Initialize Phase 8: Music & Audio Experience Engine
  initAudio();

  // Synchronize Audio Filter & Timbre with Active Scene
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
        AppState.activeScene = entry.target.id;
        syncAudioScene(entry.target.id);
      }
    });
  }, { threshold: [0.35] });

  document.querySelectorAll('section[id]').forEach(sec => {
    sceneObserver.observe(sec);
  });
});
