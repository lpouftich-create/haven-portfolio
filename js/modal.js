const CASES = {
  note1: {
    title: 'Architecting a real-time real estate platform',
    tags: ['Engineering', '3 min read'],
    glyph: '🏗',
    body: [
      'Building Immoidou required a database architecture that could handle rapid read/write operations without bottlenecking. I implemented a custom caching layer and optimized the frontend routing to ensure sub-second page loads.',
      'The search functionality was built using indexed queries, allowing users to filter through thousands of property listings instantly. The frontend relies on server-side rendering to guarantee SEO performance and initial load speed.'
    ],
    stats: [{ n: '0.8s', label: 'Load Time' }, { n: '100', label: 'Lighthouse Score' }, { n: '99.9%', label: 'Uptime' }]
  },
  note2: {
    title: 'Scaling community infrastructure',
    tags: ['Community', '5 min read'],
    glyph: '⚙️',
    body: [
      'A 250+ member Discord server doesn\'t run itself. I designed an automated infrastructure that handles onboarding, role assignment, and moderation to maintain a highly focused environment.',
      'The engagement loops are built around structured focus sprints rather than constant chatting. By utilizing custom bot logic to manage voice channel states and study timers, the server maintains a consistent daily active user count without requiring constant manual oversight.'
    ],
    stats: [{ n: '250+', label: 'Members' }, { n: '24/7', label: 'Automation' }, { n: '0', label: 'Spam' }]
  },
  note3: {
    title: 'High-performance web rendering',
    tags: ['Design', '2 min read'],
    glyph: '💻',
    body: [
      'WebGL and Three.js can easily destroy a website\'s performance if not implemented correctly. I built the 3D background on this site using optimized geometry and frame-limiting to ensure it doesn\'t drain the user\'s battery.',
      'By dynamically scaling the render resolution based on the device pixel ratio and pausing the animation loop when the canvas is out of view, I maintained a flawless 60fps experience while keeping the main thread free for UI interactions.'
    ],
    stats: [{ n: '60fps', label: 'Frame Rate' }, { n: '3D', label: 'Canvas' }, { n: '0', label: 'Layout Shifts' }]
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

// Check for both data-modal and data-note
document.querySelectorAll('[data-modal], [data-note]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // Stops jumping to top
    const id = link.getAttribute('data-modal') || link.getAttribute('data-note');
    openModal(id);
  });
});
