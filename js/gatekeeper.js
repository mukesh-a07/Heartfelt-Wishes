/**
 * Phase 1: The Gatekeeper — Cinematic DOB Lock Experience
 * Target Date: 23 / 09 / 2005
 */

import { primeAudioContext } from './audio.js';
import { contentData } from '../data/content.js';

export function initGatekeeper({ onUnlock } = {}) {
  const gatekeeper = document.getElementById('scene-gatekeeper');
  const vaultContainer = document.querySelector('.vault-container');
  const inputDay = document.getElementById('dob-day');
  const inputMonth = document.getElementById('dob-month');
  const inputYear = document.getElementById('dob-year');
  const btnUnlock = document.getElementById('btn-unlock');
  const feedback = document.getElementById('vault-feedback');
  const flashOverlay = document.getElementById('vault-flash');

  if (!gatekeeper || !inputDay || !inputMonth || !inputYear || !btnUnlock) {
    console.warn('[Gatekeeper] Essential DOM elements missing.');
    return;
  }

  // Hydrate content dynamically from contentData
  if (contentData?.gatekeeper) {
    const subtitleEl = gatekeeper.querySelector('.vault-subtitle');
    const titleEl = gatekeeper.querySelector('.vault-title');
    const badgeEl = gatekeeper.querySelector('.vault-badge');
    const hintEl = gatekeeper.querySelector('.vault-hint');
    if (subtitleEl && contentData.gatekeeper.subtitle) subtitleEl.textContent = contentData.gatekeeper.subtitle;
    if (titleEl && contentData.gatekeeper.title) titleEl.textContent = contentData.gatekeeper.title;
    if (badgeEl && contentData.gatekeeper.badge) badgeEl.textContent = contentData.gatekeeper.badge;
    if (hintEl && contentData.gatekeeper.hint) hintEl.textContent = contentData.gatekeeper.hint;
  }

  // Auto-focus day on desktop after brief pause
  setTimeout(() => {
    if (window.innerWidth > 768) {
      inputDay.focus();
    }
  }, 350);

  // Trigger tactile pulse on field container
  const triggerPulse = (fieldEl) => {
    if (!fieldEl) return;
    fieldEl.classList.add('is-pulsing');
    setTimeout(() => {
      fieldEl.classList.remove('is-pulsing');
    }, 300);
  };

  // Tactile Input Sanitization & Auto-Advance
  const setupInputBehavior = (input, maxLen, nextInput) => {
    const parentField = input.closest('.dob-field');

    input.addEventListener('input', () => {
      // Numerical sanitization only
      input.value = input.value.replace(/\D/g, '');

      if (input.value.length >= maxLen) {
        input.value = input.value.slice(0, maxLen);
        triggerPulse(parentField);

        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        attemptUnlock();
      } else if (e.key === 'Backspace' && input.value === '') {
        const prev = getPreviousInput(input);
        if (prev) {
          prev.focus();
        }
      }
    });
  };

  const getPreviousInput = (curr) => {
    if (curr === inputYear) return inputMonth;
    if (curr === inputMonth) return inputDay;
    return null;
  };

  setupInputBehavior(inputDay, 2, inputMonth);
  setupInputBehavior(inputMonth, 2, inputYear);
  setupInputBehavior(inputYear, 4, null);

  // Unlock Verification
  const attemptUnlock = () => {
    const dayStr = inputDay.value.trim();
    const monthStr = inputMonth.value.trim();
    const yearStr = inputYear.value.trim();

    // Check for incomplete date
    if (!dayStr || !monthStr || !yearStr || yearStr.length < 4) {
      handleIncomplete();
      return;
    }

    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    const targetDay = parseInt(contentData?.birthday?.dob?.day || '23', 10);
    const targetMonth = parseInt(contentData?.birthday?.dob?.month || '09', 10);
    const targetYear = parseInt(contentData?.birthday?.dob?.year || '2005', 10);

    const isCorrect = day === targetDay && month === targetMonth && year === targetYear;

    if (isCorrect) {
      try {
        primeAudioContext();
      } catch (e) {}
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleIncomplete = () => {
    shakeVault();
    feedback.textContent = 'Please enter the complete date to begin.';
    feedback.className = 'vault-feedback is-error';
  };

  const handleFailure = () => {
    shakeVault();
    feedback.textContent = 'Not quite… try again.';
    feedback.className = 'vault-feedback is-error';

    // Highlight input for immediate correction
    inputDay.select();
  };

  const shakeVault = () => {
    vaultContainer.classList.remove('is-shaking');
    // Force reflow for clean repeated attempts
    void vaultContainer.offsetWidth;
    vaultContainer.classList.add('is-shaking');

    setTimeout(() => {
      vaultContainer.classList.remove('is-shaking');
    }, 400);
  };

  const handleSuccess = () => {
    // 1. Freeze the gatekeeper UI
    inputDay.disabled = true;
    inputMonth.disabled = true;
    inputYear.disabled = true;
    btnUnlock.disabled = true;

    // 2. Increase gold glow
    vaultContainer.style.boxShadow = '0 0 65px rgba(217, 181, 109, 0.7), 0 0 120px rgba(201, 130, 155, 0.35)';
    vaultContainer.style.borderColor = 'var(--accent-gold)';

    // 3. Show “Access granted.”
    feedback.textContent = 'Access granted.';
    feedback.className = 'vault-feedback is-success';

    // 4. Hold briefly (~600ms)
    setTimeout(() => {
      // 5. Dissolve the DOB interface
      vaultContainer.classList.add('is-dissolving');

      // 6. Transition through particles/light
      setTimeout(() => {
        if (flashOverlay) {
          flashOverlay.classList.add('is-flashing');
        }

        // 7. Reveal the Hero section underneath
        setTimeout(() => {
          gatekeeper.classList.add('is-unlocked');

          if (flashOverlay) {
            flashOverlay.classList.remove('is-flashing');
          }

          if (typeof onUnlock === 'function') {
            onUnlock();
          }

          // Smoothly scroll to top of Hero section
          const hero = document.getElementById('scene-hero');
          if (hero) {
            hero.scrollIntoView({ behavior: 'smooth' });
          }
        }, 450);
      }, 500);
    }, 650);
  };

  btnUnlock.addEventListener('click', attemptUnlock);
}
