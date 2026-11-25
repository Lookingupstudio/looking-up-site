/* Emi BioLab · sfondo a gradienti leggeri (25/11/2026)
   Fondo scuro con tre macchie di colore morbide (petrolio, sea glass, lilla)
   che si spostano con lo scroll e respirano appena anche da ferme. */
(function () {
  const cv = document.createElement('canvas');
  cv.setAttribute('aria-hidden', 'true');
  Object.assign(cv.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', zIndex: '-1', pointerEvents: 'none', display: 'block' });
  document.body.prepend(cv);
  document.documentElement.style.background = '#1d2125';
  document.body.style.background = 'transparent';
  const cx = cv.getContext('2d');
  const D = Math.min(1.5, devicePixelRatio || 1);
  function size() { cv.width = innerWidth * D; cv.height = innerHeight * D; semina(); }

  /* gocce di umidità, come condensa su un vetro davanti alla laguna */
  let gocce = [];
  function goccia(y) {
    const r = Math.pow(Math.random(), 2.6) * 7 + 0.8;            // tante piccole, poche grandi
    return { x: Math.random() * innerWidth, y: y ?? Math.random() * innerHeight, r, v: 0,
             scivola: r > 5 && Math.random() < .35, scia: [] };
  }
  const GOCCE = false; // gocce tolte (Mattia 25/11): resta solo il gradiente
  function semina() {
    if (!GOCCE) { gocce = []; return; }
    const n = Math.round(innerWidth * innerHeight / 5200);
    gocce = Array.from({ length: n }, () => goccia());
  }
  size(); addEventListener('resize', size);

  function disegnaGoccia(g, spost) {
    const x = g.x * D, y = (g.y - spost) * D, r = g.r * D;
    if (y < -20 || y > cv.height + 20) return;
    // scia lasciata da una goccia che è scesa
    if (g.scia.length > 1) {
      cx.strokeStyle = 'rgba(200,214,214,.05)'; cx.lineWidth = r * .9; cx.lineCap = 'round';
      cx.beginPath(); cx.moveTo(g.scia[0][0] * D, (g.scia[0][1] - spost) * D);
      g.scia.forEach(p => cx.lineTo(p[0] * D, (p[1] - spost) * D)); cx.stroke();
    }
    // corpo: lente scura al centro, bordo chiaro, ombra in basso, riflesso in alto
    const corpo = cx.createRadialGradient(x - r * .25, y - r * .3, r * .1, x, y, r);
    corpo.addColorStop(0, 'rgba(15,20,24,.20)');
    corpo.addColorStop(.75, 'rgba(120,140,145,.10)');
    corpo.addColorStop(1, 'rgba(215,225,225,.28)');
    cx.fillStyle = corpo; cx.beginPath(); cx.arc(x, y, r, 0, 6.2832); cx.fill();
    cx.fillStyle = 'rgba(0,0,0,.18)'; cx.beginPath(); cx.arc(x + r * .15, y + r * .35, r * .95, .2, 2.9); cx.fill();
    if (r > 1.6) { cx.fillStyle = 'rgba(240,245,245,.55)'; cx.beginPath(); cx.arc(x - r * .35, y - r * .4, r * .22, 0, 6.2832); cx.fill(); }
  }
  const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const macchie = [
    { c: '47,75,83',    x: [.78, .22, .62], y: [.25, .62, .2],  r: [.75, .9, .65], a: .55 }, // petrolio
    { c: '183,198,195', x: [.18, .7, .35],  y: [.78, .3, .82],  r: [.5, .6, .7],   a: .15 }, // sea glass
    { c: '168,161,187', x: [.55, .88, .15], y: [.08, .85, .45], r: [.45, .55, .5], a: .13 }  // lilla
  ];
  const tra = (v, t) => { const k = t * 2, i = Math.min(1, Math.floor(k)), f = k - i; return v[i] + (v[i + 1] - v[i]) * f; };
  let prog = 0;
  function giro(tempo) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    prog += (p - prog) * 0.06;                                    // segue lo scroll con calma
    const W = cv.width, H = cv.height;
    cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#1d2125'; cx.fillRect(0, 0, W, H);
    cx.globalCompositeOperation = 'lighter';
    macchie.forEach((m, i) => {
      const ond = ridotto ? 0 : Math.sin(tempo * 0.00022 + i * 2.1) * 0.035;
      const x = (tra(m.x, prog) + ond) * W, y = (tra(m.y, prog) - ond) * H, r = tra(m.r, prog) * Math.max(W, H);
      const g = cx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${m.c},${m.a})`); g.addColorStop(1, `rgba(${m.c},0)`);
      cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    });
    cx.globalCompositeOperation = 'source-over';
    // le gocce si spostano appena con lo scroll (sono "più vicine" del colore dietro)
    const spost = scrollY * 0.08;
    gocce.forEach((g, i) => {
      if (g.scivola && !ridotto) {
        if (Math.random() < .004) g.v = 0.6 + Math.random() * 1.6;     // ogni tanto parte
        if (g.v > 0) {
          g.y += g.v; g.x += Math.sin(g.y * .05) * .15; g.v *= .985;
          if (g.v < .05) g.v = 0;
          g.scia.push([g.x, g.y]); if (g.scia.length > 60) g.scia.shift();
          // raccoglie le goccioline che incontra e cresce un poco
          gocce.forEach(h => { if (h !== g && !h.preso && Math.hypot(h.x - g.x, h.y - g.y) < g.r + h.r) { h.preso = true; g.r = Math.min(9, g.r + h.r * .15); } });
        }
        if (g.y - spost > innerHeight + 30) gocce[i] = goccia(spost - 10);
      }
      if (!g.preso) disegnaGoccia(g, spost);
    });
    gocce = gocce.map(g => g.preso ? goccia() : g);
    if (!ridotto) requestAnimationFrame(giro);
  }
  requestAnimationFrame(giro);
  if (ridotto) addEventListener('scroll', () => requestAnimationFrame(giro), { passive: true });
})();
