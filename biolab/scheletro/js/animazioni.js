/* Emi BioLab · animazioni organiche: entrate allo scroll, titolo che si condensa, parallax leggero */
(function () {
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const main = document.querySelector('main');
  if (!main) return;

  // titolo grande: lettere separate
  const h1 = main.querySelector('h1');
  if (h1 && !ridotto) {
    const testo = h1.textContent;
    h1.setAttribute('aria-label', testo);
    h1.innerHTML = [...testo].map((c, i) => c === ' ' ? ' ' : `<span aria-hidden="true" style="--rit:${(i * 0.045).toFixed(3)}s">${c}</span>`).join('');
    h1.classList.add('lettere');
    requestAnimationFrame(() => setTimeout(() => h1.classList.add('dentro'), 60));
  }

  // tutto il resto entra quando arriva sullo schermo, a cascata
  const voci = main.querySelectorAll('.occhiello, .lead, .prossimo, .hero-foto, .porta, .sez h2, .righe li, .punti li, .percorso span, .dati > div, .blocco, .striscia-fondatrice, .striscia-voce, details.faq, .info > div, .nomi span, .fondatrice > div');
  voci.forEach(el => el.classList.add('anim'));
  if (ridotto || !('IntersectionObserver' in window)) { voci.forEach(el => el.classList.add('dentro')); return; }
  const io = new IntersectionObserver(entrate => {
    let n = 0;
    entrate.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--rit', (0.25 + n++ * 0.09).toFixed(2) + 's');
      e.target.classList.add('dentro');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // quello che è già sullo schermo entra subito, a cascata; il resto quando ci si arriva
  let k = 0;
  voci.forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight * 0.95) {
      el.style.setProperty('--rit', (0.35 + k++ * 0.07).toFixed(2) + 's');
      requestAnimationFrame(() => el.classList.add('dentro'));
    } else io.observe(el);
  });
  // sicurezza: dopo qualche secondo niente resta nascosto
  setTimeout(() => voci.forEach(el => el.classList.add('dentro')), 6000);

  // il visual principale segue appena il mouse, come qualcosa che galleggia
  const vis = main.querySelector('.hero-foto');
  if (vis && matchMedia('(hover: hover)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0;
    addEventListener('mousemove', e => { tx = (e.clientX / innerWidth - .5) * 14; ty = (e.clientY / innerHeight - .5) * 10; });
    (function giro() {
      x += (tx - x) * 0.04; y += (ty - y) * 0.04;
      const figlio = vis.firstElementChild;
      if (figlio) figlio.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(1.04)`;
      requestAnimationFrame(giro);
    })();
  }
})();
