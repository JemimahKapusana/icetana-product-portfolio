const menuButton = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.hidden = !open;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}));

const toggle = document.querySelector('#tilt-btn');
const cards = document.querySelectorAll('[data-tilt]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let tiltEnabled = !reducedMotion.matches;
function syncTilt() {
  toggle.setAttribute('aria-pressed', String(tiltEnabled));
  toggle.textContent = `3D tilt: ${tiltEnabled ? 'on' : 'off'}`;
  if (!tiltEnabled) cards.forEach(card => card.style.transform = '');
}
toggle.addEventListener('click', () => { tiltEnabled = !tiltEnabled; syncTilt(); });
syncTilt();
cards.forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!tiltEnabled || event.pointerType === 'touch') return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  card.addEventListener('blur', () => { card.style.transform = ''; });
});

const sections = document.querySelectorAll('.chapter');
const desktopLinks = document.querySelectorAll('.desktop-nav a');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    desktopLinks.forEach(link => {
      if (link.getAttribute('href') === `#${visible.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
}
