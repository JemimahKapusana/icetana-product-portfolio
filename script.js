// Clear mobile navigation
const menuButton = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.hidden = true;
}
menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  mobileMenu.hidden = !willOpen;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    closeMenu();
    menuButton.focus();
  }
});

// Add gentle 3D movement for mouse users, without getting in the way of navigation.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mouseSupportsHover = window.matchMedia('(hover: hover) and (pointer: fine)');
if (!reducedMotion.matches && mouseSupportsHover.matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    card.addEventListener('blur', () => { card.style.transform = ''; });
  });
  const scene = document.querySelector('.scene-art');
  const board = document.querySelector('.holo-board');
  scene.addEventListener('pointermove', event => {
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    board.style.setProperty('--rx', `${x * 10}deg`);
    board.style.setProperty('--ry', `${-y * 8}deg`);
  });
  scene.addEventListener('pointerleave', () => {
    board.style.setProperty('--rx', '0deg');
    board.style.setProperty('--ry', '0deg');
  });
}

// Highlight the page section the visitor is reading.
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    for (const link of navLinks) {
      if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, { rootMargin: '-18% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('.chapter').forEach(section => observer.observe(section));
}
