/**
 * Phase 7: The Personal Letter Controller
 * Progressively reveals personal message paragraphs with intentional pauses,
 * renders central data, and orchestrates smooth transition into the finale.
 */

import { letterContent } from '../data/letter.js';

export function initPersonalLetter() {
  const letterSection = document.getElementById('scene-letter');
  if (!letterSection) {
    console.warn('[PersonalLetter] #scene-letter section not found.');
    return;
  }

  // Hydrate Letter Container
  renderLetterContent(letterSection);

  // Setup Progressive Reveal Observer
  setupProgressiveReveal(letterSection);

  // Setup Finale Transition Bridge
  setupFinaleTransition();
}

/**
 * Renders structured content from data/letter.js into the DOM
 */
function renderLetterContent(container) {
  const mountPoint = container.querySelector('#personal-letter-mount');
  if (!mountPoint) return;

  const { openingHook, paragraphs, gratitudeStatement, signature, transitionBridge } = letterContent;

  const paragraphsHTML = paragraphs.map(p => `
    <p class="letter-para letter-reveal-item" data-letter-step>
      ${p.lines.map(line => `<span class="letter-line">${line}</span>`).join('')}
    </p>
  `).join('');

  mountPoint.innerHTML = `
    <!-- Opening Hook -->
    <header class="letter-hook-wrapper letter-reveal-item" data-letter-step>
      <h2 class="letter-hook">${openingHook}</h2>
    </header>

    <!-- Poetic Body Paragraphs -->
    <div class="letter-body-flow">
      ${paragraphsHTML}
    </div>

    <!-- Climax Gratitude Highlight -->
    <div class="letter-gratitude-wrapper letter-reveal-item" data-letter-step>
      <p class="letter-gratitude">“${gratitudeStatement}”</p>
    </div>

    <!-- Handwritten Signature Treatment -->
    <footer class="letter-signature-block letter-reveal-item" data-letter-step>
      <span class="letter-signature-signoff">${signature.signoff}</span>
      <span class="letter-signature-author">${signature.author}</span>
    </footer>

    <!-- Transition Bridge to the Final Scene -->
    <div class="letter-finale-bridge letter-reveal-item" id="letter-finale-bridge" data-letter-step>
      <p class="finale-bridge-leadin">${transitionBridge.leadIn}</p>
      <button type="button" class="finale-bridge-btn" id="btn-enter-finale" aria-label="${transitionBridge.actionText}">
        <span>${transitionBridge.actionText}</span>
        <svg class="finale-bridge-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
    </div>
  `;
}

/**
 * Progressive Paragraph Reveal Engine
 * sequence: Hook → (pause) → P1 → (pause) → P2 → (pause) → P3 → (pause) → P4 → (pause) → Gratitude → Signature & Bridge
 */
function setupProgressiveReveal(section) {
  const steps = Array.from(section.querySelectorAll('[data-letter-step]'));
  if (steps.length === 0) return;

  // Stagger delays in milliseconds:
  // Step 0 (Hook): 300ms
  // Step 1 (P1): 950ms
  // Step 2 (P2): 1100ms
  // Step 3 (P3): 1100ms
  // Step 4 (P4): 1100ms
  // Step 5 (Gratitude): 1200ms
  // Step 6 (Signature): 900ms
  // Step 7 (Bridge): 800ms
  const pauseIntervals = [300, 950, 1100, 1100, 1100, 1200, 900, 800];

  let isTriggered = false;
  const timeoutIds = [];

  const revealAllImmediately = () => {
    timeoutIds.forEach(id => clearTimeout(id));
    steps.forEach(step => step.classList.add('is-revealed'));
  };

  const startSequence = () => {
    if (isTriggered) return;
    isTriggered = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealAllImmediately();
      return;
    }

    let cumulativeDelay = 0;
    steps.forEach((step, idx) => {
      const pause = pauseIntervals[idx] !== undefined ? pauseIntervals[idx] : 1000;
      cumulativeDelay += pause;

      const timerId = setTimeout(() => {
        step.classList.add('is-revealed');
      }, cumulativeDelay);

      timeoutIds.push(timerId);
    });
  };

  // Optional tap/click to reveal all at once if user wants to read immediately
  section.addEventListener('click', (e) => {
    // If clicking the action button itself, allow standard event
    if (e.target.closest('#btn-enter-finale')) return;
    revealAllImmediately();
  });

  // IntersectionObserver to trigger when section scrolls into viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startSequence();
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(section);
}

/**
 * Finale Transition Button Click Handler
 */
function setupFinaleTransition() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('#btn-enter-finale');
    if (!btn) return;

    const targetScene = document.getElementById(letterContent.transitionBridge.targetSceneId);
    if (targetScene) {
      targetScene.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
}
