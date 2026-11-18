/* Emi BioLab · test3 · script comune
   - apertura con un pezzo del video vero che scorre (data-da / data-a = fotogrammi)
   - testata, menu attivo, apparizioni, moduli di prova, ora di Venezia
   - ?auto=1 scorre da solo (solo per registrare i video di prova) */
(function () {
  var Q = new URLSearchParams(location.search), AUTO = Q.get('auto') === '1';
  function clamp(x) { return Math.min(1, Math.max(0, x)); }
  function pad(n) { return ('00' + n).slice(-3); }

  // menu: segna la pagina in cui sei
  var qui = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('header nav a').forEach(function (a) { if (a.getAttribute('href') === qui) a.classList.add('qui'); });

  // APERTURA: fotogrammi veri che avanzano con lo scroll
  var sc = document.querySelector('.scena');
  if (sc) {
    var cv = sc.querySelector('canvas'), cx = cv.getContext('2d');
    var da = +sc.dataset.da || 1, a = +sc.dataset.a || 60, mob = innerWidth <= 820, dir = mob ? 'frames/m/' : 'frames/d/', img = [];
    for (var i = da; i <= a; i++) { var im = new Image(); im.src = dir + pad(i) + '.jpg'; img.push(im); }
    var D = Math.min(2, devicePixelRatio || 1);
    function size() { cv.width = cv.clientWidth * D; cv.height = cv.clientHeight * D; }
    size(); addEventListener('resize', size);
    function ok(im) { return im && im.complete && im.naturalWidth; }
    function copri(im, al, z) { var W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight) * z, w = im.naturalWidth * s, h = im.naturalHeight * s; cx.globalAlpha = al; cx.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); }
    var linea = sc.querySelector('.linea i'), cont = sc.querySelector('.cont'), tit = sc.querySelector('.titolo'), prog = 0;
    (function giro() {
      var r = sc.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight));
      prog += (p - prog) * .18;
      var f = prog * (img.length - 1), k = Math.floor(f), t = f - k, z = 1.03 + prog * .12;
      var A = null; for (var j = k; j >= 0; j--) if (ok(img[j])) { A = img[j]; break; }
      if (A) { copri(A, 1, z); if (ok(img[k + 1]) && t > 0) copri(img[k + 1], t, z); } cx.globalAlpha = 1;
      if (linea) linea.style.width = (prog * 100).toFixed(1) + '%';
      if (cont) cont.textContent = pad(da + Math.round(f)) + ' / 200';
      if (tit) { tit.style.transform = 'translateY(' + (-prog * 60).toFixed(1) + 'px)'; tit.style.opacity = (1 - clamp((prog - .55) / .45)).toFixed(3); }
      requestAnimationFrame(giro);
    })();
  }

  // testata piena dopo l'apertura
  var head = document.querySelector('header');
  function testata() { head.classList.toggle('pieno', scrollY > innerHeight * (sc ? 1.4 : .2)); }

  // apparizioni
  var el = [].slice.call(document.querySelectorAll('.r,.svela'));
  function mostra() { el = el.filter(function (e) { var r = e.getBoundingClientRect(); if (r.top < innerHeight * .9 && r.bottom > 0) { e.classList.add('via'); return false; } return true; }); }
  function tutto() { testata(); mostra(); }
  addEventListener('scroll', tutto, { passive: true }); addEventListener('load', tutto); tutto();
  if (Q.get('tutto') === '1') el.forEach(function (e) { e.classList.add('via'); });

  // moduli di prova (non inviano nulla)
  document.querySelectorAll('form.modulo').forEach(function (f) { f.addEventListener('submit', function (e) { e.preventDefault(); f.classList.add('inviato'); }); });

  // ora di Venezia
  var ora = document.getElementById('ora');
  function aggiorna() { try { ora.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit' }) + ' Venice'; } catch (e) {} }
  if (ora) { aggiorna(); setInterval(aggiorna, 30000); }

  // orari dei workshop anche nel fuso di chi guarda
  document.querySelectorAll('[data-quando]').forEach(function (e) {
    try { var d = new Date(e.dataset.quando); e.textContent = 'Your time: ' + d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }); } catch (x) {}
  });

  // scorrimento: morbido, oppure automatico per i video
  if (AUTO) {
    var t0 = null, dur = +(Q.get('dur') || 24), pausa = +(Q.get('p') || 1.5);
    requestAnimationFrame(function g(t) { if (t0 === null) t0 = t; var s = clamp(((t - t0) / 1000 - pausa) / dur); scrollTo(0, s * (document.documentElement.scrollHeight - innerHeight)); requestAnimationFrame(g); });
  } else if (window.Lenis) {
    var lenis = new Lenis({ lerp: .08 }); lenis.on('scroll', tutto);
    requestAnimationFrame(function raf(t) { lenis.raf(t); requestAnimationFrame(raf); });
  }
})();
