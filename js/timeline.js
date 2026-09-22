/**
 * Chronicle of Moments — Flip-Card Memory Archive
 * Builds flip-card timeline, About Her observation cards,
 * animated epilogue sequence, and all-cards-opened completion state.
 */

import { contentData } from '../data/content.js';

export function initTimeline() {
  const timelineTrack = document.querySelector('.timeline-track');
  const cardsMount    = document.getElementById('timeline-cards-mount');
  const aboutMount    = document.getElementById('about-her-mount');
  const epilogueEl    = document.getElementById('timeline-epilogue');
  const completionEl  = document.getElementById('timeline-completion');
  const spineFill     = document.querySelector('.timeline-spine-fill');

  if (!cardsMount || !timelineTrack) return;

  const memories  = contentData?.memories  || [];
  const aboutHer  = contentData?.aboutHer  || [];
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------------------------
  // 1. Build flip-card DOM for each memory chapter
  // -------------------------------------------------------------------------
  buildMemoryCards(memories, cardsMount);

  // -------------------------------------------------------------------------
  // 2. Build "About Her" observation cards
  // -------------------------------------------------------------------------
  if (aboutMount && aboutHer.length) {
    buildAboutHer(aboutHer, aboutMount);
  }

  // -------------------------------------------------------------------------
  // 3. Build the epilogue sequence
  // -------------------------------------------------------------------------
  if (epilogueEl) {
    buildEpilogue(memories, epilogueEl);
  }

  // -------------------------------------------------------------------------
  // 4. Track opened cards for completion state
  // -------------------------------------------------------------------------
  const openedSet = new Set();
  const totalCards = memories.length;

  function checkCompletion(cardId) {
    openedSet.add(cardId);
    if (openedSet.size >= totalCards && completionEl) {
      triggerCompletion(completionEl);
    }
  }

  // -------------------------------------------------------------------------
  // 5. Attach flip handlers to all cards
  // -------------------------------------------------------------------------
  const cardEls = cardsMount.querySelectorAll('.mem-card');
  cardEls.forEach(cardEl => {
    const cardId = cardEl.dataset.memId;

    const doFlip = () => {
      const isFlipped = cardEl.classList.contains('is-flipped');
      cardEl.classList.add('is-flipping');
      setTimeout(() => cardEl.classList.remove('is-flipping'), 820);

      if (!isFlipped) {
        cardEl.classList.add('is-flipped');
        cardEl.setAttribute('aria-label', cardEl.dataset.labelBack);
        checkCompletion(cardId);
      } else {
        cardEl.classList.remove('is-flipped');
        cardEl.setAttribute('aria-label', cardEl.dataset.labelFront);
      }
    };

    // Click / tap
    cardEl.addEventListener('click', doFlip);

    // Keyboard: Enter or Space
    cardEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doFlip();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Reveal timeline items as they scroll into view (IntersectionObserver)
  // -------------------------------------------------------------------------
  const items = cardsMount.querySelectorAll('.timeline-item');

  if (prefersRM) {
    items.forEach(item => item.classList.add('is-revealed'));
    if (spineFill) spineFill.style.height = '100%';
  } else {
    const itemObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

    items.forEach(item => itemObs.observe(item));

    // Dynamic spine fill on scroll
    if (spineFill) {
      let ticking = false;
      const updateSpine = () => {
        const rect = timelineTrack.getBoundingClientRect();
        const dist = (window.innerHeight * 0.65) - rect.top;
        const pct  = Math.min(Math.max(dist / rect.height, 0), 1);
        spineFill.style.height = `${(pct * 100).toFixed(1)}%`;
        ticking = false;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(updateSpine); ticking = true; }
      }, { passive: true });
      updateSpine();
    }
  }

  // -------------------------------------------------------------------------
  // 7. Scroll-observe epilogue + About Her sections
  // -------------------------------------------------------------------------
  if (!prefersRM) {
    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    if (epilogueEl)  sectionObs.observe(epilogueEl);
    const aboutSection = aboutMount?.querySelector('.about-her-section');
    if (aboutSection) sectionObs.observe(aboutSection);

    // Stagger About Her cards when section becomes visible
    if (aboutSection) {
      const aboutCards = aboutSection.querySelectorAll('.about-card');
      const cardObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.cardIndex, 10) || 0;
            setTimeout(() => {
              entry.target.classList.add('is-shown');
            }, idx * 110);
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      aboutCards.forEach((c, i) => {
        c.dataset.cardIndex = i;
        cardObs.observe(c);
      });
    }

    // Stagger epilogue year chain + statements when visible
    epilogueEl?.addEventListener('transitionend', () => {
      if (epilogueEl.classList.contains('is-visible')) {
        animateEpilogue(epilogueEl);
      }
    }, { once: true });
  } else {
    // Reduced motion: show everything immediately
    epilogueEl?.classList.add('is-visible');
    const aboutSection = aboutMount?.querySelector('.about-her-section');
    aboutSection?.classList.add('is-visible');
    aboutSection?.querySelectorAll('.about-card').forEach(c => c.classList.add('is-shown'));
    epilogueEl?.querySelectorAll('.epilogue-year-item, .epilogue-stmt, .epilogue-sub')
      .forEach(el => el.classList.add('is-shown'));
  }
}

// =============================================================================
// Build Memory Flip Cards
// =============================================================================
function buildMemoryCards(memories, mount) {
  memories.forEach((mem, idx) => {
    // Outer timeline-item (position + node)
    const item = document.createElement('article');
    item.className = 'timeline-item';
    item.id = mem.id;
    item.setAttribute('data-memory-id', mem.id);
    item.setAttribute('data-year', mem.year);

    // Spine dot
    const node = document.createElement('div');
    node.className = 'timeline-node';
    node.setAttribute('aria-hidden', 'true');
    const nodeInner = document.createElement('span');
    nodeInner.className = 'timeline-node-inner';
    node.appendChild(nodeInner);

    // The flip card
    const card = createFlipCard(mem, idx);

    item.appendChild(node);
    item.appendChild(card);
    mount.appendChild(item);
  });
}

function createFlipCard(mem, idx) {
  const labelFront = `Open memory: ${mem.year} — ${mem.frontSubtitle}`;
  const labelBack  = `Close memory: ${mem.year} — ${mem.title}`;

  const card = document.createElement('div');
  card.className = 'mem-card';
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', labelFront);
  card.setAttribute('data-mem-id', mem.id);
  card.setAttribute('data-label-front', labelFront);
  card.setAttribute('data-label-back', labelBack);

  const inner = document.createElement('div');
  inner.className = 'mem-card-inner';

  inner.appendChild(buildCardFront(mem));
  inner.appendChild(buildCardBack(mem));

  card.appendChild(inner);
  return card;
}

function buildCardFront(mem) {
  const front = document.createElement('div');
  front.className = 'mem-card-front';
  front.setAttribute('aria-hidden', 'true');

  front.innerHTML = `
    <span class="mem-front-chapter">${escHtml(mem.chapter)}</span>
    <span class="mem-front-year">${escHtml(mem.year)}</span>
    <p class="mem-front-subtitle">${escHtml(mem.frontSubtitle)}</p>
    <p class="mem-front-tagline">${escHtml(mem.frontTagline)}</p>
    <span class="mem-front-cta">
      <span>Tap to open memory</span>
      <span class="mem-front-cta-arrow" aria-hidden="true">✦</span>
    </span>
    <span class="mem-front-stamp" aria-hidden="true">23 · 09 · 2026</span>
  `;

  return front;
}

function buildCardBack(mem) {
  const back = document.createElement('div');
  back.className = 'mem-card-back';
  back.setAttribute('aria-hidden', 'true');

  // Photo section (if image exists)
  const photoHTML = mem.image ? `
    <div class="mem-back-photo-wrapper">
      <img
        src="${escHtml(mem.image)}"
        alt="Memory photograph — ${escHtml(mem.year)}: ${escHtml(mem.title)}"
        class="mem-back-photo"
        loading="lazy"
        width="800"
        height="450"
        decoding="async"
        onerror="this.closest('.mem-back-photo-wrapper').style.display='none'"
      >
    </div>
  ` : '';

  // Paragraphs of the real personal story
  const storyLines = (mem.story || mem.cinematicLines || [])
    .map(line => `<span class="mem-back-story-line">${escHtml(line)}</span>`)
    .join('');

  back.innerHTML = `
    <div class="mem-back-meta">
      <span class="mem-back-chapter-label">${escHtml(mem.chapter)} · ${escHtml(mem.year)}</span>
      <span class="mem-back-year-label">${escHtml(mem.year)}</span>
    </div>
    <h3 class="mem-back-title">${escHtml(mem.title).toUpperCase()}</h3>
    ${photoHTML}
    <div class="mem-back-story">${storyLines}</div>
    <p class="mem-back-closing">${escHtml(mem.closingLine)}</p>
    <button class="mem-back-return" type="button" aria-label="Return to front of ${escHtml(mem.year)} card">
      ← Return
    </button>
  `;

  return back;
}

// =============================================================================
// Build "Things I Learned About You" Observation Cards
// =============================================================================
function buildAboutHer(aboutHer, mount) {
  const section = document.createElement('div');
  section.className = 'about-her-section';

  const header = document.createElement('div');
  header.className = 'about-her-header';
  header.innerHTML = `
    <span class="about-her-badge">Observations // For Lakshu</span>
    <h2 class="about-her-title">Things I Learned About You</h2>
  `;

  const grid = document.createElement('div');
  grid.className = 'about-her-grid';

  aboutHer.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'about-card' + (item.isSpecial ? ' about-card--special' : '');
    card.setAttribute('data-card-index', idx);

    if (item.isSpecial) {
      card.innerHTML = `
        <p class="about-card-observation">${escHtml(item.observation)}</p>
        <p class="about-card-special-text">${escHtml(item.specialText)}</p>
      `;
    } else {
      card.innerHTML = `
        <p class="about-card-observation">${escHtml(item.observation)}</p>
        ${item.supporting ? `<p class="about-card-supporting">${escHtml(item.supporting)}</p>` : ''}
      `;
    }

    grid.appendChild(card);
  });

  section.appendChild(header);
  section.appendChild(grid);
  mount.appendChild(section);
}

// =============================================================================
// Build Timeline Epilogue
// =============================================================================
function buildEpilogue(memories, epilogueEl) {
  const years = memories.map(m => m.year);

  // Year chain with connector lines
  const chainItems = years.map((yr, i) => `
    <div class="epilogue-year-item" data-epilogue-index="${i}">
      <span class="epilogue-year-num">${escHtml(yr)}</span>
      ${i < years.length - 1 ? '<span class="epilogue-year-connector" aria-hidden="true"></span>' : ''}
    </div>
  `).join('');

  epilogueEl.innerHTML = `
    <div class="epilogue-year-chain" aria-hidden="true">
      ${chainItems}
    </div>
    <div class="epilogue-statements">
      <p class="epilogue-stmt" data-stmt-index="0">Six years.</p>
      <p class="epilogue-stmt epilogue-stmt--accent" data-stmt-index="1">One friendship.</p>
      <p class="epilogue-stmt" data-stmt-index="2">Still writing.</p>
      <p class="epilogue-sub" data-stmt-index="3">And I hope there are many more chapters left.</p>
    </div>
  `;
}

function animateEpilogue(epilogueEl) {
  const yearItems = epilogueEl.querySelectorAll('.epilogue-year-item');
  const stmts = epilogueEl.querySelectorAll('.epilogue-stmt');
  const sub = epilogueEl.querySelector('.epilogue-sub');

  // Stagger the years
  yearItems.forEach((item, i) => {
    setTimeout(() => item.classList.add('is-shown'), i * 150);
  });

  // Then stagger the statements
  const stmtDelay = yearItems.length * 150 + 400;
  stmts.forEach((stmt, i) => {
    setTimeout(() => stmt.classList.add('is-shown'), stmtDelay + i * 700);
  });

  // Sub line last
  if (sub) {
    setTimeout(() => sub.classList.add('is-shown'), stmtDelay + stmts.length * 700 + 300);
  }
}

// =============================================================================
// Completion State — all 6 chapters opened
// =============================================================================
function triggerCompletion(el) {
  // Mark all spine nodes as complete
  document.querySelectorAll('.timeline-node').forEach(n => n.classList.add('is-complete'));

  el.innerHTML = `
    <p class="completion-label">Six chapters brought us here</p>
    <div class="completion-number" aria-label="Twenty one">21</div>
    <p class="completion-message">Happy 21st, Lakshu.</p>
  `;
  el.classList.add('is-active');
}

// =============================================================================
// Utility: HTML escape
// =============================================================================
function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
