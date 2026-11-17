/* Emi BioLab · pulsante Giorno / Notte
   Si carica nel <head>: applica subito il tema salvato, poi aggiunge il pulsante nella testata. */
(function () {
  var d = document.documentElement, t = 'notte';
  try { t = localStorage.getItem('emi-tema') || 'notte'; } catch (e) {}
  d.setAttribute('data-tema', t);
  function metti() {
    var h = document.querySelector('header'); if (!h || h.querySelector('.tema')) return;
    var b = document.createElement('button'); b.className = 'tema'; b.type = 'button';
    function testo() { var n = d.getAttribute('data-tema') === 'notte'; b.innerHTML = '<i></i>' + (n ? 'Night' : 'Day'); b.setAttribute('aria-label', n ? 'Switch to day mode' : 'Switch to night mode'); }
    b.onclick = function () { var n = d.getAttribute('data-tema') === 'notte' ? 'giorno' : 'notte'; d.setAttribute('data-tema', n); try { localStorage.setItem('emi-tema', n); } catch (e) {} testo(); };
    testo();
    var nav = h.querySelector('nav'); h.insertBefore(b, nav ? nav.nextSibling : null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', metti); else metti();
})();
