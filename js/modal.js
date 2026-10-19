const CASES = {
  haven: {
    title: 'Haven — the study server',
    tags: ['Community', 'Discord', '2026'],
    glyph: 'H',
    body: [
      'Haven started as a small Discord server for a handful of friends who could not focus alone. In twelve months it became a 1,200-person study community with structured focus sessions, body-doubling rooms, and a strict no-noise policy.',
      'The design challenge: make a text-and-voice app feel like a place. The answer was rhythm — predictable daily rituals, a clean visual identity, and moderation that keeps the tone quiet.'
    ],
    stats: [
      { n: '1,200+', label: 'members' },
      { n: '40+', label: 'daily focus hours' },
      { n: '12mo', label: 'old' }
    ]
  },
  project2: {
    title: 'Your second project',
    tags: ['Product', '2026'],
    glyph: '◆',
    body: [
      'Describe the problem. What was broken or missing?',
      'Describe the solution and the specific decision that made it work.'
    ],
    stats: [
      { n: '—', label: 'placeholder' },
      { n: '—', label: 'placeholder' },
      { n: '—', label: 'placeholder' }
    ]
  },
  project3: {
    title: 'Your third project',
    tags: ['Client work', '2026'],
    glyph: '✦',
    body: ['Same structure. Be specific.'],
    stats: [{ n: '—', label: 'placeholder' }, { n: '—', label: 'placeholder' }, { n: '—', label: 'placeholder' }]
  }
};

const overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.innerHTML = `
  <div class="modal" role="dialog" aria-modal="true">
    <button class="modal-close" aria-label="Close">×</button>
    <div class="modal-tags"></div>
    <h2></h2>
    <div class="modal-hero"><span></span></div>
    <div class="modal-body"></div>
    <div class="modal-stats"></div>
  </div>`;
document.body.appendChild(overlay);

const modal = overlay.querySelector('.modal');

function openModal(id) {
  const c = CASES[id];
  if (!c) return;
  overlay.querySelector('.modal-tags').innerHTML = c.tags.map(t => `<span>${t}</span>`).join('');
  overlay.querySelector('h2').textContent = c.title;
  overlay.querySelector('.modal-hero span').textContent = c.glyph;
  overlay.querySelector('.modal-body').innerHTML = c.body.map(p => `<p>${p}</p>`).join('');
  overlay.querySelector('.modal-stats').innerHTML = c.stats.map(s =>
    `<div><strong>${s.n}</strong><small>${s.label}</small></div>`).join('');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

overlay.querySelector('.modal-close').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Hook up modal links via data-modal attribute
document.querySelectorAll('[data-modal]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(link.getAttribute('data-modal'));
  });
});
