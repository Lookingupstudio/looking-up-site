/* Emi BioLab · script condiviso */

/* anno nel footer */
document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

/* menu mobile */
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  }));
}

/* comparsa al passaggio */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* avviso per i segnaposto (Stripe, Skool, YouTube, form) */
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
document.querySelectorAll('[data-placeholder]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); showToast(el.dataset.placeholder); });
});

/* orario del workshop nel fuso di chi guarda */
document.querySelectorAll('time[data-local]').forEach(t => {
  const d = new Date(t.getAttribute('datetime'));
  if (isNaN(d)) return;
  const out = t.parentElement.querySelector('.local-out');
  if (!out) return;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone';
    const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    out.innerHTML = 'Your time: <b>' + fmt.format(d) + '</b><br>' + tz.replace(/_/g, ' ');
  } catch (err) { /* il testo di riserva resta */ }
});

/* dati di provenienza: li raccolgono i form e i bottoni di iscrizione,
   così il futuro gestionale sa da dove arriva ogni persona */
const params = new URLSearchParams(location.search);
const origin = {
  utm_source: params.get('utm_source') || '',
  utm_medium: params.get('utm_medium') || '',
  utm_campaign: params.get('utm_campaign') || '',
  referrer: document.referrer || '',
  page: location.pathname.split('/').pop() || 'index.html'
};
try {
  if (origin.utm_source) sessionStorage.setItem('emi_origin', JSON.stringify(origin));
  const saved = JSON.parse(sessionStorage.getItem('emi_origin') || 'null');
  if (saved) Object.assign(origin, saved, { page: origin.page });
} catch (err) { /* storage non disponibile: si usa quello della pagina */ }

document.querySelectorAll('form[data-list]').forEach(form => {
  Object.entries(origin).forEach(([k, v]) => {
    const input = document.createElement('input');
    input.type = 'hidden'; input.name = k; input.value = v;
    form.appendChild(input);
  });
  /* segnaposto: lo strumento email si sceglie col gestionale */
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.classList.add('sent');
    form.querySelector('.btn').disabled = true;
  });
});
