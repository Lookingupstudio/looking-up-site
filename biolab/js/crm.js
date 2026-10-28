/* Emi BioLab · prezzi, date e posti letti dal CRM.
   Indirizzo del CRM: <meta name="emi-crm" content="https://crm.emibiolab.com"> in ogni pagina.
   Se il CRM non risponde entro 4 secondi, restano i valori scritti nella pagina (riserva statica).
   Per provarlo in locale: aggiungi ?crm=http://127.0.0.1:5055 all'indirizzo della pagina. */
(function () {
  var meta = document.querySelector('meta[name="emi-crm"]');
  var base = meta ? meta.getAttribute('content') : '';
  try {
    var prova = new URLSearchParams(location.search).get('crm');
    if (prova && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(prova) && /^(127\.0\.0\.1|localhost|)$/.test(location.hostname)) base = prova;
  } catch (e) { /* browser vecchio: si usa il meta */ }
  if (!base || !window.fetch) return;
  base = base.replace(/\/+$/, '');

  var MESI = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var GIORNI = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function prezzo(p) {
    var n = Number(p.prezzo);
    var t = '€' + (n % 1 ? n.toFixed(2) : n.toFixed(0));
    return /mese|month/i.test(p.unita || '') ? t + ' / month' : t;
  }
  function el(tag, cls, testo) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (testo != null) x.textContent = testo;
    return x;
  }
  function posti(d) {
    if (d.stato === 'Da annunciare') return 'Date to be announced';
    if (d.liberi == null) return 'Open';
    if (d.liberi <= 0) return 'Sold out';
    if (d.liberi <= 3) return 'Last ' + d.liberi + (d.liberi === 1 ? ' seat' : ' seats');
    return d.liberi + ' of ' + d.posti + ' seats left';
  }
  function oraLocale(out, iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d)) return;
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone';
      var f = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      out.innerHTML = '';
      out.appendChild(document.createTextNode('Your time: '));
      out.appendChild(el('b', '', f.format(d)));
      out.appendChild(document.createElement('br'));
      out.appendChild(document.createTextNode(tz.replace(/_/g, ' ')));
    } catch (e) { /* resta il testo di riserva */ }
  }
  function riga(d, prodotto) {
    var x = new Date(d.data + 'T12:00:00');
    var r = el('div', 'date-row');
    var w = el('div', 'when');
    if (d.stato === 'Da annunciare') {
      w.appendChild(el('b', '', MESI[x.getMonth()] + ' ' + x.getFullYear()));
    } else {
      w.appendChild(el('b', '', GIORNI[x.getDay()] + ' ' + x.getDate() + ' ' + MESI[x.getMonth()] + ' ' + x.getFullYear()));
      if (d.ora) w.appendChild(el('span', '', d.ora + ' · Venice time'));
    }
    w.appendChild(el('span', 'seats', posti(d)));
    r.appendChild(w);
    var loc = el('div', 'local');
    if (d.stato === 'Da annunciare' || !d.ora) {
      loc.textContent = 'Join the list to hear first.';
    } else {
      var out = el('span', 'local-out', 'Shown in your own time zone');
      loc.appendChild(out);
      oraLocale(out, d.inizio);
    }
    r.appendChild(loc);
    var a = el('a', 'btn');
    if (d.prenotabile && d.link_pagamento) {
      a.href = d.link_pagamento;
      a.textContent = 'Book · ' + prezzo({ prezzo: d.prezzo, unita: '' }) + ' ';
      a.appendChild(el('span', 'arrow', '→'));
    } else if (d.prenotabile) {
      a.href = '#';
      a.className = 'btn ph';
      a.textContent = 'Book · ' + prezzo({ prezzo: d.prezzo, unita: '' }) + ' ';
      a.appendChild(el('span', 'arrow', '→'));
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (window.showToast) window.showToast('Stripe Checkout link goes here (account not created yet)');
      });
    } else {
      a.href = 'free-course.html';
      a.className = 'btn ghost';
      a.textContent = d.liberi === 0 ? 'Join the waiting list ' : 'Notify me ';
      a.appendChild(el('span', 'arrow', '→'));
    }
    r.appendChild(a);
    return r;
  }

  var ctrl = window.AbortController ? new AbortController() : null;
  var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 4000);
  fetch(base + '/api/pubblica/catalogo', { signal: ctrl ? ctrl.signal : undefined, credentials: 'omit' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (dati) {
      clearTimeout(timer);
      var prodotti = {};
      (dati.prodotti || []).forEach(function (p) { prodotti[p.codice] = p; });
      document.querySelectorAll('[data-crm-prezzo]').forEach(function (n) {
        var p = prodotti[n.getAttribute('data-crm-prezzo')];
        if (p) n.textContent = prezzo(p);
      });
      document.querySelectorAll('[data-crm-date]').forEach(function (box) {
        var codice = box.getAttribute('data-crm-date');
        if (!prodotti[codice]) return;
        var date = (dati.date || []).filter(function (d) { return d.prodotto === codice; });
        box.innerHTML = '';
        if (!date.length) {
          var r = el('div', 'date-row');
          var w = el('div', 'when');
          w.appendChild(el('b', '', 'New dates soon'));
          w.appendChild(el('span', 'seats', 'Join the list to hear first'));
          r.appendChild(w);
          r.appendChild(el('div', 'local', ''));
          var a = el('a', 'btn ghost', 'Notify me ');
          a.href = 'free-course.html';
          a.appendChild(el('span', 'arrow', '→'));
          r.appendChild(a);
          box.appendChild(r);
          return;
        }
        date.forEach(function (d) { box.appendChild(riga(d, prodotti[codice])); });
      });
      document.documentElement.setAttribute('data-crm', 'ok');
    })
    .catch(function () {
      clearTimeout(timer);
      document.documentElement.setAttribute('data-crm', 'riserva');  // restano i valori scritti nella pagina
    });
})();
