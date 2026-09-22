/**
 * Phase 3: Kavithai / Tamil Poetry Experience
 * Line-by-line Tamil typewriter engine with Unicode grapheme segmentation,
 * punctuation cadence, and champagne-gold focal point illumination.
 */

import { poetryData } from '../data/poetry.js';

export function initKavithai() {
  const cards = document.querySelectorAll('.kavithai-card');
  if (!cards.length) return;

  // Hydrate card contents from centralized poetryData if present
  if (Array.isArray(poetryData) && poetryData.length > 0) {
    cards.forEach((card, cardIdx) => {
      const pData = poetryData[cardIdx];
      if (!pData) return;

      const chapterEl = card.querySelector('.kavithai-chapter');
      const themeEl = card.querySelector('.kavithai-theme');
      const translationEl = card.querySelector('.kavithai-translation');
      const signatureEl = card.querySelector('.kavithai-signature');
      const stanzaContainer = card.querySelector('.kavithai-stanza');

      if (chapterEl && pData.chapter) chapterEl.textContent = pData.chapter;
      if (themeEl && pData.theme) themeEl.textContent = pData.theme;
      if (translationEl && pData.translation) translationEl.textContent = `“${pData.translation}”`;
      if (signatureEl && pData.signature) signatureEl.textContent = pData.signature;

      if (stanzaContainer && Array.isArray(pData.tamilLines)) {
        stanzaContainer.innerHTML = pData.tamilLines.map((line, lIdx) => {
          const isHigh = (lIdx === pData.highlightIndex);
          return `<span class="kavithai-line${isHigh ? ' kavithai-gold-focus' : ''}" data-line-index="${lIdx}" data-highlight="${isHigh ? 'true' : 'false'}">${line}</span>`;
        }).join('');
      }
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helper for Tamil grapheme-safe splitting using Intl.Segmenter
  const getGraphemes = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('ta', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), s => s.segment);
    }
    return Array.from(text);
  };

  // Helper sleep promise
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Reduced motion: reveal all text instantly without typewriter delays
  if (prefersReducedMotion) {
    cards.forEach(card => {
      card.classList.add('is-visible');
      const lines = card.querySelectorAll('.kavithai-line');
      lines.forEach(line => {
        if (line.dataset.highlight === 'true' || line.classList.contains('kavithai-gold-focus')) {
          line.classList.add('is-highlight', 'kavithai-gold-focus');
        }
      });
      const translation = card.querySelector('.kavithai-translation');
      const signature = card.querySelector('.kavithai-signature');
      if (translation) translation.classList.add('is-revealed');
      if (signature) signature.classList.add('is-revealed');
    });
    return;
  }

  // Pre-process cards: store full text in data-full-text and hold height with non-breaking space
  cards.forEach(card => {
    const lines = card.querySelectorAll('.kavithai-line');
    lines.forEach(line => {
      const fullText = line.textContent.trim();
      line.dataset.fullText = fullText;
      line.innerHTML = '&nbsp;';
    });
  });

  // Typewriter worker for a single line
  async function typeLine(lineEl, fullText, isHighlight) {
    const graphemes = getGraphemes(fullText);
    lineEl.textContent = '';

    const caret = document.createElement('span');
    caret.className = 'kavithai-caret';
    caret.setAttribute('aria-hidden', 'true');
    lineEl.appendChild(caret);

    for (let i = 0; i < graphemes.length; i++) {
      const char = graphemes[i];
      caret.before(document.createTextNode(char));

      // Character cadence: 45ms to 65ms
      let delay = 45 + Math.floor(Math.random() * 20);

      // Emotional punctuation pauses: 280ms to 340ms
      if (char === '…' || char === '.' || char === ',' || char === '!' || char === ';') {
        delay = 280 + Math.floor(Math.random() * 60);
      }

      await sleep(delay);
    }

    // Line settling pause
    await sleep(220);

    // If marked as highlight, softly illuminate into champagne gold
    if (isHighlight) {
      lineEl.classList.add('is-highlight', 'kavithai-gold-focus');
    }

    // Remove caret from completed line
    caret.remove();
  }

  // Typewriter worker for an entire poetic chamber card
  async function typeCard(card) {
    if (card.dataset.typed === 'true') return;
    card.dataset.typed = 'true';

    // Fade in and slide up the card chamber
    card.classList.add('is-visible');
    await sleep(400);

    const lines = card.querySelectorAll('.kavithai-line');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fullText = line.dataset.fullText || '';
      const isHighlight = line.dataset.highlight === 'true' || line.classList.contains('is-highlight');

      await typeLine(line, fullText, isHighlight);

      // Natural pause between poetic lines
      if (i < lines.length - 1) {
        await sleep(260);
      }
    }

    // Reveal English translation after poem completes
    await sleep(350);
    const translation = card.querySelector('.kavithai-translation');
    if (translation) {
      translation.classList.add('is-revealed');
    }

    // Reveal closing signature
    await sleep(400);
    const signature = card.querySelector('.kavithai-signature');
    if (signature) {
      signature.classList.add('is-revealed');
    }
  }

  // IntersectionObserver to trigger as each chamber enters the viewport
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        obs.unobserve(card);
        typeCard(card);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.15
  });

  cards.forEach(card => observer.observe(card));
}
