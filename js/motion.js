/**
 * Phase 5: Advanced Motion System
 * Standardized Scroll Observers, Custom Lerp Film Cursor & Cinema Dust Engine
 */

export function initMotion() {
  initCursor();
  initDust();
  initScrollReveals();
}

/**
 * Desktop Custom Luxury Cursor with Fluid Lerp & Contextual Actions
 */
function initCursor() {
  const cursorRing = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorText = cursorRing ? cursorRing.querySelector('.custom-cursor-text') : null;

  if (!cursorRing || !cursorDot) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Fluid Lerp Loop for Trailing Ring
  let isRunning = true;
  const renderCursor = () => {
    if (isRunning) {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX.toFixed(1)}px`;
      cursorRing.style.top = `${ringY.toFixed(1)}px`;
    }
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Contextual Hover Detection
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-cursor], a, button, input, .timeline-card, .kavithai-card');
    if (!target) return;

    const customText = target.getAttribute('data-cursor');
    if (customText) {
      cursorRing.classList.add('is-expanded');
      if (cursorText) cursorText.textContent = customText;
    } else if (target.matches('.timeline-card') || target.matches('.timeline-photo')) {
      cursorRing.classList.add('is-expanded');
      if (cursorText) cursorText.textContent = 'VIEW';
    } else if (target.matches('.kavithai-card')) {
      cursorRing.classList.add('is-expanded');
      if (cursorText) cursorText.textContent = 'READ';
    } else if (target.matches('button, a, input, .audio-controller')) {
      cursorRing.classList.add('is-expanded');
      if (cursorText) cursorText.textContent = '';
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-cursor], a, button, input, .timeline-card, .kavithai-card, .audio-controller');
    if (target) {
      cursorRing.classList.remove('is-expanded');
      if (cursorText) cursorText.textContent = '';
    }
  });

  document.addEventListener('mouseleave', () => {
    cursorRing.classList.add('is-hidden');
    cursorDot.classList.add('is-hidden');
  });

  document.addEventListener('mouseenter', () => {
    cursorRing.classList.remove('is-hidden');
    cursorDot.classList.remove('is-hidden');
  });
}

/**
 * Cinema Projector Ambient Dust Canvas
 */
function initDust() {
  const canvas = document.getElementById('dust-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  // Moderate density: max 35 particles on desktop, 18 on mobile
  const maxParticles = width < 768 ? 18 : 35;
  const particleCount = Math.min(Math.floor(width / 40), maxParticles);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.3 + 0.4,
      alpha: Math.random() * 0.16 + 0.04,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.25 - 0.08, // Slow upward drift
      color: Math.random() > 0.45 ? '217, 181, 109' : '245, 239, 229'
    });
  }

  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  const animate = () => {
    if (isPageVisible) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

/**
 * Standardized Scroll Observers for Elements
 */
function initScrollReveals() {
  const elements = document.querySelectorAll(
    '.reveal-on-scroll, .motion-reveal, .motion-reveal-hero, .motion-reveal-image, .section-header-reveal'
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.14
  });

  elements.forEach(el => observer.observe(el));
}
