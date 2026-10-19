const CASES = {
  project3: {
    title: 'ConcourSup',
    tags: ['Education', 'Product', '2026'],
    glyph: '✦',
    body: [
      'Post-bac students need a way to prepare for the CNCS exam without drowning in scattered resources. ConcourSup brings the prep into one focused site.',
      'The goal was to build a platform that helps students study smarter, not harder, by giving them the exact tools they need.'
    ],
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

document.querySelectorAll('[data-modal]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(link.getAttribute('data-modal'));
  });
});
