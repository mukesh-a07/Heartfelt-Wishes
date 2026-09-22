import { syncAudioScene } from './audio.js';
import { contentData } from '../data/content.js';

export function initFinale() {
  const btnOneLastThing = document.getElementById('btn-one-last-thing');
  const climaxOverlay = document.getElementById('finale-climax');
  const btnReturnStory = document.getElementById('btn-return-story');

  const climaxLines = document.querySelectorAll('.climax-line');
  const climaxDate = document.querySelector('.climax-date-wrapper');
  const climaxClosing = document.querySelector('.climax-closing');
  const climaxActions = document.querySelector('.climax-actions');

  if (!btnOneLastThing || !climaxOverlay) return;

  // Hydrate content dynamically from contentData
  if (contentData?.finale) {
    const finaleBadge = document.querySelector('.finale-badge');
    const finaleTitle = document.querySelector('.finale-title');
    const finaleSubtitle = document.querySelector('.finale-subtitle');
    const dateCrest = document.querySelector('.climax-milestone-crest');
    const dateVal = document.querySelector('.climax-date');
    const closingEl = document.querySelector('.climax-closing-text');

    if (finaleBadge && contentData.finale.badge) finaleBadge.textContent = contentData.finale.badge;
    if (finaleTitle && contentData.finale.title) finaleTitle.textContent = contentData.finale.title;
    if (finaleSubtitle && contentData.finale.subtitle) finaleSubtitle.textContent = contentData.finale.subtitle;
    if (dateCrest && contentData.finale.milestoneCrest) dateCrest.textContent = contentData.finale.milestoneCrest;
    if (dateVal && contentData.finale.milestoneDate) dateVal.textContent = contentData.finale.milestoneDate;
    if (closingEl && contentData.finale.closingText) closingEl.textContent = contentData.finale.closingText;

    if (Array.isArray(contentData.finale.climaxLines)) {
      climaxLines.forEach((lineEl, idx) => {
        if (contentData.finale.climaxLines[idx]) {
          lineEl.textContent = contentData.finale.climaxLines[idx];
        }
      });
    }
  }

  const resetReveals = () => {
    climaxLines.forEach(line => line.classList.remove('is-revealed'));
    if (climaxDate) climaxDate.classList.remove('is-revealed');
    if (climaxClosing) climaxClosing.classList.remove('is-revealed');
    if (climaxActions) climaxActions.classList.remove('is-revealed');
  };

  const triggerClimax = () => {
    resetReveals();
    climaxOverlay.classList.add('is-active');
    climaxOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Cinematic Audio Swell for Finale
    syncAudioScene('scene-finale');

    // Stagger reveal sequence
    const delays = [
      400,   // "For every laugh."
      1200,  // "Every conversation."
      2000,  // "Every memory."
      2800,  // "Every version of us."
      3800,  // "Thank you for being part of my life."
      4800   // "Happy 21st Birthday."
    ];

    climaxLines.forEach((line, idx) => {
      setTimeout(() => {
        if (climaxOverlay.classList.contains('is-active')) {
          line.classList.add('is-revealed');
        }
      }, delays[idx] || (idx * 800));
    });

    // Reveal Grand Date
    setTimeout(() => {
      if (climaxOverlay.classList.contains('is-active') && climaxDate) {
        climaxDate.classList.add('is-revealed');
      }
    }, 5800);

    // Reveal Closing Reflection
    setTimeout(() => {
      if (climaxOverlay.classList.contains('is-active') && climaxClosing) {
        climaxClosing.classList.add('is-revealed');
      }
    }, 6800);

    // Reveal Actions
    setTimeout(() => {
      if (climaxOverlay.classList.contains('is-active') && climaxActions) {
        climaxActions.classList.add('is-revealed');
      }
    }, 7600);
  };

  const closeClimax = () => {
    climaxOverlay.classList.remove('is-active');
    climaxOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Return audio to hero profile
    syncAudioScene('scene-hero');

    // Smooth scroll back to top of the hero
    const hero = document.getElementById('scene-hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth' });
    }
  };

  btnOneLastThing.addEventListener('click', triggerClimax);
  if (btnReturnStory) {
    btnReturnStory.addEventListener('click', closeClimax);
  }

  // Keyboard accessibility: Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && climaxOverlay.classList.contains('is-active')) {
      closeClimax();
    }
  });
}
