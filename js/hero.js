import { contentData } from '../data/content.js';

export function initHero() {
  const heroSection = document.getElementById('scene-hero');
  const heroPhoto = document.getElementById('hero-photo');
  const heroDarken = document.getElementById('hero-darken-scrim');
  const heroMasthead = document.querySelector('.hero-masthead');
  const heroTags = document.querySelector('.hero-issue-tags');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroScrollHint = document.querySelector('.hero-scroll-hint');

  if (!heroSection) return;

  // Hydrate content dynamically from contentData
  if (contentData && contentData.hero) {
    if (heroTitle && contentData.hero.title) heroTitle.textContent = contentData.hero.title;
    if (heroSubtitle && contentData.hero.subtitle) heroSubtitle.textContent = contentData.hero.subtitle;
    if (heroPhoto) {
      if (contentData.hero.portraitImage) heroPhoto.src = contentData.hero.portraitImage;
      if (contentData.hero.portraitAlt) heroPhoto.alt = contentData.hero.portraitAlt;
    }
    const mastheadDate = document.getElementById('micro-discovery-trigger');
    if (mastheadDate && contentData.hero.mastheadDate) {
      mastheadDate.textContent = contentData.hero.mastheadDate;
      mastheadDate.setAttribute('aria-label', `${contentData.hero.mastheadDate}. Press to discover a quiet secret.`);
    }
  }

  const playHeroRevealSequence = () => {
    // Stage 1: Image gradual focus (1.2–1.8s)
    setTimeout(() => {
      if (heroPhoto) heroPhoto.classList.add('is-revealed');
    }, 180);

    // Stage 2: Editorial Masthead
    setTimeout(() => {
      if (heroMasthead) heroMasthead.classList.add('is-revealed');
    }, 550);

    // Stage 3: Magazine Issue Metadata Tags
    setTimeout(() => {
      if (heroTags) heroTags.classList.add('is-revealed');
    }, 800);

    // Stage 4: Cinematic Mask Title Reveal
    setTimeout(() => {
      if (heroTitle) heroTitle.classList.add('is-revealed');
    }, 1100);

    // Stage 5: Poetic Subtitle & Scroll Hint
    setTimeout(() => {
      if (heroSubtitle) heroSubtitle.classList.add('is-revealed');
      if (heroScrollHint) heroScrollHint.classList.add('is-revealed');
    }, 1550);
  };

  // Triggered on Gatekeeper unlock event
  window.addEventListener('vault:unlocked', playHeroRevealSequence);

  // Smooth scroll down to Kavithai when clicking scroll hint
  if (heroScrollHint) {
    heroScrollHint.style.cursor = 'pointer';
    heroScrollHint.addEventListener('click', () => {
      const kavithaiSection = document.getElementById('scene-kavithai');
      if (kavithaiSection) {
        kavithaiSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Refined Scroll Parallax & Gradual Darkening Transition
  let isTicking = false;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  window.addEventListener('scroll', () => {
    if (isReducedMotion) return;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;

        if (scrollY <= heroHeight) {
          const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

          // 1. Desktop only: subtle, restrained scale (1.00 -> 1.035 max)
          if (!isTouchDevice && heroPhoto) {
            const scale = 1.0 + progress * 0.035;
            heroPhoto.style.transform = `scale(${scale.toFixed(3)})`;
          }

          // 2. Subtle, restrained title lift
          const titleShift = progress * -32;
          if (heroTitle) {
            heroTitle.style.transform = `translateY(${titleShift.toFixed(1)}px)`;
          }

          // 3. Subtitle moves upward gently and fades
          if (heroSubtitle) {
            heroSubtitle.style.transform = `translateY(${(titleShift * 0.65).toFixed(1)}px)`;
            heroSubtitle.style.opacity = Math.max(0, 1 - progress * 1.4).toFixed(2);
          }

          // 4. Hero gradually darkens to reveal the next chapter
          if (heroDarken) {
            heroDarken.style.opacity = (progress * 0.8).toFixed(2);
          }
        }

        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}
