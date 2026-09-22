/**
 * Phase 6: Memory Interactions & Easter Eggs
 * The Constellation "21", The Hidden Letter & The Hero Micro Discovery
 */

import { playCelestialChime } from './audio.js';
import { contentData } from '../data/content.js';

export function initConstellation() {
  initConstellationCanvas();
  initHiddenLetter();
  initMicroDiscovery();
}

/**
 * Feature 2: Memory Constellation of 21
 */
function initConstellationCanvas() {
  const canvas = document.getElementById('constellation-canvas');
  const statusEl = document.getElementById('constellation-unlocked-count');
  const starDialog = document.getElementById('star-dialog');
  const starDialogClose = document.getElementById('star-dialog-close');
  const starBadge = document.getElementById('star-dialog-badge');
  const starTitle = document.getElementById('star-dialog-title');
  const starText = document.getElementById('star-dialog-text');
  const starImg = document.getElementById('star-dialog-img');

  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set canvas resolution according to devicePixelRatio
  let width = 0;
  let height = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 8 Celestial Stars forming the numeral "21" (from centralized contentData)
  const starData = contentData.constellation;

  // Connecting line segments for "2" and "1"
  const connections = [
    [1, 2], [2, 3], [3, 4], [4, 5], // Digit 2
    [6, 7], [7, 8]                   // Digit 1
  ];

  let mouseX = -999;
  let mouseY = -999;
  let hoveredStar = null;

  const updateCoordinates = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;
  };

  canvas.addEventListener('mousemove', (e) => {
    updateCoordinates(e.clientX, e.clientY);
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mouseX = -999;
    mouseY = -999;
    hoveredStar = null;
  });

  const openStarMemory = (star) => {
    if (!star) return;
    star.unlocked = true;
    updateStatus();

    // Play celestial chime harmonic
    try {
      const starFreqs = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66, 1318.51, 1479.98];
      const freq = starFreqs[(star.id - 1) % starFreqs.length] || 880.00;
      playCelestialChime(freq, 0.22);
    } catch (e) {}

    if (starBadge) starBadge.textContent = `Memory Star // 0${star.id} (Digit ${star.group})`;
    if (starTitle) starTitle.textContent = star.title;
    if (starText) starText.textContent = star.text;
    if (starImg) {
      starImg.src = star.image;
      starImg.alt = star.title;
    }
    if (starDialog) starDialog.classList.add('is-active');
  };

  // Pointer Click on Canvas
  canvas.addEventListener('click', (e) => {
    e.stopPropagation();
    updateCoordinates(e.clientX, e.clientY);
    checkHover();
    if (hoveredStar) {
      openStarMemory(hoveredStar);
    }
  });

  // Touch Support on Mobile
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      updateCoordinates(touch.clientX, touch.clientY);
      checkHover(38); // Enhanced 38px mobile touch hit radius
      if (hoveredStar) {
        e.preventDefault();
        e.stopPropagation();
        openStarMemory(hoveredStar);
      }
    }
  }, { passive: false });

  // Accessible Buttons for Keyboard Navigation
  const starBtns = document.querySelectorAll('.constellation-star-btn');
  starBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const starId = parseInt(btn.dataset.starId, 10);
      const star = starData.find(s => s.id === starId);
      if (star) openStarMemory(star);
    });
  });

  if (starDialogClose) {
    starDialogClose.addEventListener('click', (e) => {
      e.stopPropagation();
      starDialog.classList.remove('is-active');
    });
  }

  // Close dialog on outside click
  window.addEventListener('click', (e) => {
    if (starDialog && starDialog.classList.contains('is-active')) {
      if (!starDialog.contains(e.target) && !e.target.closest('#constellation-canvas, .constellation-star-btn')) {
        starDialog.classList.remove('is-active');
      }
    }
  });

  // Close dialog on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && starDialog && starDialog.classList.contains('is-active')) {
      starDialog.classList.remove('is-active');
    }
  });

  const updateStatus = () => {
    const count = starData.filter(s => s.unlocked).length;
    if (statusEl) {
      statusEl.textContent = `${count} / ${starData.length}`;
      if (count === starData.length) {
        statusEl.textContent = 'Milestone 21 Completed ✦';
      }
    }
  };

  const checkHover = (threshold = 24) => {
    hoveredStar = null;
    for (const star of starData) {
      const sx = (star.x / 100) * width;
      const sy = (star.y / 100) * height;
      const dist = Math.hypot(mouseX - sx, mouseY - sy);
      if (dist < threshold) {
        hoveredStar = star;
        break;
      }
    }
  };

  // Canvas Render Loop
  let frameId;
  const render = () => {
    ctx.clearRect(0, 0, width, height);

    checkHover();

    // 1. Draw Connecting Lines
    connections.forEach(([idA, idB]) => {
      const starA = starData.find(s => s.id === idA);
      const starB = starData.find(s => s.id === idB);
      if (!starA || !starB) return;

      const ax = (starA.x / 100) * width;
      const ay = (starA.y / 100) * height;
      const bx = (starB.x / 100) * width;
      const by = (starB.y / 100) * height;

      const isLineLit = starA.unlocked || starB.unlocked;
      const bothLit = starA.unlocked && starB.unlocked;

      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);

      if (bothLit) {
        ctx.strokeStyle = 'rgba(217, 181, 109, 0.85)';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = 'rgba(217, 181, 109, 0.7)';
        ctx.shadowBlur = 12;
      } else if (isLineLit) {
        ctx.strokeStyle = 'rgba(217, 181, 109, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(217, 181, 109, 0.3)';
        ctx.shadowBlur = 6;
      } else {
        ctx.strokeStyle = 'rgba(217, 181, 109, 0.12)';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // 2. Draw Stars
    starData.forEach(star => {
      const sx = (star.x / 100) * width;
      const sy = (star.y / 100) * height;
      const isHovered = (hoveredStar === star);

      // Star outer aura
      if (star.unlocked || isHovered) {
        ctx.beginPath();
        ctx.arc(sx, sy, isHovered ? 16 : 11, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? 'rgba(217, 181, 109, 0.38)' : 'rgba(217, 181, 109, 0.22)';
        ctx.fill();
      }

      // Star glowing core
      ctx.beginPath();
      ctx.arc(sx, sy, star.unlocked ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = star.unlocked 
        ? '#FAF5EE' 
        : isHovered 
          ? '#E8CF96' 
          : 'rgba(217, 181, 109, 0.65)';
      ctx.shadowColor = 'rgba(217, 181, 109, 0.85)';
      ctx.shadowBlur = star.unlocked ? 14 : (isHovered ? 16 : 4);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    frameId = requestAnimationFrame(render);
  };

  render();
}

/**
 * Feature 1: The Hidden Letter
 */
function initHiddenLetter() {
  const trigger = document.getElementById('hidden-letter-trigger');
  const modal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('letter-close-btn');

  if (!trigger || !modal) return;

  // Hydrate modal content from contentData
  const keepsake = contentData.hiddenMessages?.keepsakeLetter;
  if (keepsake) {
    const badge = modal.querySelector('.letter-emblem-badge');
    const salutation = modal.querySelector('.letter-salutation');
    const bodyContainer = modal.querySelector('.letter-body');
    const sig = modal.querySelector('.letter-signature');

    if (badge && keepsake.badge) badge.textContent = keepsake.badge;
    if (salutation && keepsake.salutation) salutation.textContent = keepsake.salutation;
    if (bodyContainer && Array.isArray(keepsake.body)) {
      bodyContainer.innerHTML = keepsake.body.map(p => `<p>${p}</p>`).join('');
    }
    if (sig && keepsake.signoff && keepsake.author) {
      sig.innerHTML = `<p>${keepsake.signoff}<br><strong>${keepsake.author}</strong></p>`;
    }
  }

  const openLetter = () => {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeLetter = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    trigger.focus();
  };

  trigger.addEventListener('click', openLetter);
  if (closeBtn) closeBtn.addEventListener('click', closeLetter);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLetter();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLetter();
    }
  });
}

/**
 * Feature 3: Micro Discovery on Hero Date Badge
 */
function initMicroDiscovery() {
  const trigger = document.getElementById('micro-discovery-trigger');
  const toast = document.getElementById('micro-whisper-toast');
  const closeBtn = document.getElementById('micro-whisper-close');

  if (!trigger || !toast) return;

  // Hydrate toast text from contentData
  const whisper = contentData.hiddenMessages?.microWhisper;
  if (whisper) {
    const textEl = toast.querySelector('.micro-whisper-text');
    if (textEl) textEl.textContent = whisper;
  }

  let timer = null;

  const showWhisper = () => {
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 6000);
  };

  const hideWhisper = () => {
    toast.classList.remove('is-visible');
    clearTimeout(timer);
  };

  trigger.addEventListener('click', showWhisper);
  if (closeBtn) closeBtn.addEventListener('click', hideWhisper);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toast.classList.contains('is-visible')) {
      hideWhisper();
    }
  });
}
