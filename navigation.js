// Mobile navigation and current-section highlighting. The site works without JS.
document.documentElement.classList.add('js');
const nav = document.getElementById('project-nav');
const toggle = document.querySelector('.mobile-toggle');
const mobile = window.matchMedia('(max-width: 800px)');
function setCollapsed(collapsed) {
  nav.dataset.collapsed = String(collapsed);
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.querySelector('.toggle-indicator').textContent = collapsed ? '+' : '\u2212';
}
setCollapsed(mobile.matches);
toggle.addEventListener('click', () => setCollapsed(nav.dataset.collapsed !== 'true'));
mobile.addEventListener('change', (event) => setCollapsed(event.matches));
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!mobile.matches || !link) return;
  if (link.getAttribute('href').startsWith('#')) {
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (target) {
      event.preventDefault();
      setCollapsed(true);
      window.requestAnimationFrame(() => {
        try { history.pushState(null, '', link.hash); }
        catch (_) { window.location.hash = link.hash; }
        target.scrollIntoView({block: 'start', behavior: 'instant'});
        scheduleHighlight();
      });
      return;
    }
  }
  setCollapsed(true);
});
const links = Array.from(nav.querySelectorAll('[data-section]'));
const headings = links.map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))));
let pending = false;
function highlight() {
  pending = false;
  let current = -1;
  const threshold = Math.min(150, window.innerHeight * 0.2);
  headings.forEach((heading, index) => {
    if (heading && heading.getBoundingClientRect().top <= threshold) current = index;
  });
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) current = headings.length - 1;
  links.forEach((link, index) => {
    if (index === current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleHighlight() {
  if (!pending) { pending = true; window.requestAnimationFrame(highlight); }
}
window.addEventListener('scroll', scheduleHighlight, {passive: true});
window.addEventListener('resize', scheduleHighlight);
window.addEventListener('load', scheduleHighlight);
highlight();
